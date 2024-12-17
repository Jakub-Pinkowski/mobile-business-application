import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface ProductSupplier {
    id?: number;
    productId: number;
    supplierId: number;
}

export default function ProductsSupplierScreen() {
    const [productSuppliersData, setProductSuppliersData] = useState<ProductSupplier[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editProductSupplier, setEditProductSupplier] = useState<ProductSupplier | null>(null);
    const [newProductSupplier, setNewProductSupplier] = useState<ProductSupplier>({
        productId: 0,
        supplierId: 0,
    });

    // Fetch product-suppliers from the backend
    const fetchProductSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:5094/productsupplier');
            setProductSuppliersData(response.data);
        } catch (error) {
            console.error('Error fetching product-suppliers:', error);
        }
    };

    useEffect(() => {
        fetchProductSuppliers();
    }, []);

    const handlePress = (productSupplierId: string) => {
        setExpanded((prev) => (prev === productSupplierId ? null : productSupplierId));
    };

    // Handle Edit ProductSupplier
    const handleEditProductSupplier = (productSupplier: ProductSupplier) => {
        setEditProductSupplier(productSupplier);
        setIsModalVisible(true);
    };

    // Handle Update ProductSupplier
    const handleUpdateProductSupplier = async () => {
        if (editProductSupplier) {
            try {
                const response = await axios.put(
                    `http://localhost:5094/productsupplier/${editProductSupplier.id}`,
                    editProductSupplier
                );
                if (response.status === 200) {
                    const updatedProductSuppliers = productSuppliersData.map((ps) =>
                        ps.id === editProductSupplier.id ? editProductSupplier : ps
                    );
                    setProductSuppliersData(updatedProductSuppliers);
                    setIsModalVisible(false);
                    setEditProductSupplier(null);
                    Alert.alert('Success', 'Product-Supplier updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update the product-supplier');
                }
            } catch (error) {
                console.error('Error updating product-supplier:', error);
                Alert.alert('Error', 'Failed to update the product-supplier');
            }
        }
    };

    // Handle Add ProductSupplier
    const handleAddProductSupplier = async () => {
        if (!newProductSupplier.productId || !newProductSupplier.supplierId) {
            Alert.alert('Missing Fields', 'Please fill in all fields before adding a product-supplier.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5094/productsupplier', newProductSupplier);
            setProductSuppliersData((prev) => [...prev, response.data]);
            setIsAddModalVisible(false);
            setNewProductSupplier({
                productId: 0,
                supplierId: 0,
            });
        } catch (error) {
            console.error('Error adding product-supplier:', error);
            Alert.alert('Error', 'Failed to add the product-supplier');
        }
    };

    // Handle Delete ProductSupplier
    const handleDeleteProductSupplier = (productSupplierId: number) => {
        // Check if the app is running on web, and use window.confirm on the web.
        if (typeof window !== 'undefined') {
            // Web environment
            const confirmation = window.confirm('Are you sure you want to delete this product-supplier?');
            if (confirmation) {
                deleteProductSupplierFromBackend(productSupplierId);
            } else {
                console.log('Delete cancelled');
            }
        } else {
            // For mobile platforms (iOS/Android), use the React Native Alert
            Alert.alert('Delete Product-Supplier', 'Are you sure you want to delete this product-supplier?', [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => deleteProductSupplierFromBackend(productSupplierId),
                    style: 'destructive',
                },
            ]);
        }
    };

    // Function to delete product-supplier from the backend and update UI
    const deleteProductSupplierFromBackend = async (productSupplierId: number) => {
        try {
            // Optimistic UI update: Remove the product-supplier immediately from the local state
            setProductSuppliersData((prev) =>
                prev.filter((productSupplier) => productSupplier.id !== productSupplierId)
            );

            const response = await axios.delete(`http://localhost:5094/productsupplier/${productSupplierId}`);
            if (response.status === 200) {
                fetchProductSuppliers();
                Alert.alert('Success', 'Product-Supplier deleted successfully');
            } else {
                fetchProductSuppliers();
                Alert.alert('Error', 'Failed to delete the product-supplier');
            }
        } catch (error) {
            console.error('Error deleting product-supplier:', error);
            fetchProductSuppliers();
            Alert.alert('Error', 'Failed to delete the product-supplier');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Product-Suppliers</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Product-Supplier</Text>
            </TouchableOpacity>

            {productSuppliersData.map((productSupplier) => (
                <View key={productSupplier.id} style={styles.card}>
                    <TouchableOpacity
                        onPress={() => handlePress(productSupplier.id?.toString() || '')}
                        style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            Product ID: {productSupplier.productId} | Supplier ID: {productSupplier.supplierId}
                        </Text>
                    </TouchableOpacity>

                    {expanded === productSupplier.id?.toString() && (
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Product ID:</Text>
                            <Text style={styles.cardValue}>{productSupplier.productId}</Text>

                            <Text style={styles.cardLabel}>Supplier ID:</Text>
                            <Text style={styles.cardValue}>{productSupplier.supplierId}</Text>

                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleEditProductSupplier(productSupplier)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => handleDeleteProductSupplier(productSupplier.id!)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            ))}

            {/* Modal for editing a product-supplier */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Product-Supplier</Text>

                        {/* Product ID Field */}
                        <Text style={styles.label}>Product ID</Text>
                        <TextInput
                            style={styles.input}
                            value={editProductSupplier?.productId?.toString() || ''}
                            onChangeText={(text) =>
                                setEditProductSupplier((prev) => ({ ...prev!, productId: Number(text) }))
                            }
                            keyboardType="numeric"
                        />

                        {/* Supplier ID Field */}
                        <Text style={styles.label}>Supplier ID</Text>
                        <TextInput
                            style={styles.input}
                            value={editProductSupplier?.supplierId?.toString() || ''}
                            onChangeText={(text) =>
                                setEditProductSupplier((prev) => ({ ...prev!, supplierId: Number(text) }))
                            }
                            keyboardType="numeric"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleUpdateProductSupplier}>
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

            {/* Modal for adding a new product-supplier */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Product-Supplier</Text>

                        {/* Product ID Field */}
                        <Text style={styles.label}>Product ID</Text>
                        <TextInput
                            style={styles.input}
                            value={newProductSupplier.productId === 0 ? '' : newProductSupplier.productId.toString()}
                            onChangeText={(text) =>
                                setNewProductSupplier((prev) => ({ ...prev, productId: text ? Number(text) : 0 }))
                            }
                            keyboardType="numeric"
                        />

                        {/* Supplier ID Field */}
                        <Text style={styles.label}>Supplier ID</Text>
                        <TextInput
                            style={styles.input}
                            value={newProductSupplier.supplierId === 0 ? '' : newProductSupplier.supplierId.toString()}
                            onChangeText={(text) =>
                                setNewProductSupplier((prev) => ({ ...prev, supplierId: text ? Number(text) : 0 }))
                            }
                            keyboardType="numeric"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleAddProductSupplier}>
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
