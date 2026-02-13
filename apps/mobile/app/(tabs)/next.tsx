import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { trpc } from '../../lib/trpc';
import NextActionBlock from '../../components/NextActionBlock';
import { NextActionStatus } from '@copilot-2nd-brain/shared';

export default function NextScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [nextActions, setNextActions] = useState<any[]>([]);
  const [highlightAction, setHighlightAction] = useState<any>(null);

  const loadData = async () => {
    try {
      // Load all next actions
      const actions = await trpc.nextActions.getAll.query({ 
        status: NextActionStatus.PENDING,
        limit: 20 
      });
      setNextActions(actions);

      // Load highlight action
      const highlight = await trpc.nextActions.getHighlight.query();
      setHighlightAction(highlight);
    } catch (error) {
      console.error('Failed to load next actions:', error);
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
        <Text className="text-foreground font-bold text-2xl mb-4">NEXT</Text>

        {/* Highlight Action */}
        {highlightAction && (
          <View className="mb-4">
            <Text className="text-foreground font-bold text-lg mb-2">
              🌟 最重要アクション
            </Text>
            <View className="border-2 border-primary">
              <NextActionBlock
                title={highlightAction.title}
                description={highlightAction.description}
                reason={highlightAction.reason}
                category={highlightAction.category}
                priority={highlightAction.priority}
              />
            </View>
          </View>
        )}

        {/* All Next Actions */}
        {nextActions.length > 0 ? (
          <View>
            <Text className="text-foreground font-bold text-lg mb-2">
              すべてのアクション
            </Text>
            {nextActions.map((action) => (
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
        ) : (
          <View className="items-center justify-center py-8">
            <Text className="text-muted text-base">NEXTアクションはありません</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
