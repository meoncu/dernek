import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class FcmService {
  FcmService({
    FirebaseMessaging? messaging,
    FirebaseFirestore? firestore,
  })  : _messaging = messaging ?? FirebaseMessaging.instance,
        _firestore = firestore ?? FirebaseFirestore.instance;

  final FirebaseMessaging _messaging;
  final FirebaseFirestore _firestore;

  /// Get the current FCM token
  Future<String?> getToken() async {
    return await _messaging.getToken();
  }

  /// Subscribe to a topic (e.g., project-updates, tenant-XYZ)
  Future<void> subscribeToTopic(String topic) async {
    await _messaging.subscribeToTopic(topic);
  }

  /// Unsubscribe from a topic
  Future<void> unsubscribeFromTopic(String topic) async {
    await _messaging.unsubscribeFromTopic(topic);
  }

  /// Save FCM token to user document in Firestore
  Future<void> saveTokenToUser(String uid, String token) async {
    await _firestore.doc('users/$uid').set({
      'fcmTokens': FieldValue.arrayUnion([token]),
      'updatedAt': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  /// Remove FCM token from user document (e.g., on logout)
  Future<void> removeTokenFromUser(String uid, String token) async {
    await _firestore.doc('users/$uid').update({
      'fcmTokens': FieldValue.arrayRemove([token]),
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  /// Listen to token refresh events and update Firestore
  void onTokenRefresh(String uid) {
    _messaging.onTokenRefresh.listen((newToken) async {
      await saveTokenToUser(uid, newToken);
    });
  }

  /// Handle background messages (must be a top-level or static function)
  static Future<void> backgroundMessageHandler(RemoteMessage message) async {
    // TODO: Handle background notifications (e.g., show local notification)
  }

  /// Handle foreground messages
  void onForegroundMessage(void Function(RemoteMessage) handler) {
    FirebaseMessaging.onMessage.listen(handler);
  }
}
