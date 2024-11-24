import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
}

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

  // FIXME: Nothing happens after clicking the button, no alert shows up
  const handleDeleteProduct = (productId: string) => {
    console.log("Deleting product with ID:", productId); // Debugging log
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          console.log("Product deleted"); // Debugging log
          setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        },
        style: 'destructive',
      },
    ]);
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
    const newProductWithId = { ...newProduct, id: `${products.length + 1}` }; // Generate new ID
    setProducts(prevProducts => [...prevProducts, newProductWithId]);
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

      {/* Add Product Button */}
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleEditProduct(product)}>
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
              <Button title="Update Product" onPress={handleUpdateProduct} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setIsModalVisible(false)}
              />
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
              <Button title="Add Product" onPress={handleAddProduct} />
              <Button
                title="Cancel"
                color="red"
                onPress={() => setIsAddModalVisible(false)}
              />
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
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
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
    color: '#333',
  },
  cardCategory: {
    fontSize: 14,
    color: '#555',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  cardContent: {
    marginTop: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  cardValue: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f44336',
  },
  deleteButtonText: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  modalActions: {
    marginTop: 16,
  },
});
