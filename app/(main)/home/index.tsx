import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Home screen placeholder
const Home = () => (
  <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.greeting}>Welcome to Akewi</Text>
      <Text style={styles.subtitle}>Discover and enjoy Yoruba Oriki</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Featured Oriki</Text>
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderText}>Featured content will appear here</Text>
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Popular Oriki</Text>
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderText}>Popular content will appear here</Text>
      </View>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderText}>Categories will appear here</Text>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  placeholderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderText: {
    color: '#999',
  },
});

export default Home;
