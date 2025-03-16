# Akewi App - Architecture & Structure

## Folder Structure

```
src/
├── app/                      # Expo Router file-based routing
│   ├── _layout.tsx           # Root layout with providers
│   ├── index.tsx             # Entry point / splash redirector
│   ├── (auth)/               # Authentication group
│   │   ├── _layout.tsx       # Auth layout with no bottom tabs
│   │   ├── login.tsx         # Login screen
│   │   ├── verification.tsx  # Verification screen
│   │   └── user-details.tsx  # User details form
│   ├── (main)/               # Main app group (authenticated)
│   │   ├── _layout.tsx       # Main layout with bottom tabs
│   │   ├── home/             # Home tab
│   │   │   ├── index.tsx     # Home screen
│   │   │   └── [id].tsx      # Dynamic oriki detail route
│   │   ├── explore/          # Explore tab
│   │   │   ├── index.tsx     # All categories screen
│   │   │   ├── search.tsx    # Search results
│   │   │   └── [category].tsx# Category detail screen
│   │   └── contributor/      # Contributor tab
│   │       ├── index.tsx     # Contributions list
│   │       ├── share.tsx     # Share oriki form
│   │       └── edit/[id].tsx # Edit oriki screen
│   ├── profile/              # Profile screens
│   │   └── edit.tsx          # Edit profile screen
│   ├── player/               # Audio player screens
│   │   └── [id].tsx          # Full-screen player
│   └── sync/                 # Lyrics synchronization
│       ├── [id].tsx          # Sync screen
│       └── preview/[id].tsx  # Sync preview screen
├── components/               # Reusable components
│   ├── base/                 # Base UI components
│   │   ├── Button.tsx        # Button component
│   │   ├── Text.tsx          # Text component with variants
│   │   ├── Input.tsx         # Input component
│   │   └── ...
│   ├── forms/                # Form-related components
│   │   ├── FormInput.tsx     # Form input with label
│   │   ├── SelectInput.tsx   # Dropdown select
│   │   ├── SaveButton.tsx    # Form submission button
│   │   └── ...
│   ├── media/                # Media-related components
│   │   ├── AudioPlayer.tsx   # Audio playback component
│   │   ├── AudioWaveform.tsx # Audio visualization
│   │   ├── CircularProgress.tsx # Circular progress indicator
│   │   └── ...
│   ├── user/                 # User-related components
│   │   ├── ProfileAvatar.tsx # User avatar display
│   │   ├── ProfileImageEditor.tsx # Profile image editor
│   │   ├── StatBadge.tsx     # Statistics badge for profile
│   │   └── ...
│   ├── oriki/                # Oriki-specific components
│   │   ├── OrikiItem.tsx     # Oriki list item
│   │   ├── CategoryCard.tsx  # Category display card
│   │   ├── LyricsDisplay.tsx # Lyrics display component
│   │   └── ...
│   ├── layout/               # Layout components
│   │   ├── Header.tsx        # Screen header
│   │   ├── BottomTabs.tsx    # Custom bottom tabs
│   │   ├── KeyboardAware.tsx # Keyboard-aware wrapper
│   │   └── ...
│   └── modals/               # Modal components
│       ├── LanguageModal.tsx # Language selection modal
│       ├── UserProfileModal.tsx # User profile modal
│       └── ...
├── hooks/                    # Custom React hooks
│   ├── useAudio.ts           # Audio playback hook
│   ├── useForm.ts            # Form management
│   ├── useLanguage.ts        # Language utilities
│   └── ...
├── store/                    # Redux state management
│   ├── index.ts              # Store configuration
│   ├── middleware.ts         # Redux middleware
│   ├── slices/               # Redux slices
│   │   ├── authSlice.ts      # Authentication state
│   │   ├── userSlice.ts      # User profile state
│   │   ├── contentSlice.ts   # Content/oriki state
│   │   ├── audioSlice.ts     # Audio playback state
│   │   └── settingsSlice.ts  # App settings
│   └── selectors/            # Reselect selectors
│       ├── userSelectors.ts  # User-related selectors
│       └── ...
├── services/                 # API and external services
│   ├── api/                  # API clients
│   │   ├── client.ts         # Base API client
│   │   ├── authApi.ts        # Auth endpoints
│   │   ├── orikiApi.ts       # Oriki content endpoints
│   │   ├── userApi.ts        # User profile endpoints
│   │   └── ...
│   ├── audio/                # Audio services
│   │   ├── player.ts         # Audio player service
│   │   ├── recorder.ts       # Audio recording service
│   │   └── waveform.ts       # Waveform generation
│   └── storage/              # Local storage services
│       ├── secureStorage.ts  # Secure storage utilities
│       └── asyncStorage.ts   # General storage utilities
├── utils/                    # Utility functions
│   ├── formatters.ts         # Text/date formatting
│   ├── validation.ts         # Input validation
│   ├── animations.ts         # Animation utilities
│   └── ...
├── constants/                # App constants
│   ├── theme.ts              # Design system theme
│   ├── routes.ts             # Route names
│   ├── apiPaths.ts           # API endpoint paths
│   └── ...
├── assets/                   # Static assets
│   ├── images/               # Image files
│   ├── icons/                # Icon files
│   ├── fonts/                # Custom fonts
│   └── dummy/                # Mock data files
└── i18n/                     # Internationalization
    ├── index.ts              # i18n setup
    ├── en.json               # English translations
    └── yo.json               # Yoruba translations
```

