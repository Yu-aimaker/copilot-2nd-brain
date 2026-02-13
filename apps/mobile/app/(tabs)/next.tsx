import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { trpc } from '../../src/utils/trpc';

export default function NextScreen() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { data: actions, refetch } = trpc.actions.list.useQuery({
    limit: 50,
    offset: 0,
    completed: false,
  });

  const { data: suggestions } = trpc.actions.suggestActions.useQuery();

  const createAction = trpc.actions.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
    },
  });

  const updateAction = trpc.actions.update.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateAction.mutate({ id, completed: !completed });
  };

  const handleCreateAction = () => {
    if (title.trim() && description.trim()) {
      createAction.mutate({
        title: title.trim(),
        description: description.trim(),
        priority: 'MEDIUM',
        sourceIds: [],
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return '#EF4444';
      case 'HIGH': return '#F59E0B';
      case 'MEDIUM': return '#3B82F6';
      case 'LOW': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Next Actions</Text>
          <Text style={styles.subtitle}>AI-suggested actions based on your sources</Text>
        </View>

        {/* AI Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✨ AI Suggestions</Text>
            </View>
            
            {suggestions.map((suggestion: any, idx: number) => (
              <View key={idx} style={[styles.actionCard, styles.suggestionCard]}>
                <View style={styles.actionHeader}>
                  <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(suggestion.priority) }]} />
                  <View style={styles.suggestionBadge}>
                    <Text style={styles.suggestionBadgeText}>AI SUGGESTED</Text>
                  </View>
                </View>
                
                <Text style={styles.actionTitle}>{suggestion.title}</Text>
                <Text style={styles.actionDescription}>{suggestion.description}</Text>
                
                {suggestion.sourceIds && suggestion.sourceIds.length > 0 && (
                  <Text style={styles.sourceCount}>
                    Based on {suggestion.sourceIds.length} source{suggestion.sourceIds.length !== 1 ? 's' : ''}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Current Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Actions</Text>
            <Text style={styles.sectionCount}>
              {actions?.length || 0} active
            </Text>
          </View>

          {actions && actions.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>⚡</Text>
              <Text style={styles.emptyText}>No actions yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first action or wait for AI suggestions
              </Text>
            </View>
          )}

          {actions?.map((action: any) => (
            <View key={action.id} style={styles.actionCard}>
              <TouchableOpacity
                style={styles.actionHeader}
                onPress={() => handleToggleComplete(action.id, action.completed)}
              >
                <View style={[
                  styles.checkbox,
                  action.completed && styles.checkboxCompleted
                ]}>
                  {action.completed && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(action.priority) }]} />
              </TouchableOpacity>
              
              <Text style={[
                styles.actionTitle,
                action.completed && styles.actionTitleCompleted
              ]}>
                {action.title}
              </Text>
              
              <Text style={styles.actionDescription}>{action.description}</Text>
              
              {action.dueDate && (
                <Text style={styles.dueDate}>
                  Due: {new Date(action.dueDate).toLocaleDateString()}
                </Text>
              )}
              
              <Text style={styles.createdDate}>
                Created {new Date(action.createdAt).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Create Action Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Action</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Action title"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleCreateAction}
                disabled={createAction.isPending}
              >
                <Text style={styles.saveButtonText}>
                  {createAction.isPending ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sectionCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  suggestionBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 'auto',
  },
  suggestionBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  actionTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  actionDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  sourceCount: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '500',
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
