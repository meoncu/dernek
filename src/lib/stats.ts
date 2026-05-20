import type { Contact, Currency, Donation, ProjectStats } from '@/types';

export function computeProjectStats(
  donations: Donation[],
  contacts: Contact[],
  projectId: string
): ProjectStats {
  const projectDonations = donations.filter((d) => d.projectId === projectId);
  const donorIds = new Set(projectDonations.map((d) => d.donorId));

  const totalAmountByCurrency: Partial<Record<Currency, number>> = {};
  const receivedAmountByCurrency: Partial<Record<Currency, number>> = {};

  for (const d of projectDonations) {
    totalAmountByCurrency[d.currency] = (totalAmountByCurrency[d.currency] ?? 0) + d.amount;
    if (d.status === 'banka_ulasti') {
      receivedAmountByCurrency[d.currency] = (receivedAmountByCurrency[d.currency] ?? 0) + d.amount;
    }
  }

  const projectContacts = contacts.filter((c) => donorIds.has(c.id));
  const missingPhone = projectContacts.filter((c) => !c.phone || c.phone.trim() === '').length;

  return {
    totalDonors: donorIds.size,
    totalDonations: projectDonations.length,
    bankReceived: projectDonations.filter((d) => d.status === 'banka_ulasti').length,
    pending: projectDonations.filter((d) => d.status !== 'banka_ulasti').length,
    missingPhone,
    totalAmountByCurrency,
    receivedAmountByurrency: receivedAmountByCurrency,
  };
}

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount) + ' ' + currency;
}

/** Söz verilip tarihi geçmiş bağışları döndürür */
export function getOverdueDonations(donations: Donation[]): Donation[] {
  const today = new Date().toISOString().slice(0, 10);
  return donations.filter(
    (d) => d.status === 'soz_verildi' && d.promisedDate && d.promisedDate < today
  );
}

/** Telefonu olmayan bağışçıları döndürür */
export function getContactsWithMissingPhone(contacts: Contact[], donorIds: Set<string>): Contact[] {
  return contacts.filter((c) => donorIds.has(c.id) && (!c.phone || c.phone.trim() === ''));
}
