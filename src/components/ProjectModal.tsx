'use client';

import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Input, Select, Textarea } from './ui/Input';
import { Button } from './ui/Button';
import { PROJECT_CATEGORY_ICONS, PROJECT_CATEGORY_LABELS, CURRENCY_LABELS } from '@/types';
import type { Project, ProjectCategory, Currency } from '@/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Project, 'id' | 'uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  editing?: Project | null;
};

export function ProjectModal({ open, onClose, onSave, editing }: Props) {
  const [name, setName] = useState(editing?.name ?? '');
  const [category, setCategory] = useState<ProjectCategory>(editing?.category ?? 'diger');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [deadline, setDeadline] = useState(editing?.deadline ?? '');
  const [targetAmount, setTargetAmount] = useState(editing?.targetAmount?.toString() ?? '');
  const [targetCurrency, setTargetCurrency] = useState<Currency>(editing?.targetCurrency ?? 'TRY');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Editing değiştiğinde formu güncelle
  const isEditing = !!editing;

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Proje adı zorunludur.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        category,
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        targetAmount: targetAmount ? parseFloat(targetAmount) : undefined,
        targetCurrency: targetAmount ? targetCurrency : undefined,
        status: editing?.status ?? 'aktif',
        completedAt: editing?.completedAt,
        resultNote: editing?.resultNote,
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
      title={isEditing ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
        <Input
          label="Proje Adı *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn: 2024 Ramazan İftar Projesi"
          error={errors.name}
        />

        <Select
          label="Proje Kategorisi"
          value={category}
          onChange={(e) => setCategory(e.target.value as ProjectCategory)}
        >
          {(Object.keys(PROJECT_CATEGORY_LABELS) as ProjectCategory[]).map((key) => (
            <option key={key} value={key}>
              {PROJECT_CATEGORY_ICONS[key]} {PROJECT_CATEGORY_LABELS[key]}
            </option>
          ))}
        </Select>

        <Textarea
          label="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Proje hakkında kısa bilgi..."
          rows={3}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Hedef Tutar"
            type="number"
            min="0"
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0"
          />
          <Select
            label="Para Birimi"
            value={targetCurrency}
            onChange={(e) => setTargetCurrency(e.target.value as Currency)}
          >
            {(Object.keys(CURRENCY_LABELS) as Currency[]).map((key) => (
              <option key={key} value={key}>{CURRENCY_LABELS[key]}</option>
            ))}
          </Select>
        </div>

        <Input
          label="Bitiş Tarihi"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" fullWidth onClick={onClose}>
            İptal
          </Button>
          <Button type="submit" variant="primary" fullWidth loading={loading}>
            {isEditing ? 'Güncelle' : 'Oluştur'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
