# Screen Documentation

This document contains detailed specifications for all screens in the Akewi app, identified from the design files.

## Template for Screen Documentation

### [Screen Name]

**Description:**  
Brief description of the screen's purpose and functionality.

**Screen Path:**  
`/path/to/screen` (Expo Router path)

**Components Used:**

- ComponentA
- ComponentB
- ComponentC

**Component Hierarchy:**

```
ScreenComponent
├── HeaderComponent
├── ContentComponent
│   ├── CardComponent
│   │   ├── TitleComponent
│   │   └── DescriptionComponent
│   └── ButtonComponent
└── FooterComponent
```

**State Requirements:**

- userProfile: User's profile data
- isLoading: Loading state for data fetching
- etc.

**API Endpoints:**

- GET /api/endpoint - Description of what this fetches
- POST /api/endpoint - Description of what this updates

**Navigation:**

- Screens that navigate to this screen
- Screens that this screen navigates to

**User Interactions:**

- Action 1: Description of what happens
- Action 2: Description of what happens

**Variants/States:**

- Loading state
- Error state
- Empty state
- etc.

**Notes:**
Any additional notes or considerations for implementation.

## Screens

### Onboarding/Login Screen

**Description:**  
The initial screen users see when not logged in. Provides options to sign in with email or phone number, as well as social authentication options.

**Screen Path:**  
`/` or `/auth/login` (Expo Router path)

**Components Used:**

- LanguageSelector (Top right)
- VoiceButton (Red circular audio button)
- Logo (AKEWI)
- Text (Description text)
- TextInput (Email/Phone input)
- Button (Primary "Continue" button)
- Divider (Or divider)
- SocialButton (Google and Apple authentication buttons)

**Component Hierarchy:**

```
LoginScreen
├── Header
│   ├── VoiceButton
│   └── LanguageSelector
├── ContentContainer
│   ├── Logo
│   ├── DescriptionText
│   ├── EmailPhoneInput
│   ├── ContinueButton
│   ├── Divider
│   ├── GoogleButton
│   └── AppleButton
```

**State Requirements:**

- loginIdentifier: string - User's email or phone input
- loginIdentifierType: 'email' | 'phone' | null - Detected type of login credential
- isLoading: boolean - Loading state during authentication
- authError: string | null - Any authentication errors
- currentLanguage: string - The selected language code

**API Endpoints:**

- POST /auth/email - Send email for magic link or verification
- POST /auth/phone - Send SMS verification code
- POST /auth/social - Handle social authentication

**Navigation:**

- Navigates to: Email verification screen, SMS verification screen, or Main app screens upon successful authentication

**User Interactions:**

- User enters email or phone and taps Continue: System detects input type and initiates appropriate verification flow
- User taps Google/Apple button: Initiates social authentication flow
- User taps language selector: Opens language selection modal

**Variants/States:**

- Default state
- Loading state (when authentication is in progress)
- Error state (when authentication fails)
- Field validation state (email/phone format validation)
- Keyboard visible state (when user is typing in input field)
- Localized state (when displayed in different languages)

**Language Variations:**
The screen is fully localized with all text elements translatable:

| UI Element            | English                                                       | Yoruba                                                                   |
| --------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Description text      | "Create easy and secure financial transactions through voice" | "Ṣàwárí, fẹ́tí sí, kí o sì pín Oríkì tí ń ṣe àyẹyẹ ìbílẹ̀, ìdílé, àti aṣa" |
| Input placeholder     | "Enter your email or phone number"                            | "Tẹ ìméèlì rẹ tàbí nọ́mbà tẹlifóònù rẹ"                                   |
| Continue button       | "Continue"                                                    | "Tẹ̀síwájú"                                                               |
| Divider text          | "or"                                                          | "tàbí"                                                                   |
| Social login - Google | "Continue with Google"                                        | "Tẹ̀síwájú pẹ̀lú Google"                                                   |
| Social login - Apple  | "Continue with Apple"                                         | "Tẹ̀síwájú pẹ̀lú Apple"                                                    |

**Notes:**

- Keyboard behavior: The screen layout ensures the keyboard appears below the input field without obscuring it
- Input field needs to detect whether user entered an email or phone number and validate accordingly
- Phone number input may require country code handling
- Different verification flows should be triggered based on the detected input type
- All text elements need to be localized based on language selection
- Consider implementing keyboard avoidance behavior on Android to match iOS behavior
- Language selection needs to persist across app sessions
- The UI layout accommodates text length variations between languages
- Note that description text translations appear to be different between languages, not just direct translations, possibly for cultural relevance
- Error messages should also be localized

### User Details Form Screen

**Description:**  
Form screen for collecting user details after initial login, including name, state, town, and family information. Features interactive accessibility support through voice reading functionality that guides users through form completion.

**Screen Path:**  
`/auth/user-details` (Expo Router path)

**Components Used:**

- BackButton (Top left)
- LanguageSelector (Top right)
- VoiceButton (Red circular audio button)
- Text (Title and description)
- TextInput (Name, Town, Family inputs)
- SelectInput (State dropdown)
- Button (Primary "Continue" button)

**Component Hierarchy:**

```
UserDetailsScreen
├── Header
│   ├── BackButton
│   ├── VoiceButton
│   └── LanguageSelector
├── ContentContainer
│   ├── TitleText
│   ├── DescriptionText
│   ├── Form
│   │   ├── NameInput
│   │   ├── StateSelect
│   │   ├── TownInput
│   │   └── FamilyInput
│   └── ContinueButton
```

**State Requirements:**

- userDetails: Object containing user form data
  - name: string
  - state: string
  - town: string
  - family: string (optional)
- formValidation: Object containing validation states
- isLoading: boolean - Loading state during submission
- currentLanguage: string - The selected language code
- isVoiceReading: boolean - Whether voice reading is active
- currentVoiceElement: string | null - ID of the element currently being read aloud

**API Endpoints:**

- POST /user/profile - Submit user profile information

**Navigation:**

- Navigates from: Login or Verification screen
- Navigates to: Next onboarding step or main app screens

**User Interactions:**

- User enters personal details in form fields
- User selects state from dropdown
- User taps Continue to proceed
- User can tap back button to return to previous screen
- User can tap voice button to activate interactive voice guidance through form elements:
  - When voice mode is active, each input is sequentially focused and highlighted
  - For text inputs, user enters text and presses Enter key on keyboard to move to next field
  - For select inputs, choosing an option automatically advances to the next field
  - Voice mode waits for user input at each interactive element before proceeding

**Accessibility Features:**

- Interactive Voice Guidance: When the voice button is tapped, the app reads out form fields and waits for user input at each field
- Visual Highlighting: Each input element being read/focused is visually highlighted with a red border and light background
- Input Status Icons: Special icon appears in inputs when they are in voice mode
- Voice Button States: The voice button changes appearance when waiting for user input vs. actively reading
- Keyboard Navigation: Enter key advances to next field when in voice mode
- Auto-Advancement: Select dropdown automatically advances after selection
- Language Support: Voice guidance works in the user's selected language
- Visual Cues: The voice button and inputs have distinct visual states to indicate the current interaction mode

