import 'package:flutter/material.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/app_scaffold.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Yardım Paneli',
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.add),
        label: const Text('Hızlı bağış'),
      ),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          _HeroCard(),
          _MetricGrid(),
          _AlertCard(title: 'Geciken ödeme sözleri', count: '3', color: AppColors.critical),
          _AlertCard(title: 'Eksik telefon bilgisi', count: '5', color: AppColors.warning),
          _AlertCard(title: 'Yaklaşan proje bitişi', count: '2', color: AppColors.olive),
        ],
      ),
    );
  }
}

class _HeroCard extends StatelessWidget {
  const _HeroCard();

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Bugünkü durum', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            const Text('Projeler, bağışlar ve kritik hatırlatmalar tek ekranda.'),
          ],
        ),
      ),
    );
  }
}

class _MetricGrid extends StatelessWidget {
  const _MetricGrid();

  @override
  Widget build(BuildContext context) {
    final metrics = [
      ('Aktif proje', '8'),
      ('Tamamlanan', '21'),
      ('Toplam bağış', '₺125K'),
      ('Son bağış', '₺5K'),
    ];

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      children: [
        for (final metric in metrics)
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(metric.$2, style: Theme.of(context).textTheme.headlineMedium),
                  Text(metric.$1),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

class _AlertCard extends StatelessWidget {
  const _AlertCard({required this.title, required this.count, required this.color});

  final String title;
  final String count;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        leading: CircleAvatar(backgroundColor: color, child: Text(count, style: const TextStyle(color: Colors.white))),
        title: Text(title),
        trailing: const Icon(Icons.chevron_right),
      ),
    );
  }
}
