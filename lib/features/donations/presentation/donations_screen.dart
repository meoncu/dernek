import 'package:flutter/material.dart';

import '../../../core/widgets/app_scaffold.dart';

class DonationsScreen extends StatelessWidget {
  const DonationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Bağışlar',
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.payments_outlined),
        label: const Text('Bağış ekle'),
      ),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(child: ListTile(title: Text('₺5.000'), subtitle: Text('Söz verildi · Kurban Organizasyonu'))),
          Card(child: ListTile(title: Text('USD 250'), subtitle: Text('Ödeme alındı · Su Kuyusu'))),
        ],
      ),
    );
  }
}
