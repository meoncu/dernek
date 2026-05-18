import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/admin/presentation/admin_screen.dart';
import '../../features/dashboard/presentation/dashboard_screen.dart';
import '../../features/donations/presentation/donations_screen.dart';
import '../../features/donors/presentation/donors_screen.dart';
import '../../features/projects/presentation/projects_screen.dart';
import '../../features/reminders/presentation/reminders_screen.dart';
import '../../features/reports/presentation/reports_screen.dart';
import '../../features/settings/presentation/settings_screen.dart';
import '../../features/whatsapp/presentation/whatsapp_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/',
    routes: [
      GoRoute(path: '/', name: 'dashboard', builder: (_, __) => const DashboardScreen()),
      GoRoute(path: '/projects', name: 'projects', builder: (_, __) => const ProjectsScreen()),
      GoRoute(path: '/donors', name: 'donors', builder: (_, __) => const DonorsScreen()),
      GoRoute(path: '/donations', name: 'donations', builder: (_, __) => const DonationsScreen()),
      GoRoute(path: '/reminders', name: 'reminders', builder: (_, __) => const RemindersScreen()),
      GoRoute(path: '/whatsapp', name: 'whatsapp', builder: (_, __) => const WhatsAppScreen()),
      GoRoute(path: '/reports', name: 'reports', builder: (_, __) => const ReportsScreen()),
      GoRoute(path: '/admin', name: 'admin', builder: (_, __) => const AdminScreen()),
      GoRoute(path: '/settings', name: 'settings', builder: (_, __) => const SettingsScreen()),
    ],
  );
});
