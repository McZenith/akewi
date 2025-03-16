import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Explore screen placeholder
const Explore = () => (
  <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Explore Oriki</Text>
      <View style={styles.searchBar}>
        <Text style={styles.placeholderText}>Search bar will appear here</Text>
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoriesContainer}>
        {[1, 2, 3, 4].map(item => (
          <View key={item} style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>Category {item}</Text>
          </View>
        ))}
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#999',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTitle: {
    fontWeight: 'bold',
  },
});

export default Explore;
