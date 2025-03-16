# Akewi App - Implementation Plan

This document outlines the step-by-step implementation plan for the Akewi app. Each item can be checked off as development progresses.

## Project Setup & Base Components

- [x] 1.1 Initialize Expo project with TypeScript

  - [x] Install Expo CLI: `npm install -g expo-cli`
  - [x] Create project: `expo init akewi --template expo-template-blank-typescript`
  - [x] Set up project settings in app.json
  - [x] Configure TypeScript settings in tsconfig.json

- [x] 1.2 Implement folder structure

  - [x] Create directory structure as defined in ARCHITECTURE.md
  - [x] Add placeholder files for key directories
  - [x] Configure ESLint and Prettier with recommended settings

- [x] 1.3 Set up Expo Router

  - [x] Install: `npm install expo-router`
  - [x] Configure file-based routing structure in app folder
  - [x] Set up root layout with providers

- [x] 1.4 Configure Redux store

  - [x] Install: `npm install @reduxjs/toolkit react-redux redux-persist`
  - [x] Set up store configuration with proper typing
  - [x] Implement basic slices for app settings
  - [x] Create store provider component

- [x] 1.5 Configure theming system

  - [x] Define theme constants (colors, typography, spacing)
  - [x] Set up light/dark theme context
  - [x] Create theme provider component
  - [x] Implement useTheme hook

- [x] 1.6 Set up internationalization (i18n)

  - [x] Install: `npm install i18next react-i18next`
  - [x] Configure i18n setup with English and Yoruba translations
  - [x] Create translation JSON files for both languages
  - [x] Implement useTranslation hook

- [x] 1.7 Create base Text component

  - [x] Implement text variants (heading, body, caption, etc.)
  - [x] Add support for custom styling
  - [x] Ensure proper localization support
  - [x] Support screen reader accessibility

- [x] 1.8 Create base Button component

  - [x] Implement variants (primary, secondary, outline, text)
  - [x] Add loading state with ActivityIndicator
  - [x] Implement proper disabled state
  - [x] Add haptic feedback
  - [x] Add press animations

- [x] 1.9 Implement Input component

  - [x] Create base text input with proper styling
  - [x] Add focus/blur animations
  - [x] Implement error state with validation
  - [x] Support various keyboard types
  - [x] Add accessibility labels

- [x] 1.10 Create IconButton component

  - [x] Implement pressable icon component with feedback
  - [x] Support various icon sizes
  - [x] Add tooltip support
  - [x] Implement accessibility features

- [x] 1.11 Build form components

  - [x] Create FormInput with label and error handling
  - [x] Implement SelectInput for dropdown selection
  - [x] Build form validation utilities
  - [x] Create SaveButton component

- [x] 1.12 Implement LanguageSelector components
  - [x] Create compact language toggle
  - [x] Build LanguageSelectionModal
  - [x] Implement language switching logic
  - [x] Add persistence for language preference

## User Authentication & Profile

- [x] 2.1 Implement auth slice in Redux

  - [x] Define auth state interface
  - [x] Create auth reducers
  - [x] Implement auth actions
  - [x] Add auth selectors

- [ ] 2.2 Create Login screen

  - [x] Design email/phone input form
  - [x] Implement input type detection (email vs. phone)
  - [x] Add form validation
  - [x] Implement continue button with loading state
  - [x] Add social login buttons

- [ ] 2.3 Build verification screen

  - [ ] Create verification code input
  - [ ] Implement timer for code expiration
  - [ ] Add resend code functionality
  - [ ] Handle verification success/failure

- [ ] 2.4 Create User Details form screen

  - [ ] Build form for name, state, town, family
  - [ ] Implement state dropdown with Nigerian states
  - [ ] Add validation for required fields
  - [ ] Create continue button with loading state

- [ ] 2.5 Implement user slice in Redux

  - [ ] Define user profile state interface
  - [ ] Create user profile reducers
  - [ ] Implement profile actions
  - [ ] Add profile selectors

