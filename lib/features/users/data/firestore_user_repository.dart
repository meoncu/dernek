import 'package:cloud_firestore/cloud_firestore.dart';

import '../domain/user.dart';
import '../../../core/security/rbac.dart';

class FirestoreUserRepository implements UserRepository {
  FirestoreUserRepository(this._firestore);

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _users => _firestore.collection('users');

  @override
  Stream<AppUser?> watchUser(String uid) {
    return _users.doc(uid).snapshots().map((doc) {
      if (!doc.exists) return null;
      return _fromDoc(doc);
    });
  }

  @override
  Future<void> updateUserProfile(String uid, {String? displayName, String? photoURL}) {
    final updates = <String, dynamic>{'updatedAt': FieldValue.serverTimestamp()};
    if (displayName != null) updates['displayName'] = displayName;
    if (photoURL != null) updates['photoURL'] = photoURL;
    return _users.doc(uid).update(updates);
  }

  AppUser _fromDoc(DocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data()!;
    return AppUser(
      uid: doc.id,
      email: data['email'] as String,
      displayName: data['displayName'] as String?,
      photoURL: data['photoURL'] as String?,
      roles: _parseRoles(data['roles'] as List<dynamic>?),
      tenantIds: Set<String>.from(data['tenantIds'] as List<dynamic>? ?? ['default']),
      createdAt: data['createdAt'] != null ? (data['createdAt'] as Timestamp).toDate() : null,
      updatedAt: data['updatedAt'] != null ? (data['updatedAt'] as Timestamp).toDate() : null,
    );
  }

  Set<AppRole> _parseRoles(List<dynamic>? rolesList) {
    if (rolesList == null) return {AppRole.user};
    return rolesList
        .whereType<String>()
        .map((role) => AppRole.values.firstWhere(
              (r) => r.wireName == role,
              orElse: () => AppRole.user,
            ))
        .toSet();
  }
}
