'use client';

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input, Select, Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Phone, Search } from 'lucide-react';
import { CURRENCY_LABELS, DONATION_STATUS_LABELS } from '@/types';
import type { Contact, Currency, Donation, DonationStatus } from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Donation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editing?: Donation | null;
  projectId: string;
  contacts: Contact[];
};

export function DonationModal({ open, onClose, onSave, editing, projectId, contacts }: Props) {
  const [donorId, setDonorId] = useState(editing?.donorId ?? '');
  const [amount, setAmount] = useState(editing?.amount?.toString() ?? '');
  const [currency, setCurrency] = useState<Currency>(editing?.currency ?? 'TRY');
  const [status, setStatus] = useState<DonationStatus>(editing?.status ?? 'gonderilmedi');
  const [promisedDate, setPromisedDate] = useState(editing?.promisedDate ?? '');
  const [receivedDate, setReceivedDate] = useState(editing?.receivedDate ?? '');
  const [note, setNote] = useState(editing?.note ?? '');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedContact = contacts.find((c) => c.id === donorId);

  const filteredContacts = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      (c.phone ?? '').includes(q)
    );
  });

  function validate() {
    const e: Record<string, string> = {};
    if (!donorId) e.donorId = 'Bağışçı seçiniz.';
    if (!amount || parseFloat(amount) <= 0) e.amount = 'Geçerli bir tutar giriniz.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave({
        projectId,
        donorId,
        amount: parseFloat(amount),
        currency,
        status,
        promisedDate: status === 'soz_verildi' ? promisedDate || undefined : undefined,
        receivedDate: status === 'banka_ulasti' ? receivedDate || undefined : undefined,
        note: note.trim() || undefined,
        reminderSent: editing?.reminderSent ?? false,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Bağışı Düzenle' : 'Bağış Ekle'}
      size="md"
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        {/* Bağışçı Seçimi */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-600">Bağışçı *</label>

          {selectedContact ? (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {selectedContact.firstName} {selectedContact.lastName}
                </p>
                {selectedContact.phone ? (
                  <p className="text-xs text-slate-500">{selectedContact.phone}</p>
                ) : (
                  <p className="flex items-center gap-1 text-xs text-red-500 font-medium">
                    <Phone className="h-3 w-3" /> Telefon yok
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => { setDonorId(''); setSearch(''); }}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Değiştir
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="İsim veya telefon ile ara..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                {filteredContacts.length === 0 ? (
                  <p className="p-3 text-xs text-slate-400 text-center">Kişi bulunamadı.</p>
                ) : (
                  filteredContacts.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setDonorId(c.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 transition"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {c.firstName} {c.lastName}
                        </p>
                        {c.phone ? (
                          <p className="text-xs text-slate-400">{c.phone}</p>
                        ) : (
                          <p className="flex items-center gap-1 text-xs text-red-400">
                            <Phone className="h-3 w-3" /> Telefon yok
                          </p>
                        )}
                      </div>
                      {!c.phone && (
                        <Badge variant="red">⚠️ Telefon Yok</Badge>
                      )}
                    </button>
                  ))
                )}
              </div>
              {errors.donorId && <p className="text-xs text-red-500">{errors.donorId}</p>}
            </div>
          )}
        </div>

        {/* Tutar */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Bağış Tutarı *"
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            error={errors.amount}
          />
          <Select
            label="Para Birimi"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
          >
            {(Object.keys(CURRENCY_LABELS) as Currency[]).map((key) => (
              <option key={key} value={key}>{CURRENCY_LABELS[key]}</option>
            ))}
          </Select>
        </div>

        {/* Durum */}
        <Select
          label="Bağış Durumu"
          value={status}
          onChange={(e) => setStatus(e.target.value as DonationStatus)}
        >
          {(Object.keys(DONATION_STATUS_LABELS) as DonationStatus[]).map((key) => (
            <option key={key} value={key}>{DONATION_STATUS_LABELS[key]}</option>
          ))}
        </Select>

        {status === 'soz_verildi' && (
          <Input
            label="Söz Verilen Tarih"
            type="date"
            value={promisedDate}
            onChange={(e) => setPromisedDate(e.target.value)}
            hint="Bu tarihten sonra hâlâ gönderilmemişse uyarı gösterilir."
          />
        )}

        {status === 'banka_ulasti' && (
          <Input
            label="Bankaya Ulaşma Tarihi"
            type="date"
            value={receivedDate}
            onChange={(e) => setReceivedDate(e.target.value)}
          />
        )}

        <Textarea
          label="Not"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Bağış hakkında ek bilgi..."
          rows={2}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            {editing ? 'Güncelle' : 'Kaydet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
