import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Colors } from '@/constants/Colors';

interface Tag {
    id: number;
    name: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    categoryId: number;
    supplierId: number;
}

interface ProductTag {
    id: number;
    productId: number;
    tagId: number;
}

interface JoinedProduct {
    id: number;
    name: string;
    price: number;
    description: string;
    tags: Tag[];
}

export default function ProductTagSummary() {
    const [products, setProducts] = useState<Product[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [productTags, setProductTags] = useState<ProductTag[]>([]);
    const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, tagsRes, productTagsRes] = await Promise.all([
                    axios.get<Product[]>('http://localhost:5094/products'),
                    axios.get<Tag[]>('http://localhost:5094/tags'),
                    axios.get<ProductTag[]>('http://localhost:5094/producttags'),
                ]);
                setProducts(productsRes.data);
                setTags(tagsRes.data);
                setProductTags(productTagsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const getJoinedData = (): JoinedProduct[] => {
        return products.map(product => {
            // Find the tags associated with each product using productTags
            const associatedTags = productTags
                .filter(pt => pt.productId === product.id)
                .map(pt => tags.find(tag => tag.id === pt.tagId))
                .filter(tag => tag !== undefined) as Tag[];

            return {
                ...product,
                tags: associatedTags,
            };
        });
    };

    const toggleExpand = (productId: number) => {
        setExpandedProductId(prevId => (prevId === productId ? null : productId));
    };

    const joinedData = getJoinedData();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Product Tag Summary</Text>
            {joinedData.map(product => (
                <View key={product.id} style={styles.card}>
                    <TouchableOpacity onPress={() => toggleExpand(product.id)}>
                        <Text style={styles.cardHeader}>{product.name}</Text>
                    </TouchableOpacity>

                    {expandedProductId === product.id && (
                        <View style={styles.expandedContent}>
                            <Text style={styles.cardPrice}>Price: ${product.price.toFixed(2)}</Text>
                            <Text style={styles.cardDescription}>{product.description}</Text>
                            <View style={styles.tagsContainer}>
                                <Text style={styles.cardTagsHeader}>Tags:</Text>
                                {product.tags.length > 0 ? (
                                    product.tags.map(tag => (
                                        <Text key={tag.id} style={styles.tag}>{tag.name}</Text>
                                    ))
                                ) : (
                                    <Text style={styles.noTags}>No tags available</Text>
                                )}
                            </View>
                        </View>
                    )}
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
    tagsContainer: {
        marginTop: 8,
    },
    cardTagsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    tag: {
        fontSize: 14,
        color: '#333',
    },
    expandedContent: {
        marginTop: 8,
    },
    noTags: {
        fontSize: 14,
        color: '#888',
    },
});
