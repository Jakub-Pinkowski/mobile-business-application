import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import axios from 'axios';

interface NewsItem {
  id?: number;
  title: string;
  description: string;
  date: string;
}

export default function NewsScreen() {
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editNewsItem, setEditNewsItem] = useState<NewsItem | null>(null);
  const [newNewsItem, setNewNewsItem] = useState<NewsItem>({
    title: '',
    description: '',
    date: new Date().toISOString(),
  });

  // Fetch news items from the backend
  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5094/news');
      setNewsData(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handlePress = (newsId: string) => {
    setExpanded(prev => (prev === newsId ? null : newsId));
  };

  // Handle Edit News Item
  const handleEditNewsItem = (newsItem: NewsItem) => {
    setEditNewsItem(newsItem);
    setIsModalVisible(true);
  };

  // Handle Update News Item
  const handleUpdateNewsItem = async () => {
    if (editNewsItem) {
      const updatedNewsItem = {
        ...editNewsItem,
        // Ensure we update the date as it's a fixed value
        date: new Date().toISOString(),
      };

      try {
        const response = await axios.put(`http://localhost:5094/news/${editNewsItem.id}`, updatedNewsItem);
        if (response.status === 200) {
          // Optimistically update the UI (Update the news item in the state)
          const updatedNews = newsData.map(newsItem =>
            newsItem.id === editNewsItem.id ? updatedNewsItem : newsItem
          );
          setNewsData(updatedNews);
          setIsModalVisible(false);
          setEditNewsItem(null);
          Alert.alert('Success', 'News item updated successfully');
        } else {
          Alert.alert('Error', 'Failed to update the news item');
        }
      } catch (error) {
        console.error('Error updating news item:', error);
        Alert.alert('Error', 'Failed to update the news item');
      }
    }
  };

  // Handle Add News Item
  const handleAddNewsItem = async () => {
    if (!newNewsItem.title || !newNewsItem.description) {
      Alert.alert('Missing Fields', 'Please fill in all fields before adding a news item.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5094/news', newNewsItem);
      setNewsData(prevNews => [...prevNews, response.data]);
      setIsAddModalVisible(false);
      setNewNewsItem({
        title: '',
        description: '',
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error adding news item:', error);
      Alert.alert('Error', 'Failed to add the news item');
    }
  };

  // Handle Delete News Item
  const handleDeleteNewsItem = (newsId: number) => {
    if (typeof window !== 'undefined') {
      const confirmation = window.confirm('Are you sure you want to delete this news item?');
      if (confirmation) {
        deleteNewsFromBackend(newsId);
      } else {
        console.log('Delete cancelled');
      }
    } else {
      Alert.alert('Delete News Item', 'Are you sure you want to delete this news item?', [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            deleteNewsFromBackend(newsId);
          },
          style: 'destructive',
        },
      ]);
    }
  };

  // Function to delete news item from the backend and update UI
  const deleteNewsFromBackend = async (newsId: number) => {
    try {
      setNewsData(prevNews => prevNews.filter(newsItem => newsItem.id !== newsId));

      const response = await axios.delete(`http://localhost:5094/news/${newsId}`);
      if (response.status === 200) {
        fetchNews();
        Alert.alert('Success', 'News item deleted successfully');
      } else {
        fetchNews();
        Alert.alert('Error', 'Failed to delete the news item');
      }
    } catch (error) {
      console.error('Error deleting news item:', error);
      fetchNews();
      Alert.alert('Error', 'Failed to delete the news item');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>News</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setIsAddModalVisible(true)}>
        <Text style={styles.addButtonText}>Add New News Item</Text>
      </TouchableOpacity>

      {newsData.map((newsItem) => (
        <View key={newsItem.id} style={styles.card}>
          <TouchableOpacity
            onPress={() => handlePress(newsItem.id?.toString() || '')}
            style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{newsItem.title}</Text>
          </TouchableOpacity>

          {expanded === newsItem.id?.toString() && (
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Description:</Text>
              <Text style={styles.cardValue}>{newsItem.description}</Text>

              <Text style={styles.cardLabel}>Date:</Text>
              <Text style={styles.cardValue}>{newsItem.date}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleEditNewsItem(newsItem)}>
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDeleteNewsItem(newsItem.id!)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}

      {/* Modal for editing a news item */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit News Item</Text>

            {/* Title Field */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={editNewsItem?.title || ''}
              onChangeText={text => setEditNewsItem(prev => ({ ...prev!, title: text }))}
            />

            {/* Description Field */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={editNewsItem?.description || ''}
              onChangeText={text => setEditNewsItem(prev => ({ ...prev!, description: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={handleUpdateNewsItem}>
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

      {/* Modal for adding a new news item */}
      <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New News Item</Text>

            {/* Title Field */}
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={newNewsItem.title}
              onChangeText={text => setNewNewsItem(prev => ({ ...prev, title: text }))}
            />

            {/* Description Field */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={newNewsItem.description}
              onChangeText={text => setNewNewsItem(prev => ({ ...prev, description: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.updateButton]}
                onPress={handleAddNewsItem}>
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
  cardContent: {
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
