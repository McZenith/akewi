# Akewi App

## Overview

Akewi is a React Native application built with Expo, TypeScript, and Redux for state management. It follows a file-based routing structure using Expo Router and supports multiple languages.

## Project Structure

```
├── app/                   # Expo Router file-based navigation
├── assets/                # Static assets like images, fonts, etc.
│   ├── images/
│   └── icons/
├── components/            # Reusable UI components
│   ├── common/            # Shared components across features
│   ├── layout/            # Layout components (headers, containers, etc.)
│   └── ui/                # Basic UI components (buttons, inputs, etc.)
├── constants/             # App constants, theme variables, etc.
├── hooks/                 # Custom React hooks
├── localization/          # i18n setup and translation files
│   └── translations/
├── services/              # API services, local storage, etc.
├── store/                 # Redux store configuration
│   ├── slices/            # Redux toolkit slices
│   └── thunks/            # Async actions
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Expo CLI

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Development Guidelines

- Use TypeScript for all components and files
- Follow component-based architecture
- Use Redux for global state management
- Use Expo Router for navigation
- Support multiple languages through i18n

## Documentation

See the `docs/` folder for detailed documentation, including:

- Design system
- Component catalog
- Screen implementations
- State management
