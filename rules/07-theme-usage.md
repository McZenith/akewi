---
description: Theme usage rules for the Akewi application
globs: ["**/*.tsx", "**/theme/**", "**/styles/**", "**/constants/theme.ts"]
---

# Theme System Usage

## Design System Overview

The Akewi app uses a consistent design system defined in `src/constants/theme.ts`. All visual elements should follow these guidelines.

## Theme Structure

```typescript
export const theme = {
  colors: {
    // Primary colors
    primary: '#C73D10',
    primaryLight: '#FF6D3F',
    primaryDark: '#8F2900',
    
    // Secondary colors
    secondary: '#251608',
    secondaryLight: '#4A3020',
    secondaryDark: '#0F0900',
    
    // Neutrals
    black: '#000000',
    white: '#FFFFFF',
    grey1: '#F5F5F5',
    grey2: '#E0E0E0',
    grey3: '#9E9E9E',
    grey4: '#616161',
    grey5: '#212121',
    
    // Semantic colors
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    
    // Background colors
    background: '#FFFFFF',
    surface: '#F5F5F5',
  },
  
  typography: {
    fontFamilies: {
      primary: 'System',
      logo: 'Custom',
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 32,
    },
    fontWeights: {
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },
  
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    '2xl': 64,
    '3xl': 80,
  },
  
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 16,
    pill: 9999,
    circle: '50%',
  },
  
  shadows: {
    none: 'none',
    sm: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    md: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    lg: '0px 8px 16px rgba(0, 0, 0, 0.1)',
  },
};
```

## Theme Usage Guidelines

### Accessing Theme Values

Use the theme import in your components:

```tsx
import { theme } from '../../constants/theme';

export const Button = ({ label, variant = 'primary' }) => {
  // Use theme values for styling
  return (
    <TouchableOpacity
      style={{
        backgroundColor: variant === 'primary' ? theme.colors.primary : theme.colors.secondary,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
      }}
    >
      <Text
        style={{
          color: theme.colors.white,
          fontSize: theme.typography.fontSizes.md,
          fontWeight: theme.typography.fontWeights.semiBold,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
```

### Color Usage

- Use semantic color variables rather than hard-coded values
- Use primary colors for main interactive elements
- Use secondary colors for supporting elements
- Use neutrals for text, backgrounds, and subtle elements
- Use semantic colors consistently for their respective purposes

For example:
- Primary action buttons: `theme.colors.primary`
- Success messages: `theme.colors.success`
- Error states: `theme.colors.error`
- Text on light background: `theme.colors.grey5` (darkest grey)
- Text on dark background: `theme.colors.white`

### Typography

- Use the defined font sizes, weights, and line heights
- Maintain consistent text hierarchy across the app
- Use appropriate font sizes for different contexts:
  - Headlines: `xl`, `2xl`, `3xl`
  - Body text: `md`
  - Supporting text: `sm`
  - Labels/captions: `xs`

### Spacing

- Use the spacing scale for all margins, paddings, and gaps
- Maintain consistent spacing between elements
- Use appropriate spacing for different contexts:
  - Between sections: `lg` or larger
  - Between items within a section: `sm` or `md`
  - Internal component padding: `xs` or `sm`

### Component-Specific Styling

Create component-specific styles using the theme:

```tsx
import { StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.grey5,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    lineHeight: theme.typography.lineHeights.normal,
    color: theme.colors.grey4,
  },
});
```

## Theme Extension

For specific UI features that need specialized theming, extend the base theme with component-specific values:

```typescript
// Component specific theme extension
export const audioPlayerTheme = {
  ...theme,
  waveform: {
    activeColor: theme.colors.primary,
    inactiveColor: theme.colors.grey3,
    backgroundColor: theme.colors.grey1,
    barWidth: 2,
    barGap: 1,
    barRadius: 1,
  },
};
```

## Dark Mode Considerations

While dark mode is not yet implemented, design components with potential theming in mind:

- Avoid hard-coded colors that couldn't work in dark mode
- Use relative color terms (background, surface, text) when possible
- Prepare for dark mode by designing components that could adapt

## Platform-Specific Adjustments

Account for platform differences when necessary:

```tsx
import { Platform, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
```

## Best Practices

1. **Consistency**: Use theme values consistently across all components
2. **Maintainability**: Centralize all theme values in the theme file
3. **Responsiveness**: Design components to work across different screen sizes
4. **Accessibility**: Ensure color contrasts meet WCAG guidelines
5. **Composition**: Build complex UI by composing themed elements
6. **Reusability**: Extract common styled elements into reusable components 