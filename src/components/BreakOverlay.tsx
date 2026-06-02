import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useReelStore } from '../store/reelStore';

const { width, height } = Dimensions.get('window');

export default function BreakOverlay() {
  const { isOnBreak, breakEndTime, endBreak, breakMinutes, resetReelCount } =
    useReelStore();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOnBreak && breakEndTime) {
      interval = setInterval(() => {
        const remaining = Math.ceil((breakEndTime - Date.now()) / 1000);
        if (remaining <= 0) {
          endBreak();
          Vibration.vibrate([200, 100, 200]);
          Notifications.scheduleNotificationAsync({
            content: {
              title: 'Break time is over! ✨',
              body: 'You can continue watching now. Stay mindful!',
              sound: 'default',
            },
            trigger: null,
          });
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak, breakEndTime, endBreak]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getMotivationalMessage = () => {
    const messages = [
      '✨ Take a deep breath and relax!',
      '👁️ Give your eyes a rest.',
      '🌟 You\'re doing great! Keep it up!',
      '💪 Screen time under control!',
      '🎯 Building better habits!',
      '😴 Rest your mind a bit.',
      '🌈 Embrace the break!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  if (!isOnBreak) return null;

  return (
    <View style={styles.overlay}>
      {/* Content Card */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="pause-circle"
            size={80}
            color="#FF1493"
          />
        </View>

        <Text style={styles.title}>Take a Break! 🎬</Text>
        <Text style={styles.message}>{getMotivationalMessage()}</Text>

        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Time Remaining</Text>
          <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Break Info */}
        <View style={styles.breakInfoContainer}>
          <View style={styles.breakInfo}>
            <MaterialCommunityIcons
              name="clock"
              size={20}
              color="#00BCD4"
            />
            <Text style={styles.breakInfoText}>
              {breakMinutes} minute break
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Take a moment to:</Text>
          <View style={styles.tipRow}>
            <MaterialCommunityIcons
              name="dot-circle"
              size={6}
              color="#FF1493"
            />
            <Text style={styles.tipText}>Stretch your arms and neck</Text>
          </View>
          <View style={styles.tipRow}>
            <MaterialCommunityIcons
              name="dot-circle"
              size={6}
              color="#FF1493"
            />
            <Text style={styles.tipText}>Look away from the screen</Text>
          </View>
          <View style={styles.tipRow}>
            <MaterialCommunityIcons
              name="dot-circle"
              size={6}
              color="#FF1493"
            />
            <Text style={styles.tipText}>Have some water</Text>
          </View>
          <View style={styles.tipRow}>
            <MaterialCommunityIcons
              name="dot-circle"
              size={6}
              color="#FF1493"
            />
            <Text style={styles.tipText}>Take deep breaths</Text>
          </View>
        </View>

        {/* Early End Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            endBreak();
            resetReelCount();
          }}
        >
          <Text style={styles.buttonText}>I'm Ready to Continue</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          (You can end the break early, but we recommend taking the full time to rest)
        </Text>
      </View>

      {/* Floating Motivational Icons */}
      <View style={[styles.floatingIcon, { top: '15%', left: '10%' }]}>
        <MaterialCommunityIcons
          name="water-check"
          size={40}
          color="rgba(255, 20, 147, 0.2)"
        />
      </View>
      <View style={[styles.floatingIcon, { top: '25%', right: '10%' }]}>
        <MaterialCommunityIcons
          name="flower"
          size={40}
          color="rgba(255, 20, 147, 0.2)"
        />
      </View>
      <View style={[styles.floatingIcon, { bottom: '20%', left: '15%' }]}>
        <MaterialCommunityIcons
          name="cloud-check"
          size={40}
          color="rgba(255, 20, 147, 0.2)"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    width: width - 40,
    maxHeight: height - 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF1493',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    fontStyle: 'italic',
  },
  timerContainer: {
    backgroundColor: '#FFE4E1',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  timerValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF1493',
    fontVariant: ['tabular-nums'],
  },
  breakInfoContainer: {
    marginBottom: 20,
  },
  breakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  breakInfoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#FF1493',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  floatingIcon: {
    position: 'absolute',
    opacity: 0.2,
  },
});
