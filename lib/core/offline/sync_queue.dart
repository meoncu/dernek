class SyncCommand {
  const SyncCommand({required this.id, required this.collection, required this.payload, required this.createdAt});

  final String id;
  final String collection;
  final Map<String, Object?> payload;
  final DateTime createdAt;
}

abstract interface class SyncQueue {
  Future<void> enqueue(SyncCommand command);
  Future<List<SyncCommand>> pending();
  Future<void> markCompleted(String id);
}
