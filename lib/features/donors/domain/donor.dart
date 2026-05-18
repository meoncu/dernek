class Donor {
  const Donor({
    required this.id,
    required this.tenantId,
    required this.ownerUid,
    required this.firstName,
    required this.lastName,
    this.phone,
    this.whatsappNumber,
    this.email,
    this.city,
    this.country,
    this.tags = const [],
    this.referenceDonorId,
    this.relationshipNote,
  });

  final String id;
  final String tenantId;
  final String ownerUid;
  final String firstName;
  final String lastName;
  final String? phone;
  final String? whatsappNumber;
  final String? email;
  final String? city;
  final String? country;
  final List<String> tags;
  final String? referenceDonorId;
  final String? relationshipNote;

  String get fullName => '$firstName $lastName'.trim();
  bool get hasMissingPhone => (phone == null || phone!.trim().isEmpty) && (whatsappNumber == null || whatsappNumber!.trim().isEmpty);
}

abstract interface class DonorRepository {
  Stream<List<Donor>> watchDonors({required String tenantId, required String effectiveUid, bool missingPhoneOnly = false});
  Future<String> upsertDonor(Donor donor);
}