**Variants/States:**

- Default state
- Form validation states (error highlighting for required fields)
- Loading state (when submitting)
- Dropdown open state (when selecting state)
- Keyboard visible states (when typing in text fields)
- Localized state (when displayed in different languages)
- Voice reading state (when accessibility voice feature is active)

**Language Variations:**
The screen is fully localized with all text elements translatable:

| UI Element                                      | English                                            | Yoruba                                       |
| ----------------------------------------------- | -------------------------------------------------- | -------------------------------------------- |
| Title                                           | "Enter your details"                               | "Tẹ àwọn alaye rẹ sií"                       |
| Description                                     | "Add the following to personalize your experience" | "Ṣàfikún àwọn atẹle látí ṣe àkànṣe ìrírí rẹ" |
| Name field                                      | "Name"                                             | "Kí ní Orúko rẹ"                             |
| State field                                     | "State"                                            | "Ìpínlẹ́ tí Òtí"                              |
| Town field                                      | "Town"                                             | "Ilu àbínibí"                                |
| Family field                                    | "Family (Optional)"                                | "Idile (Aṣayan)"                             |
| Continue button                                 | "Continue"                                         | "Tẹ̀síwájú"                                   |
| Voice reading button label (for screen readers) | "Activate voice reading"                           | "Sọ orukọ rẹ"                                |

**Notes:**

- All text elements need to be localized based on language selection
- State dropdown should contain localized state/region names
- Input placeholders and validation messages require localization
- The voice feature provides interactive guidance through the form:
  - Highlights each field sequentially
  - Provides visual cues for the current field
  - Reads instructions/labels in the user's language
  - Waits for input before proceeding to next field
  - Listens for Enter key to advance from text inputs
  - Automatically advances after dropdown selection
- The voice button changes appearance to indicate when it's waiting for user input
- Special icons appear within inputs when they're the current focus of voice guidance
- Consider keyboard avoidance behavior for multiple input fields
- Optional field (Family) is clearly marked to set user expectations
- The Yoruba translations sometimes require more space than English equivalents, so UI layout must be flexible
- Note that the translations maintain the same meaning but are culturally adapted
- The voice reading functionality requires implementation of Text-to-Speech in both English and Yoruba with interactive input handling

### Home Screen

**Description:**  
The main screen users see after logging in. Displays featured oriki content, popular items, recently added content, and category browsing options. Serves as the hub for discovering and accessing oriki content.

**Screen Path:**  
`/home` (Expo Router path)

**Components Used:**

- Header with app title "Oriki"
- VoiceButton (Red circular button for accessibility)
- LanguageSelector (Top right)
- FeaturedOrikiCard (Large horizontal scrollable card)
- SectionHeader (For "Popular oriki", "Recently added", "Top Categories")
- OrikiItem (Individual oriki entries with actions)
- CategoryCard (Cards for oriki categories)
- Divider (Between list items)
- BottomNavigation (Home, Explore, Contributor tabs)
- MinimizedPlayer (When audio is playing and full player is minimized)

**Component Hierarchy:**

```
HomeScreen
├── SafeAreaView
│   ├── Header
│   │   ├── Text (Oriki title)
│   │   ├── VoiceButton
│   │   └── LanguageSelector
│   ├── ScrollView (Main content)
│   │   ├── FeaturedOrikiCarousel
│   │   │   └── FeaturedOrikiCard (Family Oriki)
│   │   ├── SectionHeader (Popular oriki)
│   │   ├── FilterText ("From your /State/ Town / Family")
│   │   ├── OrikiList (Popular)
│   │   │   ├── OrikiItem
│   │   │   ├── Divider
│   │   │   ├── OrikiItem
│   │   │   └── ...
│   │   ├── SectionHeader (Recently added)
│   │   ├── OrikiList (Recent)
│   │   │   ├── OrikiItem
│   │   │   ├── Divider
│   │   │   ├── OrikiItem
│   │   │   └── ...
│   │   ├── SectionHeader (Top Categories)
│   │   └── CategoryList
│   │       ├── CategoryCard
│   │       ├── CategoryCard
│   │       └── ...
│   ├── MinimizedPlayer (Appears when audio is playing)
│   └── BottomNavigation
│       ├── HomeTab (active)
│       ├── ExploreTab
│       └── ContributorTab
```

**State Requirements:**

- featuredOriki: Array of featured oriki content items
- popularOriki: Array of popular oriki items
- recentOriki: Array of recently added oriki items
- categories: Array of oriki categories
- currentLanguage: string - The selected language code
- userProfile: Object containing user profile data (for filtering)
- isLoading: boolean - Loading state for data fetching
- currentlyPlayingOriki: Object - Data for currently playing oriki (when minimized player is shown)
- audioPlaybackState: Object - Current state of audio playback

**API Endpoints:**

- GET /api/oriki/featured - Fetch featured oriki content
- GET /api/oriki/popular - Fetch popular oriki items
- GET /api/oriki/recent - Fetch recently added oriki items
- GET /api/categories - Fetch oriki categories

**Navigation:**

- Navigates from: Login/Authentication flow or app startup (if already logged in)
- Navigates to:
  - Oriki details screen (when tapping an oriki item)
  - Category browsing screen (when tapping a category)
  - Explore screen (via bottom navigation)
  - Contributor screen (via bottom navigation)

**User Interactions:**

- User can tap on featured oriki card to view detailed content
- User can tap on individual oriki items to view details
- User can tap play button on oriki items to listen to content
- User can tap lyrics button on oriki items to view text content
- User can tap "Explore all" to see more content in a section
- User can navigate between tabs using bottom navigation
- User can tap language selector to change app language
- User can tap voice button to activate accessibility features

**Variants/States:**

- Default state - Displaying all content
- Loading state - While fetching content
- Empty states - When sections have no content to display
- Filtered state - When content is filtered by user's state/town/family
- Voice reading state - When accessibility reading is active

**Notes:**

- The Home screen uses consistent safe area insets to ensure content is properly displayed on all devices
- The main content is scrollable, with multiple horizontal sections
- The featured oriki card has a distinctive red background with white text
- Each oriki item includes:
  - Color-coded initial/icon (e.g., "WE" in orange, "CF" in red)
  - Title ("Oriki Idílé Adéwálé")
  - Description ("Praise Poetry of the Adéwálé Family")
  - Action buttons (lyrics/book icon and play button)
- Sections are clearly separated with headers and spacing
- The "Explore all >" text acts as a button to see more content
- The bottom navigation shows the current tab (Home) as selected
- All text content needs to be localized based on the selected language
- Categories appear to have different colors and counts (e.g., "40+" items)

### Explore Screen

**Description:**  
Primary discovery screen that allows users to browse all oriki categories and search for specific content. Features a clean, vertically-organized layout with visually distinct category cards and a prominent search bar.

**Screen Path:**  
`/explore` (Expo Router path)

**Components Used:**

