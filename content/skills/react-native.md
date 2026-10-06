---
title: React Native
domain: mobile
level: intermediate
hours: 50–80
brief: If you know React, you're 70% of the way to mobile.
prereqs:
  - react
learn:
  - topic: View / Text / Image
    detail: The native equivalents of div, p, img. View is a container. Text renders text (must be inside Text component). Image for local or remote images.
  - topic: StyleSheet.create
    detail: CSS-like but camelCase. No cascade, no inheritance. Inline styles are allowed but StyleSheet.create is preferred for performance.
  - topic: Flexbox (default)
    detail: "All Views are flex containers by default. flexDirection: 'column' is the default (opposite of web). Layouts work the same as CSS Flexbox."
  - topic: FlatList
    detail: The performant equivalent of HTML table or map() rendering. Only renders visible items. Use this for any list of items.
  - topic: Pressable
    detail: The correct way to handle taps. Replace touchables with Pressable — it supports complex press states and accessibility.
  - topic: React Navigation
    detail: "The standard navigation library. Stack navigator, Tab navigator, Drawer navigator. Navigate with navigation.navigate('Profile', { id: 1 })"
  - topic: AsyncStorage
    detail: "@react-native-async-storage/async-storage — key-value store that persists between app launches. Use for tokens, preferences."
  - topic: Expo
    detail: Build React Native apps without Xcode or Android Studio. Expo Go app lets you preview instantly on your phone. expo-camera, expo-location, etc.
  - topic: useColorScheme
    detail: const isDark = useColorScheme() === 'dark' — detect the user's system theme and apply the right colours.
  - topic: Bridge vs JSI
    detail: Modern RN uses JSI (JavaScript Interface) for direct JS-to-native calls without the asynchronous bridge. Much faster.
resources:
  - title: React Native Docs
    url: https://reactnative.dev/docs/getting-started
    provider: Meta
    type: docs
    cost: free
    official: true
  - title: Expo Docs
    url: https://docs.expo.dev
    provider: Expo
    type: docs
    cost: free
  - title: React Native in 100 Seconds
    url: https://www.youtube.com/watch?v=0-S5a0eXPoc
    provider: Fireship
    type: video
    cost: free
  - title: Simon Grimm (Galaxies.dev)
    url: https://www.youtube.com/@galaxies_dev
    provider: YouTube
    type: video
    cost: free
checked: 2026-10-06
---

## In plain English

React Native is the bridge between web and mobile. You write code that looks almost identical to React — same useState, same useEffect, same component model — but instead of rendering HTML elements, React Native maps them to real native iOS and Android components. View becomes UIView (iOS) or ViewGroup (Android). Text becomes UILabel or TextView. You get native performance without learning two new platforms. Shopify's merchant app, Facebook Ads Manager, and Discord mobile are React Native.

## A first look

```js
// 1. Basic component
import { Text } from "react-native";

export default function App() {
  return <Text>Hello</Text>;
}

// 2. View layout
import { View } from "react-native";

<View>
  <Text>Welcome</Text>
</View>

// 3. Button
import { Button } from "react-native";

<Button title="Click" onPress={() => console.log("Clicked")} />

// 4. State
import { useState } from "react";

const [count, setCount] = useState(0);

// 5. Real Example
import { View, Text } from "react-native";

export default function App() {
  return (
    <View>
      <Text>Hello App</Text>
    </View>
  );
}
```jsx
