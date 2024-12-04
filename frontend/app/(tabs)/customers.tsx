import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface Customer {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  phoneNumber: string;
  addressId: number; // Foreign key to Address (we'll need to map it to a full address later)
}

export default function CustomersScreen() {
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Fetch customers from the backend
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5094/customers');
      setCustomersData(response.data); // Populate state with the fetched customer data
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers(); // Fetch customers on component mount
  }, []);

  const handlePress = (customerId: string) => {
    setExpanded(prev => (prev === customerId ? null : customerId)); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Customers</Text>

      {customersData.map((customer) => (
        <View key={customer.id} style={styles.card}>
          <TouchableOpacity
            onPress={() => handlePress(customer.id)}
            style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{customer.name}</Text>
            <Text style={styles.cardEmail}>{customer.email}</Text>
          </TouchableOpacity>

          {expanded === customer.id && (
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Phone Number:</Text>
              <Text style={styles.cardValue}>{customer.phoneNumber}</Text>

              <Text style={styles.cardLabel}>Address ID:</Text>
              <Text style={styles.cardValue}>{customer.addressId}</Text>

              <Text style={styles.cardLabel}>Registration Date:</Text>
              <Text style={styles.cardValue}>{customer.registrationDate}</Text>
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
    backgroundColor: Colors.light.background,
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
  cardEmail: {
    fontSize: 14,
    color: '#555',
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
