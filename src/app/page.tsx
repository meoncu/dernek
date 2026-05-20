'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookUser,
  FolderOpen,
  HandHeart,
  LogOut,
  Plus,
  Settings,
} from 'lucide-react';
import { signInWithGoogle, signOutUser, subscribeAuthState } from '@/lib/firebase';
import { openWhatsApp } from '@/lib/whatsapp';
import {
  createContact,
  createDonation,
  createProject,
  createScheduledMessage,
  deleteContact,
  deleteDonation,
  deleteProject,
  subscribeContacts,
  subscribeDonations,
  subscribeProjects,
  updateContact,
  updateDonation,
  updateProject,
} from '@/lib/db';
import { computeProjectStats, getOverdueDonations } from '@/lib/stats';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { ContactModal } from '@/components/ContactModal';
import { DonationModal } from '@/components/DonationModal';
import { DonationList } from '@/components/DonationList';
import { OverdueAlert } from '@/components/OverdueAlert';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { CompleteProjectModal } from '@/components/CompleteProjectModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import type { Contact, Donation, Project } from '@/types';

type Tab = 'projeler' | 'rehber';

export default function Home() {
  const [uid, setUid] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [tab, setTab] = useState<Tab>('projeler');

  // Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  // Seçili proje (detay görünümü)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Modaller
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [whatsappModalOpen, setWhatsappModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  // Auth
  useEffect(() => {
    return subscribeAuthState((user) => {
      setUid(user?.uid ?? null);
      setLoadingAuth(false);
    });
  }, []);

  // Firestore subscriptions
  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeProjects(uid, setProjects);
    return unsub;
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeContacts(uid, setContacts);
    return unsub;
  }, [uid]);

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeDonations(uid, setDonations);
    return unsub;
  }, [uid]);

  // Gecikmiş bağışlar
  const overdueDonations = getOverdueDonations(donations);

  // Seçili projenin bağışları
  const projectDonations = selectedProject
    ? donations.filter((d) => d.projectId === selectedProject.id)
    : [];

  // ─── Loading ─────────────────────────────────────────────────────────────────
  if (loadingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
          <p className="text-sm text-slate-500">Yükleniyor...</p>
        </div>
      </main>
    );
  }

  // ─── Login ───────────────────────────────────────────────────────────────────
  if (!uid) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30">
              <HandHeart className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Hayır Takip</h1>
            <p className="text-sm text-slate-500 mt-2">
              Bağış projelerinizi ve bağışçılarınızı kolayca yönetin.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-xl shadow-slate-900/8 backdrop-blur">
            <button
              type="button"
              onClick={() => void signInWithGoogle()}
              className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" opacity=".9"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity=".9"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" opacity=".9"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" opacity=".9"/>
              </svg>
              Google ile Giriş Yap
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ─── Proje Detay Görünümü ─────────────────────────────────────────────────────
  if (selectedProject) {
    const stats = computeProjectStats(donations, contacts, selectedProject.id);
    const projectOverdue = overdueDonations.filter((d) => d.projectId === selectedProject.id);

    return (
      <main className="mx-auto min-h-screen max-w-lg px-4 py-4 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setSelectedProject(null)}
            className="h-9 w-9 rounded-2xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition shadow-sm"
            aria-label="Geri"
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-slate-900 truncate">{selectedProject.name}</h1>
            <p className="text-xs text-slate-500">
              {selectedProject.status === 'aktif' ? '🟢 Aktif' :
               selectedProject.status === 'tamamlandi' ? '✅ Tamamlandı' : '❌ İptal'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => { setEditingProject(selectedProject); setProjectModalOpen(true); }}
            >
              <Settings className="h-3.5 w-3.5" />
            </Button>
            {selectedProject.status === 'aktif' && (
              <Button
                size="sm"
                variant="success"
                onClick={() => setCompleteModalOpen(true)}
              >
                ✓ Tamamla
              </Button>
            )}
          </div>
        </div>

        {/* Gecikmiş bağış uyarısı */}
        {projectOverdue.length > 0 && (
          <div className="mb-4">
            <OverdueAlert
              overdueDonations={projectOverdue}
              contacts={contacts}
              onMarkReceived={async (donationId) => {
                if (!uid) return;
                await updateDonation(uid, donationId, {
                  status: 'banka_ulasti',
                  receivedDate: new Date().toISOString().slice(0, 10),
                });
                addToast('Bağış bankaya ulaştı olarak işaretlendi.', 'success');
              }}
            />
          </div>
        )}

        {/* İstatistik kartları */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-3 shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{stats.totalDonors}</p>
            <p className="text-xs text-slate-500">Toplam Bağışçı</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 shadow-sm">
            <p className="text-2xl font-bold text-emerald-700">{stats.bankReceived}</p>
            <p className="text-xs text-emerald-600">Bankaya Ulaştı</p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 shadow-sm">
            <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
            <p className="text-xs text-amber-600">Bekleyen</p>
          </div>
          <div className="rounded-2xl bg-red-50 border border-red-200 p-3 shadow-sm">
            <p className="text-2xl font-bold text-red-600">{stats.missingPhone}</p>
            <p className="text-xs text-red-500">Telefon Eksik</p>
          </div>
        </div>

        {/* Bağış listesi başlığı */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-800">Bağışlar</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setWhatsappModalOpen(true)}
            >
              💬 WhatsApp
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => { setEditingDonation(null); setDonationModalOpen(true); }}
            >
              <Plus className="h-3.5 w-3.5" />
              Bağış Ekle
            </Button>
          </div>
        </div>

        <DonationList
          donations={projectDonations}
          contacts={contacts}
          onEdit={(d) => { setEditingDonation(d); setDonationModalOpen(true); }}
          onDelete={async (d) => {
            if (!uid) return;
            if (!window.confirm('Bu bağışı silmek istediğinize emin misiniz?')) return;
            await deleteDonation(uid, d.id);
            addToast('Bağış silindi.', 'info');
          }}
        />

        {/* Modaller */}
        <DonationModal
          open={donationModalOpen}
          onClose={() => { setDonationModalOpen(false); setEditingDonation(null); }}
          editing={editingDonation}
          projectId={selectedProject.id}
          contacts={contacts}
          onSave={async (data) => {
            if (!uid) return;
            if (editingDonation) {
              await updateDonation(uid, editingDonation.id, data);
              addToast('Bağış güncellendi.', 'success');
            } else {
              await createDonation(uid, data);
              addToast('Bağış eklendi.', 'success');
            }
          }}
        />

        <WhatsAppModal
          open={whatsappModalOpen}
          onClose={() => setWhatsappModalOpen(false)}
          project={selectedProject}
          contacts={contacts}
          donations={donations}
          onSchedule={async (data) => {
            if (!uid) return;
            await createScheduledMessage(uid, data);
            addToast('Mesaj zamanlandı.', 'success');
          }}
        />

        <CompleteProjectModal
          open={completeModalOpen}
          onClose={() => setCompleteModalOpen(false)}
          project={selectedProject}
          onComplete={async (resultNote) => {
            if (!uid) return;
            await updateProject(uid, selectedProject.id, {
              status: 'tamamlandi',
              completedAt: new Date().toISOString(),
              resultNote,
            });
            setSelectedProject({ ...selectedProject, status: 'tamamlandi', resultNote });
            addToast('Proje tamamlandı!', 'success');
          }}
          onOpenWhatsApp={() => setWhatsappModalOpen(true)}
        />

        <ProjectModal
          open={projectModalOpen}
          onClose={() => { setProjectModalOpen(false); setEditingProject(null); }}
          editing={editingProject}
          onSave={async (data) => {
            if (!uid || !editingProject) return;
            await updateProject(uid, editingProject.id, data);
            setSelectedProject({ ...selectedProject, ...data });
            addToast('Proje güncellendi.', 'success');
          }}
        />

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </main>
    );
  }

  // ─── Ana Görünüm ──────────────────────────────────────────────────────────────
  return (
    <main className="mx-auto min-h-screen max-w-lg px-4 py-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <HandHeart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Hayır Takip</h1>
            <p className="text-xs text-slate-500">Bağış & Proje Yönetimi</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void signOutUser()}
          className="flex items-center gap-1.5 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition shadow-sm"
        >
          <LogOut className="h-3.5 w-3.5" />
          Çıkış
        </button>
      </div>

      {/* Gecikmiş bağış global uyarısı */}
      {overdueDonations.length > 0 && tab === 'projeler' && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="text-sm font-bold text-amber-800">
              {overdueDonations.length} gecikmiş bağış var
            </p>
            <p className="text-xs text-amber-600">
              Söz verilen tarih geçmiş, henüz bankaya ulaşmamış bağışlar.
            </p>
          </div>
        </div>
      )}

      {/* Tab içerikleri */}
      <AnimatePresence mode="wait">
        {tab === 'projeler' ? (
          <motion.div
            key="projeler"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800">
                Projeler
                <Badge variant="slate" className="ml-2">{projects.length}</Badge>
              </h2>
              <Button
                size="sm"
                variant="primary"
                onClick={() => { setEditingProject(null); setProjectModalOpen(true); }}
              >
                <Plus className="h-3.5 w-3.5" />
                Yeni Proje
              </Button>
            </div>

            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-16 text-center">
                <div className="mb-4 h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">
                  🤲
                </div>
                <h3 className="font-bold text-slate-700">Henüz proje yok</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  İlk hayır projenizi oluşturun.
                </p>
                <Button
                  variant="primary"
                  onClick={() => { setEditingProject(null); setProjectModalOpen(true); }}
                >
                  <Plus className="h-4 w-4" />
                  Proje Oluştur
                </Button>
              </div>
            ) : (
              projects.map((project) => {
                const stats = computeProjectStats(donations, contacts, project.id);
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    stats={stats}
                    onClick={() => setSelectedProject(project)}
                  />
                );
              })
            )}
          </motion.div>
        ) : (
          <motion.div
            key="rehber"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800">
                Rehber
                <Badge variant="slate" className="ml-2">{contacts.length}</Badge>
              </h2>
              <Button
                size="sm"
                variant="primary"
                onClick={() => { setEditingContact(null); setContactModalOpen(true); }}
              >
                <Plus className="h-3.5 w-3.5" />
                Kişi Ekle
              </Button>
            </div>

            {contacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                <div className="mb-4 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl">
                  👥
                </div>
                <h3 className="font-bold text-slate-700">Rehber boş</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  Bağışçılarınızı buraya ekleyin.
                </p>
                <Button
                  variant="primary"
                  onClick={() => { setEditingContact(null); setContactModalOpen(true); }}
                >
                  <Plus className="h-4 w-4" />
                  Kişi Ekle
                </Button>
              </div>
            ) : (
              contacts.map((contact) => {
                const referrer = contact.referredById
                  ? contacts.find((c) => c.id === contact.referredById)
                  : null;
                const donationCount = donations.filter((d) => d.donorId === contact.id).length;

                return (
                  <div
                    key={contact.id}
                    className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                          {contact.firstName[0]}{contact.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-sm">
                            {contact.firstName} {contact.lastName}
                          </p>
                          {contact.phone ? (
                            <p className="text-xs text-slate-500">{contact.phone}</p>
                          ) : (
                            <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                              ⚠️ Telefon numarası yok
                            </p>
                          )}
                          {referrer && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              👤 {referrer.firstName} {referrer.lastName} vasıtasıyla
                            </p>
                          )}
                          {donationCount > 0 && (
                            <Badge variant="teal" className="mt-1">
                              {donationCount} bağış
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1 shrink-0">
                        {contact.phone && (
                          <button
                            type="button"
                            onClick={() => {
                              openWhatsApp(contact.phone!);
                            }}
                            className="h-8 w-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition text-sm"
                            title="WhatsApp"
                          >
                            💬
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => { setEditingContact(contact); setContactModalOpen(true); }}
                          className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition text-sm"
                          title="Düzenle"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!uid) return;
                            if (!window.confirm(`${contact.firstName} ${contact.lastName} silinsin mi?`)) return;
                            await deleteContact(uid, contact.id);
                            addToast('Kişi silindi.', 'info');
                          }}
                          className="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition text-sm"
                          title="Sil"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modaller */}
      <ProjectModal
        open={projectModalOpen}
        onClose={() => { setProjectModalOpen(false); setEditingProject(null); }}
        editing={editingProject}
        onSave={async (data) => {
          if (!uid) return;
          if (editingProject) {
            await updateProject(uid, editingProject.id, data);
            addToast('Proje güncellendi.', 'success');
          } else {
            await createProject(uid, data);
            addToast('Proje oluşturuldu!', 'success');
          }
        }}
      />

      <ContactModal
        open={contactModalOpen}
        onClose={() => { setContactModalOpen(false); setEditingContact(null); }}
        editing={editingContact}
        contacts={contacts}
        onSave={async (data) => {
          if (!uid) return;
          if (editingContact) {
            await updateContact(uid, editingContact.id, data);
            addToast('Kişi güncellendi.', 'success');
          } else {
            await createContact(uid, data);
            addToast('Kişi eklendi.', 'success');
          }
        }}
      />

      {/* Alt navigasyon */}
      <nav className="fixed inset-x-4 bottom-3 z-20 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2 shadow-2xl backdrop-blur">
        <ul className="grid grid-cols-2 items-center gap-2">
          <li>
            <button
              type="button"
              onClick={() => setTab('projeler')}
              className={[
                'w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition',
                tab === 'projeler'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100',
              ].join(' ')}
            >
              <FolderOpen className="h-4 w-4" />
              Projeler
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setTab('rehber')}
              className={[
                'w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition',
                tab === 'rehber'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100',
              ].join(' ')}
            >
              <BookUser className="h-4 w-4" />
              Rehber
            </button>
          </li>
        </ul>
      </nav>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  );
}
