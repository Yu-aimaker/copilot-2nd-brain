import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { trpc } from "@/lib/trpc";
import { theme } from "@/lib/theme";

/**
 * Source detail screen – shows full source info and AI analysis.
 */
export default function SourceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sourceQuery = trpc.source.getById.useQuery({ id: id ?? "" });

  if (sourceQuery.isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.brand} />
      </View>
    );
  }

  const source = sourceQuery.data;
  if (!source) {
    return (
      <View style={styles.loader}>
        <Text>Source not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Source Detail" }} />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{source.title}</Text>
          <View style={styles.meta}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{source.type}</Text>
            </View>
            <View
              style={[
                styles.priorityBadge,
                {
                  backgroundColor:
                    source.priority === "high"
                      ? theme.colors.priorityHigh + "20"
                      : source.priority === "medium"
                        ? theme.colors.priorityMedium + "20"
                        : theme.colors.priorityLow + "20",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color:
                    source.priority === "high"
                      ? theme.colors.priorityHigh
                      : source.priority === "medium"
                        ? theme.colors.priorityMedium
                        : theme.colors.priorityLow,
                }}
              >
                {source.priority}
              </Text>
            </View>
          </View>
        </View>

        {/* AI Summary */}
        {source.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="sparkles"
                size={16}
                color={theme.colors.brand}
              />
              <Text style={styles.sectionTitle}>AI Summary</Text>
            </View>
            <Text style={styles.summaryText}>{source.summary}</Text>
          </View>
        )}

        {/* Tags */}
        {source.tags?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tags}>
              {(source.tags as string[]).map((tag: string) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content</Text>
          <Text style={styles.contentText}>{source.content}</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  meta: {
    flexDirection: "row",
    gap: 8,
  },
  typeBadge: {
    backgroundColor: theme.colors.brandLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.brand,
    textTransform: "uppercase",
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  summaryText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  contentText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
  },
});
