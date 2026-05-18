import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'sync_queue.dart';

class LocalSyncQueue implements SyncQueue {
  LocalSyncQueue(this._prefs);

  final SharedPreferences _prefs;
  static const String _key = 'sync_queue';

  @override
  Future<void> enqueue(SyncCommand command) async {
    final queue = await pending();
    final updated = [...queue, command];
    await _prefs.setString(_key, jsonEncode(updated.map(_toJson).toList()));
  }

  @override
  Future<List<SyncCommand>> pending() async {
    final raw = _prefs.getString(_key);
    if (raw == null) return [];
    try {
      final List<dynamic> decoded = jsonDecode(raw);
      return decoded.map((e) => _fromJson(e as Map<String, dynamic>)).toList();
    } catch (_) {
      return [];
    }
  }

  @override
  Future<void> markCompleted(String id) async {
    final queue = await pending();
    final updated = queue.where((cmd) => cmd.id != id).toList();
    await _prefs.setString(_key, jsonEncode(updated.map(_toJson).toList()));
  }

  Map<String, dynamic> _toJson(SyncCommand cmd) => {
        'id': cmd.id,
        'collection': cmd.collection,
        'payload': cmd.payload,
        'createdAt': cmd.createdAt.toIso8601String(),
      };

  SyncCommand _fromJson(Map<String, dynamic> json) => SyncCommand(
        id: json['id'] as String,
        collection: json['collection'] as String,
        payload: Map<String, Object?>.from(json['payload'] as Map),
        createdAt: DateTime.parse(json['createdAt'] as String),
      );
}
