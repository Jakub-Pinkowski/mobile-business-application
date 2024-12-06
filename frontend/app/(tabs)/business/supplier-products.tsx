import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { Colors } from '@/constants/Colors';

interface Supplier {
    id: number;
    name: string;
    contactEmail: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    categoryId: number;
    supplierId: number;
}

interface Category {
    id: number;
    name: string;
    description: string;
}

interface SupplierProduct {
    supplier: Supplier;
    products: (Product & { category: Category | null })[];
}

export default function SupplierProductInventory() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [suppliersRes, productsRes, categoriesRes] = await Promise.all([
                    axios.get<Supplier[]>('http://localhost:5094/suppliers'),
                    axios.get<Product[]>('http://localhost:5094/products'),
                    axios.get<Category[]>('http://localhost:5094/categories'),
                ]);
                setSuppliers(suppliersRes.data);
                setProducts(productsRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getJoinedData = (): SupplierProduct[] => {
        return suppliers.map(supplier => {
            const supplierProducts = products
                .filter(product => product.supplierId === supplier.id)
                .map(product => ({
                    ...product,
                    category: categories.find(category => category.id === product.categoryId) || null,
                }));

            return {
                supplier,
                products: supplierProducts,
            };
        });
    };

    const joinedData = getJoinedData();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Supplier Product Inventory</Text>
            {joinedData.map(({ supplier, products }) => (
                <View key={supplier.id} style={styles.card}>
                    <Text style={styles.cardHeader}>{supplier.name}</Text>
                    <Text style={styles.cardEmail}>Contact Email: {supplier.contactEmail}</Text>
                    <View style={styles.productsContainer}>
                        <Text style={styles.productsHeader}>Products:</Text>
                        {products.map(product => (
                            <View key={product.id} style={styles.productRow}>
                                <Text style={styles.productName}>{product.name}</Text>
                                <Text style={styles.productCategory}>
                                    Category: {product.category?.name || 'Uncategorized'}
                                </Text>
                                <Text style={styles.productPrice}>Price: ${product.price.toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </ScrollView>
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
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardEmail: {
        fontSize: 14,
        color: '#888',
        marginBottom: 12,
    },
    productsContainer: {
        marginTop: 8,
    },
    productsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    productRow: {
        marginBottom: 8,
    },
    productName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    productCategory: {
        fontSize: 14,
        color: '#888',
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
    },
});
