import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface ProductTag {
    id?: number;
    productId: number;
    tagId: number;
}

export default function ProductsTagScreen() {
    const [productTagsData, setProductTagsData] = useState<ProductTag[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editProductTag, setEditProductTag] = useState<ProductTag | null>(null);
    const [newProductTag, setNewProductTag] = useState<ProductTag>({
        productId: 0,
        tagId: 0,
    });

    // Fetch product-tags from the backend
    const fetchProductTags = async () => {
        try {
            const response = await axios.get('http://localhost:5094/producttags');
            setProductTagsData(response.data);
        } catch (error) {
            console.error('Error fetching product-tags:', error);
        }
    };

    useEffect(() => {
        fetchProductTags();
    }, []);

    const handlePress = (productTagId: string) => {
        setExpanded((prev) => (prev === productTagId ? null : productTagId));
    };

    // Handle Edit ProductTag
    const handleEditProductTag = (productTag: ProductTag) => {
        setEditProductTag(productTag);
        setIsModalVisible(true);
    };

    // Handle Update ProductTag
    const handleUpdateProductTag = async () => {
        if (editProductTag) {
            try {
                const response = await axios.put(
                    `http://localhost:5094/producttags/${editProductTag.id}`,
                    editProductTag
                );
                if (response.status === 200) {
                    const updatedProductTags = productTagsData.map((pt) =>
                        pt.id === editProductTag.id ? editProductTag : pt
                    );
                    setProductTagsData(updatedProductTags);
                    setIsModalVisible(false);
                    setEditProductTag(null);
                    Alert.alert('Success', 'Product-Tag updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update the product-tag');
                }
            } catch (error) {
                console.error('Error updating product-tag:', error);
                Alert.alert('Error', 'Failed to update the product-tag');
            }
        }
    };

    // Handle Add ProductTag
    const handleAddProductTag = async () => {
        if (!newProductTag.productId || !newProductTag.tagId) {
            Alert.alert('Missing Fields', 'Please fill in all fields before adding a product-tag.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5094/producttags', newProductTag);
            setProductTagsData((prev) => [...prev, response.data]);
            setIsAddModalVisible(false);
            setNewProductTag({
                productId: 0,
                tagId: 0,
            });
        } catch (error) {
            console.error('Error adding product-tag:', error);
            Alert.alert('Error', 'Failed to add the product-tag');
        }
    };

    // Handle Delete ProductTag
    const handleDeleteProductTag = (productTagId: number) => {
        // Check if the app is running on web, and use window.confirm on the web.
        if (typeof window !== 'undefined') {
            // Web environment
            const confirmation = window.confirm('Are you sure you want to delete this product-tag?');
            if (confirmation) {
                deleteProductTagFromBackend(productTagId);
            } else {
                console.log('Delete cancelled');
            }
        } else {
            // For mobile platforms (iOS/Android), use the React Native Alert
            Alert.alert('Delete Product-Tag', 'Are you sure you want to delete this product-tag?', [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => deleteProductTagFromBackend(productTagId),
                    style: 'destructive',
                },
            ]);
        }
    };

    // Function to delete product-tag from the backend and update UI
    const deleteProductTagFromBackend = async (productTagId: number) => {
        try {
            // Optimistic UI update: Remove the product-tag immediately from the local state
            setProductTagsData((prev) =>
                prev.filter((productTag) => productTag.id !== productTagId)
            );

            const response = await axios.delete(`http://localhost:5094/producttags/${productTagId}`);
            if (response.status === 200) {
                fetchProductTags();
                Alert.alert('Success', 'Product-Tag deleted successfully');
            } else {
                fetchProductTags();
                Alert.alert('Error', 'Failed to delete the product-tag');
            }
        } catch (error) {
            console.error('Error deleting product-tag:', error);
            fetchProductTags();
            Alert.alert('Error', 'Failed to delete the product-tag');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Product-Tags</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Product-Tag</Text>
            </TouchableOpacity>

            {productTagsData.map((productTag) => (
                <View key={productTag.id} style={styles.card}>
                    <TouchableOpacity
                        onPress={() => handlePress(productTag.id?.toString() || '')}
                        style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>
                            Product ID: {productTag.productId} | Tag ID: {productTag.tagId}
                        </Text>
                    </TouchableOpacity>

                    {expanded === productTag.id?.toString() && (
                        <View style={styles.cardContent}>
                            <Text style={styles.cardLabel}>Product ID:</Text>
                            <Text style={styles.cardValue}>{productTag.productId}</Text>

                            <Text style={styles.cardLabel}>Tag ID:</Text>
                            <Text style={styles.cardValue}>{productTag.tagId}</Text>

                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleEditProductTag(productTag)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => handleDeleteProductTag(productTag.id!)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            ))}

            {/* Modal for editing a product-tag */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Product-Tag</Text>

                        {/* Product ID Field */}
                        <Text style={styles.label}>Product ID</Text>
                        <TextInput
                            style={styles.input}
                            value={editProductTag?.productId?.toString() || ''}
                            onChangeText={(text) =>
                                setEditProductTag((prev) => ({ ...prev!, productId: Number(text) }))
                            }
                            keyboardType="numeric"
                        />

                        {/* Tag ID Field */}
                        <Text style={styles.label}>Tag ID</Text>
                        <TextInput
                            style={styles.input}
                            value={editProductTag?.tagId?.toString() || ''}
                            onChangeText={(text) =>
                                setEditProductTag((prev) => ({ ...prev!, tagId: Number(text) }))
                            }
                            keyboardType="numeric"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleUpdateProductTag}>
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

            {/* Modal for adding a new product-tag */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Product-Tag</Text>

                        {/* Product ID Field */}
                        <Text style={styles.label}>Product ID</Text>
                        <TextInput
                            style={styles.input}
                            value={newProductTag.productId === 0 ? '' : newProductTag.productId.toString()}
                            onChangeText={(text) =>
                                setNewProductTag((prev) => ({ ...prev, productId: text ? Number(text) : 0 }))
                            }
                            keyboardType="numeric"
                        />

                        {/* Tag ID Field */}
                        <Text style={styles.label}>Tag ID</Text>
                        <TextInput
                            style={styles.input}
                            value={newProductTag.tagId === 0 ? '' : newProductTag.tagId.toString()}
                            onChangeText={(text) =>
                                setNewProductTag((prev) => ({ ...prev, tagId: text ? Number(text) : 0 }))
                            }
                            keyboardType="numeric"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleAddProductTag}>
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
