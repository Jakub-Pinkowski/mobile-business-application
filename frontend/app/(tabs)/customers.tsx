import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Customer {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  phoneNumber: string;
  address: string;
}

const customersData: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    registrationDate: 'Jan 15, 2023',
    phoneNumber: '+1 234 567 890',
    address: '123 Elm Street, Springfield, IL, 62701',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'janesmith@example.com',
    registrationDate: 'Feb 10, 2023',
    phoneNumber: '+1 234 567 891',
    address: '456 Oak Avenue, Springfield, IL, 62702',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    registrationDate: 'Mar 20, 2023',
    phoneNumber: '+1 234 567 892',
    address: '789 Maple Road, Springfield, IL, 62703',
  },
  {
    id: '4',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    registrationDate: 'Apr 12, 2023',
    phoneNumber: '+1 234 567 893',
    address: '321 Birch Lane, Springfield, IL, 62704',
  },
  {
    id: '5',
    name: 'Emily White',
    email: 'emily.white@example.com',
    registrationDate: 'May 30, 2023',
    phoneNumber: '+1 234 567 894',
    address: '654 Pine Street, Springfield, IL, 62705',
  },
  {
    id: '6',
    name: 'Michael Green',
    email: 'michael.green@example.com',
    registrationDate: 'Jun 25, 2023',
    phoneNumber: '+1 234 567 895',
    address: '987 Cedar Avenue, Springfield, IL, 62706',
  },
  {
    id: '7',
    name: 'Sophia Black',
    email: 'sophia.black@example.com',
    registrationDate: 'Jul 15, 2023',
    phoneNumber: '+1 234 567 896',
    address: '123 Walnut Street, Springfield, IL, 62707',
  },
];

export default function CustomersScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);

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

              <Text style={styles.cardLabel}>Address:</Text>
              <Text style={styles.cardValue}>{customer.address}</Text>

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
