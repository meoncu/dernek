import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProjectCreateScreen extends StatelessWidget {
  const ProjectCreateScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Yeni Proje Oluştur'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const TextField(
              decoration: InputDecoration(
                labelText: 'Proje Adı',
                hintText: 'Örn: Yetim Giydirme',
              ),
            ),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(
                labelText: 'Hedef Bütçe',
                prefixText: '₺ ',
              ),
              keyboardType: TextInputType.number,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<String>(
              decoration: const InputDecoration(labelText: 'Proje Tipi'),
              items: const [
                DropdownMenuItem(value: 'orphan', child: Text('Yetim')),
                DropdownMenuItem(value: 'water_well', child: Text('Su Kuyusu')),
                DropdownMenuItem(value: 'emergency', child: Text('Acil Yardım')),
              ],
              onChanged: (_) {},
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: () {
                // TODO: Implement project creation
                context.pop();
              },
              child: const Text('Projeyi Kaydet'),
            ),
          ],
        ),
      ),
    );
  }
}
