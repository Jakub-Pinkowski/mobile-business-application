import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

type Section = {
  name: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  path: '/tables' | '/business';
};

const sections: Section[] = [
  {
    name: 'Tables',
    description: 'View, add, edit, and delete entries from all database tables.',
    icon: 'table-chart',
    path: '/tables',
  },
  {
    name: 'Business Views',
    description: 'Explore views prepared by combining multiple tables together.',
    icon: 'business-center',
    path: '/business',
  },
];

export default function HomePage() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to the App</Text>
      <Text style={styles.subheader}>Choose a section to explore:</Text>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.name}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Link href={item.path} asChild>
            <TouchableOpacity style={styles.card}>
              <MaterialIcons name={item.icon} size={32} color={Colors.light.primary} />
              <Text style={styles.cardText}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
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
  subheader: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginBottom: 40,
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
  description: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
    textAlign: 'center',
  },
});
