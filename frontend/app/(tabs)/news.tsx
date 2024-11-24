import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';

// Define the type for a news item
interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

const newsData: NewsItem[] = [
  {
    id: '1',
    title: 'New Office Opening',
    description: 'Our company has officially inaugurated a new office in downtown New York. This state-of-the-art facility is designed to enhance collaboration, foster innovation, and provide a comfortable workspace for all our employees. We look forward to hosting many successful meetings and events here.',
    date: 'Nov 20, 2024',
  },
  {
    id: '2',
    title: 'Quarterly Revenue Report',
    description: 'We are thrilled to announce that we achieved record-breaking revenues in the fourth quarter of this year! Thanks to the hard work and dedication of our team, we surpassed all projections, setting a strong foundation for continued growth in the coming year. Detailed insights will be shared during our next town hall.',
    date: 'Nov 18, 2024',
  },
  {
    id: '3',
    title: 'Employee of the Month',
    description: 'A big congratulations to Jane Doe for being awarded Employee of the Month! Her outstanding performance, commitment to excellence, and ability to go above and beyond have made a remarkable impact. Jane has set a stellar example for all of us, and we’re lucky to have her on the team!',
    date: 'Nov 15, 2024',
  },
];


export default function NewsScreen() {
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
        keyExtractor={(item: NewsItem) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
