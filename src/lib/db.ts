/**
 * Firestore CRUD işlemleri
 * Koleksiyon yapısı:
 *   users/{uid}/projects/{projectId}
 *   users/{uid}/contacts/{contactId}
 *   users/{uid}/donations/{donationId}
 *   users/{uid}/scheduledMessages/{messageId}
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Contact, Donation, Project, ScheduledMessage } from '@/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Firestore undefined değerleri kabul etmez — tüm undefined alanları siler */
function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
}

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === 'string') return ts;
  return new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProject(id: string, data: Record<string, any>): Project {
  return {
    id,
    uid: data.uid ?? '',
    name: data.name ?? '',
    category: data.category ?? 'diger',
    description: data.description,
    targetAmount: data.targetAmount,
    targetCurrency: data.targetCurrency,
    deadline: data.deadline,
    status: data.status ?? 'aktif',
    completedAt: data.completedAt,
    resultNote: data.resultNote,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapContact(id: string, data: Record<string, any>): Contact {
  return {
    id,
    uid: data.uid ?? '',
    firstName: data.firstName ?? '',
    lastName: data.lastName ?? '',
    phone: data.phone,
    referredById: data.referredById,
    notes: data.notes,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDonation(id: string, data: Record<string, any>): Donation {
  return {
    id,
    projectId: data.projectId ?? '',
    donorId: data.donorId ?? '',
    amount: data.amount ?? 0,
    currency: data.currency ?? 'TRY',
    status: data.status ?? 'gonderilmedi',
    promisedDate: data.promisedDate,
    receivedDate: data.receivedDate,
    note: data.note,
    reminderSent: data.reminderSent ?? false,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapScheduledMessage(id: string, data: Record<string, any>): ScheduledMessage {
  return {
    id,
    projectId: data.projectId ?? '',
    message: data.message ?? '',
    scheduledAt: toISO(data.scheduledAt),
    recipients: data.recipients ?? [],
    status: data.status ?? 'bekliyor',
    sentAt: data.sentAt,
    createdAt: toISO(data.createdAt),
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function subscribeProjects(uid: string, cb: (projects: Project[]) => void): Unsubscribe {
  const q = query(collection(db, 'users', uid, 'projects'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => mapProject(d.id, d.data() as Record<string, unknown>)));
  });
}

export async function createProject(uid: string, data: Omit<Project, 'id' | 'uid' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'projects'), {
    ...stripUndefined(data),
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(uid: string, projectId: string, data: Partial<Project>): Promise<void> {
  const { id: _id, uid: _uid, createdAt: _ca, ...rest } = data;
  void _id; void _uid; void _ca;
  await updateDoc(doc(db, 'users', uid, 'projects', projectId), {
    ...stripUndefined(rest as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProject(uid: string, projectId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'projects', projectId));
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

export function subscribeContacts(uid: string, cb: (contacts: Contact[]) => void): Unsubscribe {
  const q = query(collection(db, 'users', uid, 'contacts'), orderBy('lastName', 'asc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => mapContact(d.id, d.data() as Record<string, unknown>)));
  });
}

export async function createContact(uid: string, data: Omit<Contact, 'id' | 'uid' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'contacts'), {
    ...stripUndefined(data),
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateContact(uid: string, contactId: string, data: Partial<Contact>): Promise<void> {
  const { id: _id, uid: _uid, createdAt: _ca, ...rest } = data;
  void _id; void _uid; void _ca;
  await updateDoc(doc(db, 'users', uid, 'contacts', contactId), {
    ...stripUndefined(rest as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteContact(uid: string, contactId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'contacts', contactId));
}

// ─── Donations ────────────────────────────────────────────────────────────────

export function subscribeDonations(uid: string, cb: (donations: Donation[]) => void): Unsubscribe {
  const q = query(collection(db, 'users', uid, 'donations'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => mapDonation(d.id, d.data() as Record<string, unknown>)));
  });
}

export function subscribeDonationsByProject(uid: string, projectId: string, cb: (donations: Donation[]) => void): Unsubscribe {
  const q = query(
    collection(db, 'users', uid, 'donations'),
    where('projectId', '==', projectId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => mapDonation(d.id, d.data() as Record<string, unknown>)));
  });
}

export async function createDonation(uid: string, data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'donations'), {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateDonation(uid: string, donationId: string, data: Partial<Donation>): Promise<void> {
  const { id: _id, createdAt: _ca, ...rest } = data;
  void _id; void _ca;
  await updateDoc(doc(db, 'users', uid, 'donations', donationId), {
    ...stripUndefined(rest as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteDonation(uid: string, donationId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'donations', donationId));
}

// ─── Scheduled Messages ───────────────────────────────────────────────────────

export function subscribeScheduledMessages(uid: string, projectId: string, cb: (msgs: ScheduledMessage[]) => void): Unsubscribe {
  const q = query(
    collection(db, 'users', uid, 'scheduledMessages'),
    where('projectId', '==', projectId),
    orderBy('scheduledAt', 'asc')
  );
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => mapScheduledMessage(d.id, d.data() as Record<string, unknown>)));
  });
}

export async function createScheduledMessage(uid: string, data: Omit<ScheduledMessage, 'id' | 'createdAt'>): Promise<string> {
  const ref = await addDoc(collection(db, 'users', uid, 'scheduledMessages'), {
    ...stripUndefined(data),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateScheduledMessage(uid: string, msgId: string, data: Partial<ScheduledMessage>): Promise<void> {
  const { id: _id, createdAt: _ca, ...rest } = data;
  void _id; void _ca;
  await updateDoc(doc(db, 'users', uid, 'scheduledMessages', msgId), rest);
}

export async function deleteScheduledMessage(uid: string, msgId: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'scheduledMessages', msgId));
}
