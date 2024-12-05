import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface Address {
    id?: number;
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

export default function AddressesScreen() {
    const [addressesData, setAddressesData] = useState<Address[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editAddressItem, setEditAddressItem] = useState<Address | null>(null);
    const [newAddressItem, setNewAddressItem] = useState<Address>({
        street: '',
        city: '',
        postalCode: '',
        country: '',
    });

    // Fetch addresses from the backend
    const fetchAddresses = async () => {
        try {
            const response = await axios.get('http://localhost:5094/address');
            setAddressesData(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handlePress = (addressId: string) => {
        setExpanded(prev => (prev === addressId ? null : addressId));
    };

    // Handle Edit Address Item
    const handleEditAddressItem = (addressItem: Address) => {
        setEditAddressItem(addressItem);
        setIsModalVisible(true);
    };

    // Handle Update Address Item
    const handleUpdateAddressItem = async () => {
        if (editAddressItem) {
            const updatedAddressItem = {
                ...editAddressItem,
            };

            try {
                const response = await axios.put(`http://localhost:5094/address/${editAddressItem.id}`, updatedAddressItem);
                if (response.status === 200) {
                    // Optimistically update the UI
                    const updatedAddresses = addressesData.map(addressItem =>
                        addressItem.id === editAddressItem.id ? updatedAddressItem : addressItem
                    );
                    setAddressesData(updatedAddresses);
                    setIsModalVisible(false);
                    setEditAddressItem(null);
                    Alert.alert('Success', 'Address updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update the address');
                }
            } catch (error) {
                console.error('Error updating address item:', error);
                Alert.alert('Error', 'Failed to update the address');
            }
        }
    };

    // Handle Add Address Item
    const handleAddAddressItem = async () => {
        if (!newAddressItem.street || !newAddressItem.city || !newAddressItem.postalCode || !newAddressItem.country) {
            Alert.alert('Missing Fields', 'Please fill in all fields before adding an address.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5094/address', newAddressItem);
            setAddressesData(prevAddresses => [...prevAddresses, response.data]);
            setIsAddModalVisible(false);
            setNewAddressItem({
                street: '',
                city: '',
                postalCode: '',
                country: '',
            });
        } catch (error) {
            console.error('Error adding address item:', error);
            Alert.alert('Error', 'Failed to add the address');
        }
    };

    // Handle Delete Address Item
    const handleDeleteAddressItem = (addressId: number) => {
        // Check if the app is running on web, and use window.confirm on the web.
        if (typeof window !== 'undefined') {
            // Web environment
            const confirmation = window.confirm('Are you sure you want to delete this address?');
            if (confirmation) {
                deleteAddressFromBackend(addressId); 
            } else {
                console.log('Delete cancelled');
            }
        } else {
            // For mobile platforms (iOS/Android), use the React Native Alert
            Alert.alert('Delete Customer', 'Are you sure you want to delete this address?', [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteAddressFromBackend(addressId); 
                    },
                    style: 'destructive',
                },
            ]);
        }
    };

    // Function to delete address item from the backend and update UI
    const deleteAddressFromBackend = async (addressId: number) => {
        try {
            setAddressesData(prevAddresses => prevAddresses.filter(addressItem => addressItem.id !== addressId));

            const response = await axios.delete(`http://localhost:5094/address/${addressId}`);
            if (response.status === 200) {
                fetchAddresses();
                Alert.alert('Success', 'Address item deleted successfully');
            } else {
                fetchAddresses();
                Alert.alert('Error', 'Failed to delete the address item');
            }
        } catch (error) {
            console.error('Error deleting address item:', error);
            fetchAddresses();
            Alert.alert('Error', 'Failed to delete the address item');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Addresses</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>

            {addressesData.map((addressItem) => (
                <View key={addressItem.id} style={styles.card}>
                    <TouchableOpacity
                        onPress={() => handlePress(addressItem.id?.toString() || '')}
                        style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{addressItem.street}, {addressItem.city}</Text>
                    </TouchableOpacity>

                    {expanded === addressItem.id?.toString() && (
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Street:</Text>
                            <Text style={styles.cardValue}>{addressItem.street}</Text>

                            <Text style={styles.cardLabel}>City:</Text>
                            <Text style={styles.cardValue}>{addressItem.city}</Text>

                            <Text style={styles.cardLabel}>Postal Code:</Text>
                            <Text style={styles.cardValue}>{addressItem.postalCode}</Text>

                            <Text style={styles.cardLabel}>Country:</Text>
                            <Text style={styles.cardValue}>{addressItem.country}</Text>

                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleEditAddressItem(addressItem)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => handleDeleteAddressItem(addressItem.id!)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            ))}

            {/* Modal for editing an address item */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Address</Text>

                        {/* Street Field */}
                        <Text style={styles.label}>Street</Text>
                        <TextInput
                            style={styles.input}
                            value={editAddressItem?.street || ''}
                            onChangeText={text => setEditAddressItem(prev => ({ ...prev!, street: text }))}
                        />

                        {/* City Field */}
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            value={editAddressItem?.city || ''}
                            onChangeText={text => setEditAddressItem(prev => ({ ...prev!, city: text }))}
                        />

                        {/* Postal Code Field */}
                        <Text style={styles.label}>Postal Code</Text>
                        <TextInput
                            style={styles.input}
                            value={editAddressItem?.postalCode || ''}
                            onChangeText={text => setEditAddressItem(prev => ({ ...prev!, postalCode: text }))}
                        />

                        {/* country Field */}
                        <Text style={styles.label}>Country</Text>
                        <TextInput
                            style={styles.input}
                            value={editAddressItem?.country || ''}
                            onChangeText={text => setEditAddressItem(prev => ({ ...prev!, country: text }))}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleUpdateAddressItem}>
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

            {/* Modal for adding a new address item */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Address</Text>

                        {/* Street Field */}
                        <Text style={styles.label}>Street</Text>
                        <TextInput
                            style={styles.input}
                            value={newAddressItem.street}
                            onChangeText={text => setNewAddressItem(prev => ({ ...prev, street: text }))}
                        />

                        {/* City Field */}
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            value={newAddressItem.city}
                            onChangeText={text => setNewAddressItem(prev => ({ ...prev, city: text }))}
                        />

                        {/* Postal Code Field */}
                        <Text style={styles.label}>Postal Code</Text>
                        <TextInput
                            style={styles.input}
                            value={newAddressItem.postalCode}
                            onChangeText={text => setNewAddressItem(prev => ({ ...prev, postalCode: text }))}
                        />

                        {/* country Field */}
                        <Text style={styles.label}>Country</Text>
                        <TextInput
                            style={styles.input}
                            value={newAddressItem.country}
                            onChangeText={text => setNewAddressItem(prev => ({ ...prev, country: text }))}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleAddAddressItem}>
                                <Text style={styles.actionButtonText}>Save</Text>
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
