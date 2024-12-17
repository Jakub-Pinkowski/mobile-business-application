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
}

interface ProductSupplier {
    productId: number;
    supplierId: number;
}

interface JoinedProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    suppliers: Supplier[];
}

export default function ProductSupplierSummary() {
    const [products, setProducts] = useState<Product[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, suppliersRes, productSuppliersRes] = await Promise.all([
                    axios.get<Product[]>('http://localhost:5094/products'),
                    axios.get<Supplier[]>('http://localhost:5094/suppliers'),
                    axios.get<ProductSupplier[]>('http://localhost:5094/productsupplier'),
                ]);
                setProducts(productsRes.data);
                setSuppliers(suppliersRes.data);
                setProductSuppliers(productSuppliersRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getJoinedData = (): JoinedProduct[] => {
        return products.map(product => {
            // Find the suppliers associated with each product using productSuppliers
            const associatedSuppliers = productSuppliers
                .filter(ps => ps.productId === product.id)
                .map(ps => suppliers.find(supplier => supplier.id === ps.supplierId))
                .filter(supplier => supplier !== undefined) as Supplier[];

            return {
                ...product,
                suppliers: associatedSuppliers,
            };
        });
    };

    const joinedData = getJoinedData();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Product Supplier Summary</Text>
            {joinedData.map(product => (
                <View key={product.id} style={styles.card}>
                    <Text style={styles.cardHeader}>{product.name}</Text>
                    <Text style={styles.cardPrice}>Price: ${product.price.toFixed(2)}</Text>
                    <Text style={styles.cardDescription}>{product.description}</Text>
                    <View style={styles.suppliersContainer}>
                        <Text style={styles.cardSuppliersHeader}>Suppliers:</Text>
                        {product.suppliers.length > 0 ? (
                            product.suppliers.map(supplier => (
                                <View key={supplier.id}>
                                    <Text style={styles.supplierName}>{supplier.name}</Text>
                                    <Text style={styles.supplierEmail}>{supplier.contactEmail}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noSuppliers}>No suppliers available</Text>
                        )}
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
    cardPrice: {
        fontSize: 16,
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        color: '#888',
        marginBottom: 12,
    },
    suppliersContainer: {
        marginTop: 8,
    },
    cardSuppliersHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    supplierName: {
        fontSize: 14,
        color: '#333',
    },
    supplierEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    noSuppliers: {
        fontSize: 14,
        color: '#888',
    },
});
