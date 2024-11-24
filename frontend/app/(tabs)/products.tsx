import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
}

const productsData: Product[] = [
  {
    id: '1',
    name: 'Mountain Bike',
    category: 'Bikes',
    price: '$500',
    description: 'Durable mountain bike designed for all terrains and tough rides.',
  },
  {
    id: '2',
    name: 'Road Bike',
    category: 'Bikes',
    price: '$400',
    description: 'Lightweight road bike, perfect for fast riding on paved roads.',
  },
  {
    id: '3',
    name: 'Cycling Cap',
    category: 'Caps',
    price: '$20',
    description: 'Comfortable cycling cap to protect you from the sun during long rides.',
  },
  {
    id: '4',
    name: 'Sports Cap',
    category: 'Caps',
    price: '$15',
    description: 'Stylish sports cap with adjustable straps for a perfect fit.',
  },
  {
    id: '5',
    name: 'Backpack 20L',
    category: 'Backpacks',
    price: '$45',
    description: 'Compact backpack with 20L capacity, perfect for day trips.',
  },
  {
    id: '6',
    name: 'Backpack 40L',
    category: 'Backpacks',
    price: '$70',
    description: 'Large 40L backpack with multiple compartments for extended trips.',
  },
  {
    id: '7',
    name: 'Running Shoes',
    category: 'Shoes',
    price: '$80',
    description: 'Breathable running shoes designed for comfort during long runs.',
  },
  {
    id: '8',
    name: 'Trekking Boots',
    category: 'Shoes',
    price: '$120',
    description: 'Sturdy trekking boots for outdoor adventures and rough terrains.',
  },
];

export default function ProductsScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handlePress = (productId: string) => {
    setExpanded(prev => (prev === productId ? null : productId)); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products</Text>

      {productsData.map((product) => (
        <View key={product.id} style={styles.card}>
          <TouchableOpacity
            onPress={() => handlePress(product.id)}
            style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{product.name}</Text>
            <Text style={styles.cardCategory}>{product.category}</Text>
            <Text style={styles.cardPrice}>{product.price}</Text>
          </TouchableOpacity>

          {expanded === product.id && (
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Description:</Text>
              <Text style={styles.cardValue}>{product.description}</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardCategory: {
    fontSize: 14,
    color: '#555',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cardContent: {
    marginTop: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  cardValue: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
});
