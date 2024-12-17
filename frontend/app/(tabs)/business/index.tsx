import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

type BusinessView = {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  path: '/business/product-reviews' | '/business/customer-invoices' | '/business/supplier-products' | '/business/product-tag' | '/business/product-supplier';
  meta: string;
};

const businessViews: BusinessView[] = [
  { name: 'Product Reviews', icon: 'rate-review', path: '/business/product-reviews', meta: '4 tables used, foreign keys present' },
  { name: 'Customer Invoices', icon: 'receipt', path: '/business/customer-invoices', meta: '5 tables used, foreign keys present' },
  { name: 'Supplier Products', icon: 'business', path: '/business/supplier-products', meta: '3 tables used, foreign keys present' },
  { name: 'Product Tags', icon: 'label', path: '/business/product-tag', meta: 'many-to-many relationships between products and tags, 3 tables used' },
  { name: 'Product Suppliers', icon: 'local-shipping', path: '/business/product-supplier', meta: 'many-to-many relationships between products and suppliers, 3 tables used' },
];

export default function BusinessPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Business Views</Text>
      <FlatList
        data={businessViews}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Link href={item.path} asChild>
            <TouchableOpacity style={styles.card}>
              <MaterialIcons name={item.icon} size={32} color={Colors.light.primary} />
              <Text style={styles.cardText}>{item.name}</Text>
              <Text style={styles.metaDescription}>{item.meta}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '47%',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
  },
  metaDescription: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
  },
});
