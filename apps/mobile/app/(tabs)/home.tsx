import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { trpc } from '../../src/utils/trpc';

export default function HomeScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [content, setContent] = useState('');

  const { data: sources, refetch } = trpc.sources.list.useQuery({ limit: 20, offset: 0 });
  const { data: projects } = trpc.projects.list.useQuery();
  const createSource = trpc.sources.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowAddModal(false);
      setContent('');
    },
  });

  const handleAddSource = () => {
    if (content.trim()) {
      createSource.mutate({ content: content.trim() });
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
          <Text style={styles.title}>Your Sources</Text>
          <Text style={styles.subtitle}>AI-powered knowledge base</Text>
        </View>

        {sources?.map((source: any) => (
          <View key={source.id} style={styles.sourceCard}>
            <View style={styles.sourceHeader}>
              <View style={styles.mediaTypeBadge}>
                <Text style={styles.mediaTypeText}>{source.mediaType}</Text>
              </View>
              <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(source.priority) }]} />
            </View>
            
            {source.summary && (
              <Text style={styles.summary}>{source.summary}</Text>
            )}
            
            <Text style={styles.content} numberOfLines={3}>
              {source.content}
            </Text>
            
            {source.tags && source.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {source.tags.map((tag: string, idx: number) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}
            
            <Text style={styles.date}>
              {new Date(source.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Source Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Source</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter your content here..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              value={content}
              onChangeText={setContent}
              autoFocus
            />
            
            <Text style={styles.helperText}>
              AI will automatically detect media type, generate tags, and set priority
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddSource}
                disabled={createSource.isPending}
              >
                <Text style={styles.saveButtonText}>
                  {createSource.isPending ? 'Saving...' : 'Save'}
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
  sourceCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaTypeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mediaTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  summary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
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
    minHeight: 400,
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
    textAlignVertical: 'top',
    minHeight: 150,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 6,
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
