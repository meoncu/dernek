import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_scaffold.dart';

class RemindersScreen extends StatelessWidget {
  const RemindersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppScaffold(
      title: 'Hatırlatmalar',
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Card(
          child: ListTile(
            leading: Icon(Icons.notifications_active_outlined, color: AppColors.warning),
            title: Text('Günlük ödeme sözü kontrolü'),
            subtitle: Text('Geciken bağış sözleri push notification ile bildirilecek.'),
          ),
        ),
      ),
    );
  }
}