- SearchBar (Top of screen with "Search Oriki" placeholder)
- Text ("All Categories" heading)
- CategoryCard (Multiple category cards with distinct styling)
- BottomNavigation (Home, Explore, Contributor tabs)

**Component Hierarchy:**

```
ExploreScreen
├── SafeAreaView
│   ├── SearchBar
│   ├── Text (All Categories)
│   ├── ScrollView (Main content)
│   │   ├── CategoryCard (Oriki Orílè-èdè - Community/Regional)
│   │   ├── CategoryCard (Oriki Ọlọ́run/Òrìṣà - Deity)
│   │   ├── CategoryCard (Oriki Ọmọ - Child)
│   │   ├── CategoryCard (Ethnic Group Oriki)
│   │   └── [Additional CategoryCards]
│   └── BottomNavigation
│       ├── HomeTab
│       ├── ExploreTab (active)
│       └── ContributorTab
```

**State Requirements:**

- searchQuery: string - Current search term
- categories: Array of oriki categories
- isSearchActive: boolean - Whether search is currently in focus
- searchResults: Array of search results (when search is active)
- isLoading: boolean - Loading state for data fetching

**API Endpoints:**

- GET /api/categories - Fetch all oriki categories
- GET /api/search?q={searchQuery} - Search for oriki content

**Navigation:**

- Navigates from: Home screen or app startup
- Navigates to:
  - Category details screen (when tapping a category)
  - Search results screen (when executing a search)
  - Home screen (via bottom navigation)
  - Contributor screen (via bottom navigation)

**User Interactions:**

- User can tap the search bar to initiate a search
- User can type in the search bar to search for oriki content
- User can tap on category cards to browse specific categories
- User can navigate between tabs using bottom navigation

**Variants/States:**

- Default state - Showing all categories
- Loading state - While fetching categories
- Search active state - When search bar is focused
- Search results state - When displaying search results

**Notes:**

- The screen uses a light gray background that contrasts with the colorful category cards
- Each category card has a distinct color scheme and visual identity:
  - Oriki Orílè-èdè: Dark/black background
  - Oriki Ọlọ́run/Òrìṣà: Dark gray background
  - Oriki Ọmọ: Medium gray background
  - Ethnic Group Oriki: Light gray background
- All cards display both reading (book icon) and listening (play icon) options
- Cards use consistent layout but with unique styling to distinguish category types
- Category titles are displayed prominently with subtitles providing English translations
- Item count indicators (like "40+") show the volume of content in each category
- The search bar is prominently positioned for easy discovery
- Bottom navigation clearly indicates the current "Explore" tab as selected

### Search Results Screen

**Description:**  
A results screen that appears when a user searches for oriki content from the Explore tab. Displays matching oriki items in a simple, scrollable list format with the active search query maintained in the search bar.

**Screen Path:**  
`/explore/search` (Expo Router path)

**Components Used:**

- SearchBar (Top of screen with active query)
- Text (Results count header)
- OrikiItem (Multiple result items)
- KeyboardAvoidingView (For proper keyboard integration)

**Component Hierarchy:**

```
SearchResultsScreen
├── SafeAreaView
│   ├── SearchBar (with active query)
│   ├── Text (Result count)
│   └── FlatList
│       ├── OrikiItem
│       ├── OrikiItem
│       ├── OrikiItem
│       └── ... (additional results)
```

**State Requirements:**

- searchQuery: string - The current search term
- searchResults: Array of search result items
- totalResults: number - Total count of results
- isLoading: boolean - Loading state while fetching results
- currentPage: number - For pagination if implemented

**API Endpoints:**

- GET /api/search?q={searchQuery} - Search for oriki content

**Navigation:**

- Navigates from: Explore screen (when search is executed)
- Navigates to:
  - Oriki detail screen (when tapping a result item)
  - Back to Explore screen (when clearing search)

**User Interactions:**

- User can modify search query to refine results
- User can tap on a result item to view its details
- User can tap the book/lyrics icon to view text content
- User can tap the play button (when available) to listen to audio
- User can clear the search and return to Explore screen

**Variants/States:**

- Results state - Showing matching items
- Loading state - While fetching results
- Empty state - When no results match the query
- Error state - If search fails to execute

**Notes:**

- The search results appear below the search bar as a scrollable list
- Results count is displayed as "Result (X)" where X is the number of matches
- Each OrikiItem in the results shows:
  - An InitialIcon with consistent styling (orange "WE" circle in example)
  - Title ("Oriki Idílé Adéwálé")
  - Subtitle/description ("Praise Poetry of the Adéwálé Family")
  - Book/lyrics icon on the right for viewing text content
  - Play button (red circle icon) only appears on items with audio content
- The keyboard remains visible when search results are first displayed
- The results list should implement proper scroll behavior to work with the keyboard
- Search appears to match within titles and possibly content
- Some items have audio content (indicated by play button) while others are text-only
- The UI should handle long result lists with proper virtualization and performance optimizations

### Category Detail Screen

**Description:**  
A detailed screen that displays all oriki content within a specific category after a user taps on a category card. Features category metadata, filtering options, and a scrollable list of oriki items belonging to the selected category.

**Screen Path:**  
`/category/[categoryId]` (Expo Router path)

**Components Used:**

- Header with category title and subtitle
- LanguageSelector (Top right with globe icon)
- ActionIcons (Book and play icons for category-wide actions)
- RecentlyAddedCard (Dark banner showing newest content)
- FilterTabs (Horizontal scrollable filter options)
- OrikiItem (Multiple list items showing category content)

**Component Hierarchy:**

```
CategoryDetailScreen
├── Header
│   ├── Text (Category title - e.g., "Oriki Orílè-èdè")
│   ├── Text (Category subtitle - e.g., "Community/Regional Oriki")
│   ├── LanguageSelector
│   └── ActionIcons (Book and Play)
├── ScrollView (Main content)
│   ├── RecentlyAddedCard
│   │   └── Text (Recently added)
│   ├── FilterTabs
│   │   ├── FilterTab (All - active)
│   │   ├── FilterTab (Oluyole)
│   │   ├── FilterTab (Osun)
│   │   ├── FilterTab (Ekiti)
│   │   └── FilterTab (Ondo)
│   └── OrikiList
│       ├── OrikiItem
│       ├── OrikiItem
│       ├── OrikiItem
│       └── ... (additional items)
```

**State Requirements:**

- category: Object containing category metadata
- categoryItems: Array of oriki items in this category
- recentlyAdded: Array of most recent items in the category
- selectedFilter: string - Current filter selection (e.g., "All", "Oluyole", etc.)
- isLoading: boolean - Loading state while fetching content
- currentLanguage: string - The selected language code

**API Endpoints:**

- GET /api/categories/[categoryId] - Fetch category metadata
- GET /api/categories/[categoryId]/items - Fetch all items in category
- GET /api/categories/[categoryId]/items/recent - Fetch recently added items
- GET /api/categories/[categoryId]/items?filter=[filterName] - Fetch filtered items

**Navigation:**

- Navigates from: Explore screen (category card tap)
- Navigates to:
  - Oriki detail screen (when tapping an oriki item)
  - Category content player (when tapping play icon)
  - Category text viewer (when tapping book icon)

