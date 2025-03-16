# Theme Documentation

This document defines the design system for the Akewi app, including color palette, typography, spacing, and other design tokens.

## Colors

### Primary Colors

- **Primary**: `#C73D10` - Main brand color (from logo)
- **PrimaryLight**: `#FF6D3F` - Lighter shade of primary
- **PrimaryDark**: `#8F2900` - Darker shade of primary

### Secondary Colors

- **Secondary**: `#251608` - Secondary brand color (dark brown from logo)
- **SecondaryLight**: `#4A3020` - Lighter shade of secondary
- **SecondaryDark**: `#0F0900` - Darker shade of secondary

### Neutrals

- **Black**: `#000000` - Pure black (used in buttons)
- **White**: `#FFFFFF` - Pure white (backgrounds, text)
- **Grey1**: `#F5F5F5` - Lightest grey (input background)
- **Grey2**: `#E0E0E0` - Light grey (dividers)
- **Grey3**: `#9E9E9E` - Medium grey (placeholder text)
- **Grey4**: `#616161` - Dark grey (secondary text)
- **Grey5**: `#212121` - Darkest grey (primary text)

### Semantic Colors

- **Success**: `#4CAF50` - Success/positive actions
- **Warning**: `#FFC107` - Warning/caution actions
- **Error**: `#F44336` - Error/negative actions
- **Info**: `#2196F3` - Informational

### Background Colors

- **Background**: `#FFFFFF` - Default background
- **Surface**: `#F5F5F5` - Card/elevated surface

## Typography

### Font Families

- **Primary**: `System` - Main font for most text
- **Logo**: `Custom` - Custom font for the AKEWI logo

### Font Sizes

- **xs**: `12px` - Extra small text
- **sm**: `14px` - Small text (language selector)
- **md**: `16px` - Medium text (description, inputs)
- **lg**: `18px` - Large text (buttons)
- **xl**: `20px` - Extra large text
- **2xl**: `24px` - 2x extra large text
- **3xl**: `32px` - 3x extra large text

### Font Weights

- **Regular**: `400`
- **Medium**: `500`
- **SemiBold**: `600`
- **Bold**: `700`

### Line Heights

- **Tight**: `1.2`
- **Normal**: `1.5` (used in description text)
- **Relaxed**: `1.75`
- **Loose**: `2`

## Spacing

### Base Unit

The base spacing unit is `8px`. All spacing values are multiples of this base unit.

### Spacing Scale

- **xxs**: `4px` - Extra extra small spacing
- **xs**: `8px` - Extra small spacing
- **sm**: `16px` - Small spacing (between elements)
- **md**: `24px` - Medium spacing (content padding)
- **lg**: `32px` - Large spacing (between major sections)
- **xl**: `48px` - Extra large spacing
- **2xl**: `64px` - 2x extra large spacing
- **3xl**: `80px` - 3x extra large spacing

## Border Radius

- **none**: `0px`
- **sm**: `4px` - Small radius
- **md**: `8px` - Medium radius (input fields)
- **lg**: `16px` - Large radius
- **pill**: `9999px` - Pill shape
- **circle**: `50%` - Perfect circle

## Shadows

- **none**: No shadow
- **sm**: Small shadow (input fields)
- **md**: Medium shadow
- **lg**: Large shadow

## Implementation

These design tokens will be implemented in a TypeScript file for easy access throughout the app:

```typescript
export const theme = {
  colors: {
    primary: '#C73D10',
    primaryLight: '#FF6D3F',
    primaryDark: '#8F2900',
    secondary: '#251608',
    secondaryLight: '#4A3020',
    secondaryDark: '#0F0900',
    black: '#000000',
    white: '#FFFFFF',
    grey1: '#F5F5F5',
    grey2: '#E0E0E0',
    grey3: '#9E9E9E',
    grey4: '#616161',
    grey5: '#212121',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
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
