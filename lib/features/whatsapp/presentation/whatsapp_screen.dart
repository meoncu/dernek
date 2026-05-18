import 'package:flutter/material.dart';

import '../../../core/widgets/app_scaffold.dart';

class WhatsAppScreen extends StatelessWidget {
  const WhatsAppScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'WhatsApp',
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(child: ListTile(leading: Icon(Icons.chat_outlined), title: Text('Teşekkür mesajı'), subtitle: Text('{{ad}} alanı ile kişiselleştirilir.'))),
          Card(child: ListTile(leading: Icon(Icons.campaign_outlined), title: Text('Proje sonucu mesajı'), subtitle: Text('Görsel ve sonuç yazısı ile toplu gönderime hazır.'))),
        ],
      ),
    );
  }
}
