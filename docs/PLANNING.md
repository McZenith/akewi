# Akewi App - Design & Implementation Planning

## Overview

This document tracks our design analysis and implementation planning for the Akewi app. We'll analyze each screen, identify components, plan reusability, and document our technical decisions.

## Design System

### Core Components

We'll identify and document reusable components here as we analyze the designs.

| Component Name         | Variations                                         | Props                                               | Usage                                      |
| ---------------------- | -------------------------------------------------- | --------------------------------------------------- | ------------------------------------------ |
| Button                 | Primary, Social, Icon, Back                        | variant, label, onPress, icon, disabled, etc.       | Primary actions, social logins, navigation |
| Input                  | Text, Password, Email, Phone, EmailPhone, Optional | label, placeholder, value, onChangeText, type, etc. | Form inputs, search fields                 |
| Select                 | Default                                            | value, options, onChange, etc.                      | Dropdown selection (State)                 |
| Text                   | Heading, Body, Caption, Button                     | variant, color, align, weight, etc.                 | All text elements                          |
| Divider                | With/without text                                  | text, color, thickness                              | Section separators                         |
| LanguageSelector       | -                                                  | currentLanguage, onPress, showIcon                  | Language selection                         |
| LanguageSelectionModal | -                                                  | visible, onClose, languages, onSelectLanguage       | Modal for language selection               |
| Logo                   | Small, Medium, Large                               | size, colored                                       | App branding                               |
| VoiceButton            | -                                                  | onPress, isActive, isWaitingForInput, etc.          | Accessibility features                     |
| SocialButton           | Google, Apple, etc.                                | provider, onPress, label                            | Social authentication                      |
| BackButton             | -                                                  | onPress, color, size                                | Navigation                                 |
| Form                   | -                                                  | children, onSubmit                                  | Form container                             |
| Header                 | With/without back                                  | title, showBackButton, rightComponent               | Screen headers                             |
| FeaturedOrikiCard      | -                                                  | title, subtitle, description, metaText, etc.        | Featured content display                   |
| OrikiItem              | Standard, Compact                                  | title, description, initialText, onPress, etc.      | Oriki list items                           |
| InitialIcon            | Small, Medium, Large                               | text, backgroundColor, size, etc.                   | Visual identifiers for items               |
| CategoryCard           | Featured, Standard, Compact                        | title, count, backgroundColor, etc.                 | Category display                           |
| SectionHeader          | With/without action                                | title, actionText, onActionPress, etc.              | Section headings                           |
| BottomNavigation       | -                                                  | activeTab, onTabPress                               | Main app navigation                        |

### Typography

Based on the designs, we observe these typography patterns:

- System font family for regular text
- Custom font for the AKEWI logo
- Font sizes ranging from 12px to 32px
- Font weights from Regular (400) to Bold (700)
- Consistent text alignment (centered for headings, left-aligned for inputs)
- Line heights appropriate for different text types

See the `THEME.md` document for detailed typography specifications.

### Colors

From the designs, we've identified a color palette with:

