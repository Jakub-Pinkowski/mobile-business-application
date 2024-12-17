import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface Supplier {
    id?: number;
    name: string;
    contactEmail: string;
}

export default function SuppliersScreen() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
    const [newSupplier, setNewSupplier] = useState<Supplier>({ name: '', contactEmail: '' });

    // Fetch suppliers from the backend
    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:5094/suppliers');
            setSuppliers(response.data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handlePress = (supplierId: string) => {
        setExpanded(prev => (prev === supplierId ? null : supplierId));
    };

    // Handle Edit Supplier
    const handleEditSupplier = (supplier: Supplier) => {
        setEditSupplier(supplier);
        setIsEditModalVisible(true);
    };

    // Handle Update Supplier
    const handleUpdateSupplier = async () => {
        if (editSupplier) {
            try {
                const response = await axios.put(`http://localhost:5094/suppliers/${editSupplier.id}`, editSupplier);
                if (response.status === 200) {
                    const updatedSuppliers = suppliers.map(sup =>
                        sup.id === editSupplier.id ? response.data : sup
                    );
                    setSuppliers(updatedSuppliers);
                    setIsEditModalVisible(false);
                    setEditSupplier(null);
                    Alert.alert('Success', 'Supplier updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update the supplier');
                }
            } catch (error) {
                console.error('Error updating supplier:', error);
                Alert.alert('Error', 'Failed to update the supplier');
            }
        }
    };

    // Handle Add Supplier
    const handleAddSupplier = async () => {
        if (!newSupplier.name || !newSupplier.contactEmail) {
            Alert.alert('Missing Fields', 'Please enter all fields for the new supplier.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5094/suppliers', newSupplier);
            setSuppliers(prev => [...prev, response.data]);
            setNewSupplier({ name: '', contactEmail: '' });
            setIsAddModalVisible(false);
        } catch (error) {
            console.error('Error adding supplier:', error);
            Alert.alert('Error', 'Failed to add the supplier');
        }
    };

    // Handle Delete Supplier
    const handleDeleteSupplier = (supplierId: number) => {
        if (typeof window !== 'undefined') {
            const confirmation = window.confirm('Are you sure you want to delete this supplier?');
            if (confirmation) {
                deleteSupplierFromBackend(supplierId);
            } else {
                console.log('Delete cancelled');
            }
        } else {
            Alert.alert('Delete Supplier', 'Are you sure you want to delete this supplier?', [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteSupplierFromBackend(supplierId);
                    },
                    style: 'destructive',
                },
            ]);
        }
    };

    // Function to delete supplier from the backend and update UI
    const deleteSupplierFromBackend = async (supplierId: number) => {
        try {
            setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier.id !== supplierId));

            const response = await axios.delete(`http://localhost:5094/suppliers/${supplierId}`);
            if (response.status === 200) {
                fetchSuppliers();
                Alert.alert('Success', 'Supplier deleted successfully');
            } else {
                fetchSuppliers();
                Alert.alert('Error', 'Failed to delete the supplier');
            }
        } catch (error) {
            console.error('Error deleting supplier:', error);
            fetchSuppliers();
            Alert.alert('Error', 'Failed to delete the supplier');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Suppliers</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Supplier</Text>
            </TouchableOpacity>

            {suppliers.map((supplier) => (
                <View key={supplier.id} style={styles.card}>
                    <TouchableOpacity
                        onPress={() => handlePress(supplier.id?.toString() || '')}
                        style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{supplier.name}</Text>
                    </TouchableOpacity>

                    {expanded === supplier.id?.toString() && (
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Contact Email:</Text>
                            <Text style={styles.cardValue}>{supplier.contactEmail}</Text>
                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleEditSupplier(supplier)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => handleDeleteSupplier(supplier.id!)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            ))}

            {/* Modal for editing a supplier */}
            <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Supplier</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={editSupplier?.name || ''}
                            onChangeText={text => setEditSupplier(prev => ({ ...prev!, name: text }))}
                        />

                        <Text style={styles.label}>Contact Email</Text>
                        <TextInput
                            style={styles.input}
                            value={editSupplier?.contactEmail || ''}
                            onChangeText={text => setEditSupplier(prev => ({ ...prev!, contactEmail: text }))}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleUpdateSupplier}>
                                <Text style={styles.actionButtonText}>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => setIsEditModalVisible(false)}>
                                <Text style={styles.actionButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal for adding a new supplier */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Supplier</Text>

                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newSupplier.name}
                            onChangeText={text => setNewSupplier(prev => ({ ...prev, name: text }))}
                        />

                        <Text style={styles.label}>Contact Email</Text>
                        <TextInput
                            style={styles.input}
                            value={newSupplier.contactEmail}
                            onChangeText={text => setNewSupplier(prev => ({ ...prev, contactEmail: text }))}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleAddSupplier}>
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
