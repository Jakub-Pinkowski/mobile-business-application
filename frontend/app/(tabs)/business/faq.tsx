import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Animated } from 'react-native';
import { Colors } from '@/constants/Colors'; // Assuming your color constants are imported here
import { MaterialIcons } from '@expo/vector-icons';

type FaqItem = {
    Id: number;
    Question: string;
    Answer: string;
};

const faqData: FaqItem[] = [
    { Id: 1, Question: "What is your return policy?", Answer: "Our return policy allows you to return products within 30 days of purchase." },
    { Id: 2, Question: "Do you offer international shipping?", Answer: "Yes, we offer international shipping to many countries. Shipping fees may vary." },
    { Id: 3, Question: "How can I track my order?", Answer: "You can track your order using the tracking number provided in your order confirmation email." },
    { Id: 4, Question: "What payment methods do you accept?", Answer: "We accept various payment methods including credit cards, PayPal, and bank transfers." },
    { Id: 5, Question: "How can I contact customer support?", Answer: "You can contact our customer support through the contact form on our website or by calling our support hotline." },
];

export default function FaqPage() {
    const [expanded, setExpanded] = useState<number | null>(null); 
    const [height, setHeight] = useState<{ [key: number]: Animated.Value }>({}); 

    const toggleAnswer = (id: number) => {
        if (expanded === id) {
            setExpanded(null); 
        } else {
            setExpanded(id); 
        }
    };

    const renderItem = ({ item }: { item: FaqItem }) => {
        const isExpanded = expanded === item.Id;

        // Set up animated height for answer visibility
        if (!height[item.Id]) {
            height[item.Id] = new Animated.Value(0);
        }

        Animated.timing(height[item.Id], {
            toValue: isExpanded ? 100 : 0, 
            duration: 300,
            useNativeDriver: false,
        }).start();

        return (
            <View style={styles.faqItem}>
                <TouchableOpacity onPress={() => toggleAnswer(item.Id)} style={styles.questionContainer}>
                    <Text style={styles.question}>{item.Question}</Text>
                    <MaterialIcons
                        name={isExpanded ? 'expand-less' : 'expand-more'}
                        size={24}
                        color={Colors.light.primary}
                    />
                </TouchableOpacity>
                <Animated.View style={[styles.answerContainer, { height: height[item.Id] }]}>
                    {isExpanded && <Text style={styles.answer}>{item.Answer}</Text>}
                </Animated.View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Frequently Asked Questions</Text>
            <FlatList
                data={faqData}
                keyExtractor={(item) => item.Id.toString()}
                renderItem={renderItem}
                style={styles.faqList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primary,
        textAlign: 'center',
        marginBottom: 20,
    },
    faqList: {
        marginTop: 10,
    },
    faqItem: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        padding: 16,
    },
    questionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.text,
        flex: 1,
    },
    answerContainer: {
        overflow: 'hidden',
        paddingTop: 10,
    },
    answer: {
        fontSize: 14,
        color: '#555',
        fontStyle: 'italic',
    },
});
