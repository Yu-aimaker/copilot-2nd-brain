import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { trpc } from "@/lib/trpc";
import { theme } from "@/lib/theme";
import { ActionCard } from "@/components/ActionCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import type { SourceType } from "@2nd-brain/shared";

/**
 * NEXT tab – AI-suggested concrete actions.
 */
export default function NextScreen() {
  const actionsQuery = trpc.action.list.useQuery({ limit: 50 });
  const generateMutation = trpc.action.generateSuggestions.useMutation({
    onSuccess: () => actionsQuery.refetch(),
  });
  const updateStatus = trpc.action.updateStatus.useMutation({
    onSuccess: () => actionsQuery.refetch(),
  });
  const sourcesQuery = trpc.source.list.useQuery({ limit: 30, offset: 0 });
  const createSource = trpc.source.create.useMutation({
    onSuccess: () => sourcesQuery.refetch(),
  });

  const handleToggle = (action: { id: string; status: string }) => {
    const nextStatus = action.status === "done" ? "pending" : "done";
    updateStatus.mutate({
      id: action.id,
      status: nextStatus as any,
    });
  };

  const handleSave = (data: {
    type: SourceType;
    title: string;
    content: string;
  }) => {
    createSource.mutate(data);
  };

  const pendingActions =
    actionsQuery.data?.filter((a) => a.status !== "done") ?? [];
  const doneActions =
    actionsQuery.data?.filter((a) => a.status === "done") ?? [];

  return (
    <View style={styles.container}>
      {/* Generate button */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => generateMutation.mutate()}
        disabled={generateMutation.isPending}
      >
        {generateMutation.isPending ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons name="sparkles" size={18} color="#FFFFFF" />
        )}
        <Text style={styles.generateText}>
          {generateMutation.isPending
            ? "Analyzing..."
            : "Generate AI Suggestions"}
        </Text>
      </TouchableOpacity>

      {actionsQuery.isLoading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={theme.colors.brand}
        />
      ) : (
        <FlatList
          data={[...pendingActions, ...doneActions]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActionCard
              action={item as any}
              onToggle={() => handleToggle(item)}
            />
          )}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            pendingActions.length > 0 ? (
              <Text style={styles.sectionTitle}>
                Pending ({pendingActions.length})
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🚀</Text>
              <Text style={styles.emptyTitle}>No actions yet</Text>
              <Text style={styles.emptyText}>
                Add sources and tap "Generate AI Suggestions"
              </Text>
            </View>
          }
        />
      )}

      <FloatingActionButton onSave={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: theme.colors.brand,
    margin: theme.spacing.md,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.sm,
  },
  generateText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: theme.spacing.xl,
  },
});
