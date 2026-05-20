// ─── Proje Türleri ───────────────────────────────────────────────────────────

export type ProjectCategory =
  | 'yetim_giydirme'
  | 'su_kuyusu'
  | 'ekmek_dagitim'
  | 'su_dagitim'
  | 'kurban'
  | 'iftar'
  | 'diger';

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, string> = {
  yetim_giydirme: 'Yetim Giydirme',
  su_kuyusu: 'Su Kuyusu',
  ekmek_dagitim: 'Ekmek Dağıtımı',
  su_dagitim: 'Su Dağıtımı',
  kurban: 'Kurban Kesimi',
  iftar: 'İftar Yemeği',
  diger: 'Diğer',
};

export const PROJECT_CATEGORY_ICONS: Record<ProjectCategory, string> = {
  yetim_giydirme: '👕',
  su_kuyusu: '💧',
  ekmek_dagitim: '🍞',
  su_dagitim: '🚰',
  kurban: '🐑',
  iftar: '🌙',
  diger: '🤲',
};

export type ProjectStatus = 'aktif' | 'tamamlandi' | 'iptal';

export type Project = {
  id: string;
  uid: string;
  name: string;
  category: ProjectCategory;
  description?: string;
  targetAmount?: number;
  targetCurrency?: Currency;
  deadline?: string; // YYYY-MM-DD
  status: ProjectStatus;
  completedAt?: string; // ISO
  resultNote?: string; // Tamamlanma sonuç yazısı
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

// ─── Para Birimi ─────────────────────────────────────────────────────────────

export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED' | 'KWD' | 'QAR' | 'OTHER';

export const CURRENCY_LABELS: Record<Currency, string> = {
  TRY: '₺ Türk Lirası',
  USD: '$ Dolar',
  EUR: '€ Euro',
  GBP: '£ Sterlin',
  SAR: 'ر.س Suudi Riyali',
  AED: 'د.إ Dirhem',
  KWD: 'د.ك Kuveyt Dinarı',
  QAR: 'ر.ق Katar Riyali',
  OTHER: 'Diğer',
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
  GBP: '£',
  SAR: 'ر.س',
  AED: 'د.إ',
  KWD: 'د.ك',
  QAR: 'ر.ق',
  OTHER: '?',
};

// ─── Bağış Durumu ─────────────────────────────────────────────────────────────

export type DonationStatus =
  | 'banka_ulasti'    // Banka hesabına ulaştı
  | 'gonderilmedi'    // Henüz gönderilmedi
  | 'soz_verildi';    // Söz verildi, bekliyor

export const DONATION_STATUS_LABELS: Record<DonationStatus, string> = {
  banka_ulasti: 'Bankaya Ulaştı',
  gonderilmedi: 'Gönderilmedi',
  soz_verildi: 'Söz Verildi',
};

export const DONATION_STATUS_COLORS: Record<DonationStatus, string> = {
  banka_ulasti: 'emerald',
  gonderilmedi: 'amber',
  soz_verildi: 'blue',
};

// ─── Bağış ───────────────────────────────────────────────────────────────────

export type Donation = {
  id: string;
  projectId: string;
  donorId: string; // Contact id
  amount: number;
  currency: Currency;
  status: DonationStatus;
  promisedDate?: string; // YYYY-MM-DD - söz verildiğinde ne zaman gönderileceği
  receivedDate?: string; // YYYY-MM-DD - bankaya ulaştığında
  note?: string;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Rehber / Kişi ───────────────────────────────────────────────────────────

export type Contact = {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  phone?: string; // Yoksa uyarı gösterilecek
  referredById?: string; // Bu kişiyi kim getirdi (başka bir Contact id)
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// ─── Zamanlanmış WhatsApp Mesajı ─────────────────────────────────────────────

export type ScheduledMessage = {
  id: string;
  projectId: string;
  message: string;
  scheduledAt: string; // ISO - ne zaman gönderilecek
  recipients: string[]; // Contact id listesi
  status: 'bekliyor' | 'gonderildi' | 'iptal';
  sentAt?: string;
  createdAt: string;
};

// ─── Proje Özet İstatistikleri ────────────────────────────────────────────────

export type ProjectStats = {
  totalDonors: number;
  totalDonations: number;
  bankReceived: number; // banka_ulasti sayısı
  pending: number;      // gonderilmedi + soz_verildi sayısı
  missingPhone: number; // telefonu olmayan bağışçı sayısı
  totalAmountByCurrency: Partial<Record<Currency, number>>;
  receivedAmountByurrency: Partial<Record<Currency, number>>;
};
