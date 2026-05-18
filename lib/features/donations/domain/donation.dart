enum DonationStatus { received, sentToBank, promised, pending, cancelled, missingInfo, partial }
enum PaymentMethod { cash, bankTransfer, card, online, other }

class Donation {
  const Donation({
    required this.id,
    required this.tenantId,
    required this.ownerUid,
    required this.projectId,
    required this.donorId,
    required this.amount,
    required this.currency,
    required this.status,
    required this.donatedAt,
    this.paymentMethod = PaymentMethod.bankTransfer,
    this.receiptPath,
    this.notes,
  });

  final String id;
  final String tenantId;
  final String ownerUid;
  final String projectId;
  final String donorId;
  final num amount;
  final String currency;
  final DonationStatus status;
  final DateTime donatedAt;
  final PaymentMethod paymentMethod;
  final String? receiptPath;
  final String? notes;
}

abstract interface class DonationRepository {
  Stream<List<Donation>> watchProjectDonations(String projectId);
  Future<String> createDonation(Donation donation);
  Future<void> updateDonationStatus({required String donationId, required DonationStatus status});
}
