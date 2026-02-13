import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { NextActionCategory, Priority } from '@copilot-2nd-brain/shared';

interface NextActionBlockProps {
  title: string;
  description: string;
  reason: string;
  category: NextActionCategory;
  priority: Priority;
  onPress?: () => void;
}

const categoryLabels: Record<NextActionCategory, string> = {
  [NextActionCategory.INFORMATION_GATHERING]: '情報収集',
  [NextActionCategory.LEARNING]: '学習',
  [NextActionCategory.EXECUTION]: '実行',
  [NextActionCategory.REFLECTION]: '振り返り',
};

const priorityColors: Record<Priority, string> = {
  [Priority.URGENT]: '#EF4444',
  [Priority.HIGH]: '#F59E0B',
  [Priority.MEDIUM]: '#6B7280',
  [Priority.LOW]: '#22C55E',
};

export default function NextActionBlock({
  title,
  description,
  reason,
  category,
  priority,
  onPress,
}: NextActionBlockProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className="bg-surface border border-border rounded-2xl p-4 mb-3"
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-foreground font-bold text-base mb-1">{title}</Text>
          <Text className="text-muted text-sm">{categoryLabels[category]}</Text>
        </View>
        <MaterialCommunityIcons name="arrow-right" size={24} color="#0A0A0A" />
      </View>

      <Text className="text-foreground text-sm mb-2">{description}</Text>

      <View className="bg-border rounded-lg p-2 mb-2">
        <Text className="text-muted text-xs">💡 AI提案理由</Text>
        <Text className="text-foreground text-xs mt-1">{reason}</Text>
      </View>

      <View className="flex-row items-center">
        <View
          style={{ backgroundColor: priorityColors[priority] }}
          className="w-2 h-2 rounded-full mr-2"
        />
        <Text className="text-muted text-xs">優先度: {priority}</Text>
      </View>
    </TouchableOpacity>
  );
}
