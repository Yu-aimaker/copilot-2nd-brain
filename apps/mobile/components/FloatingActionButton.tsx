import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/lib/theme";
import type { SourceType } from "@2nd-brain/shared";

interface Props {
  onSave: (data: { type: SourceType; title: string; content: string }) => void;
}

const SOURCE_TYPES: { type: SourceType; icon: string; label: string }[] = [
  { type: "text", icon: "document-text", label: "Text" },
  { type: "url", icon: "link", label: "URL" },
  { type: "image", icon: "image", label: "Image" },
  { type: "audio", icon: "mic", label: "Audio" },
  { type: "video", icon: "videocam", label: "Video" },
  { type: "pdf", icon: "document", label: "PDF" },
  { type: "file", icon: "folder", label: "File" },
];

/**
 * Shared floating action button for instant source capture.
 * Present on every tab.
 */
export function FloatingActionButton({ onSave }: Props) {
  const [visible, setVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<SourceType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    const data = { type: selectedType, title: title.trim(), content: content.trim() };
    setVisible(false);
    try {
      onSave(data);
      setTitle("");
      setContent("");
    } catch {
      // Re-open modal so the user can retry
      setVisible(true);
    }
  };

  return (
    <>
      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Save to Brain</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Source type selector */}
            <View style={styles.typeRow}>
              {SOURCE_TYPES.map((st) => (
                <TouchableOpacity
                  key={st.type}
                  style={[
                    styles.typeChip,
                    selectedType === st.type && styles.typeChipActive,
                  ]}
                  onPress={() => setSelectedType(st.type)}
                >
                  <Ionicons
                    name={st.icon as any}
                    size={16}
                    color={
                      selectedType === st.type
                        ? "#FFFFFF"
                        : theme.colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.typeLabel,
                      selectedType === st.type && styles.typeLabelActive,
                    ]}
                  >
                    {st.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Title */}
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor={theme.colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            {/* Content */}
            <TextInput
              style={[styles.input, styles.contentInput]}
              placeholder="Paste or type content..."
              placeholderTextColor={theme.colors.textSecondary}
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />

            {/* Save button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                (!title.trim() || !content.trim()) && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!title.trim() || !content.trim()}
            >
              <Ionicons name="sparkles" size={18} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save & AI Process</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.brand,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: theme.colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: theme.spacing.md,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeChipActive: {
    backgroundColor: theme.colors.brand,
    borderColor: theme.colors.brand,
  },
  typeLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  typeLabelActive: {
    color: "#FFFFFF",
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
  },
  contentInput: {
    minHeight: 120,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.brand,
    borderRadius: theme.borderRadius.sm,
    paddingVertical: 14,
    marginTop: theme.spacing.sm,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
