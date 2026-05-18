// File generated manually based on Firebase web app configuration.
// Run `flutterfire configure` to regenerate for additional platforms
// (Android, iOS, macOS) when needed.

import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
      case TargetPlatform.iOS:
      case TargetPlatform.macOS:
      case TargetPlatform.windows:
      case TargetPlatform.linux:
      case TargetPlatform.fuchsia:
        throw UnsupportedError(
          'DefaultFirebaseOptions has not been configured for '
          '$defaultTargetPlatform yet. Run `flutterfire configure` to add it.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyCIun0gRQxgtOquKOv-pIsVakLIxz3XxY8',
    appId: '1:1013133296340:web:caa7812edefdce0b93b141',
    messagingSenderId: '1013133296340',
    projectId: 'dernek-80ac4',
    authDomain: 'dernek-80ac4.firebaseapp.com',
    storageBucket: 'dernek-80ac4.firebasestorage.app',
    measurementId: 'G-5Y1TJR1LFH',
  );
}