- [ ] 2.6 Implement secure storage

  - [ ] Set up secure storage for tokens
  - [ ] Create persistence for user session
  - [ ] Implement auth token refresh
  - [ ] Handle session expiration

- [ ] 2.7 Create ProfileAvatar component

  - [ ] Implement circular avatar with image
  - [ ] Add fallback to initials when no image
  - [ ] Support various sizes
  - [ ] Handle image loading and errors

- [ ] 2.8 Implement StatBadge component

  - [ ] Create badge with icon and text
  - [ ] Support different badge types
  - [ ] Implement proper styling

- [ ] 2.9 Build UserProfileModal

  - [ ] Create modal layout with user info
  - [ ] Add contribution and stream statistics
  - [ ] Implement location badges
  - [ ] Add update profile button

- [ ] 2.10 Create ProfileImageEditor

  - [ ] Implement image display with edit button
  - [ ] Add camera icon overlay
  - [ ] Connect to device image picker
  - [ ] Implement image cropping

- [ ] 2.11 Build Edit Profile screen
  - [ ] Create form with user data
  - [ ] Implement image upload functionality
  - [ ] Add validation for all fields
  - [ ] Create save button with loading state
  - [ ] Handle success and error states

## Main App Navigation & Home Screen

- [ ] 3.1 Set up bottom tab navigation

  - [ ] Create custom tab bar component
  - [ ] Implement tab icons and labels
  - [ ] Add active/inactive states
  - [ ] Support haptic feedback

- [ ] 3.2 Implement main layout

  - [ ] Create layout with safe area insets
  - [ ] Add support for bottom tabs
  - [ ] Implement keyboard avoiding behavior
  - [ ] Support screen transitions

- [ ] 3.3 Create FeaturedOrikiCard

  - [ ] Design card with title, subtitle, and background
  - [ ] Add play button for audio content
  - [ ] Implement proper touch handling
  - [ ] Add loading state

- [ ] 3.4 Build OrikiItem component

  - [ ] Create list item with title and description
  - [ ] Add initial icon with customizable color
  - [ ] Implement play button for audio items
  - [ ] Add press feedback

- [ ] 3.5 Create SectionHeader component

  - [ ] Implement header with title
  - [ ] Add "Explore all" action button
  - [ ] Support custom styling

- [ ] 3.6 Build Home screen layout

  - [ ] Create scrollable layout with sections
  - [ ] Add featured oriki section
  - [ ] Implement popular oriki section
  - [ ] Create recent oriki section
  - [ ] Add categories section

- [ ] 3.7 Implement content slice in Redux

  - [ ] Define content state interface
  - [ ] Create content reducers
  - [ ] Implement content actions
  - [ ] Add content selectors

- [ ] 3.8 Build content loading states

  - [ ] Create skeleton loaders for cards
  - [ ] Implement shimmer effect
  - [ ] Add loading state for lists
  - [ ] Handle empty states

- [ ] 3.9 Add pull-to-refresh functionality

  - [ ] Implement refresh control
  - [ ] Add loading indicator
  - [ ] Connect to content refresh actions
  - [ ] Handle refresh errors

- [ ] 3.10 Create CategoryCard component
  - [ ] Design card with title, count, and background
  - [ ] Add icon based on category type
  - [ ] Implement press handling
  - [ ] Support custom styling

## Explore & Search Functionality

- [ ] 4.1 Create SearchBar component

  - [ ] Implement input with search icon
  - [ ] Add clear button for entered text
  - [ ] Handle focus/blur states
  - [ ] Connect to search functionality

- [ ] 4.2 Build Explore screen

  - [ ] Create layout with search bar
  - [ ] Implement "All Categories" section
  - [ ] Add category cards with proper styling
  - [ ] Support scrolling for many categories

- [ ] 4.3 Implement search functionality

  - [ ] Create search actions in Redux
  - [ ] Add debounce for search queries
  - [ ] Implement result filtering
  - [ ] Save recent searches

