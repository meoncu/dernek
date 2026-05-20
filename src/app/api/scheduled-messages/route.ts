/**
 * Zamanlanmış WhatsApp mesajları için API endpoint
 * n8n webhook ile entegre çalışır.
 *
 * POST /api/scheduled-messages
 * Body: { uid, messageId, message, recipients: [{ phone, name }] }
 *
 * n8n bu endpoint'i çağırarak mesajları gönderir.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      uid?: string;
      messageId?: string;
      message?: string;
      recipients?: Array<{ phone: string; name: string }>;
    };

    const { uid, messageId, message, recipients } = body;

    if (!uid || !messageId || !message || !recipients) {
      return NextResponse.json({ error: 'Eksik parametreler.' }, { status: 400 });
    }

    const db = getAdminDb();

    // Mesajı güncelle
    await db
      .collection('users')
      .doc(uid)
      .collection('scheduledMessages')
      .doc(messageId)
      .update({
        status: 'gonderildi',
        sentAt: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      messageId,
      recipientCount: recipients.length,
    });
  } catch (error) {
    console.error('Scheduled message error:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}

/**
 * GET /api/scheduled-messages?uid=xxx
 * Bekleyen zamanlanmış mesajları döndürür (n8n polling için)
 */
export async function GET(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get('uid');
    if (!uid) {
      return NextResponse.json({ error: 'uid gerekli.' }, { status: 400 });
    }

    const db = getAdminDb();
    const now = new Date().toISOString();

    const snap = await db
      .collection('users')
      .doc(uid)
      .collection('scheduledMessages')
      .where('status', '==', 'bekliyor')
      .where('scheduledAt', '<=', now)
      .get();

    const messages = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Get scheduled messages error:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
