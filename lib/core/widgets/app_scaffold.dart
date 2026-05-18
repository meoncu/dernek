import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AppScaffold extends StatelessWidget {
  const AppScaffold({
    required this.title,
    required this.child,
    this.actions = const [],
    this.floatingActionButton,
    super.key,
  });

  final String title;
  final Widget child;
  final List<Widget> actions;
  final Widget? floatingActionButton;

  static const _navItems = [
    (path: '/', icon: Icons.dashboard_outlined, label: 'Panel'),
    (path: '/projects', icon: Icons.volunteer_activism_outlined, label: 'Projeler'),
    (path: '/donors', icon: Icons.people_alt_outlined, label: 'Bağışçılar'),
    (path: '/donations', icon: Icons.notifications_active_outlined, label: 'Bağışlar'),
    (path: '/settings', icon: Icons.settings_outlined, label: 'Ayarlar'),
  ];

  int _selectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.toString();
    final index = _navItems.indexWhere((item) => location == item.path);
    return index >= 0 ? index : 0;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title), actions: actions),
      body: SafeArea(child: child),
      floatingActionButton: floatingActionButton,
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex(context),
        onDestinationSelected: (index) {
          if (index < _navItems.length) {
            context.go(_navItems[index].path);
          }
        },
        destinations: _navItems
            .map((item) => NavigationDestination(icon: Icon(item.icon), label: item.label))
            .toList(),
      ),
    );
  }
}
