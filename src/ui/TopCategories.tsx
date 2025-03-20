import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

// Sample categories data
const CATEGORIES = [
  {
    id: 'regional',
    title: 'Oriki Orílẹ̀-èdè',
    subtitle: 'Community/Regional Oriki',
    count: '40+',
    backgroundColor: '#1C1C1E',
    textColor: '#FFFFFF',
  },
  {
    id: 'deity',
    title: 'Oriki Ọlọ́run/Ọ̀rìṣà',
    subtitle: 'Deity Oriki',
    count: '80+',
    backgroundColor: '#313131',
    textColor: '#FFFFFF',
  },
  {
    id: 'child',
    title: 'Oriki Ọmọ',
    subtitle: 'Child Oriki',
    count: '90+',
    backgroundColor: '#7A7A7A',
    textColor: '#FFFFFF',
  },
  {
    id: 'ethnic',
    title: 'Ethnic Group Oriki',
    subtitle: 'Community/Regional Oriki',
    count: '30+',
    backgroundColor: '#E0E0E0',
    textColor: '#000000',
  },
  {
    id: 'cultural',
    title: 'Oriki Ọ̀rọ̀ Àṣà',
    subtitle: 'Cultural Event Oriki',
    count: '20+',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
];

interface CategoryCardProps {
  title: string;
  subtitle: string;
  count: string;
  backgroundColor: string;
  textColor: string;
  index: number;
}

const CategoryCard = ({
  title,
  subtitle,
  count,
  backgroundColor,
  textColor,
  index,
}: Readonly<CategoryCardProps>) => (
  <Link href={`/categories/${encodeURIComponent(title)}`} asChild>
    <Pressable
      style={[
        styles.categoryCard,
        {
          backgroundColor,
          marginTop: index > 0 ? index * -65 : 0,
          zIndex: 5 - index,
        },
      ]}
      activeOpacity={0.9}
    >
      <View style={styles.categoryContent}>
        <View style={styles.categoryActions}>
          <View style={styles.actionButton}>
            <Feather name="book-open" size={20} color={textColor} style={{ opacity: 0.6 }} />
          </View>

          <View style={styles.actionButton}>
            <Feather name="play-circle" size={20} color={textColor} style={{ opacity: 0.6 }} />
          </View>
        </View>

        <View style={styles.categoryTextContainer}>
          <Text style={[styles.categoryTitle, { color: textColor }]}>{title}</Text>
          <Text style={[styles.categorySubtitle, { color: textColor }]}>{subtitle}</Text>
        </View>
      </View>

      <Text style={[styles.categoryCount, { color: textColor }]}>{count}</Text>
    </Pressable>
  </Link>
);

export default function TopCategories() {
  return (
    <View style={styles.container}>
      {CATEGORIES.map((category, index) => (
        <CategoryCard
          key={category.id}
          title={category.title}
          subtitle={category.subtitle}
          count={category.count}
          backgroundColor={category.backgroundColor}
          textColor={category.textColor}
          index={index}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  categoryCard: {
    height: 120,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: -50,
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTextContainer: {
    alignItems: 'flex-end',
    width: 161,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: Platform.select({
      ios: 'Inter-SemiBold',
      android: 'Inter-SemiBold',
    }),
    textAlign: 'right',
  },
  categorySubtitle: {
    fontSize: 12,
    fontFamily: Platform.select({
      ios: 'Inter-SemiBold',
      android: 'Inter-SemiBold',
    }),
    textAlign: 'right',
    opacity: 0.7,
  },
  categoryCount: {
    fontSize: 80,
    fontFamily: Platform.select({
      ios: 'Inter-SemiBold',
      android: 'Inter-SemiBold',
    }),
    textAlign: 'right',
  },
});
