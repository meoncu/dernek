import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../security/rbac.dart';
import 'auth_repository.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository();
});

final currentSessionProvider = StreamProvider<UserSession?>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  return authRepository.authStateChanges.asyncMap((user) async {
    if (user == null) return null;
    return await authRepository.reloadSession();
  });
});
