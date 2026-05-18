# Dernek Yardım / Bağış / Proje Yönetim Sistemi

Dernek, mobil öncelikli Flutter + Firebase mimarisiyle tasarlanmış, yardım projeleri, bağışçılar, bağışlar, ödeme sözleri, WhatsApp iletişimi, raporlama ve admin denetimi için production-ready bir ürün iskeletidir.

## Teknoloji Kararı

- **Uygulama:** Flutter + Dart; Android, iOS ve Web hedefleri.
- **State management:** Riverpod tabanlı, feature-first clean architecture.
- **Backend:** Firebase Authentication, Cloud Firestore, Storage, Cloud Messaging, Functions, Hosting ve Analytics.
- **Güvenlik:** RBAC, Firestore/Storage rules, audit log, admin impersonation logları, immutable owner alanları, server-side aggregate güncellemeleri.
- **Offline:** Firestore persistence + yerel sync queue tasarımı + idempotent yazma komutları.

## Repo İçeriği

- `docs/architecture.md`: Sistem mimarisi, domain modeli, ekranlar, auth flow, deployment ve roadmap.
- `firestore.rules`: Role based Firestore güvenlik kuralları.
- `storage.rules`: Proje dosyaları ve dekontlar için Storage güvenlik kuralları.
- `firestore.indexes.json`: Dashboard, filtreleme ve raporlama için indeks tasarımı.
- `lib/`: Flutter uygulaması için clean architecture başlangıç iskeleti.
- `functions/src/index.ts`: Cloud Functions güvenlik ve otomasyon iskeleti.
- `.github/workflows/ci.yml`: Flutter, Firebase rules ve Functions kontrolleri için CI taslağı.

## Varsayılan Kullanıcılar

| E-posta | Rol |
| --- | --- |
| `meoncu@gmail.com` | `super_admin` |
| `rumeysakucuk@gmail.com` | `user` |

> Production ortamında roller Cloud Functions veya güvenli admin panelinden custom claims + `users/{uid}` profili ile atanmalıdır.

## Hızlı Başlangıç

1. FlutterFire CLI ile Firebase projelerini bağlayın.
2. `firebase_options.dart` dosyasını üretin.
3. `firebase deploy --only firestore:rules,firestore:indexes,storage,functions,hosting` çalıştırın.
4. Google Sign-In sağlayıcısını Firebase Console'da etkinleştirin.
5. İlk admin kullanıcısını Functions seed script'i veya Firebase Admin SDK ile oluşturun.

## Ürün Kapsamı

Sistem aşağıdaki modülleri kapsar:

- Dashboard ve kritik uyarılar
- Proje yönetimi
- Bağışçı / kişi yönetimi
- Bağış ve ödeme durumu yönetimi
- Ödeme sözü hatırlatmaları
- WhatsApp mesaj şablonları ve hızlı gönderim
- Proje tamamlanma ve sonuç raporu akışı
- PDF / Excel raporlama mimarisi
- Admin paneli, impersonation ve audit log
- Bildirim ve cihaz token yönetimi
- Future-ready multi-tenant tasarım
