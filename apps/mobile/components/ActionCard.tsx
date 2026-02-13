import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/lib/theme";
import type { Action, ActionStatus, Priority } from "@2nd-brain/shared";

interface Props {
  action: Action;
  onToggle?: () => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: theme.colors.priorityHigh,
  medium: theme.colors.priorityMedium,
  low: theme.colors.priorityLow,
};

const STATUS_ICONS: Record<ActionStatus, string> = {
  pending: "ellipse-outline",
  in_progress: "time-outline",
  done: "checkmark-circle",
  skipped: "close-circle-outline",
};

export function ActionCard({ action, onToggle }: Props) {
  const isDone = action.status === "done";

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <Ionicons
          name={STATUS_ICONS[action.status] as any}
          size={22}
          color={isDone ? theme.colors.success : theme.colors.brand}
        />
        <View style={styles.content}>
          <Text style={[styles.title, isDone && styles.titleDone]}>
            {action.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {action.description}
          </Text>
          <View style={styles.meta}>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: PRIORITY_COLORS[action.priority] + "20" },
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  { color: PRIORITY_COLORS[action.priority] },
                ]}
              >
                {action.priority}
              </Text>
            </View>
            {action.dueDate && (
              <Text style={styles.dueDate}>
                Due: {new Date(action.dueDate).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </View>
      {action.reasoning && (
        <View style={styles.reasoning}>
          <Ionicons
            name="bulb-outline"
            size={14}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.reasoningText} numberOfLines={1}>
            {action.reasoning}
          </Text>
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
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  titleDone: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.full,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  dueDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  reasoning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  reasoningText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
  },
});
