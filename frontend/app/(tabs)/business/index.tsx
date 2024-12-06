import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function BusinessPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Business Views</Text>
      <Text style={styles.subheader}>View the business views below:</Text>

      <View style={styles.buttonContainer}>
        <Link href="/business/business_1" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Tables</Text>
        </Link>
        <Text style={styles.description}>Lorep Ipsum</Text>

        <Link href="/business/business_1" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Tables</Text>
        </Link>
        <Text style={styles.description}>Lorep Ipsum</Text>

        <Link href="/business/business_1" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Tables</Text>
        </Link>
        <Text style={styles.description}>Lorep Ipsum</Text>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    color: '#777',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 24,
    textAlign: 'center',
  },
});