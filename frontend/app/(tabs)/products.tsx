import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface Product {
  id?: number;  // Change id to be a number
  name: string;
  price: number;
  description: string;
  categoryId: number; // Foreign key to Category
  supplierId: number; // Foreign key to Supplier
}

// TODO: Make all of this work with the new db setup

export default function ProductsScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // State for new product modal
  const [newProduct, setNewProduct] = useState<Product>({
    name: '',
    price: 0,
    description: '',
    categoryId: 0,
    supplierId: 0
  });

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5094/products');
      setProducts(response.data); // Populate state with the fetched products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on component mount
  }, []);

  const handlePress = (productId: number) => {
    setExpanded(prev => (prev === productId ? null : productId));
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = (productId: number) => {
    // Check if the app is running on web, and use window.alert on the web.
    if (typeof window !== 'undefined') {
      // Web environment
      const confirmation = window.confirm('Are you sure you want to delete this product?');
      if (confirmation) {
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      } else {
        console.log("Delete cancelled");
      }
    } else {
      // For mobile platforms (iOS/Android), use the React Native Alert
      Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
          },
          style: 'destructive',
        },
      ]);
    }
  };

  const handleUpdateProduct = () => {
    if (editProduct) {
      const updatedProducts = products.map(product =>
        product.id === editProduct.id ? editProduct : product
      );
      setProducts(updatedProducts);
      setIsModalVisible(false);
      setEditProduct(null);
    }
  };

  const handleAddProduct = () => {
    // Check if all fields are filled
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.categoryId || !newProduct.supplierId) {
      // Check if the app is running on the web and use window.alert in that case
      if (typeof window !== 'undefined') {
        window.alert('Please fill in all fields before adding a product.');
      } else {
        // For mobile platforms (iOS/Android), use the React Native Alert
        Alert.alert('Missing Fields', 'Please fill in all fields before adding a product.');
      }
      return; // Prevent adding the product if any field is empty
    }

    // Generate a new ID and add the product to the list (convert ID to number)
    const newProductWithId = { ...newProduct, id: products.length + 1 };  // Use a number for ID
    setProducts(prevProducts => [...prevProducts, newProductWithId]);

    // Close the modal and reset the new product state
    setIsAddModalVisible(false);
    setNewProduct({
      name: '',
      price: 0,
      description: '',
      categoryId: 0,
      supplierId: 0
    });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>

      {products.map((product) => (
        <View key={product.id as number} style={styles.card}>
          <TouchableOpacity onPress={() => handlePress(product.id as number)} style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{product.name}</Text>
            <Text style={styles.cardCategory}>{product.categoryId}</Text>
            <Text style={styles.cardPrice}>{product.price}</Text>
          </TouchableOpacity>

          {expanded === (product.id as number) && (
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Description:</Text>
              <Text style={styles.cardValue}>{product.description}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.button} onPress={() => handleEditProduct(product)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDeleteProduct(product.id as number)}>
                  <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}


      {/* Modal for editing a product */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Product</Text>

            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={editProduct?.name || ''}
              onChangeText={text => setEditProduct(prev => ({ ...prev!, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Category ID"
              value={editProduct?.categoryId?.toString() || ''}
              onChangeText={text => setEditProduct(prev => ({ ...prev!, categoryId: Number(text) }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Supplier ID"
              value={editProduct?.supplierId?.toString() || ''}
              onChangeText={text => setEditProduct(prev => ({ ...prev!, supplierId: Number(text) }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={editProduct?.price.toString() || ''}
              onChangeText={text => setEditProduct(prev => ({ ...prev!, price: Number(text) }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={editProduct?.description || ''}
              onChangeText={text => setEditProduct(prev => ({ ...prev!, description: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={handleUpdateProduct}>
                <Text style={styles.actionButtonText}>Update Product</Text>
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

      {/* Modal for adding a new product */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Product</Text>

            <TextInput
              style={styles.input}
              placeholder="Product Name"
              value={newProduct.name}
              onChangeText={text => setNewProduct(prev => ({ ...prev, name: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Category ID"
              value={newProduct.categoryId?.toString() || ''}
              onChangeText={text => setNewProduct(prev => ({ ...prev, categoryId: Number(text) }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Supplier ID"
              value={editProduct?.supplierId?.toString() || ''}
              onChangeText={text => setNewProduct(prev => ({ ...prev!, supplierId: Number(text) }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={newProduct.price.toString() || ''}
              onChangeText={text => setNewProduct(prev => ({ ...prev, price: Number(text) }))}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newProduct.description}
              onChangeText={text => setNewProduct(prev => ({ ...prev, description: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={handleAddProduct}>
                <Text style={styles.actionButtonText}>Add Product</Text>
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
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.text,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  addButtonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.light.background,
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
    color: Colors.light.text,
  },
  cardCategory: {
    fontSize: 14,
    color: Colors.light.text,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  cardContent: {
    marginTop: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  cardValue: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: Colors.light.background,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: Colors.light.danger,
  },
  deleteButtonText: {
    color: Colors.light.background,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.light.background,
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.text,
  },
  input: {
    height: 40,
    borderColor: Colors.light.tertiary,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  updateButton: {
    backgroundColor: Colors.light.primary,
  },
  cancelButton: {
    backgroundColor: Colors.light.danger,
  },
  actionButtonText: {
    textAlign: 'center',
    color: Colors.light.background,
    fontWeight: 'bold',
  },

});
