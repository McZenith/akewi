# UI Component Documentation

This document contains detailed specifications for all reusable UI components in the Akewi app.

## Base Components

### Button

**Description:**  
Primary interactive element for user actions. Can appear in multiple styles and sizes.

**Variations:**

- Primary: Black background with white text (Continue button)
- Social: White background with brand logo and text (Google, Apple buttons)
- Icon: Icon-only button (Language selector)
- Back: Icon button for navigation (back arrow)

**Props:**

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'text' | 'social' | 'icon' | 'back';
  label?: string;
  onPress: () => void;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
}
```

**Usage Examples:**

```jsx
// Primary button (Continue)
<Button
  variant="primary"
  label="Continue"
  onPress={() => handleContinue()}
  fullWidth
/>

// Social button (Google)
<Button
  variant="social"
  label="Continue with Google"
  leftIcon={<GoogleIcon />}
  onPress={() => handleGoogleSignIn()}
  fullWidth
/>

// Back button
<Button
  variant="back"
  icon={<BackIcon />}
  onPress={() => navigation.goBack()}
/>
```

### Input

**Description:**  
Text input field component with support for various input types, validation states, and styling options. Features accessibility support through voice interaction mode.

**Variations:**

- Text: Standard text input (Name, Town, Family inputs)
- Password: Masked input with toggle
- Search: Input with search icon
- Select: Dropdown input with options (State input)
- EmailPhone: Combined input that accepts both email and phone formats

**Props:**

```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  type?: 'text' | 'password' | 'email' | 'phone' | 'emailPhone' | 'number';
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  backgroundColor?: string;
  borderRadius?: number;
  fullWidth?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  optional?: boolean;
  onInputTypeChange?: (type: 'email' | 'phone') => void;
  isVoiceActive?: boolean;
  voiceElementId?: string;
  onVoiceInputComplete?: () => void;
}
```

**Usage Examples:**

```jsx
// Text input (Name)
<Input
  placeholder="Name"
  value={name}
  onChangeText={(text) => setName(text)}
  returnKeyType="next"
  onSubmitEditing={() => stateInputRef.current?.focus()}
  fullWidth
/>

// Optional input (Family)
<Input
  placeholder="Family (Optional)"
  value={family}
  onChangeText={(text) => setFamily(text)}
  optional={true}
  returnKeyType="done"
  onSubmitEditing={() => handleContinue()}
  fullWidth
/>

// Combined Email/Phone input
<Input
  placeholder="Enter your email or phone number"
  value={loginIdentifier}
  onChangeText={(text) => setLoginIdentifier(text)}
  type="emailPhone"
  onInputTypeChange={(type) => setLoginIdentifierType(type)}
  keyboardType="email-address"
  autoCapitalize="none"
  returnKeyType="done"
  onSubmitEditing={() => handleContinue()}
  fullWidth
/>
```

**Email/Phone Detection Logic:**

```jsx
// Example implementation of email/phone detection
const detectInputType = text => {
  // Check if input contains @ symbol for email
  if (text.includes('@')) {
    return 'email';
  }

  // Check if input is numeric or starts with + for phone
  if (/^[0-9+\s()-]+$/.test(text)) {
    return 'phone';
  }

  // Default to null if unable to determine
  return null;
};

// Usage in input component
const handleInputChange = text => {
  setValue(text);
  const detectedType = detectInputType(text);

  // Adjust keyboard type based on detected input type
  if (detectedType === 'phone' && currentKeyboardType !== 'phone-pad') {
    setCurrentKeyboardType('phone-pad');
  } else if (detectedType === 'email' && currentKeyboardType !== 'email-address') {
    setCurrentKeyboardType('email-address');
  }

  // Notify parent component of type change
  if (onInputTypeChange && detectedType) {
    onInputTypeChange(detectedType);
  }
};
```

**Validation Logic:**

```jsx
// Example validation for combined email/phone input
const validateEmailPhone = (value, type) => {
  if (!value) {
    return 'This field is required';
  }

  if (type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  }

  if (type === 'phone') {
    const phoneRegex = /^[0-9+\s()-]{7,15}$/;
    return phoneRegex.test(value) ? null : 'Please enter a valid phone number';
  }

  return 'Please enter a valid email or phone number';
};
```

**Keyboard Handling:**
For proper keyboard behavior that matches the design:

- The Input component should be used within a KeyboardAvoidingView
- For multiline inputs or inputs in scrollable contexts, consider managing focus and scroll position
- Ensure the input is visible when the keyboard appears

Example wrapper component:

```jsx
const KeyboardAwareView = ({ children }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>{children}</View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
```

**Accessibility Support:**
The Input component includes special handling for voice-guided accessibility:

```jsx
// Example implementation of voice-enabled input
const Input = ({
  isVoiceActive,
  voiceElementId,
  onVoiceInputComplete,
  currentVoiceElement,
  ...props
}) => {
  const inputRef = useRef(null);
  const isCurrentlyVoiced = isVoiceActive && voiceElementId === currentVoiceElement;

  // Focus input when it becomes the current voiced element
  useEffect(() => {
    if (isCurrentlyVoiced && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCurrentlyVoiced]);

  // Listen for Enter key to complete input
  const handleKeyPress = e => {
    if (isCurrentlyVoiced && e.nativeEvent.key === 'Enter') {
      if (onVoiceInputComplete) {
        onVoiceInputComplete();
      }
    }
  };

  return (
    <View style={[styles.inputContainer, isCurrentlyVoiced && styles.voiceActiveInputContainer]}>
      <TextInput
        ref={inputRef}
        {...props}
        onKeyPress={handleKeyPress}
        style={[styles.input, isCurrentlyVoiced && styles.voiceActiveInput]}
      />
      {isCurrentlyVoiced && <VoiceInputIcon style={styles.voiceInputIcon} />}
    </View>
  );
};

// Styling for voice-active inputs
const styles = StyleSheet.create({
  voiceActiveInputContainer: {
    borderColor: '#FF6363',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 99, 99, 0.05)',
  },
  voiceActiveInput: {
    color: '#000000',
  },
  voiceInputIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -12,
  },
});
```

### Select

**Description:**  
Dropdown select component for choosing from a list of options, with customizable appearance and behavior.

**Props:**

```typescript
interface SelectProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  backgroundColor?: string;
  borderRadius?: number;
  fullWidth?: boolean;
}
```

**Usage Examples:**

```jsx
// State select
<Select
  placeholder="State"
  value={state}
  options={stateOptions}
  onChange={value => setState(value)}
  rightIcon={<ChevronIcon />}
  fullWidth
/>
```

### Text

**Description:**  
Text component with standardized typography styles, supporting various text types and formatting options.

**Variations:**

- Heading (Logo text, Screen title)
- Body (Description text)
- Button (Button text)
- Caption (Form labels, optional text)

**Props:**

```typescript
interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'body2' | 'caption' | 'button';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'bold' | 'semibold';
  children: React.ReactNode;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}
```

**Usage Examples:**

```jsx
// Title text
<Text variant="h1" align="center">
  Enter your details
</Text>

// Description text
<Text
  variant="body"
  align="center"
>
  Add the following to personalize your experience
</Text>
```

## Compound Components

### Divider

**Description:**  
Horizontal divider with optional text in the middle, typically used to separate content sections.

**Props:**

```typescript
interface DividerProps {
  text?: string;
  color?: string;
  thickness?: number;
  textColor?: string;
}
```

**Usage Examples:**

```jsx
// Simple or divider
<Divider text="or" />
```

### LanguageSelector

**Description:**  
Component for selecting the app language, typically showing the current language with a flag or icon.

**Props:**

```typescript
interface LanguageSelectorProps {
  currentLanguage: string;
  onPress: () => void;
  showIcon?: boolean;
}
```

**Usage Examples:**

```jsx
<LanguageSelector currentLanguage="English" onPress={() => openLanguageModal()} showIcon />
```

### LanguageSelectionModal

**Description:**  
Bottom sheet modal that displays available language options and allows users to select their preferred language. Shows language names with corresponding flag icons and uses radio buttons to indicate the current selection.

**Props:**

```typescript
interface LanguageSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  languages: Array<{
    code: string;
    name: string;
    flag?: React.ReactNode;
    selected: boolean;
  }>;
  onSelectLanguage: (languageCode: string) => void;
}
```

**Usage Examples:**

```jsx
<LanguageSelectionModal
  visible={languageModalVisible}
  onClose={() => setLanguageModalVisible(false)}
  languages={[
    {
      code: 'English',
      name: 'English UK',
      flag: <UKFlagIcon />,
      selected: currentLanguage === 'English',
    },
    { code: 'Yoruba', name: 'Yoruba', flag: <YorubaFlagIcon />, selected: currentLanguage === 'Yoruba' },
  ]}
  onSelectLanguage={code => {
    setCurrentLanguage(code);
    setLanguageModalVisible(false);
  }}