## Architecture Pattern: Clean Architecture with MVVM

We'll implement a Clean Architecture approach with MVVM presentation pattern for the Akewi app:

### Layers:

1. **Presentation Layer (UI/View)**: React components, screens, UI logic
2. **Presentation Logic (ViewModel)**: Redux slices, React hooks, UI state
3. **Domain Layer**: Business logic, use cases, entities
4. **Data Layer**: Repository implementations, API clients, storage

### Benefits:

- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Easy to write unit tests for each layer
- **Flexibility**: Switch out implementations without affecting other layers
- **Maintainability**: Organized codebase with clear boundaries

### Implementation Example:

```typescript
// Domain Entity
export interface User {
  id: string;
  name: string;
  state: string;
  town: string;
  family: string | null;
  // ...other properties
}

// Domain Use Case
export class GetUserProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  execute(userId: string): Promise<User> {
    return this.userRepository.getUserProfile(userId);
  }
}

// Data Repository Interface (Domain)
export interface UserRepository {
  getUserProfile(userId: string): Promise<User>;
  updateUserProfile(userId: string, data: Partial<User>): Promise<User>;
  // ...other methods
}

// Data Repository Implementation
export class UserRepositoryImpl implements UserRepository {
  constructor(private apiClient: ApiClient) {}

  async getUserProfile(userId: string): Promise<User> {
    try {
      const response = await this.apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }

  // ...other methods
}

// View Model (Redux Slice)
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // state mutations using Immer
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading.profile = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.profile = action.payload;
      })
      // ...other cases
  }
});

// Component (View)
const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const { profile, loading } = useAppSelector(selectUserProfile);

  useEffect(() => {
    dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  if (loading.profile) {
    return <LoadingSpinner />;
  }

  return (
    <View>
      <ProfileHeader name={profile.name} />
      {/* Rest of UI */}
    </View>
  );
};
```

## State Management

### Redux Store Structure

```typescript
interface RootState {
  // Authentication state
  auth: {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    authMethod: 'email' | 'phone' | 'social' | null;
    verificationId: string | null;
  };

  // User profile state
  user: {
    profile: {
      id: string;
      name: string;
      state: string;
      town: string;
      family: string | null;
      profileImage: string | null;
      preferredLanguage: 'english' | 'yoruba';
      isProfileComplete: boolean;
    };
    stats: {
      contributions: number;
      streams: number;
      lastContribution: string | null;
    };
    loading: {
      profile: boolean;
      stats: boolean;
      updateProfile: boolean;
    };
    error: {
      profile: string | null;
      stats: string | null;
      updateProfile: string | null;
    };
  };

  // Content state
  content: {
    featured: OrikiContent[];
    popular: OrikiContent[];
    recent: OrikiContent[];
    categories: Category[];
    userFavorites: string[]; // IDs of favorited items
    userHistory: Array<{ id: string; timestamp: number }>;
    userContributions: {
      items: OrikiContent[];
      byDate: Record<string, string[]>; // Date string to array of IDs
      loading: boolean;
      error: string | null;
      justAdded: string | null; // ID of most recently added contribution
      submissionState: {
        isSubmitting: boolean;
        progress: number; // For submission progress (0-100)
        error: string | null;
        success: boolean;
        lastSubmittedId: string | null;
      };
    };
    search: {
      query: string;
      results: OrikiContent[];
      totalResults: number;
      loading: boolean;
      error: string | null;
      lastSearches: string[]; // Recent search terms
    };
    loading: {
      featured: boolean;
      popular: boolean;
      recent: boolean;
      categories: boolean;
    };
    error: string | null;
  };

  // Audio playback state
  audio: {
    currentlyPlaying: string | null; // ID of currently playing oriki
    isPlaying: boolean;
    duration: number;
    currentPosition: number;
    volume: number;
    repeat: 'none' | 'one' | 'all';
    queue: string[]; // IDs in queue
    isPlayerMinimized: boolean;
    isPlayerVisible: boolean;
    currentLyricIndex: {
      yoruba: number | null;
      english: number | null;
    };
    loadingStatus: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
  };

  // App settings
  settings: {
    language: 'english' | 'yoruba';
    theme: 'light' | 'dark' | 'system';
    audioEnabled: boolean;
    textSize: 'small' | 'medium' | 'large';
    notifications: boolean;
    autoplay: boolean;
  };
}
```

