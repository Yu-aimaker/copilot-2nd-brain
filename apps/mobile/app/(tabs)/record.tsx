import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { trpc } from '../../src/utils/trpc';

export default function RecordScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const { data: sources } = trpc.sources.list.useQuery({ limit: 100, offset: 0 });

  // Group sources by date
  const sourcesByDate = React.useMemo(() => {
    if (!sources) return {};
    
    return sources.reduce((acc: any, source: any) => {
      const date = new Date(source.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(source);
      return acc;
    }, {});
  }, [sources]);

  // Mark dates with sources
  const markedDates = React.useMemo(() => {
    const marked: any = {};
    Object.keys(sourcesByDate).forEach(date => {
      marked[date] = {
        marked: true,
        dotColor: '#3B82F6',
      };
    });
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: '#3B82F6',
      };
    }
    return marked;
  }, [sourcesByDate, selectedDate]);

  const selectedDateSources = selectedDate ? sourcesByDate[selectedDate] || [] : [];

  return (
    <View style={styles.container}>
      <Calendar
        theme={{
          backgroundColor: '#FFFFFF',
          calendarBackground: '#FFFFFF',
          textSectionTitleColor: '#6B7280',
          selectedDayBackgroundColor: '#3B82F6',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#3B82F6',
          dayTextColor: '#111827',
          textDisabledColor: '#D1D5DB',
          dotColor: '#3B82F6',
          selectedDotColor: '#FFFFFF',
          arrowColor: '#3B82F6',
          monthTextColor: '#111827',
          textMonthFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 20,
        }}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
      />

      <ScrollView style={styles.sourcesContainer}>
        {selectedDate && (
          <View style={styles.header}>
            <Text style={styles.dateTitle}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text style={styles.countText}>
              {selectedDateSources.length} {selectedDateSources.length === 1 ? 'source' : 'sources'}
            </Text>
          </View>
        )}

        {!selectedDate && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>Select a date to view sources</Text>
          </View>
        )}

        {selectedDate && selectedDateSources.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No sources for this date</Text>
          </View>
        )}

        {selectedDateSources.map((source: any) => (
          <View key={source.id} style={styles.sourceCard}>
            <View style={styles.sourceHeader}>
              <View style={styles.mediaTypeBadge}>
                <Text style={styles.mediaTypeText}>{source.mediaType}</Text>
              </View>
              <Text style={styles.time}>
                {new Date(source.createdAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>

            {source.summary && (
              <Text style={styles.summary}>{source.summary}</Text>
            )}

            <Text style={styles.content} numberOfLines={2}>
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
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sourcesContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  countText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
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
    fontSize: 16,
    color: '#6B7280',
  },
  sourceCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
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
  time: {
    fontSize: 12,
    color: '#9CA3AF',
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
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E5E7EB',
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
});
