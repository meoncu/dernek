'use client';

import { useState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Textarea } from './ui/Input';
import { Button } from './ui/Button';
import type { Project } from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  project: Project;
  onComplete: (resultNote: string) => Promise<void>;
  onOpenWhatsApp: () => void;
};

export function CompleteProjectModal({ open, onClose, project, onComplete, onOpenWhatsApp }: Props) {
  const [resultNote, setResultNote] = useState(project.resultNote ?? '');
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function handleComplete() {
    setLoading(true);
    try {
      await onComplete(resultNote);
      setCompleted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Projeyi Tamamla">
      {!completed ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-emerald-800">Proje Tamamlanıyor</h3>
            </div>
            <p className="text-sm text-emerald-700">
              <strong>{project.name}</strong> projesini tamamlandı olarak işaretleyeceksiniz.
              Bağışçılara bildirim göndermek için sonuç notu yazabilirsiniz.
            </p>
          </div>

          <Textarea
            label="Sonuç Notu (Bağışçılara gönderilecek mesaj için kullanılır)"
            value={resultNote}
            onChange={(e) => setResultNote(e.target.value)}
            rows={5}
            placeholder="Proje başarıyla tamamlandı. Yetim çocuklarımıza kıyafet ulaştırıldı. Allah herkesten razı olsun..."
          />

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-700">
              ⚠️ Projeyi tamamladıktan sonra bağışçılara proje görselleri ve sonuç bilgilerini
              WhatsApp üzerinden iletmeyi unutmayın.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              İptal
            </Button>
            <Button
              type="button"
              variant="primary"
              fullWidth
              loading={loading}
              onClick={() => void handleComplete()}
            >
              <CheckCircle2 className="h-4 w-4" />
              Tamamla
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Proje Tamamlandı!</h3>
            <p className="text-sm text-slate-500 mt-1">
              Bağışçılara teşekkür mesajı göndermek ister misiniz?
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
            <p className="text-xs text-amber-700 font-medium">
              📸 Proje fotoğraf ve belgelerini bağışçılarla paylaşmayı unutmayın!
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" fullWidth onClick={onClose}>
              Kapat
            </Button>
            <Button
              type="button"
              variant="success"
              fullWidth
              onClick={() => { onClose(); onOpenWhatsApp(); }}
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Mesajı
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
