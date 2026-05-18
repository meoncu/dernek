import 'package:cloud_firestore/cloud_firestore.dart';

import '../domain/project.dart';

class FirestoreProjectRepository implements ProjectRepository {
  FirestoreProjectRepository(this._firestore);

  final FirebaseFirestore _firestore;

  CollectionReference<Map<String, dynamic>> get _projects => _firestore.collection('projects');

  @override
  Stream<List<Project>> watchProjects({required String tenantId, required String effectiveUid}) {
    return _projects
        .where('tenantId', isEqualTo: tenantId)
        .where('ownerUid', isEqualTo: effectiveUid)
        .where('isDeleted', isEqualTo: false)
        .orderBy('endDate')
        .snapshots()
        .map((snapshot) => snapshot.docs.map(_fromDoc).toList(growable: false));
  }

  @override
  Future<String> createProject(Project project) async {
    final doc = _projects.doc(project.id.isEmpty ? null : project.id);
    await doc.set(_toJson(project));
    return doc.id;
  }

  @override
  Future<void> updateProject(Project project) {
    return _projects.doc(project.id).update(_toJson(project));
  }

  @override
  Future<void> completeProject({required String projectId, required String resultReportId}) {
    return _projects.doc(projectId).update({
      'status': 'completed',
      'completion.isCompleted': true,
      'reportId': resultReportId,
      'updatedAt': FieldValue.serverTimestamp(),
    });
  }

  Project _fromDoc(QueryDocumentSnapshot<Map<String, dynamic>> doc) {
    final data = doc.data();
    return Project(
      id: doc.id,
      tenantId: data['tenantId'] as String,
      ownerUid: data['ownerUid'] as String,
      name: data['name'] as String,
      projectTypeId: data['projectTypeId'] as String,
      targetBudget: data['targetBudget'] as num? ?? 0,
      collectedBudget: data['collectedBudget'] as num? ?? 0,
      currency: data['currency'] as String? ?? 'TRY',
      status: ProjectStatus.values.firstWhere(
        (status) => status.name == data['status'],
        orElse: () => ProjectStatus.draft,
      ),
    );
  }

  Map<String, Object?> _toJson(Project project) {
    return {
      'tenantId': project.tenantId,
      'ownerUid': project.ownerUid,
      'name': project.name,
      'projectTypeId': project.projectTypeId,
      'targetBudget': project.targetBudget,
      'collectedBudget': project.collectedBudget,
      'currency': project.currency,
      'status': project.status.name,
      'isDeleted': false,
      'schemaVersion': 1,
      'updatedAt': FieldValue.serverTimestamp(),
    };
  }
}