**User Interactions:**

- User can tap on the language selector to change display language
- User can tap book icon to view all text content in the category
- User can tap play icon to listen to audio content in the category
- User can select filter tabs to narrow content by region or type
- User can tap on individual oriki items to view their details
- User can tap book icon on an item to view its text content
- User can tap play button (when available) to listen to an item's audio

**Variants/States:**

- Default state - Showing all content with "All" filter
- Filtered state - Showing content filtered by a specific region/type
- Loading state - While fetching category data
- Empty state - When a category or filter has no content

**Notes:**

- The screen shows the category title in its original language with a subtitle providing translation
- Category-specific styling appears to be maintained from the Explore screen (dark background for Community/Regional oriki)
- The filter tabs use a horizontal scroll with the active filter highlighted
- Filters appear to be category-specific, showing relevant regions for the content type
- The "Recently added" section highlights new content at the top of the list
- OrikiItems maintain consistent styling with the search results screen:
  - Same initial icons (WE in orange)
  - Consistent title and description format
  - Book icon for text viewing
  - Conditional play button only on items with audio content
- The language selector allows for viewing content in different languages
- The category-wide action icons (book and play) apply to all content in the category
- No bottom navigation is visible, suggesting this is a modal or detail screen within the Explore tab

### Oriki Player Screen

**Description:**  
A detailed player screen that appears when a user selects an oriki item. This immersive screen combines audio playback with synchronized lyrics display, allowing users to both read and listen to oriki content in their preferred language.

**Screen Path:**  
`/oriki/[orikiId]` (Expo Router path)

**Components Used:**

- DragHandle (Minimization indicator at top)
- Header with oriki title and subtitle
- LanguageToggle (Yoruba/English toggle)
- SaveToPlaylistButton (Bookmark functionality)
- LyricsDisplay (Scrollable lyrics with highlighted current line)
- AudioWaveform (Audio visualization)
- CircularProgressPlayer (Elliptical progress indicator with playback controls)

**Component Hierarchy:**

```
OrikiPlayerScreen
├── Background (Deep red/maroon)
├── StatusBarOverlay (Extends background color to status bar)
├── DragHandle (Minimization indicator)
├── Header
│   ├── Text (Oriki title - e.g., "Oriki Idílé Adéwálé")
│   ├── Text (Subtitle - e.g., "Praise Poetry of the Adéwálé Family")
│   ├── LanguageToggle
│   │   ├── Button (Yoruba)
│   │   └── Button (English)
│   └── SaveToPlaylistButton
├── ScrollView
│   └── LyricsDisplay (with active line highlighting)
├── AudioWaveform (Visualization of audio)
└── CircularProgressPlayer
    ├── ProgressIndicator (Red dot on elliptical track)
    ├── PreviousButton
    ├── PlayPauseButton
    └── NextButton
```

**State Requirements:**

- oriki: Object containing the complete oriki data (title, subtitle, lyrics, audio)
- playerState: Object tracking playback state
  - isPlaying: boolean - Whether audio is currently playing
  - currentPosition: number - Current playback position (seconds)
  - duration: number - Total duration of audio (seconds)
  - currentLineIndex: number - Index of the currently played/highlighted lyric line
- selectedLanguage: string - Current language selection (e.g., 'yoruba', 'english')
- isSavedToPlaylist: boolean - Whether this oriki is saved to the user's playlist
- waveformData: Array - Data for audio visualization
- isMinimized: boolean - Whether the player is currently in minimized state

**API Endpoints:**

- GET /api/oriki/[orikiId] - Fetch oriki details including lyrics and audio
- PUT /api/users/playlists - Save/remove oriki from user's playlist
- GET /api/oriki/audio/[orikiId] - Fetch audio file for streaming

**Navigation:**

- Navigates from: Home, Explore, Search Results, or Category Detail screens
- Minimizes to: Previous screen when drag handle is used, showing MinimizedPlayer
- Can navigate to: Next or previous oriki in a playlist or category

**User Interactions:**

- Drag down on handle: Minimizes the player and returns to previous screen, showing the MinimizedPlayer at the bottom
- Tap language toggle: Switches lyrics between Yoruba and English
- Tap Save button: Adds/removes oriki from user's saved playlist
- Tap on lyrics: Begins playback from the tapped line
- Tap play/pause: Controls audio playback
- Tap previous/next: Navigates to previous/next track in playlist
- Tap on progress indicator: Seeks to that position in the audio
- Scroll: View all lyrics while playback continues

**MinimizedPlayer Behavior:**

- Appears at the bottom of the screen (above bottom navigation) when full player is minimized
- Persists across different screens while audio continues playing
- Shows current oriki title, subtitle, and playback controls
- Tapping on the minimized player expands back to full-screen mode
- Tapping play/pause controls playback without expanding the player
- Remains visible until playback is stopped or paused by the user
- Adjusts UI elements above it (like content lists) to avoid being obscured

**Variants/States:**

- Playing state: Shows pause button, active waveform, moving progress indicator
- Paused state: Shows play button, static waveform, stationary progress indicator
- Loading state: While audio or lyrics are loading
- Saved state: When oriki is saved to playlist (filled bookmark icon)
- Unsaved state: When oriki is not in playlist (outline bookmark icon)
- Yoruba language state: Displaying lyrics in Yoruba
- English language state: Displaying lyrics in English
- Minimized state: When player is collapsed to the MinimizedPlayer component

**Notes:**

- The background uses a deep red/maroon color that extends to the status bar for an immersive experience
- The current line of the lyrics is highlighted in white, while other lines appear in a muted gray
- The audio waveform visualization provides visual feedback of the audio pattern
- The circular/elliptical progress indicator shows playback progress with a red dot
- Lyrics should automatically scroll to keep the current line visible during playback
- The player should support background audio playback when the app is minimized
- When lyrics are displayed but audio is not playing, the UI should indicate this state clearly
- The minimization handle (line icon) at the top allows users to return to the previous screen
- Consider adding haptic feedback for interactions with the playback controls
- Audio buffering and quality adjustments may be needed for different network conditions
- The minimized player should be implemented as a global overlay that persists across screen navigation
- Screen content should adjust its bottom padding when the minimized player is visible
- Playback state should be managed through a global audio service to ensure continuity

### Contributor Screen

**Description:**  
Allows users to contribute their own oriki content to the platform and manage their previous submissions. This screen serves as a hub for user-generated content, encouraging community participation in preserving and sharing cultural knowledge.

**Screen Path:**  
`/contributor` (Expo Router path)

**Components Used:**

