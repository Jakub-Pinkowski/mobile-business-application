import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  categoryId: number;
  supplierId: number;
}

export default function ProductsScreen() {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editProductItem, setEditProductItem] = useState<Product | null>(null);
  const [newProductItem, setNewProductItem] = useState<Product>({
    name: '',
    price: 0,
    description: '',
    categoryId: 0,
    supplierId: 0,
  });

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5094/products');
      setProductsData(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePress = (productId: string) => {
    setExpanded(prev => (prev === productId ? null : productId));
  };

  // Handle Edit Product Item
  const handleEditProductItem = (productItem: Product) => {
    setEditProductItem(productItem);
    setIsModalVisible(true);
  };

  // Handle Update Product Item
  const handleUpdateProductItem = async () => {
    if (editProductItem) {
      const updatedProductItem = {
        ...editProductItem,
        // Assuming date is not part of the Product object, you can handle other fields
      };

      try {
        const response = await axios.put(`http://localhost:5094/products/${editProductItem.id}`, updatedProductItem);
        if (response.status === 200) {
          // Optimistically update the UI
          const updatedProducts = productsData.map(productItem =>
            productItem.id === editProductItem.id ? updatedProductItem : productItem
          );
          setProductsData(updatedProducts);
          setIsModalVisible(false);
          setEditProductItem(null);
          Alert.alert('Success', 'Product updated successfully');
        } else {
          Alert.alert('Error', 'Failed to update the product');
        }
      } catch (error) {
        console.error('Error updating product item:', error);
        Alert.alert('Error', 'Failed to update the product');
      }
    }
  };

  // Handle Add Product Item
  const handleAddProductItem = async () => {
    if (!newProductItem.name || !newProductItem.description || !newProductItem.price) {
      Alert.alert('Missing Fields', 'Please fill in all fields before adding a product.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5094/products', newProductItem);
      setProductsData(prevProducts => [...prevProducts, response.data]);
      setIsAddModalVisible(false);
      setNewProductItem({
        name: '',
        price: 0,
        description: '',
        categoryId: 0,
        supplierId: 0,
      });
    } catch (error) {
      console.error('Error adding product item:', error);
      Alert.alert('Error', 'Failed to add the product');
    }
  };

  // Handle Delete Product Item
  const handleDeleteProductItem = (productId: number) => {
    if (typeof window !== 'undefined') {
      const confirmation = window.confirm('Are you sure you want to delete this product item?');
      if (confirmation) {
        deleteProductFromBackend(productId);
      } else {
        console.log('Delete cancelled');
      }
    } else {
      Alert.alert('Delete News Item', 'Are you sure you want to delete this news item?', [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteProductFromBackend(productId);
          },
          style: 'destructive',
        },
      ]);
    }
  };

  // Function to delete product item from the backend and update UI
  const deleteProductFromBackend = async (productId: number) => {
    try {
      setProductsData(prevProducts => prevProducts.filter(productItem => productItem.id !== productId));

      const response = await axios.delete(`http://localhost:5094/products/${productId}`);
      if (response.status === 200) {
        fetchProducts();
        Alert.alert('Success', 'Product item deleted successfully');
      } else {
        fetchProducts();
        Alert.alert('Error', 'Failed to delete the product item');
      }
    } catch (error) {
      console.error('Error deleting product item:', error);
      fetchProducts();
      Alert.alert('Error', 'Failed to delete the product item');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>

      {productsData.map((productItem) => (
        <View key={productItem.id} style={styles.card}>
          <TouchableOpacity
            onPress={() => handlePress(productItem.id?.toString() || '')}
            style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{productItem.name}</Text>
          </TouchableOpacity>

          {expanded === productItem.id?.toString() && (
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Description:</Text>
              <Text style={styles.cardValue}>{productItem.description}</Text>

              <Text style={styles.cardLabel}>Price:</Text>
              <Text style={styles.cardValue}>${productItem.price.toFixed(2)}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleEditProductItem(productItem)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDeleteProductItem(productItem.id!)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}

      {/* Modal for editing a product item */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Product</Text>

            {/* Name Field */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={editProductItem?.name || ''}
              onChangeText={text => setEditProductItem(prev => ({ ...prev!, name: text }))}
            />

            {/* Price Field */}
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={editProductItem?.price.toString() || ''}
              onChangeText={text => setEditProductItem(prev => ({ ...prev!, price: parseFloat(text) }))}
              keyboardType="numeric"
            />

            {/* Description Field */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}  // Increased height for multiline input
              value={editProductItem?.description || ''}
              onChangeText={text => setEditProductItem(prev => ({ ...prev!, description: text }))}
              multiline={true}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={handleUpdateProductItem}>
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

      {/* Modal for adding a new product item */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Product</Text>

            {/* Name Field */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={newProductItem.name}
              onChangeText={text => setNewProductItem(prev => ({ ...prev, name: text }))}
            />

            {/* Price Field */}
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={newProductItem.price.toString()}
              onChangeText={text => setNewProductItem(prev => ({ ...prev, price: parseFloat(text) }))}
              keyboardType="numeric"
            />

            {/* Description Field */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}  // Increased height for multiline input
              value={newProductItem.description}
              onChangeText={text => setNewProductItem(prev => ({ ...prev, description: text }))}
              multiline={true}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={handleAddProductItem}>
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
