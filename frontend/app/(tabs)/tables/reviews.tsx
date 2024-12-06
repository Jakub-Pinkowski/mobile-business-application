import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface Review {
    id?: number;
    content: string;
    rating: number;
    productId: number; // Foreign key to Product
    customerId: number; // Foreign key to Customer
}

export default function ReviewsScreen() {
    const [reviewsData, setReviewsData] = useState<Review[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editReview, setEditReview] = useState<Review | null>(null);
    const [newReview, setNewReview] = useState<Review>({
        content: '',
        rating: 0,
        productId: 0,
        customerId: 0,
    });

    // Fetch reviews from the backend
    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:5094/reviews');
            setReviewsData(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handlePress = (reviewId: string) => {
        setExpanded(prev => (prev === reviewId ? null : reviewId));
    };

    // Handle Edit Review
    const handleEditReview = (review: Review) => {
        setEditReview(review);
        setIsModalVisible(true);
    };

    // Handle Update Review
    const handleUpdateReview = async () => {
        if (editReview) {
            try {
                const response = await axios.put(`http://localhost:5094/reviews/${editReview.id}`, editReview);
                if (response.status === 200) {
                    const updatedReviews = reviewsData.map(review =>
                        review.id === editReview.id ? editReview : review
                    );
                    setReviewsData(updatedReviews);
                    setIsModalVisible(false);
                    setEditReview(null);
                    Alert.alert('Success', 'Review updated successfully');
                } else {
                    Alert.alert('Error', 'Failed to update the review');
                }
            } catch (error) {
                console.error('Error updating review:', error);
                Alert.alert('Error', 'Failed to update the review');
            }
        }
    };

    // Handle Add Review
    const handleAddReview = async () => {
        if (!newReview.content || !newReview.rating || !newReview.productId || !newReview.customerId) {
            Alert.alert('Missing Fields', 'Please fill in all fields before adding a review.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5094/reviews', newReview);
            setReviewsData(prevReviews => [...prevReviews, response.data]);
            setIsAddModalVisible(false);
            setNewReview({
                content: '',
                rating: 0,
                productId: 0,
                customerId: 0,
            });
        } catch (error) {
            console.error('Error adding review:', error);
            Alert.alert('Error', 'Failed to add the review');
        }
    };

    const handleDeleteReview = (reviewId: number) => {
        // Check if the app is running on web, and use window.confirm on the web.
        if (typeof window !== 'undefined') {
            // Web environment
            const confirmation = window.confirm('Are you sure you want to delete this review?');
            if (confirmation) {
                deleteReviewFromBackend(reviewId);
            } else {
                console.log('Delete cancelled');
            }
        } else {
            // For mobile platforms (iOS/Android), use the React Native Alert
            Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
                {
                    text: 'Cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        deleteReviewFromBackend(reviewId);
                    },
                    style: 'destructive',
                },
            ]);
        }
    };

    // Function to delete review from the backend and update UI
    const deleteReviewFromBackend = async (reviewId: number) => {
        try {
            // Optimistic UI update: Remove the review immediately from the local state
            setReviewsData(prevReviews => prevReviews.filter(review => review.id !== reviewId));

            const response = await axios.delete(`http://localhost:5094/reviews/${reviewId}`);
            if (response.status === 200) {
                fetchReviews();
                Alert.alert('Success', 'Review deleted successfully');
            } else {
                fetchReviews();
                Alert.alert('Error', 'Failed to delete the review');
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            fetchReviews();
            Alert.alert('Error', 'Failed to delete the review');
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.header}>Reviews</Text>

            <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
                <Text style={styles.addButtonText}>Add New Review</Text>
            </TouchableOpacity>

            {reviewsData.map((review) => (
                <View key={review.id} style={styles.card}>
                    <TouchableOpacity
                        onPress={() => handlePress(review.id?.toString() || '')}
                        style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Review #{review.id}</Text>
                        <Text style={styles.cardEmail}>Rating: {review.rating}</Text>
                    </TouchableOpacity>

                    {expanded === review.id?.toString() && (
                        <View style={styles.cardcontent}>
                            <Text style={styles.cardLabel}>Content:</Text>
                            <Text style={styles.cardValue}>{review.content}</Text>

                            <Text style={styles.cardLabel}>Product ID:</Text>
                            <Text style={styles.cardValue}>{review.productId}</Text>

                            <Text style={styles.cardLabel}>Customer ID:</Text>
                            <Text style={styles.cardValue}>{review.customerId}</Text>

                            <View style={styles.cardActions}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleEditReview(review)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.deleteButton]}
                                    onPress={() => handleDeleteReview(review.id!)}>
                                    <Text style={styles.buttonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            ))}

            {/* Modal for editing a review */}
            <Modal visible={isModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Edit Review</Text>

                        <Text style={styles.label}>Content</Text>
                        <TextInput
                            style={styles.input}
                            value={editReview?.content || ''}
                            onChangeText={text => setEditReview(prev => ({ ...prev!, content: text }))}
                        />

                        <Text style={styles.label}>Rating</Text>
                        <TextInput
                            style={styles.input}
                            value={editReview?.rating?.toString() || ''}
                            onChangeText={text => setEditReview(prev => ({ ...prev!, rating: Number(text) }))}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Product ID</Text>
                        <TextInput
                            style={styles.input}
                            value={editReview?.productId?.toString() || ''}
                            onChangeText={text => setEditReview(prev => ({ ...prev!, productId: Number(text) }))}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Customer ID</Text>
                        <TextInput
                            style={styles.input}
                            value={editReview?.customerId?.toString() || ''}
                            onChangeText={text => setEditReview(prev => ({ ...prev!, customerId: Number(text) }))}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.updateButton]}
                                onPress={handleUpdateReview}>
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

            {/* Modal for adding a new review */}
            <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Add New Review</Text>

                        <Text style={styles.label}>Content</Text>
                        <TextInput
                            style={styles.input}
                            value={newReview.content}
                            onChangeText={text => setNewReview(prev => ({ ...prev, content: text }))}
                        />

                        <Text style={styles.label}>Rating</Text>
                        <TextInput
                            style={styles.input}
                            value={newReview.rating === 0 ? '' : newReview.rating.toString()}
                            onChangeText={text => setNewReview(prev => ({ ...prev, rating: Number(text) }))}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Product ID</Text>
                        <TextInput
                            style={styles.input}
                            value={newReview.productId === 0 ? '' : newReview.productId.toString()}
                            onChangeText={text => setNewReview(prev => ({ ...prev, productId: Number(text) }))}
                            keyboardType="numeric"
                        />

                        <Text style={styles.label}>Customer ID</Text>
                        <TextInput
                            style={styles.input}
                            value={newReview.customerId === 0 ? '' : newReview.customerId.toString()}
                            onChangeText={text => setNewReview(prev => ({ ...prev, customerId: Number(text) }))}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.addButton]}
                                onPress={handleAddReview}>
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
    cardcontent: {
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
