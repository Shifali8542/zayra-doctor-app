import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Layout } from '../../../components/Layout/Layout';
import { Header } from '../../../components/Header/Header';
import { Tag } from '../../../components/Tag/Tag';
import { Icon } from '../../../components/Icon';
import { Avatar } from '../../../components/Avatar/Avatar';
import { useAlyna } from '../../../features/alyna/hooks/useAlyna';
import { useAppTheme } from '../../../context/ThemeContext';
import { createAlynaScreenStyles } from './AlynaScreen.style';

interface AlynaScreenProps {
  navigation: any;
  route?: any;
}

export const AlynaScreen: React.FC<AlynaScreenProps> = ({ navigation, route }) => {
  const theme = useAppTheme();
  const styles = createAlynaScreenStyles(theme);
  const patientId: number | undefined = route?.params?.patientId;
  const { messages, suggestions, draft, setDraft, send, clear, loading, error } = useAlyna({ patientId });

  return (
    <Layout scroll padded edges={['top']} bottomInsetExtra={92}>
      <Header onProfilePress={() => navigation.navigate('Profile')} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}
      >
        <View style={styles.titleRow}>
          <Avatar initials="AL" size={56} />
          <View style={styles.titleTextWrap}>
            <Text style={styles.title}>Alyna Assist</Text>
            <Text style={styles.subtitle}>
              Governed clinical AI · grounded in patient signals
            </Text>
          </View>
        </View>

        <View style={styles.convoCard}>

          {/* Empty state */}
          {messages.length === 0 && !loading ? (
            <View style={styles.bubbleAssistantWrap}>
              <View style={styles.bubbleAssistant}>
                <Text style={styles.bubbleAssistantText}>
                  Hello Doctor 👋 I'm Alyna, your clinical AI assistant. I can help you understand ECG findings, explain metrics like QTc and HRV, and walk you through any patient case. How can I help you today?
                </Text>
                <View style={styles.suggestionsWrap}>
                  {['Explain QTc', 'What does HRV mean?', 'Summarise this case'].map((chip) => (
                    <Pressable
                      key={chip}
                      onPress={() => send(chip)}
                      style={styles.suggestionChip}
                    >
                      <Text style={styles.suggestionText}>{chip}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          ) : null}

          {messages.map((m) => {
            if (m.role === 'assistant') {
              return (
                <View key={m.id} style={styles.bubbleAssistantWrap}>
                  <View style={styles.bubbleAssistant}>
                    <Text style={styles.bubbleAssistantText}>{m.text}</Text>
                    {m.confidence !== undefined ? (
                      <View style={styles.bubbleDivider} />
                    ) : null}
                    {m.confidence !== undefined ? (
                      <Text style={styles.bubbleConfidence}>
                        Confidence {m.confidence}%
                      </Text>
                    ) : null}
                    {m.tags && m.tags.length > 0 ? (
                      <View style={styles.bubbleTagsWrap}>
                        {m.tags.map((t) => (
                          <Tag key={t} label={t} style={styles.bubbleTag} />
                        ))}
                      </View>
                    ) : null}
                  </View>
                </View>
              );
            }
            return (
              <View key={m.id} style={styles.bubbleUserWrap}>
                <View style={styles.bubbleUser}>
                  <Text style={styles.bubbleUserText}>{m.text}</Text>
                </View>
              </View>
            );
          })}

          {/* Suggestion chips */}
          {!loading && suggestions.length > 0 ? (
            <View style={styles.suggestionsWrap}>
              {suggestions.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => send(s)}
                  style={styles.suggestionChip}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          {/* Loading indicator */}
          {loading ? (
            <View style={styles.bubbleAssistantWrap}>
              <View style={styles.bubbleAssistant}>
                <Text style={styles.bubbleAssistantText}>Alyna is thinking…</Text>
              </View>
            </View>
          ) : null}

          {/* Error banner */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Ask Alyna about this case…"
              placeholderTextColor={theme.colors.textTertiary}
              style={styles.input}
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={() => send()}
              returnKeyType="send"
            />
            <Pressable
              onPress={() => send()}
              disabled={loading}
              style={({ pressed }) => [styles.sendBtn, pressed && { opacity: 0.85 }, loading && { opacity: 0.4 }]}
            >
              <Icon name="send" size={16} color={theme.colors.textOnDark} strokeWidth={2.4} />
            </Pressable>
          </View>

          {/* Clear conversation */}
          {messages.length > 0 ? (
            <Pressable onPress={clear} style={styles.clearBtn}>
              <Text style={styles.clearText}>Clear conversation</Text>
            </Pressable>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </Layout>
  );
};