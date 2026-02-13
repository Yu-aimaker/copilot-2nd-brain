import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { trpc } from '../lib/trpc';
import { ChatRole } from '@copilot-2nd-brain/shared';

interface Message {
  id: string;
  role: ChatRole;
  content: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await trpc.chat.getHistory.query({ limit: 50 });
      setMessages(history);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    try {
      const response = await trpc.chat.send.mutate({ content: userMessage });
      setMessages((prev) => [...prev, response.userMessage, response.assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1 p-4">
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-3 ${
                message.role === ChatRole.USER ? 'items-end' : 'items-start'
              }`}
            >
              <View
                className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                  message.role === ChatRole.USER
                    ? 'bg-primary'
                    : 'bg-surface border border-border'
                }`}
              >
                <Text
                  className={`text-sm ${
                    message.role === ChatRole.USER ? 'text-white' : 'text-foreground'
                  }`}
                >
                  {message.content}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="border-t border-border p-4">
          <View className="flex-row items-center bg-surface rounded-full px-4 py-2">
            <TextInput
              className="flex-1 text-foreground"
              placeholder="メッセージを入力..."
              placeholderTextColor="#6B7280"
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity onPress={sendMessage} disabled={!input.trim()}>
              <MaterialCommunityIcons
                name="send"
                size={24}
                color={input.trim() ? '#0A0A0A' : '#E8E8E8'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
