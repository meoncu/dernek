enum AppRole { superAdmin, admin, operator, readonly, user }

extension AppRoleX on AppRole {
  String get wireName => switch (this) {
        AppRole.superAdmin => 'super_admin',
        AppRole.admin => 'admin',
        AppRole.operator => 'operator',
        AppRole.readonly => 'readonly',
        AppRole.user => 'user',
      };

  bool get canManageAllProjects => this == AppRole.superAdmin || this == AppRole.admin;
  bool get canImpersonate => this == AppRole.superAdmin || this == AppRole.admin;
  bool get canWrite => this != AppRole.readonly;
}

class UserSession {
  const UserSession({
    required this.uid,
    required this.email,
    required this.roles,
    required this.tenantIds,
    this.impersonatedUid,
  });

  final String uid;
  final String email;
  final Set<AppRole> roles;
  final Set<String> tenantIds;
  final String? impersonatedUid;

  String get effectiveUid => impersonatedUid ?? uid;
  bool get isAdmin => roles.any((role) => role.canManageAllProjects);
}
