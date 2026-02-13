import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { trpc } from "@/lib/trpc";
import { theme } from "@/lib/theme";
import { SourceCard } from "@/components/SourceCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import type { SourceType } from "@2nd-brain/shared";

/**
 * HOME tab – shows recent sources and quick stats.
 */
export default function HomeScreen() {
  const sourcesQuery = trpc.source.list.useQuery({ limit: 30, offset: 0 });
  const actionsQuery = trpc.action.list.useQuery({ limit: 5 });
  const createSource = trpc.source.create.useMutation({
    onSuccess: () => sourcesQuery.refetch(),
  });

  const handleSave = (data: {
    type: SourceType;
    title: string;
    content: string;
  }) => {
    createSource.mutate(data);
  };

  return (
    <View style={styles.container}>
      {/* Stats bar */}
      <View style={styles.stats}>
        <StatBox
          label="Sources"
          value={sourcesQuery.data?.length ?? 0}
          color={theme.colors.brand}
        />
        <StatBox
          label="Pending"
          value={
            actionsQuery.data?.filter((a) => a.status === "pending").length ?? 0
          }
          color={theme.colors.warning}
        />
        <StatBox
          label="Done"
          value={
            actionsQuery.data?.filter((a) => a.status === "done").length ?? 0
          }
          color={theme.colors.success}
        />
      </View>

      {/* Source list */}
      {sourcesQuery.isLoading ? (
        <ActivityIndicator
          style={styles.loader}
          size="large"
          color={theme.colors.brand}
        />
      ) : (
        <FlatList
          data={sourcesQuery.data ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SourceCard source={item as any} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🧠</Text>
              <Text style={styles.emptyTitle}>Your brain is empty</Text>
              <Text style={styles.emptyText}>
                Tap + to save your first source
              </Text>
            </View>
          }
        />
      )}

      <FloatingActionButton onSave={handleSave} />
    </View>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: 100,
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
  },
});