/>
```

**Modal Structure:**

```jsx
// Example implementation of the language selection modal
const LanguageSelectionModal = ({ visible, onClose, languages, onSelectLanguage }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select language</Text>

          <View style={styles.languageList}>
            {languages.map(language => (
              <TouchableOpacity
                key={language.code}
                style={styles.languageOption}
                onPress={() => onSelectLanguage(language.code)}
              >
                <View style={styles.languageInfo}>
                  {language.flag}
                  <Text style={styles.languageName}>{language.name}</Text>
                </View>

                <View style={[styles.radioButton, language.selected && styles.radioButtonSelected]}>
                  {language.selected && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};
```

### Logo

**Description:**  
The app logo component that can be rendered at different sizes.

**Props:**

```typescript
interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  colored?: boolean;
}
```

**Usage Examples:**

```jsx
<Logo size="large" colored={true} />
```

### VoiceButton

**Description:**  
Accessibility feature button that activates an interactive screen reader functionality. It not only reads out form fields and text elements in the user's selected language but also waits for user input at interactive elements, with visual highlighting and status indicators to guide the user through the form.

**Props:**

```typescript
interface VoiceButtonProps {
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  isActive?: boolean;
  isWaitingForInput?: boolean;
  currentReadingElement?: string;
  onReadComplete?: () => void;
  onUserInputReceived?: (elementId: string, value: any) => void;
  disabled?: boolean;
}
```

**States:**

- Inactive: Default state, waiting to be activated
- Active Reading: Currently reading non-interactive content aloud
- Waiting for Input: Paused and waiting for user to provide input
- Input Processing: Briefly shown after receiving input before moving to next element

**Usage Examples:**

```jsx
// With input collection handling
<VoiceButton
  onPress={() => toggleVoiceReading()}
  isActive={isReadingActive}
  isWaitingForInput={isWaitingForUserInput}
  currentReadingElement={currentElementId}
  onReadComplete={() => setIsReadingActive(false)}
  onUserInputReceived={(elementId, value) => {
    updateFormData(elementId, value);
    moveToNextElement();
  }}
/>
```

**Implementation Notes:**

```jsx
// Example implementation of interactive voice reading functionality
const VoiceButton = ({
  onPress,
  isActive,
  isWaitingForInput,
  currentReadingElement,
  onReadComplete,
  onUserInputReceived,
}) => {
  // Use React Native's Text-to-Speech functionality
  const startInteractiveReading = async (elements, language) => {
    for (const element of elements) {
      // Highlight the current element
      setCurrentReadingElement(element.id);

      if (element.type === 'input' || element.type === 'select') {
        // Set waiting for input state
        setIsWaitingForInput(true);

        // Read the label/placeholder
        await TextToSpeech.speak({
          text: element.label || element.placeholder,
          language: language, // 'en-GB' or 'yo'
          rate: 0.8,
          pitch: 1.0,
        });

        // Wait for user input (this would be resolved by the Input component)
        const value = await waitForUserInput(element.id);

        // Process the input
        if (onUserInputReceived) {
          onUserInputReceived(element.id, value);
        }

        setIsWaitingForInput(false);
      } else {
        // For non-interactive elements, just read the text
        await TextToSpeech.speak({
          text: element.text,
          language: language,
          rate: 0.8,
          pitch: 1.0,
        });

        // Short pause between elements
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    // Reset after reading is complete
    setCurrentReadingElement(null);
    if (onReadComplete) onReadComplete();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.voiceButton,
        isActive && styles.voiceButtonActive,
        isWaitingForInput && styles.voiceButtonWaiting,
      ]}
      accessibilityLabel={
        !isActive
          ? 'Activate voice reading'
          : isWaitingForInput
            ? 'Waiting for your input'
            : 'Voice reading active'
      }
    >
      {!isActive ? <VoiceIcon /> : isWaitingForInput ? <VoiceWaitingIcon /> : <ActiveVoiceIcon />}
    </TouchableOpacity>
  );
};

// Select input auto-advances after selection
const Select = ({
  isVoiceActive,
  voiceElementId,
  currentVoiceElement,
  onVoiceInputComplete,
  ...props
}) => {
  const isCurrentlyVoiced = isVoiceActive && voiceElementId === currentVoiceElement;

  const handleSelection = value => {
    props.onChange(value);

    // Auto-advance to next field when in voice mode and an option is selected
    if (isCurrentlyVoiced && onVoiceInputComplete) {
      onVoiceInputComplete();
    }
  };

  return (
    <View style={[styles.selectContainer, isCurrentlyVoiced && styles.voiceActiveSelectContainer]}>
      <RNPickerSelect {...props} onValueChange={handleSelection} style={customPickerStyles} />
      {isCurrentlyVoiced && <VoiceInputIcon style={styles.voiceInputIcon} />}
    </View>
  );
};

// Styling for the voice button states
const styles = StyleSheet.create({
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6363',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#FF6363',
  },
  voiceButtonWaiting: {
    backgroundColor: '#FFA0A0',
    // Pulsing animation would be applied here
  },
  highlightedElement: {
    backgroundColor: 'rgba(255, 99, 99, 0.1)',
    borderColor: '#FF6363',
    borderWidth: 1,
  },
});
```

### SocialButton

**Description:**  
Specialized button for social media authentication options.

**Props:**

```typescript
interface SocialButtonProps {
  provider: 'google' | 'apple' | 'facebook' | 'twitter';
  onPress: () => void;
  label?: string;
}
```

**Usage Examples:**

```jsx
<SocialButton provider="google" onPress={() => handleGoogleSignIn()} label="Continue with Google" />
```

## Form Components

### FormField

**Description:**  
Composite component that combines a label, input, and error message.

**Props:**

```typescript
interface FormFieldProps {
  label?: string;
  input: React.ReactNode;
  error?: string;
  hint?: string;
  optional?: boolean;
}
```

**Usage Examples:**

```jsx
<FormField
  label="Email"
  input={
    <Input placeholder="Your email address" value={email} onChangeText={setEmail} type="email" />
  }
  error={emailError}
/>
```

### Form

**Description:**  
Container for form fields with consistent styling and behavior.

**Props:**

```typescript
interface FormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  style?: StyleProp<ViewStyle>;
}
```

**Usage Examples:**

```jsx
<Form onSubmit={handleSubmit}>
  <FormField input={<Input placeholder="Name" value={name} onChangeText={setName} />} />
  <FormField
    input={<Select placeholder="State" value={state} options={stateOptions} onChange={setState} />}
  />
  {/* Additional form fields */}
</Form>
```

## Layout Components

### KeyboardAwareLayout

**Description:**  
Wraps screen content to handle keyboard appearance without obscuring input fields.

**Props:**

```typescript
interface KeyboardAwareLayoutProps {
  children: React.ReactNode;
  behavior?: 'padding' | 'height' | 'position';
  keyboardVerticalOffset?: number;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  dismissKeyboardOnTap?: boolean;
}
```

**Usage Examples:**

```jsx
<KeyboardAwareLayout dismissKeyboardOnTap>
  <View style={styles.container}>{/* Screen content including inputs */}</View>
</KeyboardAwareLayout>
```

## Navigation Components

### BackButton

**Description:**  
Navigation button for returning to the previous screen.

**Props:**

```typescript
interface BackButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
}
```

**Usage Examples:**

```jsx
<BackButton onPress={() => navigation.goBack()} />
```

### Header

**Description:**  
Screen header component that can include a back button, title, and right-side actions like the language selector.

**Props:**

```typescript
interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  centerComponent?: React.ReactNode;
}
```

**Usage Examples:**

```jsx
<Header
  showBackButton={true}
  onBackPress={() => navigation.goBack()}
  rightComponent={<LanguageSelector currentLanguage="English" onPress={openLanguageModal} />}
/>
```

## Feedback Components

### Toast

**Description:**  
TBD

**Props:**

```typescript
interface ToastProps {
  // To be filled as we analyze designs
}
```

**Usage Examples:**

```jsx
// To be filled as we analyze designs
```

### Modal

**Description:**  
TBD

**Props:**

```typescript
interface ModalProps {
  // To be filled as we analyze designs
}
```

**Usage Examples:**

```jsx
// To be filled as we analyze designs
```

## Content Components

### FeaturedOrikiCard

**Description:**  
Large, prominent card used to highlight featured oriki content. Typically has a distinctive background color, title, description, and metadata.

**Props:**

```typescript
interface FeaturedOrikiCardProps {
  title: string;
  subtitle?: string;
  description: string;
  metaText?: string;
  backgroundColor?: string;
  textColor?: string;
  onPress: () => void;
}
```

**Usage Examples:**

```jsx
<FeaturedOrikiCard
  title="Oriki Idílé"
  subtitle="(Family Oriki)"
  description="Praises specific families or lineages, highlighting their history, achievements, and ancestral roots"
  metaText="105 tracks • 100 Oriki"
  backgroundColor="#C73D10"
  textColor="#FFFFFF"
  onPress={() => navigateToOrikiCategory('family')}
/>
```

### OrikiItem

**Description:**  
List item component for displaying oriki entries. Includes visual identifier, title, description, and action buttons with conditional display of audio/play button based on content availability.

**Components Used:**

- InitialIcon (Colored circle with text initials)
- Text (Title and description)
- IconButton (Lyrics/book and play buttons)

**Props:**

```typescript
interface OrikiItemProps {
  id: string;
  title: string;
  description: string;
  initialText: string;
  initialColor?: string;
  hasAudio?: boolean;
  isFavorite?: boolean;
  onPress: () => void;
  onLyricsPress?: () => void;
  onPlayPress?: () => void;
  onFavoriteToggle?: () => void;
  variant?: 'standard' | 'compact';
  showFavoriteButton?: boolean;
}
```

**Variations:**

- Standard: Shows all components
- Compact: Smaller version with fewer details
- With/without audio: The play button only appears when audio content is available
- With/without favorite icon: Only shown when favoriting is available

**User Interactions:**

- Tap on item: Navigate to oriki detail view
- Tap on lyrics icon: View oriki text content
- Tap on play icon (when available): Play oriki audio
- Tap on favorite icon (when present): Toggle favorite status

**Notes:**

- Color of initial icon varies by oriki type or category
- Consistent spacing and typography across all instances
- Clear hierarchy with title more prominent than description
- Action buttons are easily tappable with proper hit areas
- Play button only appears for items that have associated audio content
- In search results, items may have identical initial icons but different functionality

**Implementation Notes:**

```jsx
// Example implementation with conditional audio button
const OrikiItem = props => {
  const {
    title,
    description,
    initialText,
    initialColor,
    hasAudio,
    onPress,
    onLyricsPress,
    onPlayPress,
  } = props;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <InitialIcon text={initialText} backgroundColor={initialColor} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <IconButton icon={<LyricsIcon />} onPress={onLyricsPress} />
        {hasAudio && <IconButton icon={<PlayIcon />} onPress={onPlayPress} />}
      </View>
    </TouchableOpacity>
  );
};
```

### InitialIcon

**Description:**  
Circular icon component that displays text initials (usually 1-2 characters) on a colored background. Used to provide visual identifiers for oriki entries.

**Props:**

```typescript
interface InitialIconProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  size?: 'small' | 'medium' | 'large';
  fontSize?: number;
}
```

**Usage Examples:**

```jsx
<InitialIcon text="WE" backgroundColor="#F27B35" textColor="#FFFFFF" size="medium" />
```

**Implementation Notes:**

```jsx
// Example implementation of InitialIcon
const InitialIcon = ({
  text,
  backgroundColor = '#F27B35',
  textColor = '#FFFFFF',
  size = 'medium',
}) => {
  const sizeValues = {
    small: 32,
    medium: 40,
    large: 56,
  };

  const fontSizeValues = {
    small: 14,
    medium: 16,
    large: 24,
  };

  const containerSize = sizeValues[size];
  const fontSize = fontSizeValues[size];

  return (
    <View
      style={{
        width: containerSize,
        height: containerSize,
        borderRadius: containerSize / 2,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: textColor,
          fontSize,
          fontWeight: '700',
        }}
      >
        {text.substring(0, 2).toUpperCase()}
      </Text>
    </View>
  );
};
```

### CategoryCard

**Description:**  
Card component used to display oriki categories with distinct visual styling for each category type. Features a consistent layout with title, subtitle, reading/listening icons, and item count. Each card provides clear visual differentiation through background color, maintaining the app's design language.

**Props:**

```typescript
interface CategoryCardProps {
  id: string;
  title: string;
  subtitle?: string;
  count: number;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  bookIcon?: boolean;
  audioIcon?: boolean;
  variant?: 'featured' | 'standard' | 'compact';
  onPress: () => void;
  onPlayPress?: () => void;
  onLyricsPress?: () => void;
}
```

**Usage Examples:**

```jsx
<CategoryCard
  id="category-1"
  title="Oriki Orílè-èdè"
  subtitle="Community/Regional Oriki"
  count={40}
  backgroundColor="#333333"
  textColor="#FFFFFF"
  iconColor="#888888"
  bookIcon={true}
  audioIcon={true}
  variant="standard"
  onPress={() => navigateToCategory('category-1')}
  onPlayPress={() => playRandomFromCategory('category-1')}
  onLyricsPress={() => viewCategoryLyrics('category-1')}
