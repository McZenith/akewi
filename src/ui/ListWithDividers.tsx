import React from 'react';
import { View, StyleSheet } from 'react-native';
import OrikiItem from './OrikiItem';

interface ListItem {
  title: string;
  subtitle: string;
}

interface ListWithDividersProps {
  items: ListItem[];
  dark?: boolean;
}

export default function ListWithDividers({ items, dark }: Readonly<ListWithDividersProps>) {
  return (
    <View style={[styles.listContainer, dark && styles.darkListContainer]}>
      {items.map((item, index) => (
        <View key={index}>
          <OrikiItem title={item.title} subtitle={item.subtitle} dark={dark} />
          {index < items.length - 1 && (
            <View style={[styles.divider, dark && styles.darkDivider]} />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 18,
    marginHorizontal: 16,
  },
  darkListContainer: {
    backgroundColor: '#1C1C1E',
  },
  divider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  darkDivider: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});