### State Management Best Practices

1. **Redux Toolkit** for Redux state management
2. **Reselect** for memoized selectors
3. **Thunks** for async operations
4. **Immer** (built into Redux Toolkit) for immutable updates
5. **React Context** for theme and localization
6. **Local Component State** for UI-specific state
7. **React Query** for server data caching and synchronization

## Animation and Transition Strategy

### Key Animation Areas

1. **Screen Transitions**

   - Use Reanimated and Expo Router for smooth screen transitions
   - Implement custom transitions for modal screens
   - Apply shared element transitions for Oriki item → detail view

2. **Micro-interactions**

   - Button press feedback with scale animation
   - Form field focus/blur animations
   - Error message fade-in
   - Success checkmark animations

3. **Content Loading**

   - Skeleton loading animations for content cards
   - Staggered loading for list items
   - Fade-in animations for content appearing

4. **Audio Player**

   - Smooth expansion/collapse of the minimized player
   - Circular progress animation for playback
   - Waveform visualization animations
   - Audio play/pause button morph animation

5. **Lyrics Synchronization**

   - Smooth scrolling of lyrics text
   - Highlight transitions for active lyrics
   - Draggable markers with elastic feedback
   - Progress indicator animations

6. **Language Toggle**

   - Smooth language switch animation
   - Text fade-out/fade-in during language change
   - Radio button selection animation

7. **User Profile Modal**
   - Modal slide-up/slide-down animation
   - Stats counter animations
   - Profile image fade-in

### Animation Implementation Guidelines

```typescript
// Animation Constants
const ANIMATION_CONFIG = {
  DURATION: {
    SHORT: 150,
    MEDIUM: 300,
    LONG: 500,
  },
  EASING: {
    DEFAULT: Easing.bezier(0.25, 0.1, 0.25, 1),
    BOUNCE: Easing.bezier(0.68, -0.55, 0.27, 1.55),
    LINEAR: Easing.linear,
  },
};

// Animation Utilities
const fadeIn = (animValue, duration = ANIMATION_CONFIG.DURATION.MEDIUM) => {
  return Animated.timing(animValue, {
    toValue: 1,
    duration,
    easing: ANIMATION_CONFIG.EASING.DEFAULT,
    useNativeDriver: true,
  });
};

const scalePress = (animValue, toValue = 0.95, duration = ANIMATION_CONFIG.DURATION.SHORT) => {
  return Animated.timing(animValue, {
    toValue,
    duration,
    easing: ANIMATION_CONFIG.EASING.DEFAULT,
    useNativeDriver: true,
  });
};
```

## Loading & Error States

For each key screen, we'll implement the following loading and error states:

### Loading States:

- **Skeleton Loaders**: For content items during initial load
- **Activity Indicators**: For actions and operations
- **Progress Bars**: For uploads and downloads
- **Shimmer Effects**: For enhancing skeleton loaders
- **Placeholder Cards**: For content not yet loaded

### Error States:

- **Error Boundaries**: For catching React component errors
- **Error Messages**: Contextual error explanations
- **Retry Buttons**: For repeating failed operations
- **Fallback UI**: When components can't load
- **Offline Mode**: For handling disconnected states

## Performance Considerations

1. **Memoization**

   - Use React.memo for pure components
   - Use useMemo and useCallback for expensive calculations
   - Implement reselect for Redux selectors

2. **List Optimization**

   - Use FlatList with optimizations (getItemLayout, keyExtractor)
   - Implement windowing for long lists
   - Use pagination for API requests

3. **Image Optimization**

   - Implement proper image caching
   - Use responsive image sizes
   - Implement progressive loading for images

4. **Redux Optimization**

   - Normalize state where appropriate
   - Use shallowEqual for selector comparisons
   - Batch related actions

5. **Network Optimization**
   - Implement request caching
   - Use compression for API requests
   - Implement retry logic for failed requests
   - Support offline capabilities with queue system
