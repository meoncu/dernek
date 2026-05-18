import '../../core/security/rbac.dart';

class AppUser {
  const AppUser({
    required this.uid,
    required this.email,
    this.displayName,
    this.photoURL,
    required this.roles,
    required this.tenantIds,
    this.createdAt,
    this.updatedAt,
  });

  final String uid;
  final String email;
  final String? displayName;
  final String? photoURL;
  final Set<AppRole> roles;
  final Set<String> tenantIds;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  bool get isAdmin => roles.any((role) => role.canManageAllProjects);
  bool get canWrite => roles.any((role) => role.canWrite);
}

abstract interface class UserRepository {
  Stream<AppUser?> watchUser(String uid);
  Future<void> updateUserProfile(String uid, {String? displayName, String? photoURL});
}
