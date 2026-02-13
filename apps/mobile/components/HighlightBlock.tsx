import { View, Text } from 'react-native';

interface HighlightBlockProps {
  content: {
    topSources?: Array<{
      id: string;
      content: string;
      category?: string;
      priority: string;
    }>;
    insights: string;
  };
  totalSources: number;
  categorySummary: Record<string, number>;
}

export default function HighlightBlock({
  content,
  totalSources,
  categorySummary,
}: HighlightBlockProps) {
  return (
    <View className="bg-surface border-l-4 border-primary rounded-2xl p-4 mb-4">
      <Text className="text-foreground font-bold text-lg mb-2">今日のハイライト</Text>
      
      <Text className="text-foreground text-base mb-3">{content.insights}</Text>

      <View className="flex-row items-center mb-2">
        <Text className="text-muted text-sm">保存したSOURCE: </Text>
        <Text className="text-foreground font-semibold text-sm">{totalSources}件</Text>
      </View>

      {Object.keys(categorySummary).length > 0 && (
        <View className="mt-2">
          <Text className="text-muted text-sm mb-1">カテゴリ別:</Text>
          {Object.entries(categorySummary).map(([category, count]) => (
            <View key={category} className="flex-row items-center mb-1">
              <View className="w-2 h-2 rounded-full bg-primary mr-2" />
              <Text className="text-foreground text-sm flex-1">{category}</Text>
              <Text className="text-muted text-sm">{count}件</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