- Brand colors: Reddish-brown (#C73D10) and dark brown (#251608)
- Neutral colors: Whites, blacks, and grays
- Semantic colors for feedback
- Background colors
- Input background colors (light gray)

See the `THEME.md` document for the full color palette.

### Spacing

The app appears to use an 8px base unit for spacing, with a scale that includes:

- Extra small (8px)
- Small (16px)
- Medium (24px)
- Large (32px)
- Extra large (48px)

Spacing is consistently applied between form elements and sections.

See the `THEME.md` document for the complete spacing system.

## Screens Analysis

### Onboarding/Login Screen

**Purpose:** Allow users to sign in via email or phone number, as well as social authentication options
**Key Components:**

- LanguageSelector
- Logo
- Description Text
- Email/Phone Input
- Continue Button
- Social Authentication Buttons

**State Management Needs:**

- Authentication state
- Input type detection (email vs. phone)
- Form validation
- Loading states

**User Experience Notes:**

- The keyboard appears below the input field without obscuring it
- All UI elements remain visible and accessible when keyboard is displayed
- No scrolling required on standard device sizes
- Input type is detected automatically based on user input format

See the `SCREENS.md` document for detailed screen analysis.

### User Details Form Screen

**Purpose:** Collect user profile information to personalize the experience
**Key Components:**

- Header with Back Button and Language Selector
- VoiceButton for audio interaction
- Title and Description Text
- Form with multiple inputs:
  - Name (text input)
  - State (dropdown select)
  - Town (text input)
  - Family (optional text input)
- Continue Button

**State Management Needs:**

- User profile data
- Form validation states
- Location data (states/towns)

**User Experience Notes:**

- Form appears in a clean, organized layout
- Optional fields are clearly marked
- Select input has a visible indicator (chevron)
- Consistent design with the login screen

See the `SCREENS.md` document for detailed screen analysis.

### Home Screen

**Purpose:** Display featured oriki content, personalized recommendations, and category navigation
**Key Components:**

- Header with app title, VoiceButton, and LanguageSelector
- FeaturedOrikiCard for prominent oriki categories
- OrikiItem components organized in sections
- SectionHeader components with "Explore all" actions
- CategoryCard components for browsing categories
- BottomNavigation for app-wide navigation

**State Management Needs:**

- Oriki content collections (featured, popular, recent)
- Category data
- User preferences and history
- Playback state for oriki content

**User Experience Notes:**

- Safe area insets ensure content is properly displayed on all devices
- Consistent spacing and visual hierarchy between sections
- Clear visual identifiers (InitialIcon) for different oriki items
- Action buttons (play, view lyrics) are accessible and consistently placed
- Section headers provide clear organization with "Explore all" navigation options

See the `SCREENS.md` document for detailed screen analysis.

### Explore Screen

**Purpose:** Provide comprehensive category browsing and search functionality for oriki content discovery
**Key Components:**

- SearchBar with prominent placement for global content search
- Clear "All Categories" heading
- CategoryCard components with consistent layout but distinct visual styling per category
- Each category card includes:
  - Category title in Yoruba (e.g., "Oriki Orílè-èdè")
  - English translation/description (e.g., "Community/Regional Oriki")
  - Book/reading icon for text content
  - Play/audio icon for listening
  - Visual count indicator showing content volume
- BottomNavigation for app-wide navigation

**State Management Needs:**

- Categories collection
- Search query and results
- Recently viewed categories
- Search history

**User Experience Notes:**

- Search bar is prominently positioned for easy discovery
- Each category uses distinct color scheme for quick visual differentiation
- Category cards use consistent spacing and layout with color as the primary differentiator
- Reading and listening options are clearly presented on each card
- The screen uses a simple vertical scroll for browsing all categories
- The bottom tab navigation provides clear context of current location in app
- Category titles maintain consistent information hierarchy with subtitle providing translations

See the `SCREENS.md` document for detailed screen analysis.

## Navigation Structure

The app uses a bottom tab navigation to organize its main sections:

### Home Tab

Focused on personalized content discovery and recent/popular items. Serves as the main landing experience after login.

### Explore Tab

Dedicated to comprehensive browsing by category and searching across all content. Primary discovery tool for new users.

### Contributor Tab

Allows users to contribute content and manage their contributions. Supports the community-driven nature of the app by enabling users to share their own oriki knowledge.

**Key Features:**

- Easy-to-use form for submitting oriki content in Yoruba with English translations
- Optional audio recording functionality for authentic pronunciation
- Chronological view of user's previous contributions
- Ability to edit or update previously submitted content
- Direct access to user profile settings

## Component Hierarchy

Updated component hierarchy based on all screens:

```
App
├── NavigationContainer
│   ├── AuthStack
│   │   ├── LoginScreen
│   │   │   ├── LanguageSelector
│   │   │   ├── Logo
│   │   │   ├── Text (Description)
│   │   │   ├── Input (Email/Phone)
│   │   │   ├── Button (Continue)
│   │   │   ├── Divider (or)
│   │   │   ├── SocialButton (Google)
│   │   │   └── SocialButton (Apple)
│   │   ├── UserDetailsScreen
│   │   │   ├── Header
│   │   │   │   ├── BackButton
│   │   │   │   ├── VoiceButton
│   │   │   │   └── LanguageSelector
│   │   │   ├── Text (Title)
│   │   │   ├── Text (Description)
│   │   │   ├── Form
│   │   │   │   ├── Input (Name)
│   │   │   │   ├── Select (State)
│   │   │   │   ├── Input (Town)
│   │   │   │   └── Input (Family)
│   │   │   └── Button (Continue)
│   │   └── [Other Auth Screens]
│   ├── MainStack
│   │   ├── HomeScreen
│   │   │   ├── Header
│   │   │   ├── FeaturedOrikiCard
│   │   │   ├── SectionHeader (Popular)
│   │   │   ├── OrikiList
│   │   │   │   └── OrikiItem (multiple)
│   │   │   ├── SectionHeader (Recent)
│   │   │   ├── OrikiList
│   │   │   │   └── OrikiItem (multiple)
│   │   │   ├── SectionHeader (Categories)
│   │   │   ├── CategoryList
│   │   │   │   └── CategoryCard (multiple)
│   │   │   └── BottomNavigation
│   │   ├── ExploreScreen
│   │   └── ContributorScreen
```

## State Management

Based on the screens analyzed, we'll need to manage:

### Authentication State (Redux)

```
auth: {
  isAuthenticated: boolean,
  user: User | null,
  token: string | null,
  loading: boolean,
  error: string | null,
  authMethod: 'email' | 'phone' | 'social' | null,
  verificationId: string | null
}
```

### User Profile State (Redux)

```
userProfile: {
  name: string,
  state: string,
  town: string,
  family: string,
  preferences: {
    // Additional user preferences
  }
}
```

### Forms State (Local or Form Library)

```
form: {
  login: {
    identifier: {
      value: string,
      type: 'email' | 'phone' | null,
      isValid: boolean,
      error: string | null
    }
  },
  userDetails: {
    name: {
      value: string,
      isValid: boolean,
      error: string | null
    },
    state: {
      value: string,
      isValid: boolean,
      error: string | null
    },
    town: {
      value: string,
      isValid: boolean,
      error: string | null
    },
    family: {
      value: string,
      isValid: boolean,
      error: string | null
    }
  }
}
```

### App Settings (Redux)

```
settings: {
  language: string,
  theme: 'light' | 'dark',
  audioEnabled: boolean
}
```

### Location Data (Redux or Local)

```
locations: {
  states: Array<{ label: string, value: string }>,
  towns: Record<string, Array<{ label: string, value: string }>> // Keyed by state value
}
```

### Content Data (Redux)

```
content: {
  featured: Array<OrikiContent>,
  popular: Array<OrikiContent>,
  recent: Array<OrikiContent>,
  categories: Array<Category>,
  userFavorites: Array<string>, // IDs of favorited items
  userHistory: Array<{id: string, timestamp: number}>, // Recently viewed/played
  userContributions: {
    items: Array<OrikiContent>,
    byDate: Record<string, Array<string>>, // Date string to array of IDs
    loading: boolean,
    error: string | null,
    justAdded: string | null, // ID of the most recently added contribution for highlighting
    submissionState: {
      isSubmitting: boolean,
      progress: number, // For submission progress (0-100)
      error: string | null,
      success: boolean,
      lastSubmittedId: string | null
    }
  },
  search: {
    query: string,
    results: Array<OrikiContent>,
    totalResults: number,
    loading: boolean,
    error: string | null,
    lastSearches: Array<string> // Recent search terms
  },
  loading: {
    featured: boolean,
    popular: boolean,
    recent: boolean,
    categories: boolean
  },
  error: string | null
}
```

**Submission Flow State Updates:**

1. When user begins oriki submission:

   - `userContributions.submissionState.isSubmitting` is set to `true`
   - Form data is staged for submission

2. During upload progress (especially for audio files):

   - `userContributions.submissionState.progress` is updated with upload percentage

3. On successful submission:

   - New contribution is added to `userContributions.items` array
   - Contribution ID is added to appropriate date entry in `userContributions.byDate`
   - `userContributions.justAdded` is set to new contribution ID for highlighting
   - `userContributions.submissionState.success` is set to `true`
   - `userContributions.submissionState.lastSubmittedId` is set to new contribution ID
   - `userContributions.submissionState.isSubmitting` is reset to `false`

4. After user views the updated Contributor screen:

   - `userContributions.justAdded` is reset to `null` after a timeout
   - `userContributions.submissionState.success` is reset to `false`

5. On submission error:
   - `userContributions.submissionState.error` is set with error message
   - `userContributions.submissionState.isSubmitting` is reset to `false`

### Data Models

**OrikiContent**

```typescript
interface OrikiContent {
  id: string;
  title: string;
  description: string;
  type: 'family' | 'community' | 'cultural' | 'deity' | 'ethnic';
  initialText: string;
  initialColor: string;
  hasAudio: boolean; // Whether item has audio content
  audioUrl?: string; // Only present if hasAudio is true
  lyricsContent?: {
    yoruba: string; // Original Yoruba content
    english: string; // English translation
  };
  trackCount?: number;
  isUserContribution?: boolean; // Whether this was contributed by the current user
  contributionStatus?: 'pending' | 'approved' | 'rejected'; // Moderation status
  submittedDate?: string; // When the content was submitted
  metadata?: {
    duration?: number;
    language?: string;
    region?: string;
    family?: string;
    tags?: string[];
    contributor?: {
      id: string;
      name: string;
    };
  };
  lyricsSections?: {
    yoruba: Array<{
      text: string;
      startTime: number; // Start timestamp in seconds
      endTime: number; // End timestamp in seconds
      index: number; // Order in the sequence
    }>;
    english: Array<{
      text: string;
      startTime: number; // Start timestamp in seconds
      endTime: number; // End timestamp in seconds
      index: number; // Order in the sequence
    }>;
  }; // Synchronized text segments with timestamps for both languages
  isSynchronized?: {
    yoruba: boolean;
    english: boolean;
  }; // Whether lyrics have been synchronized with audio for each language
}
```

**Category**

```typescript
interface Category {
  id: string;
  title: string;
  description?: string;
  count: number;
  backgroundColor: string;
  textColor: string;
  iconType: string;
}
```

**AudioPlayback State**

```typescript
interface AudioPlaybackState {
  currentlyPlaying: string | null; // ID of currently playing oriki
  isPlaying: boolean;
  duration: number;
  currentPosition: number;
  volume: number;
  repeat: 'none' | 'one' | 'all';
  queue: Array<string>; // IDs in queue
  isPlayerMinimized: boolean; // Whether player is in minimized state
  isPlayerVisible: boolean; // Whether player is visible at all
}
```

## Localization Strategy

Based on the prominent language selector and seeing both English and Yoruba translations in the UI:

1. Use i18next for translation management
2. Store translations in JSON files by language
3. Implement language selector with persistent storage
4. Default to device language on first launch
5. Support multiple languages from the start:
   - English (UK)
   - Yoruba
   - Add more languages as needed
6. Create a bottom sheet modal for language selection that includes:
   - Language name
   - Country/language flag icon
   - Radio button/indicator for current selection
7. Localize all app elements:
   - UI text and labels
   - Form placeholders and validation messages
   - Error messages
   - Location data (states/towns)
   - App content
   - Button text
   - Social authentication buttons
8. Store language preference in secure storage and apply it app-wide
9. Apply translations reactively without requiring app restart
10. Ensure UI layout accommodates text length variations across languages

### Translation Examples

To help with implementation, here are observed translations between English and Yoruba:

| UI Element            | English                                                       | Yoruba                                                                   |
| --------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Description text      | "Create easy and secure financial transactions through voice" | "Ṣàwárí, fẹ́tí sí, kí o sì pín Oríkì tí ń ṣe àyẹyẹ ìbílẹ̀, ìdílé, àti aṣa" |
| Input placeholder     | "Enter your email or phone number"                            | "Tẹ ìméèlì rẹ tàbí nọ́mbà tẹlifóònù rẹ"                                   |
| Continue button       | "Continue"                                                    | "Tẹ̀síwájú"                                                               |
| Divider text          | "or"                                                          | "tàbí"                                                                   |
| Social login - Google | "Continue with Google"                                        | "Tẹ̀síwájú pẹ̀lú Google"                                                   |
| Social login - Apple  | "Continue with Apple"                                         | "Tẹ̀síwájú pẹ̀lú Apple"                                                    |

Note that translations may involve not just direct word substitution but adapting content for cultural relevance (as seen in the description text which appears to have different messaging between languages).

## Technical Decisions

- **Authentication:** Implement flexible authentication with support for email, phone, and social options
- **Navigation:** Use Expo Router for file-based navigation
- **State Management:** Redux with Redux Toolkit for global state
- **Form Management:** Consider React Hook Form for form handling and validation
- **API Integration:** Set up axios with interceptors for API requests
- **Keyboard Handling:** Implement proper keyboard avoiding behavior to match design
- **Accessibility Features:**
  - Implement Text-to-Speech for screen reading functionality
  - Support voice reading in multiple languages (English and Yoruba)
  - Add visual highlighting of elements being read
  - Include proper ARIA labels and screen reader support
  - Add support for dynamic font sizing
  - Implement interactive voice navigation through form inputs:
    - Sequential focus management for form fields
    - Visual highlighting of currently focused input
    - Input status indicators showing voice mode
    - Voice button state changes reflecting waiting vs reading status
    - Keyboard Enter key detection for advancing to next field
    - Automatic advancement after dropdown selection
    - Support for pausing and resuming the voice guidance
- **Location Data:** Create a database of states and towns with translations
- **Phone Authentication:** Integrate SMS verification service (e.g., Firebase Auth, Twilio Verify)

- **Audio Playback & Media Player:**
  - Implement a robust audio playback system with Expo AV or react-native-track-player
  - Support synchronized lyrics display with line-by-line highlighting
  - Create an immersive UI with audio visualization and elliptical progress control
  - Build custom audio progress tracking with timestamp-based lyric synchronization
  - Support background audio playback with lock screen controls
  - Implement audio playlist functionality and "save to playlist" features
  - Add seeking capability through progress bar or by tapping on specific lyric lines
  - Build audio visualization with waveform representation
  - Support language switching for lyrics content
  - Create a global audio player context to maintain playback state across screens
  - Implement a minimized player mode that persists across navigation:
    - Compact UI displaying current track info and playback controls
    - Positioned above bottom navigation tabs
    - Tap to expand back to full-screen player
    - Optimized for one-handed control
    - Seamless transitions between full and minimized states
    - Persistence across tab navigation and screen changes
    - Adjustable layout to avoid obscuring important UI elements

## Implementation Plan

1. Set up theme constants and design system
2. Implement base UI components
3. Create a keyboard-aware layout component
   - Will wrap all screen content
   - Uses KeyboardAvoidingView with appropriate behavior per platform
   - Manages spacing and positioning of elements when keyboard is visible
4. Set up Redux store with authentication and user profile slices
5. Implement accessibility features
   - Text-to-Speech integration with language support
   - Voice reading component with visual highlighting
   - Screen reader compatibility
   - Interactive voice input navigation system:
     - Sequential input focus management
     - Keyboard interaction handling (Enter key support)
     - Visual highlighting and status indicators for inputs
     - Voice button state management reflecting current status
     - Auto-advancement logic for select components
6. Create the authentication flow screens
   - Login screen with automatic input type detection
   - Email verification screen
   - SMS verification screen
   - User details form screen
7. Implement form validation with localization support
8. Implement all authentication methods (email, phone, social)
9. Build remaining screens
10. Add complete localization support

11. Implement the Audio Playback System:

    - Set up a global audio service using Expo AV or react-native-track-player
    - Build the Oriki Player screen with immersive red background extending to status bar
    - Create the CircularProgressPlayer component with elliptical track design
    - Implement audio controls (play/pause, previous, next)
    - Add synchronized lyrics display with automatic highlighting
    - Build language toggle for switching between Yoruba and English content
    - Create audio visualization with waveform representation
    - Implement seeking functionality through progress bar and lyric taps
    - Add playlist management and save-to-playlist functionality
    - Support background audio playback
    - Create a minimized player for continued playback during navigation:
      - Design a compact, persistent player UI that appears at the bottom of the screen
      - Implement gesture-based transitions between full player and minimized mode
      - Set up state persistence to maintain playback across navigation
      - Ensure bottom sheet gestures and transitions feel natural and responsive
      - Add layout adjustments for screens when minimized player is visible
      - Create global audio context provider to share audio state across the app
      - Handle audio interruptions and background playback gracefully
      - Implement proper cleanup of audio resources when stopping playback

12. Implement the Home screen with featured content

    - Create content data models and state management
    - Implement OrikiItem component with proper styling
    - Create FeaturedOrikiCard component
    - Implement SectionHeader with "Explore all" functionality
    - Build bottom navigation tabs

13. Implement the Explore screen

    - Create SearchBar component with prominent placement and clean styling
    - Implement CategoryCard components with appropriate visual differentiation:
      - Create a consistent layout structure for all cards
      - Implement color variations for different category types
      - Add book/reading and play/audio icons
      - Include title, subtitle, and count elements
    - Set up category data fetching and state management
    - Create "All Categories" view with proper spacing and scrolling
    - Implement search functionality with keyboard handling:
      - Real-time search results as user types
      - Results count display ("Result (10)")
      - Proper handling of the keyboard during search
      - Clear distinction between items with and without audio (conditional play button)
      - Persistent search query in search bar when viewing results
      - Ability to refine search by editing query
    - Set up navigation to category detail screens
    - Implement search results screen with:
      - Virtualized list for performance with many results
      - Proper keyboard avoidance
      - Empty state handling when no results are found
      - Error state handling
      - Loading indicators during search

14. Implement the Contributor screen

    - Create the main Contributor tab view with:
      - Share Oriki card with prominent design and clear call-to-action
      - Chronological list of user contributions with date grouping
      - Edit functionality for managing existing contributions
      - Profile button for quick access to user settings
    - Build the Share Oriki form:
      - Text inputs for Yoruba and English content
      - Category selection with multiple selectable tags
      - Form validation for required fields
      - Audio file upload functionality with clear visual indicators
      - Comprehensive form layout with:
        - Oriki title input field
        - Category selection tags for multiple classification
        - Full oriki body text area for Yoruba content
        - English translation text area
        - Audio file upload area with intuitive file selection
      - Clear instructional text above the form
      - Proper form validation with error indicators
      - Effective keyboard management for multiline text inputs
    - Develop the Edit Oriki screen:
      - Pre-populated form with existing content
      - Same form structure as Share Oriki with populated values
      - Category tags with pre-selected values
      - Ability to add/remove/change category selections
      - Display of existing audio files with replacement option
      - Deletion functionality with confirmation
      - Clear visual indicators for modified fields
      - Consistent styling with the rest of the app
    - Implement user contribution management:
      - API integration for fetching user's contributions
      - Caching for offline viewing
      - Pull-to-refresh for updating content list
      - Optimistic UI updates for better user experience
    - Add data validation and moderation features:
      - Client-side validation for form fields
      - Length limits and format restrictions
      - Optional moderation workflow for submitted content
      - Status indicators for pending/approved contributions

15. Implement Lyrics Synchronization:

    - Create the Lyrics Syncing screen to connect text content with audio recordings:
      - Automatic text segmentation by periods/full stops
      - Interactive audio waveform visualization with draggable timestamp markers
      - Intuitive UI for matching each text segment with its corresponding audio portion
      - Sequential synchronization workflow with smart positioning of markers
      - Language toggle to support bilingual synchronization (Yoruba and English)
      - Independent tracking and storage of timestamps for each language
      - Playback controls for verifying timing accuracy
      - Timestamp storage and retrieval for synchronized playback
      - Progress indicators showing completion status for each language
    - Build the AudioWaveformWithMarkers component:
      - Visual representation of audio waveform with amplitude data
      - Draggable start and end markers for selecting audio segments
      - Highlighting of the active selection between markers
      - Precise timestamp display with mm:ss format
      - Current position indicator during playback
    - Create the LyricsSection component for displaying text segments:
      - Clear display of each text segment with status indication
      - Playback controls for segment verification
      - Timestamp display showing the segment's time range
      - Visual states for active, completed, and pending segments
      - Language-specific styling to differentiate between Yoruba and English content
    - Implement the timestamp data storage model:
      - Store start and end times for each text segment
      - Maintain separate timestamp arrays for Yoruba and English content
      - Link timestamps to text segments with proper indexing
      - Format data appropriately for use in the playback system
    - Add automatic text segmentation logic:
      - Parse text content to identify natural breakpoints (periods, line breaks)
      - Create separate timestamp entries for each segment
      - Handle edge cases like abbreviations and ellipses
      - Process both Yoruba and English text with language-appropriate parsing
    - Implement the bilingual synchronization workflow:
      - Enable switching between languages at any point in the process
      - Preserve synchronization progress when switching languages
      - Guide users through the process with clear instructions
      - Automatically advance to next segment after completion
      - Prevent gaps or overlaps between segments
      - Validation to ensure complete synchronization for both languages
      - Save and apply timestamp data to enable synchronized playback features
      - Clear visual indication of which language is currently being edited
      - Only enable completion when both languages are fully synchronized
    - Create the Lyrics Preview screen for verification before publishing:
      - Immersive player UI with the same styling as the main Oriki Player
      - Real-time synchronized highlighting of lyrics during playback
      - Language toggle to verify both Yoruba and English versions
      - Complete playback controls (play/pause, previous/next, seek)
      - Audio waveform visualization to preview audio patterns
      - Circular progress indicator showing playback position
      - Finish button to complete and publish the synchronized oriki
      - Gesture-based dismissal to return to the synchronization screen
      - Visual representation identical to how end-users will experience the content
      - Verification functionality to ensure proper synchronization quality
      - Seamless connection between the creation and consumption experiences

16. Implement Submission Completion Flow:

    - Add publishing functionality to the Finish button on the Preview screen
    - Create loading state with progress indication during publication
    - Implement navigation back to the Contributor screen after successful submission
    - Add automatic refresh of the contributions list to show the new entry
    - Implement optimistic UI updates to immediately show the new contribution
    - Add proper error handling for failed submissions with retry options
    - Create success feedback (visual indication, toast notification, etc.)
    - Update the Redux state to include the new contribution in userContributions
    - Implement proper date-based sorting to organize contributions chronologically
    - Add visual cues to highlight the newly added contribution

17. Implement audio playback functionality

    - Integrate audio player for oriki content
    - Create playback controls and status management
    - Support background audio
    - Add synchronized text highlighting during playback based on timestamp data
    - Implement seeking functionality by tapping on text segments

18. Implement category detail screens

    - Create detailed view for each category accessed from the Explore screen
    - Implement category header with:
      - Title and subtitle maintaining category styling
      - Language selector with globe icon
      - Category-wide action buttons (read all, play all)
    - Create RecentlyAddedCard component to highlight new content
    - Implement FilterTab components for content filtering:
      - Horizontal scrollable tabs for region/type selection
      - Active/inactive state styling
      - Filter state management
    - Set up filtered API requests based on selected filter
    - Implement OrikiList with consistent styling:
      - Conditional rendering of play buttons based on audio availability
      - Book icons for text content
      - Initial icons maintaining category visual identity
    - Add loading states and empty states for filtered content

19. Implement user personalization

    - Favorite toggling and management
    - Recently viewed/played tracking
    - Content filtering by user's state/town/family

20. Implement the User Profile System:
    - Create the User Profile Modal:
      - Design the modal overlay with drag handle for dismissal
      - Implement ProfileAvatar component with initials fallback
      - Add contribution and stream statistics display
      - Create StatBadge components for state, town, and family information
      - Add UpdateProfileButton for profile editing
    - Implement contribution tracking:
      - Create a counter system for tracking total user contributions
      - Implement stream counting to track oriki plays/views
      - Add gamification elements to encourage participation
      - Generate persistence for user statistics across sessions
    - Develop the Profile Edit screen:
      - Create form for updating name, state, town, and family
      - Add profile image upload functionality
      - Include validation for all input fields
      - Implement API integration for saving profile changes
      - Add confirmation for successful updates
      - Detailed implementation steps:
        - Create the EditProfileScreen component with properly structured layout
        - Implement the BackButton component with navigation back to Profile Modal
        - Add Header component with "Update Profile" title
        - Implement the ProfileImageEditor component:
          - Support for displaying existing profile image
          - Add camera icon overlay for image selection
          - Integrate with device image picker and camera APIs
          - Add image cropping functionality for proper circular display
          - Handle image upload progress and error states
        - Implement form components:
          - Create FormInput component for text fields (name, town, family)
          - Create SelectInput component for dropdown fields (state, language)
          - Add proper label formatting with required field indicators
          - Implement focus and error states for all input fields
          - Add proper keyboard types for different field types
        - Add form validation logic:
          - Validate required fields (name, state)
          - Add length and format validation for text fields
          - Implement real-time validation as user types
          - Display appropriate error messages under invalid fields
        - Create the SaveButton component:
          - Implement disabled state for invalid forms
          - Add loading state during API operations
          - Create visual feedback for button press
        - Implement form submission:
          - Gather and format form data for API submission
          - Handle image uploads separately with progress tracking
          - Show loading indicators during submission
          - Implement error handling with user-friendly messages
          - Add success confirmation with visual feedback
          - Navigate back to Profile Modal on successful update
        - Enhance user experience:
          - Pre-populate form with existing user data
          - Implement keyboard dismissal when tapping outside fields
          - Add confirmation dialog for unsaved changes when attempting to leave
          - Implement smooth animations for state transitions
          - Add accessibility support (VoiceOver, TalkBack)
    - Add profile data to Redux state:
      - Extend userProfile slice to include contribution and stream statistics
      - Implement API services for fetching user statistics
      - Add persistence for profile data
      - Create actions and reducers for updating profile information
      - Implement optimistic updates for better UX
    - Create Profile Analytics:
      - Track user engagement with contribution statistics
      - Generate insights about user contribution patterns
      - Implement milestone notifications for contribution counts
      - Add analytics for streaming metrics and play counts
