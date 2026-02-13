import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useState } from 'react';

export default function RecordScreen() {
  const [selected, setSelected] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-foreground font-bold text-2xl mb-4">RECORD</Text>

        <Calendar
          onDayPress={(day) => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {
              selected: true,
              disableTouchEvent: true,
              selectedColor: '#0A0A0A',
            },
          }}
          theme={{
            backgroundColor: '#FFFFFF',
            calendarBackground: '#FFFFFF',
            textSectionTitleColor: '#0A0A0A',
            selectedDayBackgroundColor: '#0A0A0A',
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: '#0A0A0A',
            dayTextColor: '#0A0A0A',
            textDisabledColor: '#E8E8E8',
            dotColor: '#0A0A0A',
            selectedDotColor: '#FFFFFF',
            arrowColor: '#0A0A0A',
            monthTextColor: '#0A0A0A',
            indicatorColor: '#0A0A0A',
          }}
        />

        {selected && (
          <View className="mt-4">
            <Text className="text-foreground font-bold text-lg mb-2">
              {selected}のアクティビティ
            </Text>
            <Text className="text-muted text-sm">
              この日のSOURCEやハイライトがここに表示されます
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
