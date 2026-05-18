import 'package:cloud_firestore/cloud_firestore.dart';

import '../domain/donation.dart';

class FirestoreDonationRepository implements DonationRepository {
  FirestoreDonationRepository(this._firestore);

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _donations => _firestore.collection('donations');

  @override
  Stream<List<Donation>> watchProjectDonations(String projectId) {
    return _donations
        .where('projectId', isEqualTo: projectId)
        .where('isDeleted', isEqualTo: false)
        .orderBy('donatedAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs.map(_fromDoc).toList(growable: false));
  }

  @override
  Future<String> createDonation(Donation donation) async {
    final doc = _donations.doc(donation.id.isEmpty ? null : donation.id);
    await doc.set(_toJson(donation));
    return doc.id;
  }

  @override
  Future<void> updateDonationStatus({required String donationId, required DonationStatus status}) {
    return _donations.doc(donationId).update({
      'status': status.name,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  Donation _fromDoc(QueryDocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data();
    return Donation(
      id: doc.id,
      tenantId: data['tenantId'] as String,
      ownerUid: data['ownerUid'] as String,
      projectId: data['projectId'] as String,
      donorId: data['donorId'] as String,
      amount: data['amount'] as num,
      currency: data['currency'] as String? ?? 'TRY',
      status: DonationStatus.values.firstWhere(
        (status) => status.name == data['status'],
        orElse: () => DonationStatus.pending,
      ),
      donatedAt: (data['donatedAt'] as Timestamp).toDate(),
      paymentMethod: PaymentMethod.values.firstWhere(
        (method) => method.name == data['paymentMethod'],
        orElse: () => PaymentMethod.bankTransfer,
      ),
      receiptPath: data['receiptPath'] as String?,
      notes: data['notes'] as String?,
    );
  }

  Map<String, Object?> _toJson(Donation donation) {
    return {
      'tenantId': donation.tenantId,
      'ownerUid': donation.ownerUid,
      'projectId': donation.projectId,
      'donorId': donation.donorId,
      'amount': donation.amount,
      'currency': donation.currency,
      'status': donation.status.name,
      'donatedAt': Timestamp.fromDate(donation.donatedAt),
      'paymentMethod': donation.paymentMethod.name,
      'receiptPath': donation.receiptPath,
      'notes': donation.notes,
      'isDeleted': false,
      'schemaVersion': 1,
      'updatedAt': FieldValue.serverTimestamp(),
    };
  }
}
