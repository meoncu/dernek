'use client';

import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Edit2, MessageCircle, Phone, Trash2, UserCheck } from 'lucide-react';
import { Badge } from './ui/Badge';
import { openWhatsApp } from '@/lib/whatsapp';
import { CURRENCY_SYMBOLS, DONATION_STATUS_COLORS, DONATION_STATUS_LABELS } from '@/types';
import type { Contact, Donation } from '@/types';

type Props = {
  donations: Donation[];
  contacts: Contact[];
  onEdit: (donation: Donation) => void;
  onDelete: (donation: Donation) => void;
};

export function DonationList({ donations, contacts, onEdit, onDelete }: Props) {
  if (donations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-12 text-center">
        <div className="mb-3 h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
          🤲
        </div>
        <p className="text-sm font-medium text-slate-500">Henüz bağış kaydı yok.</p>
        <p className="text-xs text-slate-400 mt-1">Yukarıdaki butona tıklayarak ekleyin.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {donations.map((d) => {
        const contact = contacts.find((c) => c.id === d.donorId);
        const referrer = contact?.referredById
          ? contacts.find((c) => c.id === contact.referredById)
          : null;
        const statusColor = DONATION_STATUS_COLORS[d.status] as 'emerald' | 'amber' | 'blue';
        const sym = CURRENCY_SYMBOLS[d.currency] ?? d.currency;

        return (
          <div
            key={d.id}
            className="rounded-2xl border border-slate-200 bg-white p-3 space-y-2 hover:border-slate-300 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Kişi */}
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-slate-800">
                    {contact ? `${contact.firstName} ${contact.lastName}` : 'Bilinmeyen'}
                  </p>
                  {!contact?.phone && (
                    <Badge variant="red">
                      <Phone className="h-3 w-3" />
                      Telefon Yok
                    </Badge>
                  )}
                  {referrer && (
                    <Badge variant="slate">
                      <UserCheck className="h-3 w-3" />
                      {referrer.firstName} vasıtasıyla
                    </Badge>
                  )}
                </div>

                {/* Tutar ve durum */}
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-base font-bold text-emerald-700">
                    {sym}{d.amount.toLocaleString('tr-TR')}
                  </span>
                  <Badge variant={statusColor}>
                    {DONATION_STATUS_LABELS[d.status]}
                  </Badge>
                </div>

                {/* Tarih bilgileri */}
                <div className="flex flex-wrap gap-2 mt-1">
                  {d.promisedDate && d.status === 'soz_verildi' && (
                    <span className="text-xs text-blue-600">
                      Söz: {format(parseISO(d.promisedDate), 'd MMM', { locale: tr })}
                    </span>
                  )}
                  {d.receivedDate && (
                    <span className="text-xs text-emerald-600">
                      Ulaştı: {format(parseISO(d.receivedDate), 'd MMM', { locale: tr })}
                    </span>
                  )}
                  {d.note && (
                    <span className="text-xs text-slate-400 italic">{d.note}</span>
                  )}
                </div>
              </div>

              {/* Aksiyonlar */}
              <div className="flex items-center gap-1 shrink-0">
                {contact?.phone ? (
                  <button
                    type="button"
                    onClick={() => openWhatsApp(contact.phone!)}
                    className="h-8 w-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition"
                    title="WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </button>
                ) : referrer?.phone ? (
                  <button
                    type="button"
                    onClick={() => openWhatsApp(referrer.phone!)}
                    className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition"
                    title={`${referrer.firstName} ile iletişim`}
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => onEdit(d)}
                  className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition"
                  title="Düzenle"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(d)}
                  className="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition"
                  title="Sil"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
