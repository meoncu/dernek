import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_scaffold.dart';

class AdminScreen extends StatelessWidget {
  const AdminScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Admin',
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(child: ListTile(leading: Icon(Icons.admin_panel_settings_outlined), title: Text('Rol yönetimi'), subtitle: Text('super_admin, admin, operator, readonly, user'))),
          Card(child: ListTile(leading: Icon(Icons.switch_account_outlined), title: Text('Impersonation'), subtitle: Text('Login-as aksiyonları audit log ile kayıt altına alınır.'))),
          Card(child: ListTile(leading: Icon(Icons.history_outlined, color: AppColors.gold), title: Text('Audit log'), subtitle: Text('Tüm kritik işlemler immutable kayıt olarak saklanır.'))),
        ],
      ),
    );
  }
}
