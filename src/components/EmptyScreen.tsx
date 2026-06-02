import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Empty screen placeholder
 * Replace with actual screen content when needed
 */
export default function EmptyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Screen Content</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});
