# Foto - React Native Intern Assignment

This is a complete, production-ready React Native mobile application built with Expo and TypeScript, fulfilling the requirements for the intern assignment.

##  Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the app:**
   Start the Expo development server:
   ```bash
   npm start
   ```
   - Press `a` to open on an Android emulator (requires Android Studio).
   - Press `i` to open on an iOS simulator (requires Xcode on macOS).
   - Or scan the QR code with the Expo Go app on your physical device.

##  Folder Structure

```
src/
├── api/
│   └── picsumApi.ts              # Fetch functions for picsum.photos
├── components/
│   ├── common/                   # Reusable UI (Button, Input, Dropdown, RadioGroup, etc.)
│   └── gallery/                  # ImageCard, FavoriteButton, SearchBar, FilterBar
├── constants/
│   ├── cities.ts                 # Hardcoded cities for registration dropdown
│   ├── config.ts                 # API base URL, page size, etc.
│   └── theme.ts                  # Centralized design system (colors, typography, spacing)
├── hooks/
│   ├── useAuth.ts                # Bridges auth and favorites stores
│   ├── useDebouncedValue.ts      # Custom hook for debouncing search input
│   ├── useFavorites.ts           # Convenience hook for favorites operations
│   └── useImages.ts              # Auto-fetches images on mount
├── navigation/
│   ├── RootNavigator.tsx         # Switches Auth vs App stack based on session state
│   ├── AuthStack.tsx             # Login & Register screens
│   └── AppStack.tsx              # Bottom tabs (Home, Favorites, Profile)
├── screens/
│   ├── auth/                     # LoginScreen, RegisterScreen
│   ├── favorites/                # FavoritesScreen
│   ├── home/                     # HomeScreen (Gallery), ImageDetailsScreen
│   └── profile/                  # ProfileScreen
├── store/
│   ├── authStore.ts              # Zustand store for user session & local DB
│   ├── favoritesStore.ts         # Zustand store for per-user favorites
│   └── imageStore.ts             # Zustand store for gallery data and pagination
├── types/
│   ├── image.ts                  # Image & API interfaces
│   ├── navigation.ts             # Typed param lists for React Navigation
│   └── user.ts                   # User, Session, and Form interfaces
├── utils/
│   ├── storageKeys.ts            # Centralized AsyncStorage keys
│   └── validators.ts             # Regex and logic for forms, simple password hashing
└── App.tsx                       # App entry point
```

##  Assumptions Made

1. **Local "Backend":** Since there is no real backend, all user data (registrations) and sessions are persisted locally using `AsyncStorage`. Passwords are hashed using a simple custom hash function before storage so they aren't saved in plaintext.
2. **Scoped Favorites:** Favorites are scoped *per-user*. When a user logs in, their specific favorites list is loaded.
3. **Filtering Mechanism:** The Picsum API doesn't support server-side author filtering or searching. Therefore, filtering by author name (A-M / N-Z) and searching is done *client-side* using a `useMemo` hook on the accumulated list of fetched images. Pagination continues to fetch raw data.
4. **Auto-Login:** Upon successful registration, the user is automatically logged in and navigated to the main app, reducing friction.
5. **UI/UX Design:** A dark mode, premium aesthetic was chosen to provide a modern, sleek appearance, utilizing a centralized theme file.

##  Libraries Used

- **`expo` / `react-native`**: Core framework for building the mobile app.
- **`@react-navigation/native` (and stack/tabs)**: Industry standard routing and navigation for React Native. Typed for full TypeScript safety.
- **`zustand`**: State management. Chosen for its minimal boilerplate, excellent TypeScript support, and ease of use compared to Redux, making it ideal for managing auth, favorites, and paginated image states without prop drilling.
- **`@react-native-async-storage/async-storage`**: Used as the local database to persist users, sessions, and favorites across app restarts.
- **`uuid`**: To generate unique IDs for registered users.
- **`expo-media-library` & `expo-file-system`**: Required to download and save images directly to the device's photo gallery.
- **`expo-sharing`**: Allows sharing image links/files to other apps.
- **`react-native-safe-area-context`**: Ensures UI doesn't overlap with notches or system bars.

##  Bonus Features Implemented

- **Debounced Search:** Custom `useDebouncedValue` hook prevents UI jank when typing in the search bar.
- **Optimistic UI:** Liking an image updates the UI instantly while saving to storage in the background.
- **Image Download & Sharing:** Full integration with Expo's media and sharing APIs.
- **Pull-to-refresh & De-dupe guards:** Prevents overlapping API requests if the user spams the refresh or load more actions.
- **Profile Avatar Selection:** Users can pick a fun emoji avatar when editing their profile.
- **Robust Validation:** Registration has strict rules (10-digit mobile, matching passwords, valid emails) with instant feedback.
