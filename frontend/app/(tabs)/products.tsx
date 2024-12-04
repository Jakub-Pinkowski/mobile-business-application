import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
}

// interface Product {
//   id: number; 
//   name: string;
//   price: number; 
//   description: string;
//   categoryId: number; // Foreign key to Category
//   supplierId: number; // Foreign key to Supplier
// }

// TODO: Update it all to match the DB
const productsData: Product[] = [
  {
    id: '1',
    name: 'Mountain Bike',
    category: 'Bikes',
    price: '$500',
    description: 'Durable mountain bike designed for all terrains and tough rides.',
  },
  {
    id: '2',
    name: 'Road Bike',
    category: 'Bikes',
    price: '$400',
    description: 'Lightweight road bike, perfect for fast riding on paved roads.',
  },
  {
    id: '3',
    name: 'Cycling Cap',
    category: 'Caps',
    price: '$20',
    description: 'Comfortable cycling cap to protect you from the sun during long rides.',
  },
  {
    id: '4',
    name: 'Sports Cap',
    category: 'Caps',
    price: '$15',
    description: 'Stylish sports cap with adjustable straps for a perfect fit.',
  },
  {
    id: '5',
    name: 'Backpack 20L',
    category: 'Backpacks',
    price: '$45',
    description: 'Compact backpack with 20L capacity, perfect for day trips.',
  },
  {
    id: '6',
    name: 'Backpack 40L',
    category: 'Backpacks',
    price: '$70',
    description: 'Large 40L backpack with multiple compartments for extended trips.',
  },
  {
    id: '7',
    name: 'Running Shoes',
    category: 'Shoes',
    price: '$80',
    description: 'Breathable running shoes designed for comfort during long runs.',
  },
  {
    id: '8',
    name: 'Trekking Boots',
    category: 'Shoes',
    price: '$120',
    description: 'Sturdy trekking boots for outdoor adventures and rough terrains.',
  },
];

export default function ProductsScreen() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [products, setProducts] = useState(productsData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false); // State for new product modal
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    category: '',
    price: '',
    description: '',
  });

  const handlePress = (productId: string) => {
    setExpanded(prev => (prev === productId ? null : productId));
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setIsModalVisible(true);
  };

  const handleDeleteProduct = (productId: string) => {

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
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.description) {
      // Check if the app is running on the web and use window.alert in that case
      if (typeof window !== 'undefined') {
        window.alert('Please fill in all fields before adding a product.');
      } else {
        // For mobile platforms (iOS/Android), use the React Native Alert
        Alert.alert('Missing Fields', 'Please fill in all fields before adding a product.');
      }
      return; // Prevent adding the product if any field is empty
    }

    // Generate a new ID and add the product to the list
    const newProductWithId = { ...newProduct, id: `${products.length + 1}` };
    setProducts(prevProducts => [...prevProducts, newProductWithId]);

    // Close the modal and reset the new product state
    setIsAddModalVisible(false);
    setNewProduct({
      id: '',
      name: '',
      category: '',
      price: '',
      description: '',
    });
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Products</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New Product</Text>
      </TouchableOpacity>

      {products.map((product) => (
        <View key={product.id} style={styles.card}>
          <TouchableOpacity onPress={() => handlePress(product.id)} style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{product.name}</Text>
            <Text style={styles.cardCategory}>{product.category}</Text>
            <Text style={styles.cardPrice}>{product.price}</Text>
          </TouchableOpacity>

          {expanded === product.id && (
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Description:</Text>
              <Text style={styles.cardValue}>{product.description}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.button} onPress={() => handleEditProduct(product)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDeleteProduct(product.id)}>
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
              placeholder="Category"
              value={editProduct?.category || ''}
              onChangeText={text => setEditProduct(prev => ({ ...prev!, category: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={editProduct?.price || ''}
              onChangeText={text => setEditProduct(prev => ({ ...prev!, price: text }))}
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
              placeholder="Category"
              value={newProduct.category}
              onChangeText={text => setNewProduct(prev => ({ ...prev, category: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={newProduct.price}
              onChangeText={text => setNewProduct(prev => ({ ...prev, price: text }))}
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
