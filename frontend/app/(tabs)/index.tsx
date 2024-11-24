import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the App</Text>
      <Text style={styles.subheader}>Choose a section to explore:</Text>

      <View style={styles.buttonContainer}>
        {/* Success Button (Green) */}
        <Link href="/products" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Products</Text>
        </Link>
        <Text style={styles.description}>Browse our wide range of products</Text>

        {/* Danger Button (Red) */}
        <Link href="/news" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>News</Text>
        </Link>
        <Text style={styles.description}>Stay updated with the latest news</Text>

        {/* Another Success Button (Green) */}
        <Link href="/customers" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Customers</Text>
        </Link>
        <Text style={styles.description}>Manage and view customer data</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
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
