import 'package:flutter/material.dart';

import '../../../core/widgets/app_scaffold.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const AppScaffold(
      title: 'Ayarlar',
      child: ListTile(
        leading: Icon(Icons.category_outlined),
        title: Text('Proje tipleri ve para birimleri'),
        subtitle: Text('Yeni türler settings koleksiyonu üzerinden eklenebilir.'),
      ),
    );
  }
}
