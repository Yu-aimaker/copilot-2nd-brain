import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/lib/theme";
import type { Source, Priority } from "@2nd-brain/shared";

interface Props {
  source: Source;
  onPress?: () => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: theme.colors.priorityHigh,
  medium: theme.colors.priorityMedium,
  low: theme.colors.priorityLow,
};

const TYPE_ICONS: Record<string, string> = {
  text: "document-text-outline",
  url: "link-outline",
  image: "image-outline",
  audio: "mic-outline",
  video: "videocam-outline",
  pdf: "document-outline",
  file: "folder-outline",
};

export function SourceCard({ source, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.typeIcon}>
          <Ionicons
            name={(TYPE_ICONS[source.type] ?? "document-outline") as any}
            size={18}
            color={theme.colors.brand}
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            {source.title}
          </Text>
          <Text style={styles.date}>
            {new Date(source.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <View
          style={[
            styles.priorityDot,
            { backgroundColor: PRIORITY_COLORS[source.priority] },
          ]}
        />
      </View>

      {source.summary && (
        <Text style={styles.summary} numberOfLines={2}>
          {source.summary}
        </Text>
      )}

      {source.tags.length > 0 && (
        <View style={styles.tags}>
          {source.tags.slice(0, 4).map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.brandLight,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summary: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: theme.spacing.sm,
  },
  tag: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
