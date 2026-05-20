'use client';

import { useState } from 'react';
import { Phone, User } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Input, Select, Textarea } from './ui/Input';
import { Button } from './ui/Button';
import type { Contact } from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Contact, 'id' | 'uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editing?: Contact | null;
  contacts: Contact[]; // Referans kişi seçimi için
};

export function ContactModal({ open, onClose, onSave, editing, contacts }: Props) {
  const [firstName, setFirstName] = useState(editing?.firstName ?? '');
  const [lastName, setLastName] = useState(editing?.lastName ?? '');
  const [phone, setPhone] = useState(editing?.phone ?? '');
  const [referredById, setReferredById] = useState(editing?.referredById ?? '');
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'Ad zorunludur.';
    if (!lastName.trim()) e.lastName = 'Soyad zorunludur.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        referredById: referredById || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  const otherContacts = contacts.filter((c) => c.id !== editing?.id);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Kişiyi Düzenle' : 'Yeni Kişi Ekle'}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Ad *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ahmet"
            error={errors.firstName}
          />
          <Input
            label="Soyad *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Yılmaz"
            error={errors.lastName}
          />
        </div>

        <div className="space-y-1">
          <Input
            label="Telefon Numarası"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05XX XXX XX XX"
            hint="WhatsApp mesajı göndermek için gereklidir."
          />
          {!phone.trim() && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3 py-2">
              <Phone className="h-3.5 w-3.5 text-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-medium">
                Telefon numarası girilmemiş. WhatsApp ile iletişim kurulamaz.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-600">
            <User className="inline h-3.5 w-3.5 mr-1" />
            Biri Vasıtasıyla Geldi mi?
          </label>
          <Select
            value={referredById}
            onChange={(e) => setReferredById(e.target.value)}
          >
            <option value="">— Doğrudan geldi —</option>
            {otherContacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
                {!c.phone ? ' ⚠️' : ''}
              </option>
            ))}
          </Select>
          {referredById && (() => {
            const ref = contacts.find((c) => c.id === referredById);
            if (ref && !ref.phone) {
              return (
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2">
                  <Phone className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <p className="text-xs text-amber-700">
                    Referans kişi <strong>{ref.firstName} {ref.lastName}</strong>&apos;nın telefonu yok. Gerektiğinde bu kişi üzerinden iletişim kurulacak.
                  </p>
                </div>
              );
            }
            return null;
          })()}
        </div>

        <Textarea
          label="Notlar"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Kişi hakkında ek bilgi..."
          rows={2}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            {editing ? 'Güncelle' : 'Ekle'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
