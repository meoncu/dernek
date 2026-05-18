import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:flutter/foundation.dart';

import '../security/rbac.dart';

class AuthRepository {
  AuthRepository({
    FirebaseAuth? auth,
    FirebaseFirestore? firestore,
    FirebaseFunctions? functions,
  })  : _auth = auth ?? FirebaseAuth.instance,
        _firestore = firestore ?? FirebaseFirestore.instance,
        _functions = functions ?? FirebaseFunctions.instance;

  final FirebaseAuth _auth;
  final FirebaseFirestore _firestore;
  final FirebaseFunctions _functions;

  Stream<User?> get authStateChanges => _auth.authStateChanges();
  User? get currentUser => _auth.currentUser;

  Future<UserSession> signInWithGoogle() async {
    UserCredential userCredential;

    if (kIsWeb) {
      // Web: use FirebaseAuth popup (no google_sign_in package needed)
      final googleProvider = GoogleAuthProvider();
      googleProvider.setCustomParameters({'prompt': 'select_account'});
      userCredential = await _auth.signInWithPopup(googleProvider);
    } else {
      // Mobile: use google_sign_in package
      final googleSignIn = await _getGoogleSignIn();
      final googleUser = await googleSignIn.signIn();
      if (googleUser == null) {
        throw Exception('Google sign-in aborted');
      }
      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      userCredential = await _auth.signInWithCredential(credential);
    }

    final user = userCredential.user;
    if (user == null) {
      throw Exception('Sign-in failed: no user');
    }

    await _ensureUserDocument(user);
    await user.getIdToken(true);
    final idTokenResult = await user.getIdTokenResult();

    return UserSession(
      uid: user.uid,
      email: user.email ?? '',
      roles: _parseRoles(idTokenResult.claims),
      tenantIds: _parseTenantIds(idTokenResult.claims),
    );
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }

  Future<UserSession> reloadSession() async {
    final user = _auth.currentUser;
    if (user == null) {
      throw Exception('No user signed in');
    }

    await user.reload();
    await user.getIdToken(true);
    final idTokenResult = await user.getIdTokenResult();

    return UserSession(
      uid: user.uid,
      email: user.email ?? '',
      roles: _parseRoles(idTokenResult.claims),
      tenantIds: _parseTenantIds(idTokenResult.claims),
    );
  }

  Future<void> startImpersonation(String targetUid) async {
    final callable = _functions.httpsCallable('startImpersonation');
    await callable.call({'targetUid': targetUid});
  }

  Future<void> _ensureUserDocument(User user) async {
    final docRef = _firestore.doc('users/${user.uid}');
    final doc = await docRef.get();

    if (!doc.exists) {
      await docRef.set({
        'email': user.email,
        'displayName': user.displayName,
        'photoURL': user.photoURL,
        'createdAt': FieldValue.serverTimestamp(),
        'updatedAt': FieldValue.serverTimestamp(),
      }, SetOptions(merge: true));
    }
  }

  Set<AppRole> _parseRoles(Map<String, dynamic>? claims) {
    final rolesList = claims?['roles'] as List<dynamic>?;
    if (rolesList == null) return {AppRole.user};

    return rolesList
        .whereType<String>()
        .map((role) => AppRole.values.firstWhere(
              (r) => r.wireName == role,
              orElse: () => AppRole.user,
            ))
        .toSet();
  }

  Set<String> _parseTenantIds(Map<String, dynamic>? claims) {
    final tenantList = claims?['tenantIds'] as List<dynamic>?;
    if (tenantList == null) return {'default'};

    return tenantList.whereType<String>().toSet();
  }

  Future<dynamic> _getGoogleSignIn() async {
    // Lazy import to avoid web dependency issues
    final googleSignIn = await _importGoogleSignIn();
    return googleSignIn.GoogleSignIn.standard();
  }

  Future<dynamic> _importGoogleSignIn() async {
    // ignore: avoid_dynamic_calls
    return await Future.value(null);
  }
}
