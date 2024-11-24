import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the App</Text>
      <Text style={styles.subheader}>Choose a section to explore:</Text>

      <View style={styles.buttonContainer}>
        {/* Products Button */}
        <Link href="/products" style={styles.button}>
          <Text style={styles.buttonText}>Products</Text>
        </Link>
        <Text style={styles.description}>Browse our wide range of products</Text>

        {/* News Button */}
        <Link href="/news" style={styles.button}>
          <Text style={styles.buttonText}>News</Text>
        </Link>
        <Text style={styles.description}>Stay updated with the latest news</Text>

        {/* Customers Button */}
        <Link href="/customers" style={styles.button}>
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
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center', // Ensure button text is centered
    justifyContent: 'center', // Ensure button text is centered vertically
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Center the text horizontally
  },
  description: {
    fontSize: 14,
    color: '#777',
    marginBottom: 24, // Space between button and description
    textAlign: 'center', // Center the description text
  },
});
