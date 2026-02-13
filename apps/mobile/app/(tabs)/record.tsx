import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { trpc } from "@/lib/trpc";
import { theme } from "@/lib/theme";
import { SourceCard } from "@/components/SourceCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import type { SourceType } from "@2nd-brain/shared";

/**
 * RECORD tab – calendar view of saved sources.
 */
export default function RecordScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const sourcesQuery = trpc.source.list.useQuery({ limit: 100, offset: 0 });
  const createSource = trpc.source.create.useMutation({
    onSuccess: () => sourcesQuery.refetch(),
  });

  // Filter sources for selected date
  const sourcesForDate = (sourcesQuery.data ?? []).filter((s) =>
    s.createdAt?.toString().startsWith(selectedDate)
  );

  // Build marked dates
  const markedDates: Record<string, any> = {};
  for (const s of sourcesQuery.data ?? []) {
    const date = s.createdAt?.toString().split("T")[0];
    if (date) {
      markedDates[date] = {
        marked: true,
        dotColor: theme.colors.brand,
      };
    }
  }
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: theme.colors.brand,
  };

  const handleSave = useCallback(
    (data: { type: SourceType; title: string; content: string }) => {
      createSource.mutate(data);
    },
    [createSource]
  );

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.background,
          todayTextColor: theme.colors.brand,
          selectedDayBackgroundColor: theme.colors.brand,
          arrowColor: theme.colors.brand,
          textDayFontWeight: "500",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "600",
        }}
      />

      <View style={styles.dateHeader}>
        <Text style={styles.dateTitle}>{selectedDate}</Text>
        <Text style={styles.dateCount}>
          {sourcesForDate.length} source{sourcesForDate.length !== 1 ? "s" : ""}
        </Text>
      </View>

      {sourcesQuery.isLoading ? (
        <ActivityIndicator color={theme.colors.brand} />
      ) : (
        <FlatList
          data={sourcesForDate}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SourceCard source={item as any} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No sources for this date</Text>
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
    backgroundColor: theme.colors.background,
  },
  dateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  dateCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  list: {
    padding: theme.spacing.md,
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xl,
    fontSize: 14,
  },
});