/>
```

**Implementation Notes:**

````jsx
// Example implementation of CategoryCard with book and audio icons
const CategoryCard = ({
  title,
  subtitle,
  count,
  backgroundColor = '#333333',
  textColor = '#FFFFFF',
  iconColor = '#CCCCCC',
  bookIcon = true,
  audioIcon = true,
  onPress,
  onPlayPress,
  onLyricsPress,
  variant = 'standard'
}) => {
  // Size mapping based on variant
  const variantStyles = {
    featured: { height: 160, padding: 16 },
    standard: { height: 120, padding: 12 },
    compact: { height: 80, padding: 8 },
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor },
        variantStyles[variant]
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {bookIcon && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onLyricsPress || onPress}
          >
            <BookIcon color={iconColor} size={24} />
          </TouchableOpacity>
        )}

        {audioIcon && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onPlayPress || onPress}
          >
            <PlayIcon color={iconColor} size={24} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: textColor }]}>
          {title}
        </Text>

        {subtitle && (
          <Text style={[styles.subtitle, { color: `${textColor}99` }]}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.countContainer}>
        <Text style={[styles.count, { color: `${textColor}80` }]}>
          {count}+
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconButton: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  countContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
  },
  count: {
    fontSize: 28,
    fontWeight: '700',
    opacity: 0.7,
  },
});

**Category Style Variations:**
The app uses consistent card structure but with unique styling for each category type:

- **Oriki Orílè-èdè (Community/Regional)**: Black background (#333333) with white text and high contrast
- **Oriki Ọlọ́run/Òrìṣà (Deity)**: Dark gray background (#444444) with light gray text and icons
- **Oriki Ọmọ (Child)**: Medium gray background (#666666) with white text
- **Ethnic Group Oriki**: Light gray background (#999999) with dark text for readability

Each card maintains the same basic layout with:
1. Book and play icons in top left
2. Title (Yoruba) and subtitle (English translation) aligned to the right
3. Count indicator ("40+", "30+", etc.) in bottom right
4. Consistent spacing and typography across all versions

## Search Components

### SearchBar

**Description:**
Input component specialized for search functionality with integrated search icon, providing a clean and prominent interface for content discovery. Features rounded corners, light background, and a magnifying glass icon to clearly communicate its purpose.

**Props:**
```typescript
interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  autoFocus?: boolean;
  showClearButton?: boolean;
  returnKeyType?: 'search' | 'done' | 'go';
  backgroundColor?: string;
  borderRadius?: number;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
}
````

**Usage Examples:**

```jsx
<SearchBar
  placeholder="Search Oriki"
  value={searchQuery}
  onChangeText={text => setSearchQuery(text)}
  onSubmit={() => handleSearch()}
  onClear={() => setSearchQuery('')}
  showClearButton={searchQuery.length > 0}
  returnKeyType="search"
  backgroundColor="#FFFFFF"
  borderRadius={20}
/>
```

**Implementation Notes:**

````jsx
// Example implementation of SearchBar
const SearchBar = ({
  placeholder = "Search Oriki",
  value,
  onChangeText,
  onSubmit,
  onClear,
  autoFocus = false,
  showClearButton = false,
  returnKeyType = "search",
  backgroundColor = "#FFFFFF",
  borderRadius = 20,
  iconColor = "#888888",
  style
}) => {
  return (
    <View style={[
      styles.container,
      { backgroundColor, borderRadius },
      style
    ]}>
      <SearchIcon size={18} color={iconColor} style={styles.searchIcon} />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888888"
        returnKeyType={returnKeyType}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        onSubmitEditing={onSubmit}
      />

      {showClearButton && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <ClearIcon size={16} color="#999999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    height: '100%',
  },
  clearButton: {
    padding: 4,
  },
});

**Accessibility Considerations:**
- The search input should be properly labeled for screen readers
- The clear button should have an adequate touch target and accessibility label
- The component should support voice input for accessibility features
- Keyboard handling should be optimized for search-specific behavior

### SectionHeader

**Description:**
Header component used to label and provide navigation for content sections.

**Props:**
```typescript
interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  showAction?: boolean;
}
````

**Usage Examples:**

```jsx
<SectionHeader
  title="Popular oriki"
  actionText="Explore all"
  showAction={true}
  onActionPress={() => navigateToAllPopular()}
/>
```

**Implementation Notes:**

```jsx
// Example implementation of SectionHeader
const SectionHeader = ({ title, actionText = 'Explore all', showAction, onActionPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showAction && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.actionText}>{actionText} &gt;</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  actionText: {
    fontSize: 14,
    color: '#666666',
  },
});
```

## Navigation Components

### BottomNavigation

**Description:**  
Tab-based navigation component displayed at the bottom of the screen for main app navigation.

**Props:**

```typescript
interface BottomNavigationProps {
  activeTab: 'home' | 'explore' | 'contributor';
  onTabPress: (tab: 'home' | 'explore' | 'contributor') => void;
}
```

**Usage Examples:**

```jsx
<BottomNavigation activeTab="home" onTabPress={tab => navigateToTab(tab)} />
```

**Implementation Notes:**

```jsx
// Example implementation of BottomNavigation
const BottomNavigation = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress('home')}
        accessibilityState={{ selected: activeTab === 'home' }}
      >
        <HomeIcon active={activeTab === 'home'} />
        <Text style={[styles.tabLabel, activeTab === 'home' && styles.activeTabLabel]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress('explore')}
        accessibilityState={{ selected: activeTab === 'explore' }}
      >
        <ExploreIcon active={activeTab === 'explore'} />
        <Text style={[styles.tabLabel, activeTab === 'explore' && styles.activeTabLabel]}>
          Explore
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => onTabPress('contributor')}
        accessibilityState={{ selected: activeTab === 'contributor' }}
      >
        <ContributorIcon active={activeTab === 'contributor'} />
        <Text style={[styles.tabLabel, activeTab === 'contributor' && styles.activeTabLabel]}>
          Contributor
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#666666',
  },
  activeTabLabel: {
    color: '#000000',
    fontWeight: '500',
  },
});
```

### FilterTab

**Description:**  
Interactive tab component used in horizontal scrolling filter menus to narrow down content by specific criteria. Features active and inactive states for clear visual feedback.

**Props:**

```typescript
interface FilterTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  badgeCount?: number;
}
```

**Usage Examples:**

```jsx
// Single filter tab in a ScrollView
<FilterTab
  label="Oluyole"
  isActive={selectedFilter === 'Oluyole'}
  onPress={() => setSelectedFilter('Oluyole')}
/>

// Complete filter tab row
<ScrollView horizontal showsHorizontalScrollIndicator={false}>
  <FilterTab
    label="All"
    isActive={selectedFilter === 'All'}
    onPress={() => setSelectedFilter('All')}
  />
  <FilterTab
    label="Oluyole"
    isActive={selectedFilter === 'Oluyole'}
    onPress={() => setSelectedFilter('Oluyole')}
  />
  <FilterTab
    label="Osun"
    isActive={selectedFilter === 'Osun'}
    onPress={() => setSelectedFilter('Osun')}
  />
  {/* Additional filter tabs */}
</ScrollView>
```

**Implementation Notes:**

````jsx
// Example implementation of FilterTab
const FilterTab = ({ label, isActive, onPress, badgeCount }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer
      ]}
      onPress={onPress}
      accessibilityState={{ selected: isActive }}
    >
      <Text
        style={[
          styles.label,
          isActive && styles.activeLabel
        ]}
      >
        {label}
      </Text>

      {badgeCount !== undefined && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  activeContainer: {
    backgroundColor: '#000000',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  activeLabel: {
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

### CategoryTag

**Description:**
Selectable tag component used in forms to allow users to choose one or multiple categories. Features clear visual indication of selection state with a checkmark icon when selected.

**Props:**
```typescript
interface CategoryTagProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  badge?: React.ReactNode; // For checkmark or other indicator
}
````

**Usage Examples:**

```jsx
// Single category tag
<CategoryTag
  label="Ìdílé (Family Oriki)"
  isSelected={selectedCategories.includes('family')}
  onPress={() => toggleCategory('family')}
/>

// Complete category selection group
<View style={styles.categoryContainer}>
  <CategoryTag
    label="Ìdílé (Family Oriki)"
    isSelected={selectedCategories.includes('family')}
    onPress={() => toggleCategory('family')}
  />
  <CategoryTag
    label="Ọba (Royal Oriki)"
    isSelected={selectedCategories.includes('royal')}
    onPress={() => toggleCategory('royal')}
  />
  <CategoryTag
    label="Òrìṣà (Deity Oriki)"
    isSelected={selectedCategories.includes('deity')}
    onPress={() => toggleCategory('deity')}
  />
  <CategoryTag
    label="Ìlú (Town Oriki)"
    isSelected={selectedCategories.includes('town')}
    onPress={() => toggleCategory('town')}
  />
  <CategoryTag
    label="Ìtàn (Historical Oriki)"
    isSelected={selectedCategories.includes('historical')}
    onPress={() => toggleCategory('historical')}
  />
</View>
```

