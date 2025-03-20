---
description: Component development rules for the Akewi application
globs: ["**/*.tsx"]
---

# Component Development Guidelines

## Component Structure

- Use functional components with arrow function syntax
- Include a Props interface for each component
- Follow a consistent structure:
  1. Import statements
  2. Props interface
  3. Component function
  4. Export statement

Example:

```tsx
import { View, StyleSheet } from 'react-native';
import { Text } from '../base/Text';
import { useTranslation } from '../../hooks/useTranslation';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isDisabled?: boolean;
}

export const Button = ({ 
  label, 
  onPress, 
  variant = 'primary', 
  isDisabled = false 
}: ButtonProps) => {
  const { t } = useTranslation();
  
  return (
    <View style={[styles.container, styles[variant], isDisabled && styles.disabled]}>
      <Text>{t(label)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // styles
  },
  primary: {
    // styles
  },
  secondary: {
    // styles
  },
  outline: {
    // styles
  },
  disabled: {
    // styles
  },
});
```

## Component Organization

### Base Components

Base components are foundational UI elements that should:
- Be highly reusable
- Accept a variety of props for customization
- Follow design system specifications
- Support accessibility
- Have minimal dependencies

Examples include: Button, Text, Input, Select, Card

### Composite Components

Composite components combine multiple base components and should:
- Accept focused props specific to their use case
- Hide implementation complexity
- Maintain consistent behavior

Examples include: FormInput, CategoryCard, OrikiItem

### Layout Components

Layout components control the arrangement of other components and should:
- Handle spacing, alignment, and structure
- Adapt to different screen sizes
- Support RTL layouts when needed
- Handle safe areas, keyboard behavior, etc.

Examples include: Header, ScreenContainer, BottomTabs

## Component Best Practices

### Props

- Use descriptive prop names
- Provide default values for optional props
- Use TypeScript to enforce prop types
- Destructure props in the component parameter
- Document complex props with JSDoc comments

### State Management

- Use local state for UI-only state
- Avoid prop drilling; use context or Redux for shared state
- Use memoization to prevent unnecessary rerenders
- Extract complex state logic into custom hooks

### Styling

- Use StyleSheet.create for static styles
- Combine styles conditionally based on props
- Follow the theme system defined in constants/theme.ts
- Keep styling logic within the component file
- Use consistent naming conventions for style objects

### Component Testing

- Each component should have unit tests
- Test both appearance and behavior
- Mock external dependencies
- Check accessibility support
- Verify responsive behavior

## Component Categories

### Base Components

Required base components from the design system:
- Button (primary, secondary, outline, social)
- Text (various typography styles)
- Input (text, email, password, etc.)
- Select (dropdown)
- Checkbox and Radio buttons
- Card (content container)
- Divider

### Form Components

Form-related components to implement:
- FormInput (label + input + validation)
- SelectInput (label + select + validation)
- SaveButton (form submission)
- FormContainer (form wrapper)
- Validation messages

### Media Components

Media-related components to implement:
- AudioPlayer (controls, progress)
- AudioWaveform (visualization)
- CircularProgress (progress indicator)
- ImageUploader

### Oriki-specific Components

Domain-specific components to implement:
- OrikiItem (list item)
- CategoryCard (category display)
- LyricsDisplay (synchronized lyrics)
- OrikiPlayer (specialized audio player)

### Layout Components

Structural components to implement:
- Header (screen header)
- BottomTabs (navigation tabs)
- KeyboardAware (handles keyboard behavior)
- ScreenContainer (base container) 