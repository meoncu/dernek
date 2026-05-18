import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../auth/auth_providers.dart';
import '../security/rbac.dart';
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
  final authState = ref.watch(currentSessionProvider);

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      final isAuth = authState.value != null;
      final isLoginRoute = state.matchedLocation == '/login';

      if (!isAuth && !isLoginRoute) {
        return '/login';
      }
      if (isAuth && isLoginRoute) {
        return '/';
      }
      return null;
    },
    routes: [
      GoRoute(
        path: '/login',
        name: 'login',
        builder: (_, __) => const _LoginScreen(),
      ),
      GoRoute(
        path: '/',
        name: 'dashboard',
        builder: (_, __) => const DashboardScreen(),
      ),
      GoRoute(
        path: '/projects',
        name: 'projects',
        builder: (_, __) => const ProjectsScreen(),
      ),
      GoRoute(
        path: '/donors',
        name: 'donors',
        builder: (_, __) => const DonorsScreen(),
      ),
      GoRoute(
        path: '/donations',
        name: 'donations',
        builder: (_, __) => const DonationsScreen(),
      ),
      GoRoute(
        path: '/reminders',
        name: 'reminders',
        builder: (_, __) => const RemindersScreen(),
      ),
      GoRoute(
        path: '/whatsapp',
        name: 'whatsapp',
        builder: (_, __) => const WhatsAppScreen(),
      ),
      GoRoute(
        path: '/reports',
        name: 'reports',
        builder: (_, __) => const ReportsScreen(),
      ),
      GoRoute(
        path: '/admin',
        name: 'admin',
        builder: (_, __) {
          final session = authState.value;
          if (session == null || !session.isAdmin) {
            return const _AccessDeniedScreen();
          }
          return const AdminScreen();
        },
      ),
      GoRoute(
        path: '/settings',
        name: 'settings',
        builder: (_, __) => const SettingsScreen(),
      ),
    ],
  );
});

class _LoginScreen extends ConsumerWidget {
  const _LoginScreen();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authRepository = ref.watch(authRepositoryProvider);

    return Scaffold(
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            try {
              await authRepository.signInWithGoogle();
            } catch (e) {
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Login failed: $e')),
                );
              }
            }
          },
          child: const Text('Sign in with Google'),
        ),
      ),
    );
  }
}

class _AccessDeniedScreen extends StatelessWidget {
  const _AccessDeniedScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Access Denied: Admin role required'),
      ),
    );
  }
}
