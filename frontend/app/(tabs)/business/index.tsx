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
        {/* Product Reviews Link and Description */}
        <View style={styles.buttonBlock}>
          <Link href="/business/product-reviews" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
            <Text style={styles.buttonText}>Product reviews</Text>
          </Link>
          <Text style={styles.description}>
            Explore customer reviews and ratings for products.
          </Text>
          <Text style={styles.metaDescription}>
            4 tables used, foreign keys present
          </Text>
        </View>

        {/* Customer Invoices Link and Description */}
        <View style={styles.buttonBlock}>
          <Link href="/business/customer-invoices" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
            <Text style={styles.buttonText}>Customer invoices</Text>
          </Link>
          <Text style={styles.description}>
            View detailed customer invoices, including history and totals.
          </Text>
          <Text style={styles.metaDescription}>
            5 tables used, foreign keys present
          </Text>
        </View>

        {/* Supplier Products Link and Description */}
        <View style={styles.buttonBlock}>
          <Link href="/business/supplier-products" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
            <Text style={styles.buttonText}>Supplier products</Text>
          </Link>
          <Text style={styles.description}>
            Discover products provided by suppliers, including details.
          </Text>
          <Text style={styles.metaDescription}>
            3 tables used, foreign keys present
          </Text>
        </View>

        {/* Product Tag Summary Link and Description */}
        <View style={styles.buttonBlock}>
          <Link href="/business/product-tag" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
            <Text style={styles.buttonText}>Product Tags</Text>
          </Link>
          <Text style={styles.description}>
            View products with their tags, demonstrating many-to-many relations.
          </Text>
          <Text style={styles.metaDescription}>
            many-to-many relationships between products and tags, 3 tables used
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subheader: {
    fontSize: 18,
    color: '#777',
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonBlock: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 8,
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
    marginBottom: 4,
    textAlign: 'center',
  },
  metaDescription: {
    fontSize: 12,
    color: '#555',
    fontStyle: 'italic', 
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
});