**States:**

- Unselected: Light gray background with dark text
- Selected: Dark background with white text and checkmark indicator

**Implementation Notes:**

````jsx
// Example implementation of CategoryTag
const CategoryTag = ({ label, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={onPress}
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        style={[
          styles.label,
          isSelected && styles.selectedLabel
        ]}
      >
        {label}
      </Text>
      {isSelected && (
        <View style={styles.checkmarkContainer}>
          <CheckIcon width={14} height={14} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#F2F2F2',
  },
  selectedContainer: {
    backgroundColor: '#333333',
  },
  label: {
    fontSize: 16,
    color: '#333333',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
  checkmarkContainer: {
    marginLeft: 8,
  }
});

**Usage in Forms:**
- Typically used in a wrapped container that allows for wrapping to multiple lines
- Supports selecting multiple categories simultaneously
- Each tag toggles its selection state on press
- Selection state is typically managed in the parent component
- Visual design provides clear feedback on which categories are selected

### RecentlyAddedCard

**Description:**
A highlighted card component that appears at the top of category screens to showcase newly added content. Features a distinctive dark background and action buttons for quick access to content.

**Props:**
```typescript
interface RecentlyAddedCardProps {
  title?: string;
  onViewPress?: () => void;
  onPlayPress?: () => void;
  backgroundColor?: string;
  textColor?: string;
}
````

**Usage Examples:**

```jsx
<RecentlyAddedCard
  title="Recently added"
  onViewPress={() => navigateToRecentView()}
  onPlayPress={() => playRecentContent()}
  backgroundColor="#333333"
  textColor="#FFFFFF"
/>
```

**Implementation Notes:**

````jsx
// Example implementation of RecentlyAddedCard
const RecentlyAddedCard = ({
  title = "Recently added",
  onViewPress,
  onPlayPress,
  backgroundColor = "#333333",
  textColor = "#FFFFFF"
}) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor }
      ]}
    >
      <Text style={[styles.title, { color: textColor }]}>
        {title}
      </Text>

      <View style={styles.actions}>
        {onViewPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onViewPress}
          >
            <BookIcon color={textColor} size={20} />
          </TouchableOpacity>
        )}

        {onPlayPress && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onPlayPress}
          >
            <PlayIcon color="#FF3B30" size={20} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});

## Media Player Components

### DragHandle

**Description:**
A minimal UI element displayed at the top of modal or drawer screens to indicate that the screen can be dismissed by dragging down.

**Props:**
```typescript
interface DragHandleProps {
  color?: string;
  width?: number;
  thickness?: number;
}
````

**Usage Examples:**

```jsx
<DragHandle color="#FFFFFF" width={36} />
```

### LanguageToggle

**Description:**  
A segmented control/toggle component for switching between available languages for content, typically used within content viewing screens.

**Props:**

```typescript
interface LanguageToggleProps {
  languages: Array<{ label: string; value: string }>;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
}
```

**Usage Examples:**

```jsx
<LanguageToggle
  languages={[
    { label: 'Yoruba', value: 'yoruba' },
    { label: 'English', value: 'english' },
  ]}
  selectedLanguage="yoruba"
  onLanguageChange={language => setSelectedLanguage(language)}
/>
```

### SaveToPlaylistButton

**Description:**  
A button that allows users to save oriki content to their personal playlist for later listening or viewing.

**Props:**

```typescript
interface SaveToPlaylistButtonProps {
  isSaved: boolean;
  onToggleSave: () => void;
  size?: 'small' | 'medium' | 'large';
}
```

**States:**

- Unsaved: Outline bookmark/playlist icon
- Saved: Filled bookmark/playlist icon

**Usage Examples:**

```jsx
<SaveToPlaylistButton isSaved={isOrikiSaved} onToggleSave={() => toggleSaveOriki(orikiId)} />
```

### LyricsDisplay

**Description:**  
A component that displays oriki lyrics with synchronized highlighting during audio playback. Used in both the Lyrics Preview screen and main Oriki Player to provide visual tracking of lyrics as they are spoken/sung.

**Props:**

- `lyrics: Array<{text: string, startTime: number, endTime: number, index: number}>` - Array of lyrics sections with timestamps
- `currentTime: number` - Current playback position in seconds
- `language: 'yoruba' | 'english'` - Current language being displayed
- `onSectionPress?: (index: number) => void` - Optional callback when a lyrics section is tapped
- `highlightActiveSection?: boolean` - Whether to highlight the active section (defaults to true)
- `textStyle?: StyleProp<TextStyle>` - Optional custom styling for text
- `activeTextStyle?: StyleProp<TextStyle>` - Optional custom styling for active text

**States:**

- Default: All text visible with standard styling
- Active Section: Current section highlighted based on playback position
- Interactive: Tapping on sections triggers navigation to that timestamp
- Scrolling: Automatically scrolls to keep active section visible

**Usage Example:**

```tsx
// Sample lyrics data with timestamps
const lyricsSections = {
  yoruba: [
    { text: 'Ọmọ Adéwálé, ọmọ ajíbọ́ṣe', startTime: 0, endTime: 12.5, index: 0 },
    { text: 'Ọmọ ẹni tí ń gbé inú igbó ṣeré', startTime: 12.5, endTime: 25.3, index: 1 },
    // more sections...
  ],
  english: [
    { text: 'Son of Adéwálé, son of destined renown', startTime: 0, endTime: 12.5, index: 0 },
    {
      text: 'Son of one who plays in the heart of the forest',
      startTime: 12.5,
      endTime: 25.3,
      index: 1,
    },
    // more sections...
  ],
};

// In component:
const [currentTime, setCurrentTime] = useState(0);
const [language, setLanguage] = useState('yoruba');

<LyricsDisplay
  lyrics={lyricsSections[language]}
  currentTime={currentTime}
  language={language}
  onSectionPress={index => {
    // Seek audio to the section's start time
    const section = lyricsSections[language][index];
    seekToTime(section.startTime);
  }}
/>;
```

**Implementation Notes:**

```tsx
const LyricsDisplay = ({
  lyrics,
  currentTime,
  language,
  onSectionPress,
  highlightActiveSection = true,
  textStyle,
  activeTextStyle,
}) => {
  const scrollViewRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Find which section should be active based on currentTime
  useEffect(() => {
    const newActiveIndex = lyrics.findIndex(
      section => currentTime >= section.startTime && currentTime < section.endTime
    );

    if (newActiveIndex !== activeIndex) {
      setActiveIndex(newActiveIndex);
    }
  }, [currentTime, lyrics, activeIndex]);

  // Auto-scroll to keep active section visible
  useEffect(() => {
    if (activeIndex >= 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: activeIndex * 60, // Approximate height of each section
        animated: true,
      });
    }
  }, [activeIndex]);

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {lyrics.map((section, index) => (
        <Pressable
          key={section.index}
          style={styles.section}
          onPress={() => onSectionPress && onSectionPress(index)}
        >
          <Text
            style={[
              styles.text,
              textStyle,
              language === 'yoruba' ? styles.yorubaText : styles.englishText,
              highlightActiveSection &&
                index === activeIndex && [styles.activeText, activeTextStyle],
            ]}
          >
            {section.text}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    color: 'rgba(255, 255, 255, 0.6)', // Dimmed by default
    textAlign: 'left',
  },
  yorubaText: {
    // Specific styling for Yoruba text if needed
  },
  englishText: {
    // Specific styling for English text if needed
  },
  activeText: {
    color: '#FFFFFF', // Full white when active
    fontWeight: '600',
  },
});
```

**Visual Characteristics:**

- Text displayed in a clean, readable format with appropriate line height and spacing
- Currently playing section highlighted in white (or custom activeTextStyle color)
- Inactive sections displayed in a dimmed color
- Automatic scrolling ensures the active section remains visible during playback
- Each section is touchable to navigate directly to that part of the audio
- Text alignment and styling adapts based on language (may include specific typographic adjustments for Yoruba)
- Consistent with the app's overall design language and color scheme
- Smooth transitions when highlighting moves between sections
- Background-agnostic design works on both the dark red player background and other screens

### AudioWaveform

**Description:**  
A visual representation of the audio waveform that provides a visual indication of the audio pattern and progress.

**Props:**

```typescript
interface AudioWaveformProps {
  waveformData: number[];
  progress: number; // 0-1 value representing playback progress
  color?: string;
  progressColor?: string;
  height?: number;
  barWidth?: number;
  barSpacing?: number;
}
```

**Usage Examples:**

```jsx
<AudioWaveform
  waveformData={oriki.waveformData}
  progress={playerState.currentPosition / playerState.duration}
  color="#AAAAAA"
  progressColor="#FFFFFF"
  height={48}
/>
```

### CircularProgressPlayer

**Description:**  
An elliptical/circular playback control component that combines progress indication with playback controls (play/pause, previous, next).

**Props:**

```typescript
interface CircularProgressPlayerProps {
  isPlaying: boolean;
  currentPosition: number;
  duration: number;
  onPlayPausePress: () => void;
  onPreviousPress: () => void;
  onNextPress: () => void;
  onSeek: (position: number) => void;
  progressColor?: string;
  trackColor?: string;
  markerColor?: string;
  size?: number;
  buttonSize?: number;
}
```

**Usage Examples:**

```jsx
<CircularProgressPlayer
  isPlaying={playerState.isPlaying}
  currentPosition={playerState.currentPosition}
  duration={playerState.duration}
  onPlayPausePress={() => togglePlayback()}
  onPreviousPress={() => playPreviousTrack()}
  onNextPress={() => playNextTrack()}
  onSeek={position => seekToPosition(position)}
  progressColor="#FF0000"
  trackColor="#FFFFFF"
  markerColor="#FF0000"
/>
```

**Implementation Notes:**

````jsx
// Example implementation of the elliptical progress player
const CircularProgressPlayer = ({
  isPlaying,
  currentPosition,
  duration,
  onPlayPausePress,
  onPreviousPress,
  onNextPress,
  onSeek,
  progressColor = '#FF0000',
  trackColor = '#FFFFFF',
  markerColor = '#FF0000'
}) => {
  const progress = duration > 0 ? currentPosition / duration : 0;

  // Handle touch input for seeking
  const handleTrackPress = (event) => {
    // Calculate touch position relative to the elliptical track
    // and convert to a position value
    const newPosition = calculatePositionFromTouch(event);
    onSeek(newPosition * duration);
  };

  return (
    <View style={styles.container}>
      {/* Elliptical track */}
      <View style={[styles.track, { borderColor: trackColor }]}>
        {/* Progress indicator */}
        <View
          style={[
            styles.progressTrack,
            { borderColor: progressColor }
          ]}
        />

        {/* Position marker (red dot) */}
        <View
          style={[
            styles.marker,
            {
              backgroundColor: markerColor,
              transform: [
                { rotate: `${progress * 360}deg` },
                { translateX: 120 } // Half of the ellipse width
              ]
            }
          ]}
        />
      </View>

      {/* Control buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onPreviousPress}
        >
          <PreviousIcon />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={onPlayPausePress}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={onNextPress}
        >
          <NextIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 24
  },
  track: {
    width: 240,
    height: 120,
    borderRadius: 120,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120
  },
  progressTrack: {
    // Similar styling to track but with clip path or partial border
  },
  marker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 0
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16
  },
  controlButton: {
    padding: 12
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24
  }
});

### MinimizedPlayer

**Description:**
A persistent, compact player component that appears at the bottom of the screen when the full-screen Oriki Player is minimized. Allows users to control playback while browsing other parts of the app.

**Props:**
```typescript
interface MinimizedPlayerProps {
  oriki: {
    id: string;
    title: string;
    subtitle: string;
    initialText: string;
    initialColor: string;
  };
  isPlaying: boolean;
  onPlayPausePress: () => void;
  onPress: () => void; // To expand back to full player
}
````

**States:**

- Playing: Shows pause icon
- Paused: Shows play icon
- Loading: Optional loading indicator

**Usage Examples:**

```jsx
<MinimizedPlayer
  oriki={{
    id: 'oriki123',
    title: 'Oriki Idílé Adéwálé',
    subtitle: 'Praise Poetry of the Adéwálé Family',
    initialText: 'WE',
    initialColor: '#F27B35',
  }}
  isPlaying={true}
  onPlayPausePress={() => togglePlayback()}
  onPress={() => expandPlayer()}
/>
```

**Implementation Notes:**

````jsx
// Example implementation of the minimized player
const MinimizedPlayer = ({ oriki, isPlaying, onPlayPausePress, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <InitialIcon
          text={oriki.initialText}
          backgroundColor={oriki.initialColor}
          size="small"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {oriki.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {oriki.subtitle}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={(e) => {
            e.stopPropagation();
            onPlayPausePress();
          }}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60, // Positioned above the bottom navigation
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
    zIndex: 100,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666666',
  },
  playPauseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6363',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

**Notes:**
- The minimized player appears above the bottom navigation
- Tapping on the player (except for the play/pause button) expands it back to the full-screen player
- The play/pause button event needs to stop propagation to prevent expanding the player
- The player includes a subtle shadow/elevation to distinguish it from other UI elements
- The component should maintain the same audio playback state as the full-screen player
- Ensure the component is accessible with adequate touch targets
- Consider adding a swipe-down gesture on the full player for a smooth transition to the minimized state
- The minimized player should persist across tab navigation in the app

## Contributor Components

### ProfileButton

**Description:**
A button that provides access to the user's profile and account settings, typically placed in the header of screens related to user content.

**Props:**
```typescript
interface ProfileButtonProps {
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  imageUrl?: string; // Optional user avatar image
}
````

**Usage Examples:**

```jsx
<ProfileButton
  onPress={() => navigation.navigate('Profile')}
  size="medium"
  imageUrl={user.profileImage}
/>
```

### ShareOrikiCard

**Description:**  
A prominent card-style button that encourages users to contribute new oriki content to the platform. Features a distinctive design with a plus icon and explanatory text.

**Props:**

```typescript
interface ShareOrikiCardProps {
  onPress: () => void;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}
```

**Usage Examples:**

```jsx
<ShareOrikiCard
  onPress={() => navigation.navigate('ShareOriki')}
  title="Share an Orik"
  description="Add an Oriki in Yoruba, its English translation, and an optional audio"
  icon={<PlusIcon />}
/>
```

**Implementation Notes:**

```jsx
// Example implementation of ShareOrikiCard
const ShareOrikiCard = ({ onPress, title, description, icon }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>{icon || <PlusIcon color="#FFFFFF" />}</View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{title || 'Share an Orik'}</Text>
          <Text style={styles.description}>
            {description ||
              'Add an Oriki in Yoruba, its English translation, and an optional audio'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FF6363',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
  },
});
```

### DateDivider

**Description:**  
A component used to visually separate and organize content by date, typically used in list views to group items chronologically.

**Props:**

```typescript
interface DateDividerProps {
  date: string | Date;
  format?: string; // Format string for date display
}
```

**Usage Examples:**

```jsx
<DateDivider
  date="Jan 2025"
/>

// Or with Date object
<DateDivider
  date={new Date(2025, 0, 15)}
  format="MMM yyyy"
/>
```

### ContributionItem

**Description:**  
Displays user-submitted oriki entries in the Contributor screen. Shows the oriki title, description, and includes an edit button. Features special styling for newly added contributions to provide visual feedback after submission.

**Props:**

- `contribution: OrikiContent` - The oriki contribution data
- `onPress: () => void` - Callback when the item is pressed
- `onEditPress: () => void` - Callback when the edit button is pressed
- `isNew?: boolean` - Whether this is a newly added contribution (for highlighting)
- `highlightDuration?: number` - How long to show the highlight effect (in ms)

**States:**

- Default: Standard display state
- New: Highlighted state for newly added contributions
- Pressed: Visual feedback when item is pressed
- Edit Hover: Visual indication when hovering over edit button

**Usage Example:**

```tsx
const MyContributions = () => {
  const contributions = useSelector(state => state.content.userContributions.items);
  const [newContributionId, setNewContributionId] = useState<string | null>(null);

  // When a new contribution is added, set its ID to highlight it
  useEffect(() => {
    // This would be triggered after navigation from Preview screen with new submission
    if (route.params?.newContributionId) {
      setNewContributionId(route.params.newContributionId);

      // Clear the highlight after a duration
      const timer = setTimeout(() => {
        setNewContributionId(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [route.params]);

  return (
    <View>
      {contributions.map(contribution => (
        <ContributionItem
          key={contribution.id}
          contribution={contribution}
          onPress={() => navigation.navigate('OrikiDetail', { id: contribution.id })}
          onEditPress={() => navigation.navigate('EditOriki', { id: contribution.id })}
          isNew={contribution.id === newContributionId}
        />
      ))}
    </View>
  );
};
```

**Implementation Notes:**

````tsx
const ContributionItem = ({ contribution, onPress, onEditPress, isNew, highlightDuration = 3000 }) => {
  const [isHighlighted, setIsHighlighted] = useState(isNew);
  const fadeAnim = useRef(new Animated.Value(isNew ? 1 : 0)).current;

  useEffect(() => {
    if (isNew) {
      setIsHighlighted(true);

      // Create fade-out animation for the highlight
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: highlightDuration,
        useNativeDriver: true,
      }).start(() => {
        setIsHighlighted(false);
      });
    }
  }, [isNew, fadeAnim, highlightDuration]);

  const highlightStyle = {
    backgroundColor: fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', 'rgba(199, 61, 16, 0.1)'],
    }),
  };

  return (
    <Animated.View style={[styles.container, isHighlighted && highlightStyle]}>
      <Pressable
        style={({ pressed }) => [
          styles.content,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
      >
        <View style={styles.initialIconContainer}>
          <Text style={styles.initialText}>
            {contribution.initialText}
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{contribution.title}</Text>
          <Text style={styles.description}>{contribution.description}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.editButton,
            pressed && styles.editButtonPressed,
          ]}
          onPress={onEditPress}
          hitSlop={8}
        >
          <EditIcon width={20} height={20} />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 6,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  initialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5A172', // Varies based on contribution type
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#251608',
  },
  description: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 2,
  },
  editButton: {
    padding: 8,
  },
  editButtonPressed: {
    opacity: 0.7,
  },
});

**Visual Characteristics:**
- Features a color-coded initial icon that matches the main app's visual language
- Shows title in the original language and description/translation below
- Edit button is positioned on the right side for easy access
- When a new contribution is added, the component briefly highlights with a subtle animation
- Highlight effect gradually fades out to draw attention to the new item
- Maintains consistent sizing and spacing with other list items
- Proper hit areas for both the main item press and the edit button
- Visual feedback when pressed for better interaction experience

### EditButton

**Description:**
An icon button used to initiate editing of user-generated content.

**Props:**
```typescript
interface EditButtonProps {
  onPress: () => void;
  size?: number;
  color?: string;
  hitSlop?: number | { top: number, left: number, bottom: number, right: number };
}
````

**Usage Examples:**

```jsx
<EditButton onPress={() => startEditing(itemId)} size={20} color="#999999" hitSlop={10} />
```

### AudioRecorder

**Description:**  
A specialized component for recording, playing back, and visualizing audio content, used in the oriki contribution flow.

**Props:**

```typescript
interface AudioRecorderProps {
  initialAudioUrl?: string; // For pre-existing recordings
  onRecordingComplete: (file: File) => void;
  onRecordingDelete: () => void;
  maxDuration?: number; // Maximum recording length in seconds
}
```

**States:**

- Idle: Ready to start recording
- Recording: Currently capturing audio
- Playback: Playing recorded audio for preview
- Error: Recording/playback error state

**Usage Examples:**

```jsx
<AudioRecorder
  initialAudioUrl={editingMode ? existingAudio : undefined}
  onRecordingComplete={file => updateFormData('audio', file)}
  onRecordingDelete={() => updateFormData('audio', null)}
  maxDuration={180} // 3 minutes
/>
```

**Implementation Notes:**

```jsx
// Implementation would require integration with device audio APIs
// This is a simplified example of the component structure

const AudioRecorder = ({
  initialAudioUrl,
  onRecordingComplete,
  onRecordingDelete,
  maxDuration = 180,
}) => {
  const [recordingState, setRecordingState] = useState('idle'); // 'idle', 'recording', 'playback', 'error'
  const [recordedAudioUrl, setRecordedAudioUrl] = useState(initialAudioUrl);
  const [duration, setDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [waveformData, setWaveformData] = useState([]);

  // Recording logic would be implemented here

  return (
    <View style={styles.container}>
      <View style={styles.waveformContainer}>
        {/* Waveform visualization */}
        {recordedAudioUrl && (
          <WaveformVisualizer data={waveformData} progress={currentPosition / duration} />
        )}
      </View>

      <View style={styles.controls}>
        {recordingState === 'idle' && !recordedAudioUrl && (
          <RecordButton onPress={startRecording} label="Record Audio" />
        )}

        {recordingState === 'recording' && (
          <StopButton onPress={stopRecording} duration={duration} maxDuration={maxDuration} />
        )}

        {recordedAudioUrl && (
          <View style={styles.playbackControls}>
            <PlaybackButton
              isPlaying={recordingState === 'playback'}
              onPlayPress={startPlayback}
              onPausePress={pausePlayback}
            />
            <ProgressBar progress={currentPosition / duration} onSeek={seekTo} />
            <DeleteButton
              onPress={() => {
                setRecordedAudioUrl(null);
                onRecordingDelete();
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};
```

### AudioFileUpload

**Description:**  
A component for uploading pre-recorded audio files to accompany oriki submissions. Features a clean upload area with a centered icon, instructional text, and an action button.

**Props:**

```typescript
interface AudioFileUploadProps {
  onFileSelected: (file: File) => void;
  existingFileName?: string;
  isUploading?: boolean;
  error?: string;
}
```

**States:**

- Empty: No file selected yet
- Selected: File has been chosen but not uploaded
- Uploading: File is currently being uploaded
- Complete: File has been successfully uploaded
- Error: Upload failure or invalid file

**Usage Examples:**

```jsx
<AudioFileUpload
  onFileSelected={file => handleAudioFileSelection(file)}
  existingFileName={formData.audioFileName}
  isUploading={isUploading}
  error={errors.audio}
/>
```

**Implementation Notes:**

```jsx
const AudioFileUpload = ({ onFileSelected, existingFileName, isUploading = false, error }) => {
  const handleFileSelection = () => {
    // Implementation would open device file picker
    // After selection, call onFileSelected with the file
  };

  return (
    <View style={styles.container}>
      <View style={styles.uploadArea}>
        <UploadIcon width={24} height={24} color="#999999" />
        <Text style={styles.instructionText}>
          {existingFileName ? existingFileName : 'Add a audio recording'}
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleFileSelection}
          disabled={isUploading}
        >
          <Text style={styles.buttonText}>ADD FILE</Text>
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {isUploading && <ActivityIndicator size="small" color="#C73D10" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  uploadArea: {
    padding: 24,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  instructionText: {
    fontSize: 16,
    color: '#666666',
    marginVertical: 12,
    textAlign: 'center',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
  },
});
```

**Usage in Forms:**

- Typically placed in a form section for adding supplementary audio content
- The component handles the file selection dialog through platform-native pickers
- Supports displaying the selected file name once chosen
- Provides visual feedback during upload process
- Shows error messages for invalid files or failed uploads
- Styled to match the form's overall design language

### AudioWaveformWithMarkers

**Description:**  
An interactive audio visualization component that displays a waveform representation of audio with draggable markers for setting timestamp boundaries. Used primarily in the Lyrics Syncing screen to help users match text segments with audio portions.

**Props:**

- `audioUrl: string` - URL to the audio file
- `waveformData?: number[]` - Pre-processed amplitude data for rendering the waveform
- `currentTime: number` - Current playback position in seconds
- `startTime: number` - Start timestamp position in seconds
- `endTime: number` - End timestamp position in seconds
- `isPlaying: boolean` - Whether audio is currently playing
- `onStartTimeChange: (time: number) => void` - Callback when start marker is dragged
- `onEndTimeChange: (time: number) => void` - Callback when end marker is dragged
- `onSeek: (time: number) => void` - Callback when user taps on waveform to seek
- `onPlayPause: () => void` - Callback when play/pause is toggled
- `language: 'yoruba' | 'english'` - Current language being synchronized
- `duration: number` - Total duration of audio in seconds
- `disabled?: boolean` - Whether the component is interactive

**States:**

- Interactive: Both markers can be dragged
- Playing: Waveform animates with current playback position
- Paused: Static waveform with position indicator
- Selected: Portion between markers is highlighted
- Disabled: Non-interactive display mode

**Usage Example:**

```tsx
const [startTime, setStartTime] = useState(12.5);
const [endTime, setEndTime] = useState(50.2);
const [isPlaying, setIsPlaying] = useState(false);
const [currentTime, setCurrentTime] = useState(0);

const handlePlayPause = () => {
  setIsPlaying(!isPlaying);
  // Audio playback logic
};

<AudioWaveformWithMarkers
  audioUrl="https://example.com/audio.mp3"
  startTime={startTime}
  endTime={endTime}
  currentTime={currentTime}
  isPlaying={isPlaying}
  duration={180} // 3 minutes
  language="english"
  onStartTimeChange={setStartTime}
  onEndTimeChange={setEndTime}
  onSeek={time => {
    setCurrentTime(time);
    // Seek audio to time
  }}
  onPlayPause={handlePlayPause}
/>;
```

**Implementation Notes:**

```tsx
const AudioWaveformWithMarkers = ({
  audioUrl,
  waveformData,
  currentTime,
  startTime,
  endTime,
  isPlaying,
  onStartTimeChange,
  onEndTimeChange,
  onSeek,
  onPlayPause,
  language,
  duration,
  disabled,
}) => {
  // Load audio and generate waveform data if not provided
  const [localWaveformData, setLocalWaveformData] = useState(waveformData || []);

  useEffect(() => {
    if (!waveformData && audioUrl) {
      // Generate waveform data from audio file
      generateWaveformData(audioUrl).then(setLocalWaveformData);
    }
  }, [audioUrl, waveformData]);

  // Marker drag handling logic
  const handleStartMarkerDrag = position => {
    const newTime = (position / waveformWidth) * duration;
    onStartTimeChange(Math.max(0, Math.min(newTime, endTime - 0.5)));
  };

  const handleEndMarkerDrag = position => {
    const newTime = (position / waveformWidth) * duration;
    onEndTimeChange(Math.min(duration, Math.max(newTime, startTime + 0.5)));
  };

  // Format time as MM:SS
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeDisplay}>
        <Text>{formatTime(startTime)}</Text>
        <Text>-</Text>
        <Text>{formatTime(endTime)}</Text>
      </View>

      <View
        style={[
          styles.waveformContainer,
          language === 'english' ? styles.englishWaveform : styles.yorubaWaveform,
        ]}
      >
        {/* Waveform visualization */}
        <View style={styles.waveform}>
          {localWaveformData.map((amplitude, index) => (
            <View
              key={index}
              style={[
                styles.waveformBar,
                {
                  height: amplitude * 100 + '%',
                  backgroundColor: getBarColor(
                    index,
                    startTime,
                    endTime,
                    currentTime,
                    duration,
                    language
                  ),
                },
              ]}
            />
          ))}
        </View>

        {/* Start marker */}
        <View
          style={[styles.marker, styles.startMarker, { left: (startTime / duration) * 100 + '%' }]}
          {...(disabled ? {} : createPanResponder(handleStartMarkerDrag).panHandlers)}
        />

        {/* End marker */}
        <View
          style={[styles.marker, styles.endMarker, { left: (endTime / duration) * 100 + '%' }]}
          {...(disabled ? {} : createPanResponder(handleEndMarkerDrag).panHandlers)}
        />

        {/* Current position indicator */}
        {isPlaying && (
          <View
            style={[styles.positionIndicator, { left: (currentTime / duration) * 100 + '%' }]}
          />
        )}
      </View>

      <TouchableOpacity style={styles.playPauseButton} onPress={onPlayPause} disabled={disabled}>
        <Icon name={isPlaying ? 'pause' : 'play'} size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 70,
    marginVertical: 10,
  },
  timeDisplay: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  waveformContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  englishWaveform: {
    backgroundColor: 'rgba(249, 111, 93, 0.2)', // Light red for English
  },
  yorubaWaveform: {
    backgroundColor: 'rgba(93, 173, 226, 0.2)', // Light blue for Yoruba
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  waveformBar: {
    width: 2,
    marginHorizontal: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  marker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#000',
  },
  startMarker: {
    backgroundColor: '#007AFF',
  },
  endMarker: {
    backgroundColor: '#FF3B30',
  },
  positionIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#FF9500',
  },
  playPauseButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});
```

### LyricsSection

**Description:**  
A component that displays and manages a single section of lyrics text during the synchronization process. Shows text content with appropriate styling based on its current state and language, along with timing information and playback controls.

**Props:**

- `text: string` - The text content for this section
- `startTime: number` - Start timestamp in seconds for this section
- `endTime: number` - End timestamp in seconds for this section
- `index: number` - Sequential index of this section
- `isActive: boolean` - Whether this is the currently-being-synced section
- `isCompleted: boolean` - Whether this section has been synchronized
- `isPending: boolean` - Whether this section is waiting to be synced
- `language: 'yoruba' | 'english'` - Language of this text section
- `onPlay: () => void` - Callback when play button is tapped
- `isPlaying: boolean` - Whether this section is currently playing
- `onTimestampChange: (startTime: number, endTime: number) => void` - Callback for timestamp updates

**States:**

- Active: Currently being synchronized (highlighted, fully interactive)
- Completed: Already synchronized (subdued styling, playback only)
- Pending: Not yet synchronized (grayed out, non-interactive)
- Playing: Audio is playing for this section

**Usage Example:**

```tsx
<LyricsSection
  text="Son of Adéwálé, son of destined renown, Son of one who plays in the heart of the forest."
  startTime={12.5}
  endTime={50.2}
  index={0}
  isActive={true}
  isCompleted={false}
  isPending={false}
  language="english"
  onPlay={() => playSection(0)}
  isPlaying={currentPlayingSection === 0}
  onTimestampChange={(start, end) => updateTimestamps(0, start, end)}
/>
```

**Implementation Notes:**

```tsx
const LyricsSection = ({
  text,
  startTime,
  endTime,
  index,
  isActive,
  isCompleted,
  isPending,
  language,
  onPlay,
  isPlaying,
  onTimestampChange,
}) => {
  // Format time as MM:SS
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get the appropriate text color based on state
  const getTextColor = () => {
    if (isActive) return '#000';
    if (isCompleted) return '#666';
    if (isPending) return '#999';
    return '#333';
  };

  // Get the appropriate background color based on state and language
  const getBackgroundColor = () => {
    if (isActive) {
      return language === 'english' ? 'rgba(249, 111, 93, 0.15)' : 'rgba(93, 173, 226, 0.15)';
    }
    if (isCompleted) {
      return language === 'english' ? 'rgba(249, 111, 93, 0.05)' : 'rgba(93, 173, 226, 0.05)';
    }
    return 'transparent';
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <Text
        style={[
          styles.text,
          { color: getTextColor() },
          isActive && styles.activeText,
          language === 'english' ? styles.englishText : styles.yorubaText,
        ]}
      >
        {text}
      </Text>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.playButton,
            isPlaying && styles.pauseButton,
            isPending && styles.disabledButton,
          ]}
          onPress={onPlay}
          disabled={isPending}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} size={20} color="#000" />
        </TouchableOpacity>

        <Text style={styles.timestamp}>
          {formatTime(startTime)} - {formatTime(endTime)}
        </Text>
      </View>

      {isActive && (
        <AudioWaveformWithMarkers
          startTime={startTime}
          endTime={endTime}
          onStartTimeChange={time => onTimestampChange(time, endTime)}
          onEndTimeChange={time => onTimestampChange(startTime, time)}
          language={language}
          // Other required props
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 8,
  },
  activeText: {
    fontWeight: '600',
  },
  englishText: {
    fontFamily: 'System',
    borderLeftColor: 'rgba(249, 111, 93, 0.7)',
  },
  yorubaText: {
    // Possibly a different font for Yoruba if needed
    fontFamily: 'System',
    borderLeftColor: 'rgba(93, 173, 226, 0.7)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  pauseButton: {
    backgroundColor: '#F0F0F0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  timestamp: {
    marginLeft: 16,
    fontSize: 14,
    color: '#666',
  },
});
```

**Visual Characteristics:**

- Text styling changes based on section state (active, completed, pending)
- Visual distinction between Yoruba and English text sections (subtle color differences)
- Play button for audio playback verification
- Timestamp display showing current synchronization range
- Active sections display the waveform visualization with draggable markers
- Completed sections show a subdued styling with playback option
- Pending sections appear grayed out until they become active
- Language-specific styling differentiates between Yoruba and English content

### SubmissionSuccessIndicator

**Description:**  
A visual indicator that appears briefly after successful completion of an oriki submission. Provides positive feedback to users when their contribution has been successfully added.

**Props:**

- `visible: boolean` - Whether the indicator is visible
- `message?: string` - Optional custom success message
- `duration?: number` - How long to display the indicator (in ms)
- `onDismiss?: () => void` - Callback when indicator is dismissed

**States:**

- Visible: Fully displayed with animation
- Exiting: Fading out
- Hidden: Not displayed

**Usage Example:**

```tsx
// Inside ContributorScreen
const { submissionState } = useSelector(state => state.content.userContributions);

useEffect(() => {
  // Show success indicator when returning from submission
  if (submissionState.success) {
    // Reset success state after showing indicator
    setTimeout(() => {
      dispatch(resetSubmissionSuccess());
    }, 3000);
  }
}, [submissionState.success]);

return (
  <View style={styles.container}>
    {/* Other screen content */}

    <SubmissionSuccessIndicator
      visible={submissionState.success}
      message="Your oriki has been successfully added!"
      duration={3000}
      onDismiss={() => dispatch(resetSubmissionSuccess())}
    />
  </View>
);
```

**Implementation Notes:**

```tsx
const SubmissionSuccessIndicator = ({
  visible,
  message = 'Your oriki has been successfully added!',
  duration = 3000,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Set timeout to dismiss
      const timer = setTimeout(() => {
        dismissIndicator();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const dismissIndicator = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) {
        onDismiss();
      }
    });
  };

  if (!visible && opacity._value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <SuccessIcon width={24} height={24} color="#FFFFFF" />
      </View>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 90, // Above bottom navigation
    left: 16,
    right: 16,
    backgroundColor: '#251608', // Dark brown
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#C73D10', // Brand red
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
});
```

**Visual Characteristics:**

- Appears as a toast-style notification at the bottom of the screen (above bottom navigation)
- Features a checkmark icon in a circular red badge
- Dark background with white text for high contrast
- Slides up from bottom with a smooth animation
- Automatically dismisses after specified duration
- Fades out gracefully when dismissed
- Responsive to different screen sizes
- Non-intrusive design that doesn't block main content
- Consistent with app's design language

### ProfileAvatar

**Description:**  
A circular avatar component that displays either the user's profile image or their initials if no image is available. Used primarily in the User Profile Modal.

**Props:**

- `image?: string` - URL to the user's profile image (optional)
- `name: string` - User's full name (used to generate initials if no image is provided)
- `size?: 'small' | 'medium' | 'large'` - Size of the avatar (defaults to 'medium')
- `backgroundColor?: string` - Custom background color for the initials view

**States:**

- With Image: Displays the user's profile photo
- Without Image: Displays the user's initials in a colored circle

**Usage Example:**

```tsx
// With image
<ProfileAvatar
  image="https://example.com/profile.jpg"
  name="Omolola Ogunbiyi"
  size="large"
/>

// Without image (displays initials)
<ProfileAvatar
  name="Omolola Ogunbiyi"
  size="medium"
/>
```

**Implementation Notes:**

```tsx
const ProfileAvatar = ({ image, name, size = 'medium', backgroundColor }) => {
  // Generate initials from name (first letter of first and last name)
  const getInitials = name => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Determine size dimensions
  const sizeStyles = {
    small: { width: 40, height: 40, fontSize: 16 },
    medium: { width: 64, height: 64, fontSize: 24 },
    large: { width: 80, height: 80, fontSize: 32 },
  };

  // If image is provided and loaded successfully
  if (image) {
    return <Image source={{ uri: image }} style={[styles.avatar, sizeStyles[size]]} />;
  }

  // If no image, show initials
  return (
    <View
      style={[
        styles.initialsContainer,
        sizeStyles[size],
        backgroundColor ? { backgroundColor } : null,
      ]}
    >
      <Text style={[styles.initials, { fontSize: sizeStyles[size].fontSize }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 9999, // Circular
    overflow: 'hidden',
  },
  initialsContainer: {
    borderRadius: 9999,
    backgroundColor: '#E0E0E0', // Default light gray background
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#757575', // Medium gray text
    fontWeight: '500',
  },
});
```

**Visual Characteristics:**

- Perfectly circular shape for both image and initials view
- Default light gray background with darker gray text for initials
- Responsive to different size requirements (small, medium, large)
- Maintains aspect ratio for profile images
- Crops images to fill the circular container
- Clean, professional appearance to represent user identity
- Simple visual design that works well across light and dark themes

### StatBadge

**Description:**  
A pill-shaped badge component that displays user-related statistics or attributes with an icon. Used in the User Profile Modal to show state, town, and family information.

**Props:**

- `icon: ReactNode` - Icon element to display (can be SVG or component)
- `text: string` - Text to display in the badge
- `type?: 'state' | 'town' | 'family'` - Badge type, affects styling (optional)
- `color?: string` - Custom background color (optional)
- `textColor?: string` - Custom text color (optional)

**States:**

- Default: Standard appearance based on type
- Custom: With specified colors

**Usage Example:**

```tsx
<StatBadge
  icon={<LocationIcon width={16} height={16} />}
  text="Osun State"
  type="state"
/>

<StatBadge
  icon={<HomeIcon width={16} height={16} />}
  text="Ilé-Ifẹ́"
  type="town"
/>

<StatBadge
  icon={<PersonIcon width={16} height={16} />}
  text="Adéwálé family"
  type="family"
/>
```

**Implementation Notes:**

```tsx
const StatBadge = ({ icon, text, type, color, textColor }) => {
  // Type-based styling
  const getTypeStyles = () => {
    switch (type) {
      case 'state':
        return { backgroundColor: '#F0F8FF', textColor: '#0066CC' }; // Light blue
      case 'town':
        return { backgroundColor: '#F5F5F5', textColor: '#757575' }; // Light gray
      case 'family':
        return { backgroundColor: '#FFF0F0', textColor: '#CC0066' }; // Light pink
      default:
        return { backgroundColor: '#F5F5F5', textColor: '#757575' }; // Default gray
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color || typeStyles.backgroundColor,
        },
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, { color: textColor || typeStyles.textColor }]} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  iconContainer: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
```

**Visual Characteristics:**

- Pill-shaped design with rounded corners
- Icon positioned at the start of the badge
- Background color varies by badge type for visual differentiation
- Comfortable padding for easy readability
- Text truncation with ellipsis for long content
- Consistent height across all badge instances
- Light background with darker text for optimal contrast
- Different color schemes for different badge types (state, town, family)

### UpdateProfileButton

**Description:**  
A button component used to navigate to the profile editing screen. Featured prominently in the User Profile Modal.

**Props:**

- `onPress: () => void` - Function to call when button is pressed
- `text?: string` - Button text (defaults to "Update profile")
- `icon?: ReactNode` - Optional icon component to display

**States:**

- Default: Normal appearance
- Pressed: Visual feedback when pressed
- Disabled: Grayed out when unavailable (optional)

**Usage Example:**

```tsx
<UpdateProfileButton
  onPress={() => navigation.navigate('EditProfile')}
  icon={<PencilIcon width={16} height={16} color="#FFFFFF" />}
/>
```

**Implementation Notes:**

```tsx
const UpdateProfileButton = ({ onPress, text = 'Update profile', icon, disabled = false }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={styles.text}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEEEEE',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
});
```

**Visual Characteristics:**

- Full-width button design that spans the container
- Light gray background with dark text for subtle appearance
- Optional icon positioned before the text
- Consistent padding for comfortable touch target
- Rounded corners matching the app's design language
- Visual feedback when pressed (opacity change)
- Disabled state showing reduced opacity
- Clear "edit" metaphor with pencil icon
- Positioned at the bottom of the profile modal
- Clean, minimal styling that complements the modal design

### ProfileImageEditor

**Description:**  
A component that displays the user's profile image with an edit indicator, allowing users to update their profile photo. Used primarily in the Edit Profile screen.

**Props:**

- `image?: string` - URL to the user's current profile image (optional)
- `size?: number` - Size of the profile image container (default: 120)
- `onPress: () => void` - Function to call when the edit indicator is pressed
- `editable?: boolean` - Whether the image is editable (default: true)
- `editIconSize?: number` - Size of the edit icon (default: 24)

**States:**

- Default: Showing current profile image with edit indicator
- Loading: When uploading a new image
- Error: If image upload fails

**Usage Example:**

```tsx
const EditProfileScreen = () => {
  const [profileImage, setProfileImage] = useState(currentUser.profileImage);

  const handleImageSelect = async () => {
    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.cancelled) {
      // Handle image selection
      setProfileImage(result.uri);
      // Upload image
      uploadProfileImage(result.uri);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileImageEditor image={profileImage} onPress={handleImageSelect} size={120} />
      {/* Rest of form */}
    </View>
  );
};
```

**Implementation Notes:**

```tsx
const ProfileImageEditor = ({ image, size = 120, onPress, editable = true, editIconSize = 24 }) => {
  // Use ProfileAvatar for the image display
  return (
    <View style={styles.container}>
      <ProfileAvatar
        image={image}
        name="User Name" // Fallback for initials if no image
        size={size}
      />

      {editable && (
        <Pressable
          style={[
            styles.editButton,
            {
              width: editIconSize * 1.5,
              height: editIconSize * 1.5,
            },
          ]}
          onPress={onPress}
        >
          <CameraIcon width={editIconSize} height={editIconSize} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#FF6B6B', // Pinkish-red color
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
```

**Visual Characteristics:**

- Large circular profile image as the main element
- Edit indicator (camera icon) positioned in bottom-right corner
- Edit indicator has a distinct color (pink/red) to draw attention
- White border around the edit button to create visual separation
- The edit button is positioned partially overlapping the profile image
- Clean, minimal design that focuses attention on the profile image
- Consistent with the app's overall design language
- Responsive to different screen sizes with customizable dimensions
- Uses the same ProfileAvatar component for displaying the image
- Falls back to showing initials if no image is available

### FormInput

**Description:**  
A reusable form input component for text entry with labels, validation, and error handling. Used throughout the app for gathering user input, particularly in forms like the Edit Profile screen.

**Props:**

- `label: string` - Label displayed above the input field
- `value: string` - Current value of the input field
- `onChangeText: (text: string) => void` - Function called when text changes
- `placeholder?: string` - Placeholder text when input is empty
- `error?: string` - Error message to display (if any)
- `required?: boolean` - Whether the field is required (default: false)
- `optional?: boolean` - Whether to show an "Optional" label (default: false)
- `secureTextEntry?: boolean` - For password inputs (default: false)
- `keyboardType?: KeyboardTypeOptions` - Type of keyboard to display
- `maxLength?: number` - Maximum character limit
- `multiline?: boolean` - Whether input can span multiple lines

**States:**

- Default: Normal input state
- Focused: When the input is active/focused
- Error: When input has validation errors
- Disabled: When input is not editable

**Usage Example:**

```tsx
const ProfileForm = () => {
  const [name, setName] = useState('John Doe');
  const [town, setTown] = useState('Ilé-Ifẹ́');
  const [nameError, setNameError] = useState('');

  const validateName = (text: string) => {
    if (text.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
    } else {
      setNameError('');
    }
    setName(text);
  };

  return (
    <View style={styles.form}>
      <FormInput
        label="Full Name"
        value={name}
        onChangeText={validateName}
        placeholder="Enter your full name"
        error={nameError}
        required={true}
      />

      <FormInput
        label="Town"
        value={town}
        onChangeText={setTown}
        placeholder="Enter your town"
        optional={true}
      />
    </View>
  );
};
```

**Implementation Notes:**

```tsx
const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  optional = false,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
        {optional && <Text style={styles.optional}>(Optional)</Text>}
      </View>

      <TextInput
        style={[styles.input, isFocused && styles.focused, error && styles.errorInput]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  required: {
    color: '#FF3B30',
    marginLeft: 4,
  },
  optional: {
    fontSize: 14,
    color: '#777777',
    marginLeft: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  focused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  errorInput: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
});
```

**Visual Characteristics:**

- Clean, minimal design with adequate spacing
- Clear label positioned above the input field
- Visual indicators for required and optional fields
- Focus state with highlighted border
- Error state with red border and error message
- Consistent padding and height for good touch targets
- Typography that matches the app's design system
- Subtle background and border colors for visual hierarchy
- Responsive to different device sizes
- Accommodates various input types (text, email, password, etc.)

### SelectInput

**Description:**  
A dropdown select component that allows users to choose from a list of options. Used in forms like the Edit Profile screen for State and Default Language selection.

**Props:**

- `label: string` - Label displayed above the select field
- `value: string` - Currently selected value
- `options: Array<{label: string, value: string}>` - Available options
- `onSelect: (value: string) => void` - Function called when selection changes
- `placeholder?: string` - Placeholder text when no option is selected
- `icon?: React.ReactNode` - Optional icon to display (e.g., globe for language)
- `error?: string` - Error message to display (if any)
- `required?: boolean` - Whether selection is required (default: false)
- `optional?: boolean` - Whether to show an "Optional" label (default: false)

**States:**

- Default: Closed dropdown
- Open: Expanded dropdown showing options
- Selected: With a value chosen
- Error: When there's a validation error
- Disabled: When selection is not allowed

**Usage Example:**

```tsx
const ProfileForm = () => {
  const [state, setState] = useState('Osun');
  const [language, setLanguage] = useState('yoruba');

  const stateOptions = [
    { label: 'Osun', value: 'osun' },
    { label: 'Lagos', value: 'lagos' },
    { label: 'Oyo', value: 'oyo' },
    // More states
  ];

  const languageOptions = [
    { label: 'Yoruba', value: 'yoruba' },
    { label: 'English', value: 'english' },
  ];

  return (
    <View style={styles.form}>
      <SelectInput
        label="State"
        value={state}
        options={stateOptions}
        onSelect={setState}
        placeholder="Select your state"
        required={true}
      />

      <SelectInput
        label="Default Language"
        value={language}
        options={languageOptions}
        onSelect={setLanguage}
        placeholder="Select preferred language"
        icon={<GlobeIcon size={20} color="#555555" />}
      />
    </View>
  );
};
```

**Implementation Notes:**

```tsx
const SelectInput = ({
  label,
  value,
  options,
  onSelect,
  placeholder,
  icon,
  error,
  required = false,
  optional = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = option => {
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
        {optional && <Text style={styles.optional}>(Optional)</Text>}
      </View>

      <Pressable
        style={[styles.selectContainer, error && styles.errorContainer]}
        onPress={toggleDropdown}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <Text style={[styles.selectedText, !selectedOption && styles.placeholderText]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>

        <ChevronDownIcon size={20} color="#555555" />
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {isOpen && (
        <View style={styles.dropdown}>
          {options.map(option => (
            <Pressable
              key={option.value}
              style={[styles.option, option.value === value && styles.selectedOption]}
              onPress={() => handleSelect(option)}
            >
              <Text
                style={[styles.optionText, option.value === value && styles.selectedOptionText]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: 'relative',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  required: {
    color: '#FF3B30',
    marginLeft: 4,
  },
  optional: {
    fontSize: 14,
    color: '#777777',
    marginLeft: 4,
  },
  selectContainer: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    marginRight: 8,
  },
  selectedText: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
  },
  placeholderText: {
    color: '#999999',
  },
  errorContainer: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 200,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#F0F8FF',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedOptionText: {
    fontWeight: '500',
    color: '#007AFF',
  },
});
```

**Visual Characteristics:**

- Consistent styling with FormInput for a unified form appearance
- Clear visual indication of selected state
- Dropdown panel with shadow elevation for depth
- Chevron icon indicating expandable interaction
- Support for optional left icon (e.g., globe for language selection)
- Selected option highlighted in the dropdown list
- Smooth transitions for opening/closing dropdown
- Responsive dropdown that adapts to available space
- Error state with red border and error message
- Clean, organized option list with subtle highlighting

### SaveButton

**Description:**  
A prominent button component used for saving changes in forms, particularly in the Edit Profile screen. Provides visual feedback during the saving process.

**Props:**

- `onPress: () => void` - Function called when the button is pressed
- `isLoading?: boolean` - Whether the save operation is in progress (default: false)
- `disabled?: boolean` - Whether the button is disabled (default: false)
- `label?: string` - Button text (default: "Save")
- `width?: number | string` - Width of the button (default: "100%")
- `backgroundColor?: string` - Background color (default: "#000000")
- `textColor?: string` - Text color (default: "#FFFFFF")

**States:**

- Default: Ready to save changes
- Loading: Showing a loading spinner during the save operation
- Disabled: When saving is not allowed (e.g., invalid form)
- Error: When save operation fails (optional visual feedback)
- Success: When save completes successfully (optional visual feedback)

**Usage Example:**

```tsx
const EditProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: 'John Doe', state: 'Osun' /* ... */ });
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Validate form data
    const valid = !!formData.name && !!formData.state;
    setIsValid(valid);
  }, [formData]);

  const handleSave = async () => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      await updateUserProfile(formData);
      // Show success message
      navigation.goBack();
    } catch (error) {
      // Show error message
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Form inputs */}

      <SaveButton onPress={handleSave} isLoading={isLoading} disabled={!isValid} />
    </View>
  );
};
```

**Implementation Notes:**

```tsx
const SaveButton = ({
  onPress,
  isLoading = false,
  disabled = false,
  label = 'Save',
  width = '100%',
  backgroundColor = '#000000',
  textColor = '#FFFFFF',
}) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          width,
          backgroundColor: disabled
            ? '#CCCCCC'
            : pressed
              ? shadeColor(backgroundColor, -15) // Darken when pressed
              : backgroundColor,
        },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
};

// Helper function to darken/lighten colors
const shadeColor = (color, percent) => {
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = percent < 0 ? percent * -1 : percent;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;

  return `#${(
    0x1000000 +
    (Math.round((t - R) * p) + R) * 0x10000 +
    (Math.round((t - G) * p) + G) * 0x100 +
    (Math.round((t - B) * p) + B)
  )
    .toString(16)
    .slice(1)}`;
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.7,
  },
});
```

**Visual Characteristics:**

- Bold, high-contrast button that stands out in the UI
- Full-width design that spans the container (by default)
- Clear visual feedback states (pressed, loading, disabled)
- Loading spinner animation during async operations
- Smooth press animation for better tactile feedback
- Generous height for easy tapping on mobile
- Consistent with app branding and design language
- Positioned at the bottom of forms for easy reach
- Clear, readable text with appropriate font weight
- Follows accessibility best practices for touch targets
