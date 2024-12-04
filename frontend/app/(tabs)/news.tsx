import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

// Define the type for a news ite
interface NewsItem {
  id: number; 
  title: string;
  description: string;
  date: string; 
}

export default function NewsScreen() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  // Fetch news from the backend
  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5094/news');
      setNewsData(response.data); // Populate state with the fetched news data
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchNews(); // Fetch news on component mount
  }, []);

  const renderNewsItem = ({ item }: { item: NewsItem }) => (
    <View style={styles.newsTile}>
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDate}>{item.date}</Text>
      <Text style={styles.newsDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Company News</Text>
      <FlatList
        data={newsData}
        renderItem={renderNewsItem}
        keyExtractor={(item: NewsItem) => item.id.toString()} // Convert ID to string
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
  newsTile: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  newsDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    color: '#555',
  },
});
