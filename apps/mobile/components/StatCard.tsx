import { View, Text } from 'react-native';

interface StatCardProps {
  label: string;
  value: number | string;
  icon?: string;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <View className="bg-surface border border-border rounded-2xl p-4 flex-1 min-w-[100px]">
      <Text className="text-muted text-sm mb-1">{label}</Text>
      <Text className="text-foreground font-bold text-2xl">{value}</Text>
    </View>
  );
}