- Header with screen title "Contributor"
- ProfileButton (Top right corner)
- ShareOrikiCard (Button to add new oriki)
- DateDivider (Sections for different submission periods)
- ContributionItem (List items showing user's previous submissions)
- EditButton (For modifying existing contributions)
- BottomNavigation (Home, Explore, Contributor tabs)

**Component Hierarchy:**

```
ContributorScreen
├── Header
│   ├── Text (Contributor title)
│   └── ProfileButton
├── ScrollView (Main content)
│   ├── ShareOrikiCard
│   │   ├── Icon (Plus/Add)
│   │   ├── Title ("Share an Orik")
│   │   └── Description ("Add an Oriki in Yoruba, its English translation...")
│   ├── Text (My contributions)
│   ├── ContributionsList
│   │   ├── DateDivider (Jan 2025)
│   │   ├── ContributionItem
│   │   │   ├── InitialIcon
│   │   │   ├── Text (Title)
│   │   │   ├── Text (Description)
│   │   │   └── EditButton
│   │   ├── ContributionItem
│   │   │   └── ...
│   │   ├── DateDivider (Dec 2024)
│   │   ├── ContributionItem
│   │   │   └── ...
│   │   └── ...
│   └── BottomNavigation
│       ├── HomeTab
│       ├── ExploreTab
│       └── ContributorTab (active)
```

**State Requirements:**

- userContributions: Array of user's submitted oriki content
- isLoading: boolean - Loading state for data fetching
- contributionsByDate: Object - Contributions organized by submission date
- profileData: Object - Basic user profile information

**API Endpoints:**

- GET /api/user/contributions - Fetch user's submitted oriki
- POST /api/oriki/submit - Submit new oriki content
- PUT /api/oriki/[orikiId] - Update existing oriki submission

**Navigation:**

- Navigates from: Home or Explore tabs
- Navigates to:
  - Share Oriki form (when tapping the Share Oriki card)
  - Edit Oriki screen (when tapping edit icon on a contribution)
  - Profile screen (when tapping the profile button)

**User Interactions:**

- User can tap the Share Oriki card to create and submit new oriki content
- User can tap the edit icon on an existing contribution to modify it
- User can tap the profile button to access their profile settings
- User can navigate between tabs using bottom navigation
- User can tap on a contribution item to view its details

**Variants/States:**

- Default state - Showing all user contributions
- Loading state - While fetching contributions
- Empty state - When user has no submitted contributions
- Error state - If retrieving contributions fails

**Notes:**

- The Share Oriki card has a distinctive design with a red plus icon and explanatory text
- Contributions are organized chronologically with date headers
- Each contribution includes:
  - Color-coded initial icons that match the main app's visual language
  - Title in the original language (e.g., "Oriki Idílé Adéwálé")
  - Description/translation (e.g., "Praise Poetry of the Adéwálé Family")
  - Edit button for modifying submissions
- The profile button provides quick access to user account settings
- Consider implementing pull-to-refresh functionality for updating the contributions list
- Implement proper error handling for submission failures
- Add confirmation for edit actions to prevent accidental changes
- Date groupings help organize contributions chronologically and provide context

### Share Oriki Screen

**Description:**  
Form screen that allows users to create and submit new oriki content to the platform. Supports adding content in Yoruba with English translations and optional audio recordings.

**Screen Path:**  
`/contributor/share` (Expo Router path)

**Components Used:**

- Header with screen title and back button
- Form with multiple inputs:
  - OrikiTitleInput (Yoruba title)
  - OrikiDescriptionInput (English translation/description)
  - OrikiContentInput (Full oriki text in Yoruba)
  - OrikiTranslationInput (Full oriki text in English)
  - AudioRecorder (Optional audio component)
- SubmitButton (To finalize submission)

**Component Hierarchy:**

```
ShareOrikiScreen
├── Header
│   ├── BackButton
│   └── Text (Share an Oriki)
├── ScrollView (Form container)
│   ├── Form
│   │   ├── OrikiTitleInput
│   │   ├── OrikiDescriptionInput
│   │   ├── OrikiContentInput (Multiline)
│   │   ├── OrikiTranslationInput (Multiline)
│   │   └── AudioRecorder (Optional)
│   │       ├── RecordButton
│   │       ├── PlaybackControls
│   │       └── WaveformVisualizer
│   └── SubmitButton
```

**State Requirements:**

- orikiForm: Object containing form data
  - title: string
  - description: string
  - content: string
  - translation: string
  - audioRecording: File | null
- formValidation: Object containing validation states
- isSubmitting: boolean - Loading state during submission
- recordingState: Object - State for audio recording functionality

**API Endpoints:**

- POST /api/oriki/submit - Submit new oriki content
- POST /api/audio/upload - Upload audio recording

**Navigation:**

- Navigates from: Contributor screen
- Navigates to: Contributor screen (after successful submission)

**User Interactions:**

- User enters oriki title, description, content, and translation
- User can record audio by tapping the record button
- User can preview recorded audio before submission
- User taps Submit to send the oriki to the platform
- User can tap back button to cancel and return to Contributor screen

**Variants/States:**

- Default state - Empty form
- Validation state - Form with validation errors
- Recording state - When audio is being recorded
- Playback state - When previewing recorded audio
- Submitting state - Loading indicator while submitting
- Success state - Confirmation of successful submission
- Error state - When submission fails

**Notes:**

- All text fields should support proper localization
- Audio recording should have clear indicators for recording status
- Consider implementing save as draft functionality
- Validation should be robust but user-friendly
- Provide clear error messages for validation failures
- The form should handle keyboard appearance gracefully
- Audio recording should use proper permissions handling
- Consider adding a character/word count for text fields
- Implement auto-save to prevent loss of user input

### Edit Oriki Screen

**Description:**  
Allows users to modify their previously submitted oriki content. Similar to the Share Oriki screen but pre-populated with existing content.

**Screen Path:**  
`/contributor/edit/[orikiId]` (Expo Router path)

**Components Used:**

- Header with BackButton and "Oriki details" title
- Description text explaining the purpose
- Form with multiple inputs:
  - OrikiTitleInput (Title field)
  - CategorySelectionTags (Multiple selectable category tags)
  - OrikiBodyInput (Full oriki text in Yoruba)
  - EnglishTranslationInput (Full oriki text in English)
  - AudioFileUpload (For adding audio recording file)
- ContinueButton (To finalize submission)

**Component Hierarchy:**

```
EditOrikiScreen
├── Header
│   ├── BackButton
│   └── Text ("Oriki details")
├── Text (Description - "Upload an Oriki in Yoruba, provide an English translation, and add an audio recording")
├── ScrollView (Form container)
│   ├── Form
│   │   ├── FormField
│   │   │   ├── Label ("Oriki title")
│   │   │   └── TextInput (Placeholder: "Short and descriptive name")
│   │   ├── FormField
│   │   │   ├── Label ("Select Category")
│   │   │   └── CategoryTags
│   │   │       ├── CategoryTag ("Ìdílé (Family Oriki)")
│   │   │       ├── CategoryTag ("Ọba (Royal Oriki)")
│   │   │       ├── CategoryTag ("Òrìṣà (Deity Oriki)")
│   │   │       ├── CategoryTag ("Ìlú (Town Oriki)")
│   │   │       └── CategoryTag ("Ìtàn (Historical Oriki)")
│   │   ├── FormField
│   │   │   ├── Label ("Oriki Body")
│   │   │   └── TextInput (Multiline, Placeholder: "Full praise poem in Yoruba")
│   │   ├── FormField
│   │   │   ├── Label ("English Translation")
│   │   │   └── TextInput (Multiline, Placeholder: "Full praise poem in English")
│   │   └── FormField
│   │       ├── Label ("Audio Recording")
│   │       └── AudioUploadArea
│   │           ├── UploadIcon
│   │           ├── Text ("Add a audio recording")
│   │           └── AddFileButton ("ADD FILE")
└── ContinueButton
```

**State Requirements:**

- orikiForm: Object containing form data
  - title: string
  - categories: string[] - Array of selected category IDs
  - body: string - Oriki content in Yoruba
  - translation: string - English translation
  - audioFile: File | null - Audio recording file
- selectedCategories: Array of selected category IDs
- formValidation: Object containing validation states
- isSubmitting: boolean - Loading state during submission

**API Endpoints:**

- GET /api/oriki/[orikiId] - Fetch oriki details for editing
- PUT /api/oriki/[orikiId] - Update existing oriki
- DELETE /api/oriki/[orikiId] - Delete oriki
- POST /api/audio/upload - Upload audio recording file

**Navigation:**

- Navigates from: Contributor screen (edit button tap) or Create Oriki flow
- Navigates to: Contributor screen or next step in creation flow (after successful submission)

**User Interactions:**

- User edits oriki title in text field
- User selects/deselects categories by tapping category tags (multiple can be selected)
- User enters oriki body text in Yoruba
- User enters English translation
- User adds audio file by tapping "ADD FILE" button
- User taps Continue to submit changes
- User can tap back button to return to previous screen

**Variants/States:**

- Create mode - Empty form for new submissions
- Edit mode - Pre-populated form with existing content
- Loading state - While fetching original oriki data
- Validation state - Highlighting required fields or errors
- Submitting state - While updating content
- Success state - Confirmation of successful submission
- Error state - When submission fails

**Notes:**

- The form layout uses consistent spacing and styling
- Category tags can be toggled on/off with visual indication of selection state
- Multiple categories can be selected simultaneously
- The audio upload area provides a clear call-to-action for adding audio files
- Text inputs for body and translation are multiline with adequate space for longer content
- All text fields have clear, descriptive placeholders
- Form maintains the app's visual language with clean, minimal aesthetic
- Continue button is fixed at bottom of screen for easy access

### Lyrics Syncing Screen

**Description:**  
A specialized screen that allows users to synchronize oriki text with audio recordings by marking timestamp boundaries for each sentence. This creates timed segments that enable synchronized playback and highlighting of text content. The screen supports synchronizing both the original Yoruba text and its English translation, allowing for a seamless bilingual experience.

**Screen Path:**  
`/contributor/sync-lyrics/[orikiId]` (Expo Router path)

**Components Used:**

- Header with BackButton and title "Sync the Lyrics"
- Description text explaining the synchronization process
- LanguageToggle (Yoruba/English selector)
- LyricsSections (Sections of text split by periods/full stops)
- AudioWaveform (Visualization with interactive timestamp markers)
- PlaybackControls (For each section)
- TimestampIndicators (Duration display for each section)
- ContinueButton (To finalize synchronization)

**Component Hierarchy:**

```
LyricsSyncScreen
├── Header
│   ├── BackButton
│   └── Text ("Sync the Lyrics")
├── Text (Description - "Adjust and sync the audio file you attached with the lyrics")
├── LanguageToggle
│   ├── Button (Yoruba)
│   └── Button (English - active)
├── ScrollView (Main content)
│   ├── ActiveLyricsSection
│   │   ├── Text (Current lyrics section being synced - highlighted)
│   │   ├── PlayButton
│   │   ├── TimestampIndicator ("00:12 - 00:50")
│   │   └── AudioWaveform (Visual representation with draggable markers)
│   ├── LyricsSection (Subsequent section)
│   │   ├── Text (Grayed out lyrics section)
│   │   ├── PlayButton
│   │   ├── TimestampIndicator ("00:50 - 01:23")
│   │   └── AudioWaveform
│   └── Additional LyricsSection components for remaining text
└── ContinueButton
```

**State Requirements:**

- orikiData: Object containing both Yoruba and English oriki text with audio file
- lyricsSections: Object with arrays for both languages
  - yoruba: Array of Yoruba text segments (automatically split by periods)
  - english: Array of English text segments (automatically split by periods)
- syncData: Object with arrays for both languages
  - yoruba: Array of timestamp objects for Yoruba segments
  - english: Array of timestamp objects for English segments
- currentSection: number - Index of section currently being synced
- currentLanguage: string - Currently selected language ('yoruba' or 'english')
- audioPlaybackState: Object tracking current playback
  - isPlaying: boolean
  - currentTime: number
  - sectionPlaying: number | null
- isYorubaSyncComplete: boolean - Whether Yoruba synchronization is complete
- isEnglishSyncComplete: boolean - Whether English synchronization is complete

**API Endpoints:**

- GET /api/oriki/[orikiId] - Fetch oriki details with text and audio
- PUT /api/oriki/[orikiId]/timestamps - Save synchronized timestamps for both languages

**Navigation:**

- Navigates from: Edit Oriki Screen (after content and audio upload)
- Navigates to: Contributor screen or content preview (after successful synchronization)

**User Interactions:**

- User can tap the language toggle to switch between Yoruba and English synchronization
- User synchronizes each language independently but using the same audio recording
- User drags markers on the audio waveform to set the start and end points for each text section
- User can tap play buttons to hear individual sections for verification
- As each section is completed, the system automatically advances to the next section
- The start marker for a new section is automatically positioned at the end of the previous section
- User can refine timestamp positions by dragging markers to precise positions
- User taps Continue when all sections are synchronized in both languages

**Bilingual Synchronization Process:**

1. The system automatically segments both the Yoruba text and English translation based on natural sentence breaks
2. User selects which language to synchronize first using the language toggle
3. For each language, user synchronizes sections sequentially by setting start and end timestamps
4. The synchronization progress for each language is tracked separately
5. User can switch between languages at any time to work on either version
6. When switching languages, the system preserves the synchronization progress of each language
7. The Continue button is enabled only when synchronization is complete for both languages
8. Completed sections in both languages are visually indicated through styling

**Variants/States:**

- Yoruba synchronization mode - Working with Yoruba text segments
- English synchronization mode - Working with English text segments
- Initial state - First section ready for synchronization
- Section sync in progress - User dragging markers to set timestamps
- Section completed - Section showing confirmed timestamps
- Language sync completed - All sections synchronized for current language
- All content synchronized - Both languages fully synchronized with audio
- Playback state - When audio preview is active for verification
- Error state - If synchronization cannot be completed

**Notes:**

- The audio recording is shared between both language versions, but timestamps are language-specific
- The system automatically attempts to align corresponding sentences between languages, but user refinement is needed
- The language toggle prominently indicates which language is currently being synchronized
- Different text patterns and sentence structures between languages may result in different segment counts
- The UI adapts to the language being synchronized, showing appropriate text content
- Each language may have different numbers of sections due to translation differences
- The system stores timestamp data separately for each language but linked to the same audio file
- When playing back in the final experience, the app will use the appropriate language timestamps based on user preference
- Visual styling clearly differentiates which language is being worked on
- Consider providing a progress indicator showing completion status for each language
- The synchronization workflow supports switching between languages at any point in the process
- This dual-language synchronization enables a fully bilingual playback experience in the app

### Lyrics Preview Screen

**Description:**  
A preview screen that appears after successful lyrics synchronization, allowing users to verify the synchronized content before finalizing. This immersive player combines audio playback with highlighted text display to preview how the synced lyrics will appear during normal playback. The screen is visually similar to the main Oriki Player but specifically focused on verification.

**Screen Path:**  
`/contributor/preview-lyrics/[orikiId]` (Expo Router path)

**Components Used:**

- Header with "Preview" title
- InitialIcon (e.g., "WA" for Adéwálé)
- Title and Subtitle text
- LanguageToggle (Yoruba/English selector)
- LyricsDisplay (Scrollable text with synchronized highlighting)
- AudioWaveform (Visualization of audio)
- CircularProgressPlayer (Elliptical progress indicator with playback controls)
- FinishButton (To complete the process)

**Component Hierarchy:**

```
LyricsPreviewScreen
├── Background (Deep red/maroon)
├── DragHandle (Minimization indicator to dismiss)
├── Text (Preview title)
├── Content
│   ├── InitialIcon (WA)
│   ├── Text (Oriki title - e.g., "Oriki Idílé Adéwálé")
│   ├── Text (Subtitle - e.g., "Praise Poetry of the Adéwálé Family")
│   ├── LanguageToggle
│   │   ├── Button (Yoruba - active)
│   │   └── Button (English)
│   └── ScrollView
│       └── LyricsDisplay (with active line highlighting)
├── PlaybackControls
│   ├── AudioWaveform
│   ├── CircularProgressPlayer
│   │   ├── ProgressIndicator (Red dot on elliptical track)
│   │   ├── PreviousButton
│   │   ├── PlayPauseButton
│   │   └── NextButton
└── FinishButton
```

**State Requirements:**

- oriki: Object containing the complete oriki data with synchronized timestamps
- playerState: Object tracking playback state
  - isPlaying: boolean - Whether audio is currently playing
  - currentPosition: number - Current playback position (seconds)
  - duration: number - Total duration of audio (seconds)
  - currentLineIndex: number - Index of the currently played/highlighted lyric line
- selectedLanguage: string - Current language selection (e.g., 'yoruba', 'english')
- waveformData: Array - Data for audio visualization

**API Endpoints:**

- GET /api/oriki/[orikiId] - Fetch oriki details with synchronized lyrics and audio
- POST /api/oriki/[orikiId]/publish - Finalize and publish the oriki with synchronized lyrics

**Navigation:**

- Navigates from: Lyrics Syncing Screen (after successful synchronization)
- Navigates to: Contributor screen or oriki details (after tapping Finish)

**User Interactions:**

- Drag down handle: Dismisses the preview and returns to the synchronization screen
- Tap language toggle: Switches lyrics display between Yoruba and English
- Tap play/pause: Controls audio playback with synchronized highlighting
- Tap previous/next: Jumps to previous/next lyric section
- Tap on a specific lyric: Begins playback from that section
- Tap progress indicator: Seeks to that position in the audio
- Tap Finish button: Completes the synchronization process, publishes the oriki, and returns to the Contributor screen where the new submission appears in the user's contributions list

**Submission Completion Flow:**

1. When the user taps the Finish button, the app publishes the fully synchronized oriki
2. A loading indicator briefly appears during the publishing process
3. On successful publication, the app navigates back to the Contributor screen
4. The newly published oriki appears at the top of the user's contributions list
5. The list is automatically refreshed to show the updated content
6. Visual indication (such as brief highlighting) may be used to draw attention to the new entry

**Variants/States:**

- Playing state: Shows pause button, active waveform, moving progress indicator
- Paused state: Shows play button, static waveform, stationary progress indicator
- Loading state: While audio or lyrics are loading
- Yoruba language state: Displaying lyrics in Yoruba (with appropriate highlighting)
- English language state: Displaying lyrics in English (with appropriate highlighting)

**Notes:**

- The preview screen uses the same deep red/maroon background as the main Oriki Player
- Currently played lyrics are highlighted in white, while other lines appear in a muted gray
- The preview functionality allows contributors to verify that:
  - Text segments are appropriately divided
  - Timestamps correctly match the audio content
  - Highlight transitions between segments feel natural
  - Both language versions are properly synchronized
- The audio waveform provides visual cues about upcoming audio patterns
- The circular progress indicator shows overall playback position
- Lyrics automatically scroll to keep the currently playing section visible
- The Finish button is prominently displayed, enabling users to finalize their work
- The screen is designed to be a complete preview of the final user experience
- Unlike the regular Oriki Player, this screen is specifically focused on verification before publishing
- Dragging down (similar to minimizing the player) cancels the preview without publishing
- The preview uses actual synchronized timestamp data to demonstrate the real playback experience

## Category and Item Components

### OrikiItem

**Description:**  
Individual item component used to display oriki entries in lists throughout the app. Includes visual identifier, title, description, and action buttons.

**Components Used:**

- InitialIcon (Colored circle with text initials)
- Text (Title and description)
- IconButton (Lyrics/book and play buttons)

**Variations:**

- Standard: Shows all components
- Compact: Smaller version with fewer details
- With/without favorite icon

**User Interactions:**

- Tap on item: Navigate to oriki detail view
- Tap on lyrics icon: View oriki text content
- Tap on play icon: Play oriki audio
- Tap on favorite icon (when present): Toggle favorite status

**Notes:**

- Color of initial icon varies by oriki type or category
- Consistent spacing and typography across all instances
- Clear hierarchy with title more prominent than description
- Action buttons are easily tappable with proper hit areas

### CategoryCard

**Description:**  
Card component used to display oriki categories in a grid or list format. Features category name, icon, and count of items.

**Components Used:**

- Background image or color
- Text (Category name and count)
- Icon (Category icon)

**Variations:**

- Featured: Larger size with more details
- Standard: Medium-sized card in grid layouts
- Compact: Small card for dense listings

**User Interactions:**

- Tap on card: Navigate to category listing screen

**Notes:**

- Categories use different colors/themes to differentiate types
- Count indicators (e.g., "40+") show number of items in category
- Text is positioned for readability over varying backgrounds

### SectionHeader

**Description:**  
Header component used to separate and identify different content sections on screens.

**Components Used:**

- Text (Section title)
- Button (Optional "Explore all >" action)

**User Interactions:**

- Tap on "Explore all": Navigate to full section listing

**Notes:**

- Consistent typography and spacing across all instances
- Clear visual hierarchy to separate sections
- "Explore all" text is properly sized for tappability

## Modals & Overlays

### Language Selection Modal

**Description:**  
A bottom sheet modal that appears when the user taps the language selector. It allows users to choose their preferred language from the available options.

**Triggered From:**

- Language selector in the header of various screens

**Components Used:**

- Modal/Bottom Sheet container
- Title text ("Select language")
- Language option rows, each containing:
  - Flag/icon for the language
  - Language name text
  - Radio button indicator for selection

**Component Hierarchy:**

```
LanguageSelectionModal
├── ModalContainer
│   ├── TitleText
│   └── LanguageOptionsList
│       ├── LanguageOption (English UK)
│       │   ├── Flag
│       │   ├── LanguageName
│       │   └── RadioButton
│       └── LanguageOption (Yoruba)
│           ├── Flag
│           ├── LanguageName
│           └── RadioButton
```

**State Requirements:**

- currentLanguage: string - The currently selected language code
- isModalVisible: boolean - Whether the modal is currently displayed

**User Interactions:**

- User taps a language option: Updates the selected language and closes the modal
- User taps outside the modal: Dismisses the modal without changing the language

**Navigation:**

- No screen navigation, but affects the display language throughout the app

**Notes:**

- The modal should appear with a smooth animation from the bottom of the screen
- The currently selected language should be clearly marked with a filled radio button
- Language changes should be applied immediately and persisted for future app sessions
- The modal should support accessibility features for screen readers
- Adding new languages should only require adding a new language option without modifying the modal structure

### User Profile Modal

**Description:**  
A modal overlay that displays the user's profile information when the Profile button is tapped in the Contributor screen. Shows user identity, contribution statistics, and geographic/family information.

**Triggered From:**

- Profile button in the Contributor screen header

**Components Used:**

- ModalContainer with drag handle
- ProfileAvatar (Shows initials if no profile image is available)
- Text (Name, contribution count, stream count)
- StatBadges (Pills showing State, Town, and Family)
- UpdateProfileButton

**Component Hierarchy:**

```
ProfileModal
├── DragHandle
├── Content
│   ├── ProfileAvatar
│   │   └── Text (User's initials - "OO")
│   ├── Text (User's name - "Omolola Ogunbiyi")
│   ├── StatContainer
│   │   ├── ContributionStat ("5093 Contribution")
│   │   └── StreamStat ("200,000 stream")
│   ├── BadgesContainer
│   │   ├── StateBadge (Icon + "Osun State")
│   │   ├── TownBadge (Icon + "Ilé-Ifẹ́")
│   │   └── FamilyBadge (Icon + "Adéwálé family")
│   └── UpdateProfileButton
```

**State Requirements:**

- profileData: Object containing user profile information
  - name: string
  - image?: string
  - contributions: number
  - streams: number
  - state: string
  - town: string
  - family: string
- isModalVisible: boolean - Whether the modal is currently displayed

**API Endpoints:**

- GET /api/user/profile - Fetch user profile data
- GET /api/user/stats - Fetch user contribution and stream statistics

**User Interactions:**

- User can drag down on the handle or tap outside to close the modal
- User can tap the Update Profile button to navigate to profile editing
- User can view their contribution count and stream statistics
- User can see their state, town, and family information at a glance

**Variants/States:**

- Loading state - While fetching profile data
- Error state - If retrieving profile data fails
- Default state - Showing profile information
- With profile image - When user has uploaded a profile photo
- Without profile image - Using initials in a circle (e.g., "OO" for "Omolola Ogunbiyi")

**Notes:**

- The modal appears with a slide-up animation when the Profile button is tapped
- Outside of the modal is partially transparent/dimmed, showing the underlying Contributor screen
- User's initials are displayed in a gray circular avatar if no profile image is available
- Contribution count and stream count are prominently displayed to gamify user participation
- State, town, and family information is displayed in pill/badge format with relevant icons
- The Update Profile button provides quick access to edit profile information
- The modal uses a clean white background with consistent typography and spacing
- Geographic and family information uses recognizable icons for quick identification
- Consider implementing pull-to-refresh functionality within the modal for updating statistics
- The modal should be dismissible via gesture, tapping outside, or pressing back on Android

### Edit Profile Screen

**Description:**  
A screen that allows users to edit their personal profile information, including profile image, name, location details, family affiliation, and default language preferences.

**Screen Path:**  
`/profile/edit` (Expo Router path)

**Components Used:**

- BackButton
- Header
- ProfileImageEditor
- FormInput (for name and town)
- SelectInput (for state and default language)
- SaveButton

**Component Hierarchy:**

```
EditProfileScreen
├── Header (with "Update Profile" title)
│   └── BackButton (left side)
├── ProfileImageEditor (profile image with edit capability)
├── Form
│   ├── FormInput (name)
│   ├── SelectInput (state)
│   ├── FormInput (town)
│   ├── FormInput (family - optional)
│   └── SelectInput (default language)
└── SaveButton
```

**State Requirements:**

- `profileImage`: Current profile image or URI for a new selection
- `formValues`: Object containing all form field values
- `formErrors`: Validation error messages for each field
- `isLoading`: Boolean indicating save operation in progress
- `isValid`: Boolean indicating if form can be submitted
- `imagePickerVisible`: Boolean for image selection modal

**API Endpoints:**

- `GET /api/user/profile`: Fetch current user profile data
- `PUT /api/user/profile`: Update user profile information
- `POST /api/user/profile/image`: Upload new profile image

**Navigation:**

- Back button: Returns to previous screen (User Profile Modal)
- Save button: Submits changes and returns to previous screen on success

**User Interactions:**

- Tap profile image to open image picker/camera
- Fill in form fields with personal information
- Select state from dropdown list
- Select default language from dropdown list
- Tap Save button to submit changes

**Variants/States:**

- Default: Showing current profile information pre-filled in form
- Loading: When fetching profile data or saving changes
- Error: When profile fetch or update fails
- Image Selection: When selecting a new profile image
- Validation Error: When form contains invalid input

**Notes:**

- The screen should pre-populate all fields with the user's current information
- Form validation should happen in real-time as users type
- Required fields should be clearly marked
- The Save button should be disabled until all required fields are valid
- Image picker should support both gallery selection and camera capture
- Loading states should be shown during API operations
- Success and error messages should be displayed appropriately
- The state dropdown should contain a comprehensive list of Nigerian states
- The default language selector should highlight the user's current preference
- The keyboard should dismiss when tapping outside form fields
- Changes should only be saved when the user explicitly taps Save

## Search Functionality

### SearchBar

**Description:**  
Component that enables users to search for oriki content throughout the app.

**Components Used:**

- Search icon
- Text input field
- Clear button (when text is entered)

**User Interactions:**

- Tap to focus and bring up keyboard
- Type to enter search query
- Tap clear button to remove query
- Submit search to see results

**Variants/States:**

- Default (empty) state
- Focused state
- With input state
- Searching state (loading)

**Notes:**

- The search bar has a light background with rounded corners
- Features a search icon on the left side
- Placeholder text ("Search Oriki") indicates purpose
- Should support voice input for accessibility
- Search results should appear below or on a new screen depending on design

<!-- We'll populate this section as we analyze each design -->
