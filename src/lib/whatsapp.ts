/**
 * WhatsApp yardımcı fonksiyonları
 */

/**
 * Telefon numarasını WhatsApp formatına çevirir
 * Başındaki 0'ı kaldırır, Türkiye için +90 ekler
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('90') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 11) return '90' + digits.slice(1);
  if (digits.length === 10) return '90' + digits;
  return digits;
}

/**
 * Tek kişiye WhatsApp mesajı açar
 */
export function openWhatsApp(phone: string, message?: string): void {
  const normalized = normalizePhone(phone);
  const encoded = message ? encodeURIComponent(message) : '';
  const url = `https://wa.me/${normalized}${encoded ? `?text=${encoded}` : ''}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Mesajı panoya kopyalar (toplu gönderim için)
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Proje sonuç mesajı şablonu oluşturur
 */
export function buildProjectResultMessage(params: {
  projectName: string;
  category: string;
  donorName: string;
  amount?: string;
  resultNote?: string;
}): string {
  const { projectName, category, donorName, amount, resultNote } = params;
  let msg = `Sayın ${donorName},\n\n`;
  msg += `"${projectName}" (${category}) projesine yaptığınız katkı için teşekkür ederiz.\n`;
  if (amount) msg += `Bağış tutarınız: ${amount}\n`;
  if (resultNote) msg += `\n${resultNote}\n`;
  msg += `\nAllah kabul etsin. 🤲`;
  return msg;
}
