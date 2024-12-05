import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface Customer {
  id?: number;
  name: string;
  email: string;
  registrationDate: string;
  phoneNumber: string;
  addressId: number; // Foreign key to Address
}

export default function CustomersScreen() {
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState<Customer>({
    name: '',
    email: '',
    registrationDate: new Date().toISOString(),
    phoneNumber: '',
    addressId: 0,
  });

  // Fetch customers from the backend
  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5094/customers');
      setCustomersData(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handlePress = (customerId: string) => {
    setExpanded(prev => (prev === customerId ? null : customerId));
  };

  // Handle Edit Customer
  const handleEditCustomer = (customer: Customer) => {
    setEditCustomer(customer);
    setIsModalVisible(true);
  };

  // Handle Update Customer
  const handleUpdateCustomer = async () => {
    if (editCustomer) {
      const updatedCustomer = {
        ...editCustomer,
        // Ensure we update the registrationDate as it's a fixed value
        registrationDate: new Date().toISOString(),
      };

      try {
        const response = await axios.put(`http://localhost:5094/customers/${editCustomer.id}`, updatedCustomer);
        if (response.status === 200) {
          // Optimistically update the UI (Update the customer in the state)
          const updatedCustomers = customersData.map(customer =>
            customer.id === editCustomer.id ? updatedCustomer : customer
          );
          setCustomersData(updatedCustomers);
          setIsModalVisible(false); 
          setEditCustomer(null);  
          Alert.alert('Success', 'Customer updated successfully');
        } else {
          Alert.alert('Error', 'Failed to update the customer');
        }
      } catch (error) {
        console.error('Error updating customer:', error);
        Alert.alert('Error', 'Failed to update the customer');
      }
    }
  };

  // Handle Add Customer
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phoneNumber || !newCustomer.addressId) {
      Alert.alert('Missing Fields', 'Please fill in all fields before adding a customer.');
      return;
    }

    const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone: string): boolean => /^\d{8,14}$/.test(phone);

    if (!isValidEmail(newCustomer.email) || !isValidPhone(newCustomer.phoneNumber)) {
      Alert.alert('Invalid Fields', 'Please provide a valid email and phone number.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5094/customers', newCustomer);
      setCustomersData(prevCustomers => [...prevCustomers, response.data]);
      setIsAddModalVisible(false);
      setNewCustomer({
        name: '',
        email: '',
        registrationDate: new Date().toISOString(),
        phoneNumber: '',
        addressId: 0,
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      Alert.alert('Error', 'Failed to add the customer');
    }
  };

  // Handle Delete Customer
  const handleDeleteCustomer = (customerId: number) => {
    // Check if the app is running on web, and use window.confirm on the web.
    if (typeof window !== 'undefined') {
      // Web environment
      const confirmation = window.confirm('Are you sure you want to delete this customer?');
      if (confirmation) {
        deleteCustomerFromBackend(customerId); // Delete the customer from the backend
      } else {
        console.log('Delete cancelled');
      }
    } else {
      // For mobile platforms (iOS/Android), use the React Native Alert
      Alert.alert('Delete Customer', 'Are you sure you want to delete this customer?', [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteCustomerFromBackend(customerId); // Delete the customer from the backend
          },
          style: 'destructive',
        },
      ]);
    }
  };

  // Function to delete customer from the backend and update UI
  const deleteCustomerFromBackend = async (customerId: number) => {
    try {
      // Optimistic UI update: Remove the customer immediately from the local state
      setCustomersData(prevCustomers => prevCustomers.filter(customer => customer.id !== customerId));

      const response = await axios.delete(`http://localhost:5094/customers/${customerId}`);
      if (response.status === 200) {
        fetchCustomers();
        Alert.alert('Success', 'Customer deleted successfully');
      } else {
        fetchCustomers();
        Alert.alert('Error', 'Failed to delete the customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      fetchCustomers();
      Alert.alert('Error', 'Failed to delete the customer');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Customers</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Customer</Text>
      </TouchableOpacity>

      {customersData.map((customer) => (
        <View key={customer.id} style={styles.card}>
          <TouchableOpacity
            onPress={() => handlePress(customer.id?.toString() || '')}
            style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{customer.name}</Text>
            <Text style={styles.cardEmail}>{customer.email}</Text>
          </TouchableOpacity>

          {expanded === customer.id?.toString() && (
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Phone Number:</Text>
              <Text style={styles.cardValue}>{customer.phoneNumber}</Text>

              <Text style={styles.cardLabel}>Address ID:</Text>
              <Text style={styles.cardValue}>{customer.addressId}</Text>

              <Text style={styles.cardLabel}>Registration Date:</Text>
              <Text style={styles.cardValue}>{customer.registrationDate}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleEditCustomer(customer)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDeleteCustomer(customer.id!)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}

      {/* Modal for editing a customer */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Customer</Text>

            {/* Name Field */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={editCustomer?.name || ''}
              onChangeText={text => setEditCustomer(prev => ({ ...prev!, name: text }))}
            />

            {/* Email Field */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={editCustomer?.email || ''}
              onChangeText={text => setEditCustomer(prev => ({ ...prev!, email: text }))}
            />

            {/* Phone Number Field */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={editCustomer?.phoneNumber || ''}
              onChangeText={text => setEditCustomer(prev => ({ ...prev!, phoneNumber: text }))}
            />

            {/* Address ID Field */}
            <Text style={styles.label}>Address ID</Text>
            <TextInput
              style={styles.input}
              value={editCustomer?.addressId?.toString() || ''}
              onChangeText={text => setEditCustomer(prev => ({ ...prev!, addressId: Number(text) }))}
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={handleUpdateCustomer}>
                <Text style={styles.actionButtonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for adding a new customer */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Customer</Text>

            {/* Name Field */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={newCustomer.name}
              onChangeText={text => setNewCustomer(prev => ({ ...prev, name: text }))}
            />

            {/* Email Field */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={newCustomer.email}
              onChangeText={text => setNewCustomer(prev => ({ ...prev, email: text }))}
            />

            {/* Phone Number Field */}
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={newCustomer.phoneNumber}
              onChangeText={text => setNewCustomer(prev => ({ ...prev, phoneNumber: text }))}
            />

            {/* Address ID Field */}
            <Text style={styles.label}>Address ID</Text>
            <TextInput
              style={styles.input}
              value={newCustomer.addressId === 0 ? '' : newCustomer.addressId.toString()}
              onChangeText={text => setNewCustomer(prev => ({ ...prev, addressId: text ? Number(text) : 0 }))}
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={handleAddCustomer}>
                <Text style={styles.actionButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => setIsAddModalVisible(false)}>
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  addButtonText: {
    color: Colors.light.background,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardEmail: {
    fontSize: 14,
    color: '#888',
  },
  cardContent: {
    marginTop: 8,
  },
  cardLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cardValue: {
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: Colors.light.danger,
  },
  buttonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  updateButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
});
