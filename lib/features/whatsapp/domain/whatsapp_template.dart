enum WhatsAppTemplateType { thankYou, projectResult, paymentReminder, custom }

class WhatsAppTemplate {
  const WhatsAppTemplate({required this.id, required this.type, required this.title, required this.body});

  final String id;
  final WhatsAppTemplateType type;
  final String title;
  final String body;

  String render(Map<String, String> variables) {
    return variables.entries.fold(body, (value, entry) => value.replaceAll('{{${entry.key}}}', entry.value));
  }
}
