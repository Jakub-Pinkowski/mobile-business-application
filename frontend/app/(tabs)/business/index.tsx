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
            Explore customer reviews for various products. See how your products are rated and gain insights into customer satisfaction.
          </Text>
          <Text style={styles.description}>
            Foreign keys present, 4 tables used
          </Text>
        </View>

        {/* Customer Invoices Link and Description */}
        <View style={styles.buttonBlock}>
          <Link href="/business/customer-invoices" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
            <Text style={styles.buttonText}>Customer invoices</Text>
          </Link>
          <Text style={styles.description}>
            View detailed invoices for your customers, including purchase history, total amounts, and invoice-specific data.
          </Text>
          <Text style={styles.description}>
            Foreign keys present, 5 tables used
          </Text>
        </View>

        {/* Supplier Products Link and Description */}
        <View style={styles.buttonBlock}>
          <Link href="/business/supplier-products" style={[styles.button, { backgroundColor: Colors.light.primary }]}>
            <Text style={styles.buttonText}>Supplier products</Text>
          </Link>
          <Text style={styles.description}>
            Discover the products provided by your suppliers, including pricing, categories, and supplier contact information.
          </Text>
          <Text style={styles.description}>
            Foreign keys present, 3 tables used
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
    marginBottom: 20,
  },
  subheader: {
    fontSize: 18,
    color: '#777',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonBlock: {
    width: '100%',
    marginBottom: 40,  // Added margin to separate each block
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
    marginBottom: 4,  // Reduced margin to bring descriptions closer together
    textAlign: 'center',
  },
});
