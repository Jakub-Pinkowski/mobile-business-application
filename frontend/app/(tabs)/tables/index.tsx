import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function TablesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tables</Text>
      <Text style={styles.subheader}>View all the tables below</Text>

      <View style={styles.buttonContainer}>
        {/* Buttons for navigation */}
        <Link href="/tables/products" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Products</Text>
        </Link>
        <Link href="/tables/news" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>News</Text>
        </Link>
        <Link href="/tables/customers" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Customers</Text>
        </Link>
        <Link href="/tables/address" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Address</Text>
        </Link>
        <Link href="/tables/categories" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Categories</Text>
        </Link>
        <Link href="/tables/invoices" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Invoices</Text>
        </Link>
        <Link href="/tables/suppliers" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Suppliers</Text>
        </Link>
        <Link href="/tables/invoiceitems" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Invoice Items</Text>
        </Link>
        <Link href="/tables/reviews" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
          <Text style={styles.buttonText}>Reviews</Text>
        </Link>
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
});
