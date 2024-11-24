import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: Colors[colorScheme ?? 'light'].background, // Dynamic background
            borderTopWidth: 0, // Removing top border to get a cleaner design on iOS
          },
          android: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            elevation: 10, // Elevation for Android to give the tab bar a shadow effect
          },
          default: {
            backgroundColor: Colors.light.background,
          },
        }),
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="house.fill" color={color} />
          ),
          tabBarStyle: styles.tabBarStyle,
        }}
      />
      {/* Products Tab */}
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="products" color={color} />
          ),
          tabBarStyle: styles.tabBarStyle,
        }}
      />
      {/* News Tab */}
      <Tabs.Screen
        name="news"
        options={{
          title: 'News',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="notification" color={color} />
          ),
          tabBarStyle: styles.tabBarStyle,
        }}
      />
      {/* Customers Tab */}
      <Tabs.Screen
        name="customers"
        options={{
          title: 'Customers',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={30} name="customer" color={color} />
          ),
          tabBarStyle: styles.tabBarStyle,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: Colors.light.background,
    borderTopWidth: 0,
  },
});
