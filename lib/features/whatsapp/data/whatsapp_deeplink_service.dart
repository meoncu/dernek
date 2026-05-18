import 'package:url_launcher/url_launcher.dart';

class WhatsAppDeeplinkService {
  Future<bool> openChat({required String phoneNumber, required String message}) {
    final normalizedPhone = phoneNumber.replaceAll(RegExp('[^0-9+]'), '');
    final uri = Uri.https('wa.me', '/$normalizedPhone', {'text': message});
    return launchUrl(uri, mode: LaunchMode.externalApplication);
  }
}
