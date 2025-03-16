import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import IconButton from '../base/IconButton';
import Text from '../base/Text';
import { useTheme } from '../providers/ThemeProvider';

/**
 * IconButtonExample Component
 * Showcases different variations and features of the IconButton component
 */
const IconButtonExample: React.FC = () => {
  const { theme } = useTheme();
  const [likeCount, setLikeCount] = useState(5);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1">IconButton</Text>
        <Text variant="subtitle1">Icon Button Component Showcase</Text>
      </View>

      {/* Sizes Section */}
      <View style={styles.section}>
        <Text variant="h3">Icon Button Sizes</Text>
        <View style={styles.row}>
          <IconButton
            icon={<Feather name="home" />}
            size="tiny"
            onPress={() => Alert.alert('Tiny IconButton Pressed')}
          />

          <IconButton
            icon={<Feather name="home" />}
            size="small"
            onPress={() => Alert.alert('Small IconButton Pressed')}
          />

          <IconButton
            icon={<Feather name="home" />}
            size="medium"
            onPress={() => Alert.alert('Medium IconButton Pressed')}
          />

          <IconButton
            icon={<Feather name="home" />}
            size="large"
            onPress={() => Alert.alert('Large IconButton Pressed')}
          />
        </View>
      </View>

      {/* Variants Section */}
      <View style={styles.section}>
        <Text variant="h3">Icon Button Variants</Text>
        <View style={styles.row}>
          <IconButton
            icon={<Feather name="settings" />}
            variant="default"
            onPress={() => Alert.alert('Default IconButton Pressed')}
          />

          <IconButton
            icon={<Feather name="settings" />}
            variant="filled"
            onPress={() => Alert.alert('Filled IconButton Pressed')}
          />

          <IconButton
            icon={<Feather name="settings" />}
            variant="outlined"
            onPress={() => Alert.alert('Outlined IconButton Pressed')}
          />

          <IconButton
            icon={<Feather name="settings" />}
            variant="tonal"
            onPress={() => Alert.alert('Tonal IconButton Pressed')}
          />
        </View>
      </View>

      {/* Badges Section */}
      <View style={styles.section}>
        <Text variant="h3">With Badges</Text>
        <View style={styles.row}>
          <IconButton
            icon={<Feather name="heart" />}
            onPress={() => setLikeCount(prev => prev + 1)}
            badge={likeCount}
            badgeColor={theme.colors.primary}
          />

          <IconButton
            icon={<Feather name="bell" />}
            variant="tonal"
            onPress={() => Alert.alert('Notifications')}
            badge={12}
          />

          <IconButton
            icon={<Feather name="shopping-cart" />}
            variant="filled"
            onPress={() => Alert.alert('Shopping Cart')}
            badge={99}
          />
        </View>
      </View>

      {/* Disabled State */}
      <View style={styles.section}>
        <Text variant="h3">Disabled State</Text>
        <View style={styles.row}>
          <IconButton
            icon={<Feather name="trash-2" />}
            disabled
            onPress={() => Alert.alert('This should not appear')}
          />

          <IconButton
            icon={<Feather name="trash-2" />}
            variant="filled"
            disabled
            onPress={() => Alert.alert('This should not appear')}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 12,
    marginBottom: 8,
  },
});

export default IconButtonExample;
