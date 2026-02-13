import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { trpc } from '../../lib/trpc';
import HighlightBlock from '../../components/HighlightBlock';
import NextActionBlock from '../../components/NextActionBlock';
import StatCard from '../../components/StatCard';
import FloatingActionButton from '../../components/FloatingActionButton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [todayHighlight, setTodayHighlight] = useState<any>(null);
  const [nextActions, setNextActions] = useState<any[]>([]);

  const loadData = async () => {
    try {
      // Load stats
      const statsData = await trpc.sources.getStats.query();
      setStats(statsData);

      // Load today's highlight
      const today = new Date();
      const highlightData = await trpc.highlights.getByDate.query({ date: today });
      
      if (!highlightData) {
        // Generate highlight if it doesn't exist
        const generated = await trpc.highlights.generate.mutate({ date: today });
        setTodayHighlight(generated);
      } else {
        setTodayHighlight(highlightData);
      }

      // Load next actions
      const actionsData = await trpc.nextActions.getAll.query({ limit: 3 });
      setNextActions(actionsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="text-foreground font-bold text-2xl mb-4">HOME</Text>

        {/* Today's Highlight */}
        {todayHighlight && (
          <TouchableOpacity
            onPress={() => router.push(`/sources/${new Date().toISOString().split('T')[0]}`)}
            activeOpacity={0.8}
          >
            <HighlightBlock
              content={todayHighlight.content}
              totalSources={todayHighlight.totalSources}
              categorySummary={todayHighlight.categorySummary}
            />
          </TouchableOpacity>
        )}

        {/* Next Actions Preview */}
        {nextActions.length > 0 && (
          <View className="mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-foreground font-bold text-lg">NEXTアクション</Text>
              <TouchableOpacity onPress={() => router.push('/next')}>
                <Text className="text-primary text-sm">すべて見る →</Text>
              </TouchableOpacity>
            </View>
            {nextActions.slice(0, 2).map((action) => (
              <NextActionBlock
                key={action.id}
                title={action.title}
                description={action.description}
                reason={action.reason}
                category={action.category}
                priority={action.priority}
              />
            ))}
          </View>
        )}

        {/* Statistics */}
        {stats && (
          <View>
            <Text className="text-foreground font-bold text-lg mb-2">統計</Text>
            <View className="flex-row gap-3 mb-3">
              <StatCard label="今日のSOURCE" value={todayHighlight?.totalSources || 0} />
              <StatCard label="合計SOURCE" value={stats.total} />
            </View>
            
            {stats.byMediaType && Object.keys(stats.byMediaType).length > 0 && (
              <View className="bg-surface border border-border rounded-2xl p-4">
                <Text className="text-foreground font-semibold text-base mb-2">タイプ別内訳</Text>
                {Object.entries(stats.byMediaType).map(([type, count]: [string, any]) => (
                  <View key={type} className="flex-row items-center justify-between mb-2">
                    <Text className="text-muted text-sm">{type}</Text>
                    <Text className="text-foreground font-semibold text-sm">{count}件</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => {/* TODO: Open quick save sheet */}} />
    </SafeAreaView>
  );
}
