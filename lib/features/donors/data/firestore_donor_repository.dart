import 'package:cloud_firestore/cloud_firestore.dart';

import '../domain/donor.dart';

class FirestoreDonorRepository implements DonorRepository {
  FirestoreDonorRepository(this._firestore);

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _donors => _firestore.collection('donors');

  @override
  Stream<List<Donor>> watchDonors({required String tenantId, required String effectiveUid, bool missingPhoneOnly = false}) {
    var query = _donors
        .where('tenantId', isEqualTo: tenantId)
        .where('ownerUid', isEqualTo: effectiveUid)
        .where('isDeleted', isEqualTo: false);

    if (missingPhoneOnly) {
      query = query.where('phone', isEqualTo: null).where('whatsappNumber', isEqualTo: null);
    }

    return query.orderBy('lastName').snapshots().map((snapshot) => snapshot.docs.map(_fromDoc).toList(growable: false));
  }

  @override
  Future<String> upsertDonor(Donor donor) async {
    final doc = _donors.doc(donor.id.isEmpty ? null : donor.id);
    await doc.set(_toJson(donor), SetOptions(merge: true));
    return doc.id;
  }

  Donor _fromDoc(QueryDocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data();
    return Donor(
      id: doc.id,
      tenantId: data['tenantId'] as String,
      ownerUid: data['ownerUid'] as String,
      firstName: data['firstName'] as String,
      lastName: data['lastName'] as String,
      phone: data['phone'] as String?,
      whatsappNumber: data['whatsappNumber'] as String?,
      email: data['email'] as String?,
      city: data['city'] as String?,
      country: data['country'] as String?,
      tags: List<String>.from(data['tags'] ?? []),
      referenceDonorId: data['referenceDonorId'] as String?,
      relationshipNote: data['relationshipNote'] as String?,
    );
  }

  Map<String, Object?> _toJson(Donor donor) {
    return {
      'tenantId': donor.tenantId,
      'ownerUid': donor.ownerUid,
      'firstName': donor.firstName,
      'lastName': donor.lastName,
      'phone': donor.phone,
      'whatsappNumber': donor.whatsappNumber,
      'email': donor.email,
      'city': donor.city,
      'country': donor.country,
      'tags': donor.tags,
      'referenceDonorId': donor.referenceDonorId,
      'relationshipNote': donor.relationshipNote,
      'isDeleted': false,
      'updatedAt': FieldValue.serverTimestamp(),
    };
  }
}
