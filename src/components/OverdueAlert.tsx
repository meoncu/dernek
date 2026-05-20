'use client';

import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { AlertTriangle, Phone } from 'lucide-react';
import { openWhatsApp } from '@/lib/whatsapp';
import type { Contact, Donation } from '@/types';

type Props = {
  overdueDonations: Donation[];
  contacts: Contact[];
  onMarkReceived: (donationId: string) => void;
};

export function OverdueAlert({ overdueDonations, contacts, onMarkReceived }: Props) {
  if (overdueDonations.length === 0) return null;

  return (
    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-800">Gecikmiş Bağışlar</h3>
          <p className="text-xs text-amber-600">
            {overdueDonations.length} bağış söz verilen tarihten sonra hâlâ gönderilmedi.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {overdueDonations.map((d) => {
          const contact = contacts.find((c) => c.id === d.donorId);
          const referrer = contact?.referredById
            ? contacts.find((c) => c.id === contact.referredById)
            : null;

          return (
            <div
              key={d.id}
              className="rounded-2xl bg-white border border-amber-100 p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {contact ? `${contact.firstName} ${contact.lastName}` : 'Bilinmeyen'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {d.amount.toLocaleString('tr-TR')} {d.currency} •{' '}
                    Söz: {d.promisedDate ? format(parseISO(d.promisedDate), 'd MMM yyyy', { locale: tr }) : '—'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onMarkReceived(d.id)}
                  className="shrink-0 rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-200 transition"
                >
                  Ulaştı ✓
                </button>
              </div>

              {/* İletişim */}
              <div className="flex gap-2">
                {contact?.phone ? (
                  <button
                    type="button"
                    onClick={() => openWhatsApp(contact.phone!, `Sayın ${contact.firstName}, ${d.amount.toLocaleString('tr-TR')} ${d.currency} tutarındaki bağışınızı henüz almadık. Bilgi verebilir misiniz?`)}
                    className="flex items-center gap-1.5 rounded-xl bg-green-100 px-2.5 py-1.5 text-xs font-semibold text-green-700 hover:bg-green-200 transition"
                  >
                    <Phone className="h-3 w-3" />
                    WhatsApp
                  </button>
                ) : referrer?.phone ? (
                  <button
                    type="button"
                    onClick={() => openWhatsApp(referrer.phone!, `Sayın ${referrer.firstName}, ${contact?.firstName ?? ''} adlı kişinin bağışı henüz ulaşmadı. Bilgi alabilir misiniz?`)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-100 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-200 transition"
                  >
                    <Phone className="h-3 w-3" />
                    Referans: {referrer.firstName}
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-500">
                    <Phone className="h-3 w-3" />
                    Telefon yok
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
