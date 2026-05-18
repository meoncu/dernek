import 'package:flutter/foundation.dart';

/// Environment configuration loaded from --dart-define
/// Usage: flutter run --dart-define=ENV=dev
class Env {
  Env._();

  static const String env = String.fromEnvironment('ENV', defaultValue: 'dev');

  static bool get isDev => env == 'dev';
  static bool get isStaging => env == 'staging';
  static bool get isProduction => env == 'production';

  static bool get useEmulator => env == 'emulator';

  // Firebase emulator hosts (only used when useEmulator is true)
  static const String authEmulatorHost = 'localhost';
  static const String firestoreEmulatorHost = 'localhost';
  static const String functionsEmulatorHost = 'localhost';
  static const String storageEmulatorHost = 'localhost';

  // Emulator ports (standard Firebase Local Emulator Suite ports)
  static const int authEmulatorPort = 9099;
  static const int firestoreEmulatorPort = 8080;
  static const int functionsEmulatorPort = 5001;
  static const int storageEmulatorPort = 9199;

  static void debugPrint() {
    if (kDebugMode) {
      print('=== Env Configuration ===');
      print('ENV: $env');
      print('useEmulator: $useEmulator');
      if (useEmulator) {
        print('Auth Emulator: $authEmulatorHost:$authEmulatorPort');
        print('Firestore Emulator: $firestoreEmulatorHost:$firestoreEmulatorPort');
        print('Functions Emulator: $functionsEmulatorHost:$functionsEmulatorPort');
        print('Storage Emulator: $storageEmulatorHost:$storageEmulatorPort');
      }
      print('========================');
    }
  }
}
