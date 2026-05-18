import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';

initializeApp();

const db = getFirestore();
const messaging = getMessaging();

const adminRoles = new Set(['super_admin', 'admin']);

function rolesFromToken(token: Record<string, unknown> | undefined): string[] {
  const roles = token?.roles;
  return Array.isArray(roles) ? roles.filter((role): role is string => typeof role === 'string') : [];
}

function assertAdmin(token: Record<string, unknown> | undefined): void {
  if (!rolesFromToken(token).some((role) => adminRoles.has(role))) {
    throw new HttpsError('permission-denied', 'Admin role is required.');
  }
}

export const startImpersonation = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Authentication is required.');
  }

  assertAdmin(request.auth.token);

  const targetUid = String(request.data.targetUid ?? '');
  if (!targetUid) {
    throw new HttpsError('invalid-argument', 'targetUid is required.');
  }

  await db.collection('audit_logs').add({
    tenantId: request.data.tenantId ?? 'default',
    action: 'impersonation.start',
    actorUid: request.auth.uid,
    targetUid,
    createdAt: FieldValue.serverTimestamp(),
    metadata: { userAgent: request.rawRequest.headers['user-agent'] ?? null },
  });

  return { targetUid, startedAt: Date.now() };
});

export const onDonationWrite = onDocumentWritten('donations/{donationId}', async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  const projectId = String(after?.projectId ?? before?.projectId ?? '');

  if (!projectId) {
    return;
  }

  const beforeAmount = before?.status === 'received' ? Number(before.amount ?? 0) : 0;
  const afterAmount = after?.status === 'received' ? Number(after.amount ?? 0) : 0;
  const delta = afterAmount - beforeAmount;

  if (delta === 0) {
    return;
  }

  await db.doc(`projects/${projectId}`).update({
    collectedBudget: FieldValue.increment(delta),
    updatedAt: FieldValue.serverTimestamp(),
    updatedBy: 'system:onDonationWrite',
  });
});

export const sendDuePaymentPromiseNotifications = onSchedule('every day 08:00', async () => {
  const now = new Date();
  const snapshot = await db
    .collection('payment_promises')
    .where('status', '==', 'promised')
    .where('dueAt', '<=', now)
    .limit(200)
    .get();

  await Promise.all(snapshot.docs.map(async (doc) => {
    const data = doc.data();
    await doc.ref.update({ status: 'overdue', updatedAt: FieldValue.serverTimestamp(), updatedBy: 'system:reminder' });

    if (typeof data.ownerUid === 'string') {
      await db.collection('notifications').add({
        tenantId: data.tenantId,
        userUid: data.ownerUid,
        type: 'payment_promise_overdue',
        title: 'Geciken ödeme sözü',
        body: 'Bir bağış ödeme sözü gecikti. Lütfen takip edin.',
        readAt: null,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  }));

  const tokens = snapshot.docs
    .map((doc) => doc.data().fcmToken)
    .filter((token): token is string => typeof token === 'string');

  if (tokens.length > 0) {
    await messaging.sendEachForMulticast({
      tokens,
      notification: { title: 'Geciken ödeme sözü', body: 'Takip edilmesi gereken bağış sözleri var.' },
    });
  }
});
