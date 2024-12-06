import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Colors } from '@/constants/Colors';

// Define TypeScript types
type Review = {
    id: number;
    content: string;
    rating: number;
    productId: number;
    customerId: number;
};

type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    categoryId: number;
    supplierId: number;
};

type Customer = {
    id: number;
    name: string;
    email: string;
    registrationDate: string;
    phoneNumber: string;
    addressId: number;
};

type Category = {
    id: number;
    name: string;
};

type JoinedReview = {
    reviewId: number;
    content: string;
    rating: number;
    productName: string;
    customerName: string;
    categoryName: string;
};

export default function Business_1() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [reviewsRes, productsRes, customersRes, categoriesRes] = await Promise.all([
                axios.get<Review[]>('http://localhost:5094/reviews'),
                axios.get<Product[]>('http://localhost:5094/products'),
                axios.get<Customer[]>('http://localhost:5094/customers'),
                axios.get<Category[]>('http://localhost:5094/categories'),
            ]);

            setReviews(reviewsRes.data);
            setProducts(productsRes.data);
            setCustomers(customersRes.data);
            setCategories(categoriesRes.data);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const getJoinedData = (): JoinedReview[] => {
        return reviews.map((review) => {
            const product = products.find((p) => p.id === review.productId);
            const customer = customers.find((c) => c.id === review.customerId);
            const category = categories.find((cat) => cat.id === product?.categoryId);

            return {
                reviewId: review.id,
                content: review.content,
                rating: review.rating,
                productName: product?.name || 'Unknown Product',
                customerName: customer?.name || 'Unknown Customer',
                categoryName: category?.name || 'Unknown Category',
            };
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>Loading data...</Text>
            </View>
        );
    }

    const joinedData = getJoinedData();

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Product Reviews</Text>
            <FlatList
                data={joinedData}
                keyExtractor={(item) => item.reviewId.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.productName}</Text>
                        <Text style={styles.cardSubtitle}>Category: {item.categoryName}</Text>
                        <Text style={styles.cardSubtitle}>Reviewed by: {item.customerName}</Text>
                        <Text style={styles.cardContent}>Review: {item.content}</Text>
                        <Text style={styles.cardRating}>Rating: {item.rating}/5</Text>
                    </View>
                )}
            />
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
        color: Colors.light.text,
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
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: Colors.light.primary,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#555',
        marginBottom: 4,
    },
    cardContent: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    cardRating: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.light.primary,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: Colors.light.text,
    },
});
