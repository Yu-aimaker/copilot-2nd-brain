import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { MediaType, Priority } from '@copilot-2nd-brain/shared';

interface SourceBlockProps {
  id: string;
  content: string;
  mediaType: MediaType;
  category?: string;
  priority: Priority;
  aiTags: string[];
  summary?: string;
  onPress?: () => void;
}

const mediaTypeIcons: Record<MediaType, string> = {
  [MediaType.TEXT_MEMO]: 'text',
  [MediaType.THOUGHT]: 'lightbulb',
  [MediaType.LINK]: 'link',
  [MediaType.X_POST]: 'twitter',
  [MediaType.IMAGE]: 'image',
  [MediaType.AUDIO]: 'microphone',
  [MediaType.VIDEO]: 'video',
  [MediaType.PDF]: 'file-pdf',
  [MediaType.MARKDOWN]: 'markdown',
  [MediaType.FILE]: 'file',
};

const priorityColors: Record<Priority, string> = {
  [Priority.URGENT]: '#EF4444',
  [Priority.HIGH]: '#F59E0B',
  [Priority.MEDIUM]: '#6B7280',
  [Priority.LOW]: '#22C55E',
};

export default function SourceBlock({
  content,
  mediaType,
  category,
  priority,
  aiTags,
  summary,
  onPress,
}: SourceBlockProps) {
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
      <View className="flex-row items-start mb-2">
        <MaterialCommunityIcons
          name={mediaTypeIcons[mediaType] as any}
          size={20}
          color="#0A0A0A"
        />
        <View className="flex-1 ml-2">
          <Text className="text-foreground font-semibold text-base" numberOfLines={2}>
            {content}
          </Text>
          {category && (
            <Text className="text-muted text-sm mt-1">{category}</Text>
          )}
        </View>
        <View
          style={{ backgroundColor: priorityColors[priority] }}
          className="w-2 h-2 rounded-full ml-2 mt-1"
        />
      </View>

      {summary && (
        <Text className="text-muted text-sm mb-2" numberOfLines={2}>
          {summary}
        </Text>
      )}

      {aiTags.length > 0 && (
        <View className="flex-row flex-wrap">
          {aiTags.map((tag, index) => (
            <View key={index} className="bg-border rounded-lg px-2 py-1 mr-2 mb-2">
              <Text className="text-foreground text-xs">{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
