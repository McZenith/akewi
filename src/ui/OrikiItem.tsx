import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface OrikiItemProps {
  title: string;
  subtitle: string;
  showEditButton?: boolean;
  dark?: boolean;
  onPress?: () => void;
}

export default function OrikiItem({ 
  title, 
  subtitle, 
  showEditButton,
  dark,
  onPress 
}: Readonly<OrikiItemProps>) {
  return (
    <Link href="/stream" asChild>
      <Pressable 
        style={({ pressed }) => [
          styles.container,
          dark && styles.darkContainer,
          pressed && styles.pressed
        ]}
      >
        <View style={[styles.innerContainer, dark && styles.darkInnerContainer]}>
          <View style={[styles.avatar, dark && styles.darkAvatar]}>
            <Text style={styles.avatarText}>
              {title.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.content}>
            <Text style={[styles.title, dark && styles.darkTitle]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.subtitle, dark && styles.darkSubtitle]} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>

          <View style={styles.controls}>
            <View style={[styles.iconWrapper, dark && styles.darkIconWrapper]}>
              <Feather 
                name="book-open" 
                size={20} 
                color={dark ? "rgba(255, 255, 255, 0.6)" : "#666"} 
              />
            </View>
            <View style={[styles.iconWrapper, styles.primaryIconWrapper]}>
              {showEditButton ? (
                <Feather name="edit-2" size={20} color="#fff" />
              ) : (
                <Feather name="play-circle" size={20} color="#fff" />
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  darkContainer: {
    backgroundColor: '#222',
    ...Platform.select({
      ios: {
        shadowOpacity: 0.2,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.995 }],
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  darkInnerContainer: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkAvatar: {
    backgroundColor: 'rgba(255, 69, 0, 0.8)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Ojuju-SemiBold',
      android: 'Ojuju-SemiBold',
    }),

  },
  content: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  darkTitle: {
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  darkSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginLeft: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  primaryIconWrapper: {
    backgroundColor: '#FF4500',
  },
}); 