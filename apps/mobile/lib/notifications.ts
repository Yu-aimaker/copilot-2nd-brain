import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0A0A0A',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  return finalStatus === 'granted';
}

// Schedule daily report notification (21:00)
export async function scheduleDailyReport() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '今日のハイライト',
      body: '今日の活動をまとめました。確認してみましょう！',
    },
    trigger: {
      hour: 21,
      minute: 0,
      repeats: true,
    },
  });
}

// Schedule weekly report notification (Sunday 10:00)
export async function scheduleWeeklyReport() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '週次レポート',
      body: '今週の学びと成長を振り返りましょう！',
    },
    trigger: {
      weekday: 1, // Sunday
      hour: 10,
      minute: 0,
      repeats: true,
    },
  });
}

// Schedule monthly report notification (Last day of month 10:00)
export async function scheduleMonthlyReport() {
  // This would need more complex logic to determine last day of month
  // For now, schedule on the 28th which works for all months
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '月次レポート',
      body: '今月のナレッジをまとめました！',
    },
    trigger: {
      day: 28,
      hour: 10,
      minute: 0,
      repeats: true,
    },
  });
}

// Initialize all notifications
export async function initializeNotifications() {
  const hasPermission = await registerForPushNotificationsAsync();
  
  if (hasPermission) {
    await scheduleDailyReport();
    await scheduleWeeklyReport();
    await scheduleMonthlyReport();
  }
}
