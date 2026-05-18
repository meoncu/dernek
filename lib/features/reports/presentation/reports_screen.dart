import 'package:flutter/material.dart';

import '../../../core/widgets/app_scaffold.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Raporlar',
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(child: ListTile(leading: Icon(Icons.picture_as_pdf_outlined), title: Text('PDF proje özeti'))),
          Card(child: ListTile(leading: Icon(Icons.table_chart_outlined), title: Text('Excel bağışçı listesi'))),
          Card(child: ListTile(leading: Icon(Icons.account_balance_wallet_outlined), title: Text('Finansal özet'))),
        ],
      ),
    );
  }
}