- [ ] 4.4 Build search results screen

  - [ ] Create list of search results
  - [ ] Add search stats (number of results)
  - [ ] Implement filter options
  - [ ] Handle empty results state

- [ ] 4.5 Create category detail screen

  - [ ] Implement header with category info
  - [ ] Add oriki list filtered by category
  - [ ] Support play/view functionality
  - [ ] Add loading and empty states

- [ ] 4.6 Build FilterTab components
  - [ ] Create horizontal scrollable tabs
  - [ ] Implement active/inactive states
  - [ ] Connect to filter functionality
  - [ ] Support customization

## Audio Player & Oriki Detail

- [ ] 5.1 Set up audio service

  - [ ] Install: `npx expo install expo-av`
  - [ ] Create audio playback service
  - [ ] Implement basic playback functions
  - [ ] Add audio loading and error handling

- [ ] 5.2 Implement audio slice in Redux

  - [ ] Define audio state interface
  - [ ] Create audio reducers
  - [ ] Implement audio actions
  - [ ] Add audio selectors

- [ ] 5.3 Create CircularProgressPlayer

  - [ ] Design circular progress with elliptical track
  - [ ] Implement progress animation
  - [ ] Add touch tracking for seeking
  - [ ] Create time display component

- [ ] 5.4 Build transport controls

  - [ ] Create play/pause button with animation
  - [ ] Implement previous/next buttons
  - [ ] Add repeat functionality
  - [ ] Create volume control

- [ ] 5.5 Implement LyricsDisplay

  - [ ] Create scrollable lyrics container
  - [ ] Implement synchronized highlighting
  - [ ] Add support for both languages
  - [ ] Handle auto-scroll during playback

- [ ] 5.6 Build AudioWaveform visualization

  - [ ] Create waveform generator from audio data
  - [ ] Implement waveform display component
  - [ ] Add current position indicator
  - [ ] Support seeking via waveform tap

- [ ] 5.7 Create full-screen player

  - [ ] Design immersive player with background
  - [ ] Implement gesture handling
  - [ ] Add all player components
  - [ ] Support device orientation changes

- [ ] 5.8 Build minimized player

  - [ ] Create compact player component
  - [ ] Implement basic controls
  - [ ] Add track info display
  - [ ] Position above bottom tabs

- [ ] 5.9 Implement player animations

  - [ ] Create expand/collapse animation
  - [ ] Add smooth transitions
  - [ ] Implement gesture-based control
  - [ ] Handle transition between states

- [ ] 5.10 Add background audio support

  - [ ] Configure app for background audio
  - [ ] Add lock screen controls
  - [ ] Handle audio interruptions
  - [ ] Implement audio session management

- [ ] 5.11 Create OrikiDetail screen
  - [ ] Design screen with oriki information
  - [ ] Add playback functionality
  - [ ] Implement lyrics display
  - [ ] Create metadata section

## Contributor & Content Creation

- [ ] 6.1 Build Contributor screen

  - [ ] Create layout with user info
  - [ ] Add "Share Oriki" card
  - [ ] Implement contributions list
  - [ ] Group contributions by date

- [ ] 6.2 Create ContributionItem component

  - [ ] Design item with oriki info
  - [ ] Add status indicator
  - [ ] Implement edit action
  - [ ] Support deletion with confirmation

- [ ] 6.3 Build Share Oriki form

  - [ ] Create form with title, category selection
  - [ ] Add text areas for Yoruba and English
  - [ ] Implement category tag selection
  - [ ] Create audio upload section

- [ ] 6.4 Implement audio recording

  - [ ] Install: `npx expo install expo-av expo-media-library`
  - [ ] Create audio recorder service
  - [ ] Implement recording controls
  - [ ] Add audio playback for verification

- [ ] 6.5 Build Edit Oriki screen

  - [ ] Implement form with pre-filled data
  - [ ] Add audio replacement functionality
  - [ ] Create update functionality
  - [ ] Handle success and error states

