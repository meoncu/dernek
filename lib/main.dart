import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:cloud_functions/cloud_functions.dart';

import 'core/config/env.dart';
import 'core/routing/app_router.dart';
import 'core/theme/app_theme.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  // Configure emulators if in dev/staging
  if (Env.useEmulator) {
    await _configureEmulators();
  }

  // Enable Firestore offline persistence
  FirebaseFirestore.instance.settings = const Settings(
    persistenceEnabled: true,
    cacheSizeBytes: 10485760,
  );

  // Configure FCM (foreground notifications will be handled by the app)
  await _configureFCM();

  Env.debugPrint();

  runApp(const ProviderScope(child: DernekApp()));
}

Future<void> _configureEmulators() async {
  try {
    await FirebaseAuth.instance.useAuthEmulator(Env.authEmulatorHost, Env.authEmulatorPort);
    FirebaseFirestore.instance.useFirestoreEmulator(Env.firestoreEmulatorHost, Env.firestoreEmulatorPort);
    FirebaseFunctions.instance.useFunctionsEmulator(Env.functionsEmulatorHost, Env.functionsEmulatorPort);
    await FirebaseStorage.instance.useStorageEmulator(Env.storageEmulatorHost, Env.storageEmulatorPort);
  } catch (e) {
    debugPrint('Warning: Failed to connect to emulators: $e');
  }
}

Future<void> _configureFCM() async {
  try {
    final messaging = FirebaseMessaging.instance;

    // Request notification permissions
    final settings = await messaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      debugPrint('User granted notification permissions');
    } else if (settings.authorizationStatus == AuthorizationStatus.provisional) {
      debugPrint('User granted provisional notification permissions');
    } else {
      debugPrint('User declined notification permissions');
    }

    // Get FCM token
    final token = await messaging.getToken();
    if (token != null) {
      debugPrint('FCM Token: $token');
    }

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      debugPrint('Received FCM message: ${message.notification?.title}');
    });
  } catch (e) {
    debugPrint('FCM initialization skipped (web service worker not available): $e');
  }
}

class DernekApp extends ConsumerWidget {
  const DernekApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterProvider);

    return MaterialApp.router(
      title: 'Dernek',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      routerConfig: router,
    );
  }
}
