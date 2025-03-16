import { View, Text, StyleSheet } from 'react-native';

// Login screen placeholder
const Login = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Login Screen</Text>
    <Text style={styles.subtitle}>This is a placeholder for the login screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Login;
