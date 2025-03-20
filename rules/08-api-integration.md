---
description: API integration guidelines for the Akewi application
globs: ["**/services/api/**", "**/store/**"]
---

# API Integration Guidelines

## Service Layer Structure

Follow this structure for API-related services:

```
/src
  /services
    /api
      client.ts                # Base API client
      /repositories            # Repository implementations
        UserRepository.ts      # Repository interface
        UserRepositoryImpl.ts  # Implementation
        OrikiRepository.ts     # Repository interface
        OrikiRepositoryImpl.ts # Implementation
      /models                  # API response models
        UserResponse.ts        # User response model
        OrikiResponse.ts       # Oriki response model
    /storage
      secureStorage.ts         # Secure storage utilities
      asyncStorage.ts          # General storage utilities
```

## API Client

Use a centralized API client for all HTTP requests:

```typescript
// client.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../../constants/apiPaths';
import { getAuthToken } from '../storage/secureStorage';

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token to requests if available
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    
    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle common errors (401, 403, etc.)
        if (error.response?.status === 401) {
          // Handle unauthorized
        }
        return Promise.reject(error);
      }
    );
  }
  
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }
  
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }
  
  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }
  
  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data, config);
    return response.data;
  }
  
  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
```

## Repository Pattern

Use the repository pattern to abstract API calls:

```typescript
// UserRepository.ts (Interface)
export interface UserRepository {
  getUserProfile(userId: string): Promise<User>;
  updateUserProfile(userId: string, data: Partial<User>): Promise<User>;
  // Other user-related methods
}

// UserRepositoryImpl.ts (Implementation)
import { apiClient } from '../client';
import { UserRepository } from './UserRepository';
import { User, UserResponse } from '../models/UserResponse';
import { mapUserResponseToUser } from '../mappers/userMapper';

export class UserRepositoryImpl implements UserRepository {
  async getUserProfile(userId: string): Promise<User> {
    try {
      const response: UserResponse = await apiClient.get(`/users/${userId}`);
      return mapUserResponseToUser(response);
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }
  
  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    try {
      const response: UserResponse = await apiClient.patch(`/users/${userId}`, data);
      return mapUserResponseToUser(response);
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  }
}

export const userRepository = new UserRepositoryImpl();
```

## Data Models

Define clear interfaces for API responses and domain models:

```typescript
// API Response Model
export interface UserResponse {
  id: string;
  name: string;
  state: string;
  town: string;
  family: string | null;
  profile_image: string | null;
  preferred_language: string;
  date_joined: string;
  stats: {
    contributions: number;
    streams: number;
  };
}

// Domain Model
export interface User {
  id: string;
  name: string;
  state: string;
  town: string;
  family: string | null;
  profileImage: string | null;
  preferredLanguage: 'english' | 'yoruba';
  dateJoined: Date;
  stats: {
    contributions: number;
    streams: number;
  };
}
```

## Data Mapping

Create explicit mappers between API responses and domain models:

```typescript
// userMapper.ts
import { UserResponse, User } from '../models/UserResponse';

export const mapUserResponseToUser = (response: UserResponse): User => {
  return {
    id: response.id,
    name: response.name,
    state: response.state,
    town: response.town,
    family: response.family,
    profileImage: response.profile_image,
    preferredLanguage: response.preferred_language === 'yoruba' ? 'yoruba' : 'english',
    dateJoined: new Date(response.date_joined),
    stats: {
      contributions: response.stats.contributions,
      streams: response.stats.streams,
    },
  };
};
```

## Mock API Implementation

During development, use the mock API implementation:

```typescript
// mockApiClient.ts
import users from '../../assets/dummy/users.json';
import oriki from '../../assets/dummy/oriki.json';
import categories from '../../assets/dummy/categories.json';

// Add random delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(500 + Math.random() * 1000);

export const mockApiClient = {
  // Auth methods
  login: async (identifier: string) => {
    await randomDelay();
    return { verificationId: 'mock-verification-id' };
  },
  
  verifyCode: async (verificationId: string, code: string) => {
    await randomDelay();
    return { token: 'mock-token-xxx', user: users[0] };
  },
  
  // User methods
  getUserProfile: async (userId: string) => {
    await randomDelay();
    return users.find(user => user.id === userId);
  },
  
  // More mock methods...
};
```

## API Integration with Redux

Use Redux thunks for API calls:

```typescript
// userThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userRepository } from '../../services/api/repositories/UserRepositoryImpl';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userRepository.getUserProfile(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async ({ userId, data }: { userId: string; data: Partial<User> }, { rejectWithValue }) => {
    try {
      return await userRepository.updateUserProfile(userId, data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Error Handling

Implement consistent error handling across all API calls:

```typescript
// ApiError.ts
export class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
  
  static fromAxiosError(error: any): ApiError {
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      return new ApiError(
        error.response.data?.message || 'Server error',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      // Request was made but no response was received
      return new ApiError('No response from server', 0);
    } else {
      // Something else happened while setting up the request
      return new ApiError(error.message || 'Unknown error', 0);
    }
  }
}
```

## File Uploads

Handle file uploads with progress tracking:

```typescript
export const uploadAudio = async (
  fileUri: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', {
    uri: fileUri,
    name: 'audio.m4a',
    type: 'audio/m4a',
  });
  
  try {
    const response = await apiClient.post('/upload/audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      },
    });
    
    return response.audioUrl;
  } catch (error) {
    throw new ApiError('Failed to upload audio', 0);
  }
};
```

## Offline Support

Implement basic offline support with request queuing:

```typescript
import NetInfo from '@react-native-community/netinfo';
import { queueRequest, processQueue } from '../storage/requestQueue';

// Check if device is online
export const isOnline = async (): Promise<boolean> => {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
};

// Perform a network request with offline support
export const performRequestWithOfflineSupport = async (
  requestFn: () => Promise<any>,
  queueKey: string,
  queueData: any
): Promise<any> => {
  try {
    if (await isOnline()) {
      // Execute request immediately if online
      const result = await requestFn();
      // Process any queued requests while we're online
      processQueue();
      return result;
    } else {
      // Queue request for later if offline
      await queueRequest(queueKey, queueData);
      throw new ApiError('Device is offline', 0);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw ApiError.fromAxiosError(error);
  }
};
```

## Best Practices

1. **Clean Abstractions**: Use the repository pattern to abstract API details
2. **Error Handling**: Handle all potential errors consistently
3. **Type Safety**: Use TypeScript interfaces for API requests and responses
4. **Data Transformation**: Map API responses to domain models
5. **Mocking**: Provide mock implementations for local development
6. **Progress Tracking**: Track progress for file uploads and long operations
7. **Offline Support**: Implement basic offline capabilities
8. **Authentication**: Handle authentication and token refresh automatically
9. **Logging**: Add appropriate logging for debugging
10. **Testing**: Write tests for API integration 