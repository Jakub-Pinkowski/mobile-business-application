import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface InvoiceItem {
    id?: number;
    quantity: number;
    price: number;
    productId: number;
    invoiceId: number;
}

export default function InvoiceItemScreen() {
    const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editInvoiceItem, setEditInvoiceItem] = useState<InvoiceItem | null>(null);
    const [newInvoiceItem, setNewInvoiceItem] = useState<InvoiceItem>({
        quantity: 0,
        price: 0.0,
        productId: 0,
        invoiceId: 0,
    });

    // Fetch invoice items from backend
    const fetchInvoiceItems = async () => {
        try {
            const response = await axios.get('http://localhost:5094/invoiceitems');
            setInvoiceItems(response.data);
        } catch (error) {
            console.error('Error fetching invoice items:', error);
        }
    };

    useEffect(() => {
        fetchInvoiceItems();
    }, []);

    const handlePress = (itemId: string) => {
        setExpanded(prev => (prev === itemId ? null : itemId));
    };

    // Handle Edit InvoiceItem
    const handleEditInvoiceItem = (item: InvoiceItem) => {
        setEditInvoiceItem(item);
        setIsModalVisible(true);
    };

    // Handle Update InvoiceItem
    const handleUpdateInvoiceItem = async () => {
        if (editInvoiceItem) {
            try {
                const response = await axios.put(`http://localhost:5094/invoiceitems/${editInvoiceItem.id}`, editInvoiceItem);
                if (response.status === 200) {
                    const updatedItems = invoiceItems.map(item =>
                        item.id === editInvoiceItem.id ? response.data : item
                    );
                    setInvoiceItems(updatedItems);
                    setIsModalVisible(false);
                    setEditInvoiceItem(null);
                    Alert.alert('Success', 'Invoice item updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update the invoice item');
                }
            } catch (error) {
                console.error('Error updating invoice item:', error);
                Alert.alert('Error', 'Failed to update the invoice item');
            }
        }
    };

    // Handle Add InvoiceItem
    const handleAddInvoiceItem = async () => {
        if (newInvoiceItem.quantity <= 0 || newInvoiceItem.price <= 0) {
            Alert.alert('Invalid Input', 'Please enter valid quantity and price.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5094/invoiceitems', newInvoiceItem);
            setInvoiceItems(prev => [...prev, response.data]);
            setNewInvoiceItem({ quantity: 0, price: 0.0, productId: 0, invoiceId: 0 });
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error adding invoice item:', error);
            Alert.alert('Error', 'Failed to add the invoice item');
        }
    };

    // Handle Delete InvoiceItem
    const handleDeleteInvoiceItem = (itemId: number) => {
        const deleteInvoiceItemFromBackend = async (itemId: number) => {
            try {
                await axios.delete(`http://localhost:5094/invoiceitems/${itemId}`);
                setInvoiceItems(prevItems => prevItems.filter(item => item.id !== itemId));
                Alert.alert('Success', 'Invoice item deleted successfully');
            } catch (error) {
                console.error('Error deleting invoice item:', error);
                Alert.alert('Error', 'Failed to delete the invoice item');
            }
        };

        if (typeof window !== 'undefined') {
            const confirmation = window.confirm('Are you sure you want to delete this invoice item?');
            if (confirmation) {
                deleteInvoiceItemFromBackend(itemId);
            } else {
                console.log('Delete cancelled');
            }
        } else {
            Alert.alert('Delete Invoice Item', 'Are you sure you want to delete this invoice item?', [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteInvoiceItemFromBackend(itemId);
                    },
                    style: 'destructive',
                },
            ]);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Invoice Items</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Invoice Item</Text>
            </TouchableOpacity>

            <ScrollView>
                {invoiceItems.map(item => (
                    <View key={item.id} style={styles.card}>
                        <TouchableOpacity
                            onPress={() => handlePress(item.id?.toString() || '')}
                            style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Item ID: {item.id}</Text>
                        </TouchableOpacity>

                        {expanded === item.id?.toString() && (
                            <View style={styles.cardContent}>
                                <Text>Quantity: {item.quantity}</Text>
                                <Text>Price: ${item.price.toFixed(2)}</Text>
                                <Text>Product ID: {item.productId}</Text>
                                <Text>Invoice ID: {item.invoiceId}</Text>

                                <View style={styles.cardActions}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => handleEditInvoiceItem(item)}>
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.button, styles.deleteButton]}
                                        onPress={() => handleDeleteInvoiceItem(item.id!)}>
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* Modal for adding/editing Invoice Items */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>
                            {editInvoiceItem ? 'Edit Invoice Item' : 'Add New Invoice Item'}
                        </Text>

                        <Text style={styles.label}>Quantity</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={(editInvoiceItem?.quantity || newInvoiceItem.quantity).toString()}
                            onChangeText={text =>
                                editInvoiceItem
                                    ? setEditInvoiceItem(prev => ({ ...prev!, quantity: parseInt(text) || 0 }))
                                    : setNewInvoiceItem(prev => ({ ...prev, quantity: parseInt(text) || 0 }))
                            }
                        />

                        <Text style={styles.label}>Price</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={(editInvoiceItem?.price || newInvoiceItem.price).toString()}
                            onChangeText={text =>
                                editInvoiceItem
                                    ? setEditInvoiceItem(prev => ({ ...prev!, price: parseFloat(text) || 0 }))
                                    : setNewInvoiceItem(prev => ({ ...prev, price: parseFloat(text) || 0 }))
                            }
                        />

                        <Text style={styles.label}>Product ID</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={(editInvoiceItem?.productId || newInvoiceItem.productId).toString()}
                            onChangeText={text =>
                                editInvoiceItem
                                    ? setEditInvoiceItem(prev => ({ ...prev!, productId: parseInt(text) || 0 }))
                                    : setNewInvoiceItem(prev => ({ ...prev, productId: parseInt(text) || 0 }))
                            }
                        />

                        <Text style={styles.label}>Invoice ID</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={(editInvoiceItem?.invoiceId || newInvoiceItem.invoiceId).toString()}
                            onChangeText={text =>
                                editInvoiceItem
                                    ? setEditInvoiceItem(prev => ({ ...prev!, invoiceId: parseInt(text) || 0 }))
                                    : setNewInvoiceItem(prev => ({ ...prev, invoiceId: parseInt(text) || 0 }))
                            }
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={editInvoiceItem ? handleUpdateInvoiceItem : handleAddInvoiceItem}>
                                <Text style={styles.actionButtonText}>
                                    {editInvoiceItem ? 'Update' : 'Add'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setEditInvoiceItem(null);
                                }}>
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
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
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
    cardContent: {
        marginTop: 8,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        backgroundColor: Colors.light.primary,
    },
    deleteButton: {
        backgroundColor: Colors.light.danger,
    },
    buttonText: {
        color: '#fff',
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
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
});
