enum ProjectStatus { draft, active, paused, completed, cancelled }

class Project {
  const Project({
    required this.id,
    required this.tenantId,
    required this.ownerUid,
    required this.name,
    required this.projectTypeId,
    required this.targetBudget,
    required this.collectedBudget,
    required this.currency,
    required this.status,
  });

  final String id;
  final String tenantId;
  final String ownerUid;
  final String name;
  final String projectTypeId;
  final num targetBudget;
  final num collectedBudget;
  final String currency;
  final ProjectStatus status;

  double get progress => targetBudget <= 0 ? 0 : (collectedBudget / targetBudget).clamp(0, 1).toDouble();
}

abstract interface class ProjectRepository {
  Stream<List<Project>> watchProjects({required String tenantId, required String effectiveUid});
  Future<String> createProject(Project project);
  Future<void> updateProject(Project project);
  Future<void> completeProject({required String projectId, required String resultReportId});
}
