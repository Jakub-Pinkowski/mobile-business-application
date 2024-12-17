import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import axios from 'axios';
import { Colors } from '@/constants/Colors';

interface Invoice {
    id?: number;
    date: string;
    totalAmount: number;
    customerId: number;
}

export default function InvoiceScreen() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);
    const [newInvoice, setNewInvoice] = useState<Invoice>({
        date: new Date().toISOString(),
        totalAmount: 0,
        customerId: 0,
    });

    // Fetch invoices from the backend
    const fetchInvoices = async () => {
        try {
            const response = await axios.get('http://localhost:5094/invoices');
            setInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handlePress = (invoiceId: string) => {
        setExpanded(prev => (prev === invoiceId ? null : invoiceId));
    };

    // Handle Edit Invoice
    const handleEditInvoice = (invoice: Invoice) => {
        setEditInvoice(invoice);
        setIsEditModalVisible(true);
    };

    // Handle Update Invoice
    const handleUpdateInvoice = async () => {
        if (editInvoice) {
            try {
                const response = await axios.put(`http://localhost:5094/invoices/${editInvoice.id}`, editInvoice);
                if (response.status === 200) {
                    const updatedInvoices = invoices.map(inv =>
                        inv.id === editInvoice.id ? response.data : inv
                    );
                    setInvoices(updatedInvoices);
                    setIsEditModalVisible(false);
                    setEditInvoice(null);
                    Alert.alert('Success', 'Invoice updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update the invoice');
                }
            } catch (error) {
                console.error('Error updating invoice:', error);
                Alert.alert('Error', 'Failed to update the invoice');
            }
        }
    };

    // Handle Add Invoice
    const handleAddInvoice = async () => {
        if (!newInvoice.totalAmount || !newInvoice.customerId) {
            Alert.alert('Missing Fields', 'Please fill in all fields before adding an invoice.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5094/invoices', newInvoice);
            setInvoices(prevInvoices => [...prevInvoices, response.data]);
            setIsAddModalVisible(false);
            setNewInvoice({
                date: new Date().toISOString(),
                totalAmount: 0,
                customerId: 0,
            });
        } catch (error) {
            console.error('Error adding invoice:', error);
            Alert.alert('Error', 'Failed to add the invoice');
        }
    };

    // Handle Delete Invoice
    const handleDeleteInvoice = (invoiceId: number) => {
        if (typeof window !== 'undefined') {
            const confirmation = window.confirm('Are you sure you want to delete this invoice?');
            if (confirmation) {
                deleteInvoiceFromBackend(invoiceId);
            } else {
                console.log('Delete cancelled');
            }
        } else {
            Alert.alert('Delete Invoice', 'Are you sure you want to delete this invoice?', [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteInvoiceFromBackend(invoiceId);
                    },
                    style: 'destructive',
                },
            ]);
        }
    };

    // Function to delete invoice from the backend and update UI
    const deleteInvoiceFromBackend = async (invoiceId: number) => {
        try {
            setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== invoiceId));

            const response = await axios.delete(`http://localhost:5094/invoices/${invoiceId}`);

            if (response.status === 200) {
                fetchInvoices();
                Alert.alert('Success', 'Invoice deleted successfully');
            } else {
                fetchInvoices();
                Alert.alert('Error', 'Failed to delete the invoice');
            }
        } catch (error) {
            console.error('Error deleting invoice:', error);
            fetchInvoices();
            Alert.alert('Error', 'Failed to delete the invoice');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Invoices</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Invoice</Text>
            </TouchableOpacity>

            {invoices.map(invoice => (
                <View key={invoice.id} style={styles.card}>
                    <TouchableOpacity
                        onPress={() => handlePress(invoice.id?.toString() || '')}
                        style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Invoice #{invoice.id}</Text>
                    </TouchableOpacity>

                    {expanded === invoice.id?.toString() && (
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Date: {new Date(invoice.date).toLocaleDateString()}</Text>
                            <Text style={styles.cardLabel}>Total Amount: ${invoice.totalAmount.toFixed(2)}</Text>
                            <Text style={styles.cardLabel}>Customer ID: {invoice.customerId}</Text>

                            <View style={styles.cardActions}>
                                <TouchableOpacity style={styles.button} onPress={() => handleEditInvoice(invoice)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => handleDeleteInvoice(invoice.id!)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            ))}

            {/* Modal for editing an invoice */}
            <Modal visible={isEditModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Invoice</Text>

                        <Text style={styles.label}>Total Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={editInvoice?.totalAmount.toString() || ''}
                            onChangeText={text => setEditInvoice(prev => ({ ...prev!, totalAmount: parseFloat(text) }))}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Customer ID</Text>
                        <TextInput
                            style={styles.input}
                            value={editInvoice?.customerId.toString() || ''}
                            onChangeText={text => setEditInvoice(prev => ({ ...prev!, customerId: parseInt(text) }))}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleUpdateInvoice}>
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

            {/* Modal for adding a new invoice */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Invoice</Text>

                        <Text style={styles.label}>Total Amount</Text>
                        <TextInput
                            style={styles.input}
                            value={newInvoice.totalAmount.toString()}
                            onChangeText={text => setNewInvoice(prev => ({ ...prev, totalAmount: parseFloat(text) }))}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Customer ID</Text>
                        <TextInput
                            style={styles.input}
                            value={newInvoice.customerId.toString()}
                            onChangeText={text => setNewInvoice(prev => ({ ...prev, customerId: parseInt(text) }))}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.addButton]}
                                onPress={handleAddInvoice}>
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