import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

type Table = {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  path: '/tables/products' | '/tables/news' | '/tables/customers' | '/tables/address' | '/tables/categories' | '/tables/invoices' | '/tables/suppliers' | '/tables/invoiceitems' | '/tables/reviews' | '/tables/productsuppliers';
};

const tables: Table[] = [
  { name: 'Products', icon: 'shopping-cart', path: '/tables/products' },
  { name: 'News', icon: 'article', path: '/tables/news' },
  { name: 'Customers', icon: 'people', path: '/tables/customers' },
  { name: 'Address', icon: 'location-on', path: '/tables/address' },
  { name: 'Categories', icon: 'category', path: '/tables/categories' },
  { name: 'Invoices', icon: 'receipt', path: '/tables/invoices' },
  { name: 'Suppliers', icon: 'business', path: '/tables/suppliers' },
  { name: 'Invoice Items', icon: 'inventory', path: '/tables/invoiceitems' },
  { name: 'Reviews', icon: 'rate-review', path: '/tables/reviews' },
  { name: 'Product Suppliers', icon: 'local-shipping', path: '/tables/productsuppliers' },
];

export default function TablesPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Explore Tables</Text>
      <FlatList
        data={tables}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Link href={item.path} asChild>
            <TouchableOpacity style={styles.card}>
              <MaterialIcons name={item.icon} size={32} color={Colors.light.primary} />
              <Text style={styles.cardText}>{item.name}</Text>
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
});
