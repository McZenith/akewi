---
description: Expo best practices for the Akewi application
globs: ["**/*.tsx", "**/*.ts", "app.json"]
---

# Expo Best Practices

## Expo Router

Akewi uses Expo Router for file-based navigation. Follow these guidelines:

### File Structure

- Use file-based routing in the `app/` directory
- Group related routes using parentheses (`(auth)`, `(main)`)
- Use `_layout` files for defining layouts for route groups
- Use `index.tsx` for the main screen of a route
- Use `[param].tsx` for dynamic routes

```
app/
├── _layout.tsx           # Root layout
├── index.tsx             # Entry point 
├── (auth)/               # Auth group
│   ├── _layout.tsx       # Auth layout
│   ├── login.tsx
│   └── verification.tsx
└── (main)/               # Main app group
    ├── _layout.tsx       # Main layout with tabs
    ├── home/
    │   ├── index.tsx
    │   └── [id].tsx      # Dynamic route
    └── profile.tsx
```

### Navigation

Use the hooks provided by Expo Router for navigation:

```typescript
import { useRouter, useLocalSearchParams } from 'expo-router';

export const MyScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const navigateToDetails = () => {
    router.push(`/details/${itemId}`);
  };
  
  return (
    // Component content
  );
};
```

### Deep Linking

Configure deep linking in `app.json`:

```json
{
  "expo": {
    "scheme": "akewi",
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "akewi"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## Expo Modules

### Asset Loading

Load assets using Expo's asset system:

```typescript
import { Image } from 'react-native';
import { Asset } from 'expo-asset';

// Preload assets
const cacheImages = async () => {
  const images = [
    require('../assets/images/logo.png'),
    require('../assets/images/background.jpg'),
  ];
  
  const cachePromises = images.map(image => Asset.fromModule(image).downloadAsync());
  return Promise.all(cachePromises);
};
```

### Font Loading

Load fonts with Expo Font:

```typescript
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while loading assets
SplashScreen.preventAutoHideAsync();

export const App = () => {
  const [fontsLoaded] = useFonts({
    'CustomFont-Regular': require('../assets/fonts/CustomFont-Regular.ttf'),
    'CustomFont-Bold': require('../assets/fonts/CustomFont-Bold.ttf'),
  });
  
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  
  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <View onLayout={onLayoutRootView}>
      {/* App content */}
    </View>
  );
};
```

### Permissions

Request permissions using Expo's permission system:

```typescript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  // Request permission
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (permissionResult.granted === false) {
    alert('Permission to access camera roll is required!');
    return;
  }
  
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  
  if (!result.canceled) {
    // Handle selected image
  }
};
```

## Audio Implementation

Use Expo AV for audio playback:

```typescript
import { Audio } from 'expo-av';

export const useAudioPlayer = (audioUri: string) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const loadAudio = async () => {
    try {
      // Unload any existing sound
      if (sound) {
        await sound.unloadAsync();
      }
      
      // Load the audio file
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
    } catch (error) {
      console.error('Error loading audio', error);
    }
  };
  
  const onPlaybackStatusUpdate = (status: Audio.PlaybackStatus) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };
  
  const playPause = async () => {
    if (!sound) return;
    
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };
  
  // Remember to unload sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);
  
  useEffect(() => {
    loadAudio();
  }, [audioUri]);
  
  return {
    isPlaying,
    position,
    duration,
    playPause,
    // Add more functions as needed
  };
};
```

## Performance Optimization

### Image Optimization

Use appropriate image formats and sizes:

```typescript
import { Image } from 'react-native';

// Use resizeMode='cover' for background images
<Image 
  source={require('../assets/images/background.jpg')} 
  style={styles.backgroundImage} 
  resizeMode="cover" 
/>

// Use cached images for frequently used assets
import { Image } from 'react-native';
import { Asset } from 'expo-asset';

const cachedImage = Asset.fromModule(require('../assets/images/logo.png')).uri;

<Image source={{ uri: cachedImage }} style={styles.logo} />
```

### Memory Management

Handle memory efficiently:

- Use `useCallback` and `useMemo` for expensive operations
- Unsubscribe from listeners in useEffect cleanup
- Release resources (like audio players) when not needed

```typescript
// Clean up resources in useEffect
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  
  return () => {
    subscription.remove();
  };
}, []);
```

## Expo Updates

Configure over-the-air updates:

```json
// app.json
{
  "expo": {
    "updates": {
      "enabled": true,
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/your-project-id"
    }
  }
}
```

Check for updates in your app:

```typescript
import * as Updates from 'expo-updates';

const checkForUpdates = async () => {
  try {
    const update = await Updates.checkForUpdateAsync();
    
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    // Handle error
    console.error('Error checking for updates', error);
  }
};
```

## Development Workflow

### Environment Configuration

Use environment configuration for different environments:

```typescript
// app.config.js
export default ({ config }) => {
  return {
    ...config,
    extra: {
      apiUrl: process.env.API_URL || 'https://dev-api.akewi.com',
      environment: process.env.ENV || 'development',
    },
  };
};
```

Access environment variables:

```typescript
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;
```

### Error Handling

Set up error boundaries for handling runtime errors:

```typescript
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <View style={styles.errorContainer}>
    <Text style={styles.errorTitle}>Something went wrong</Text>
    <Text style={styles.errorMessage}>{error.message}</Text>
    <Button title="Try again" onPress={resetErrorBoundary} />
  </View>
);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppContent />
    </ErrorBoundary>
  );
}
```

## Expo EAS Build

Use EAS Build for building production apps:

```json
// eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  }
}
```

## Best Practices

1. Use Expo SDK features instead of third-party libraries when possible
2. Follow the file-based routing pattern for navigation
3. Properly manage assets and fonts with Expo's asset system
4. Handle permissions appropriately
5. Optimize images and other assets
6. Set up proper error boundaries
7. Configure environment-specific settings
8. Use EAS for building and deploying your app 