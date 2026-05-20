'use client';

import { useState } from 'react';
import { Copy, MessageCircle, Send } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { buildProjectResultMessage, openWhatsApp, copyToClipboard } from '@/lib/whatsapp';
import { PROJECT_CATEGORY_LABELS } from '@/types';
import type { Contact, Donation, Project, ScheduledMessage } from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  project: Project;
  contacts: Contact[];
  donations: Donation[];
  onSchedule: (data: Omit<ScheduledMessage, 'id' | 'createdAt'>) => Promise<void>;
};

export function WhatsAppModal({ open, onClose, project, contacts, donations, onSchedule }: Props) {
  const [tab, setTab] = useState<'single' | 'bulk' | 'schedule'>('single');
  const [selectedContactId, setSelectedContactId] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Projeye bağış yapmış kişiler
  const projectDonorIds = new Set(donations.filter((d) => d.projectId === project.id).map((d) => d.donorId));
  const projectContacts = contacts.filter((c) => projectDonorIds.has(c.id));
  const contactsWithPhone = projectContacts.filter((c) => c.phone);

  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  function buildDefaultMessage(contact?: Contact) {
    const donation = donations.find((d) => d.projectId === project.id && d.donorId === contact?.id);
    return buildProjectResultMessage({
      projectName: project.name,
      category: PROJECT_CATEGORY_LABELS[project.category],
      donorName: contact ? `${contact.firstName} ${contact.lastName}` : 'Değerli Bağışçımız',
      amount: donation ? `${donation.amount} ${donation.currency}` : undefined,
      resultNote: project.resultNote,
    });
  }

  function handleSelectContact(id: string) {
    setSelectedContactId(id);
    const c = contacts.find((x) => x.id === id);
    setMessage(buildDefaultMessage(c));
  }

  async function handleSendSingle() {
    if (!selectedContact?.phone || !message) return;
    openWhatsApp(selectedContact.phone, message);
  }

  async function handleCopyBulk() {
    const success = await copyToClipboard(message);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!message || !scheduledAt) return;
    setLoading(true);
    try {
      await onSchedule({
        projectId: project.id,
        message,
        scheduledAt: new Date(scheduledAt).toISOString(),
        recipients: contactsWithPhone.map((c) => c.id),
        status: 'bekliyor',
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="WhatsApp Mesajı" size="lg">
      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1 mb-5">
        {([
          { key: 'single', label: 'Tekli Gönder', icon: <MessageCircle className="h-3.5 w-3.5" /> },
          { key: 'bulk', label: 'Toplu Kopyala', icon: <Copy className="h-3.5 w-3.5" /> },
          { key: 'schedule', label: 'Zamanla', icon: <Send className="h-3.5 w-3.5" /> },
        ] as const).map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={[
              'flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition',
              tab === t.key
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700',
            ].join(' ')}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tekli Gönder */}
      {tab === 'single' && (
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600">Kişi Seç</label>
            <select
              value={selectedContactId}
              onChange={(e) => handleSelectContact(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">— Kişi seçin —</option>
              {projectContacts.map((c) => (
                <option key={c.id} value={c.id} disabled={!c.phone}>
                  {c.firstName} {c.lastName} {c.phone ? `(${c.phone})` : '⚠️ Telefon yok'}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            label="Mesaj"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Mesajınızı yazın..."
          />

          <Button
            variant="success"
            fullWidth
            onClick={() => void handleSendSingle()}
            disabled={!selectedContact?.phone || !message}
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp&apos;ta Aç
          </Button>
        </div>
      )}

      {/* Toplu Kopyala */}
      {tab === 'bulk' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
            <p className="text-xs text-slate-600">
              <strong>{contactsWithPhone.length}</strong> kişinin telefonu var.{' '}
              <span className="text-amber-600">{projectContacts.length - contactsWithPhone.length} kişinin telefonu eksik.</span>
            </p>
          </div>

          <Textarea
            label="Toplu Mesaj Şablonu"
            value={message || buildDefaultMessage()}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />

          <div className="space-y-2">
            <p className="text-xs text-slate-500">Her kişi için ayrı ayrı WhatsApp&apos;ta açmak için:</p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {contactsWithPhone.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => openWhatsApp(c.phone!, buildDefaultMessage(c))}
                  className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:bg-emerald-50 hover:border-emerald-200 transition"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {c.firstName} {c.lastName}
                  </span>
                  <Badge variant="emerald">
                    <MessageCircle className="h-3 w-3" />
                    Gönder
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="secondary"
            fullWidth
            onClick={() => void handleCopyBulk()}
          >
            <Copy className="h-4 w-4" />
            {copied ? '✓ Kopyalandı!' : 'Mesajı Kopyala'}
          </Button>
        </div>
      )}

      {/* Zamanla */}
      {tab === 'schedule' && (
        <form onSubmit={(e) => void handleSchedule(e)} className="space-y-4">
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3">
            <p className="text-xs text-blue-700">
              Zamanlanmış mesajlar n8n API üzerinden gönderilir.{' '}
              <strong>{contactsWithPhone.length} kişiye</strong> gönderilecek.
            </p>
          </div>

          <Textarea
            label="Mesaj İçeriği"
            value={message || buildDefaultMessage()}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />

          <Input
            label="Gönderim Tarihi ve Saati"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            disabled={!message || !scheduledAt}
          >
            <Send className="h-4 w-4" />
            Zamanla
          </Button>
        </form>
      )}
    </Modal>
  );
}
