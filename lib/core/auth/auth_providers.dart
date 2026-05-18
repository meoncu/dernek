import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../security/rbac.dart';

final currentSessionProvider = StreamProvider<UserSession?>((ref) async* {
  // FirebaseAuth + users/{uid} + custom claims entegrasyonu burada yapılır.
  yield const UserSession(
    uid: 'local-preview',
    email: 'meoncu@gmail.com',
    roles: {AppRole.superAdmin},
    tenantIds: {'default'},
  );
});
