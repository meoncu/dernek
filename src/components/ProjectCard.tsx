'use client';

import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { AlertCircle, Calendar, CheckCircle2, ChevronRight, Clock, Users } from 'lucide-react';
import { Badge } from './ui/Badge';
import { PROJECT_CATEGORY_ICONS, PROJECT_CATEGORY_LABELS, CURRENCY_SYMBOLS } from '@/types';
import type { Project, ProjectStats } from '@/types';

type Props = {
  project: Project;
  stats: ProjectStats;
  onClick: () => void;
};

export function ProjectCard({ project, stats, onClick }: Props) {
  const isOverdue =
    project.status === 'aktif' &&
    project.deadline &&
    project.deadline < new Date().toISOString().slice(0, 10);

  const receivedEntries = Object.entries(stats.receivedAmountByurrency ?? {});
  const totalEntries = Object.entries(stats.totalAmountByCurrency ?? {});

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-3xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Kategori ikonu */}
          <div className="shrink-0 h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-xl">
            {PROJECT_CATEGORY_ICONS[project.category]}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
                {project.name}
              </h3>
              {project.status === 'tamamlandi' && (
                <Badge variant="emerald">
                  <CheckCircle2 className="h-3 w-3" />
                  Tamamlandı
                </Badge>
              )}
              {project.status === 'iptal' && (
                <Badge variant="red">İptal</Badge>
              )}
              {isOverdue && (
                <Badge variant="amber">
                  <Clock className="h-3 w-3" />
                  Süre Doldu
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {PROJECT_CATEGORY_LABELS[project.category]}
            </p>
          </div>
        </div>

        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition shrink-0 mt-1" />
      </div>

      {/* İstatistikler */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-slate-50 border border-slate-100 px-2.5 py-2 text-center">
          <div className="flex items-center justify-center gap-1 text-slate-500 mb-0.5">
            <Users className="h-3 w-3" />
          </div>
          <p className="text-base font-bold text-slate-800">{stats.totalDonors}</p>
          <p className="text-[10px] text-slate-400">Bağışçı</p>
        </div>

        <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-2.5 py-2 text-center">
          <div className="flex items-center justify-center gap-1 text-emerald-500 mb-0.5">
            <CheckCircle2 className="h-3 w-3" />
          </div>
          <p className="text-base font-bold text-emerald-700">{stats.bankReceived}</p>
          <p className="text-[10px] text-emerald-500">Bankaya Ulaştı</p>
        </div>

        <div className="rounded-xl bg-amber-50 border border-amber-100 px-2.5 py-2 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-500 mb-0.5">
            <Clock className="h-3 w-3" />
          </div>
          <p className="text-base font-bold text-amber-700">{stats.pending}</p>
          <p className="text-[10px] text-amber-500">Bekliyor</p>
        </div>
      </div>

      {/* Tutarlar */}
      {totalEntries.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {totalEntries.map(([cur, total]) => {
            const received = stats.receivedAmountByurrency?.[cur as keyof typeof stats.receivedAmountByurrency] ?? 0;
            const sym = CURRENCY_SYMBOLS[cur as keyof typeof CURRENCY_SYMBOLS] ?? cur;
            return (
              <div key={cur} className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs">
                <span className="font-semibold text-emerald-700">
                  {sym}{received.toLocaleString('tr-TR')}
                </span>
                <span className="text-slate-400">/</span>
                <span className="text-slate-600">
                  {sym}{total.toLocaleString('tr-TR')}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Uyarılar */}
      {stats.missingPhone > 0 && (
        <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-red-50 border border-red-100 px-2.5 py-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0" />
          <p className="text-xs text-red-600">
            {stats.missingPhone} kişinin telefon numarası eksik
          </p>
        </div>
      )}

      {/* Bitiş tarihi */}
      {project.deadline && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3 w-3" />
          <span>
            Bitiş: {format(parseISO(project.deadline), 'd MMMM yyyy', { locale: tr })}
          </span>
        </div>
      )}
    </button>
  );
}
