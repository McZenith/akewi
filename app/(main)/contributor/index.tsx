import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Contributor screen placeholder
const Contributor = () => (
  <ScrollView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>My Contributions</Text>
    </View>

    <View style={styles.section}>
      <TouchableOpacity style={styles.shareCard}>
        <Text style={styles.shareCardTitle}>Share an Oriki</Text>
        <Text style={styles.shareCardText}>
          Share your knowledge and help preserve Yoruba cultural heritage
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>My Contributions</Text>
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>Your contributions will appear here</Text>
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
  },
  section: {
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  shareCard: {
    backgroundColor: '#C73D10',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shareCardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  shareCardText: {
    color: '#fff',
    opacity: 0.9,
  },
  emptyState: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyStateText: {
    color: '#999',
    textAlign: 'center',
  },
});

export default Contributor;
