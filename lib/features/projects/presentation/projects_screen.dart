import 'package:flutter/material.dart';

import '../../../core/widgets/app_scaffold.dart';
import '../../../core/widgets/states.dart';

class ProjectsScreen extends StatelessWidget {
  const ProjectsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      title: 'Projeler',
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.add),
        label: const Text('Proje oluştur'),
      ),
      child: EmptyState(
        title: 'Henüz proje yok',
        message: 'Yetim giydirme, su kuyusu veya acil yardım gibi ilk projenizi oluşturun.',
        action: FilledButton(onPressed: () {}, child: const Text('Yeni proje')),
      ),
    );
  }
}