- [ ] 6.6 Implement submission flow

  - [ ] Create multi-step submission process
  - [ ] Add validation for required fields
  - [ ] Implement audio upload with progress
  - [ ] Create success feedback

- [ ] 6.7 Build SubmissionSuccessIndicator
  - [ ] Design success animation
  - [ ] Create success message display
  - [ ] Implement automatic navigation

## Lyrics Synchronization

- [ ] 7.1 Create Lyrics Syncing screen

  - [ ] Design screen with audio and text sections
  - [ ] Implement language toggle
  - [ ] Add playback controls
  - [ ] Create progress tracking

- [ ] 7.2 Build AudioWaveformWithMarkers

  - [ ] Create waveform with draggable markers
  - [ ] Implement marker dragging logic
  - [ ] Add time display for markers
  - [ ] Support playback from markers

- [ ] 7.3 Implement LyricsSection component

  - [ ] Design section with text display
  - [ ] Add state indicators
  - [ ] Implement timestamp display
  - [ ] Create active state styling

- [ ] 7.4 Create text segmentation logic

  - [ ] Implement automatic text splitting
  - [ ] Handle special characters and punctuation
  - [ ] Support both languages
  - [ ] Add manual override option

- [ ] 7.5 Build timestamp data management

  - [ ] Create data structure for timestamps
  - [ ] Implement saving and loading
  - [ ] Add validation for completeness
  - [ ] Handle language-specific timestamps

- [ ] 7.6 Create Preview screen

  - [ ] Design screen with player and lyrics
  - [ ] Implement playback with synchronization
  - [ ] Add language toggle
  - [ ] Create finish button

- [ ] 7.7 Implement publishing flow
  - [ ] Add publish functionality to finish button
  - [ ] Create loading state with progress
  - [ ] Implement success feedback
  - [ ] Handle publishing errors

## Polish & Optimization

- [ ] 8.1 Implement animations and transitions

  - [ ] Add screen transitions
  - [ ] Implement micro-interactions
  - [ ] Create loading animations
  - [ ] Add success/error animations

- [ ] 8.2 Optimize performance

  - [ ] Add list virtualization
  - [ ] Implement image caching
  - [ ] Optimize Redux selectors
  - [ ] Add component memoization

- [ ] 8.3 Enhance accessibility

  - [ ] Add screen reader support
  - [ ] Implement dynamic font sizing
  - [ ] Create voice navigation
  - [ ] Add proper focus management

- [ ] 8.4 Implement error handling

  - [ ] Add error boundaries
  - [ ] Create error feedback components
  - [ ] Implement retry logic
  - [ ] Add offline support

- [ ] 8.5 Add analytics tracking

  - [ ] Install analytics package
  - [ ] Track key user events
  - [ ] Measure performance metrics
  - [ ] Add crash reporting

- [ ] 8.6 Create user personalization

  - [ ] Implement favorites functionality
  - [ ] Add recently viewed tracking
  - [ ] Create content filtering
  - [ ] Build user preferences

- [ ] 8.7 Perform final testing

  - [ ] Run unit tests for components
  - [ ] Perform integration testing
  - [ ] Do manual UI testing
  - [ ] Test on multiple device sizes

- [ ] 8.8 Prepare for deployment
  - [ ] Configure app for production
  - [ ] Create app icons and splash screen
  - [ ] Prepare app store listings
  - [ ] Generate build files

## Development Notes

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Implementation Approach

- Focus on building and testing core components first
- Ensure components work across different screen sizes
- Use the mock API service during development
- Implement proper error handling from the beginning
- Document code with JSDoc comments
- Create unit tests for key components
- Use feature branches for development

### Testing Strategy

- Unit test base components with Jest and Testing Library
- Test Redux reducers and selectors
- Manually test UI on iOS and Android devices
- Test accessibility features with screen readers
- Verify internationalization works properly

### Performance Considerations

- Minimize re-renders using React.memo and useCallback
- Optimize images and assets
- Use virtualized lists for large data sets
- Implement proper loading states
- Optimize animations for performance
