import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_scaffold.dart';

class DonorsScreen extends StatelessWidget {
  const DonorsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Bağışçılar',
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.person_add_alt_1),
        label: const Text('Kişi ekle'),
      ),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _MissingPhoneBanner(),
          ListTile(leading: Icon(Icons.person_outline), title: Text('Ayşe Yılmaz'), subtitle: Text('Referans: Mehmet Bey')),
        ],
      ),
    );
  }
}

class _MissingPhoneBanner extends StatelessWidget {
  const _MissingPhoneBanner();

  @override
  Widget build(BuildContext context) {
    return Card(
      color: AppColors.critical.withOpacity(0.08),
      child: const ListTile(
        leading: Icon(Icons.warning_amber, color: AppColors.critical),
        title: Text('Eksik iletişim bilgileri'),
        subtitle: Text('Telefonu olmayan kişiler dashboard ve listelerde kırmızı işaretlenir.'),
      ),
    );
  }
}
