/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// Define your new button colors
const successButtonLight = '#264653';  // Success button color in light mode
const successButtonDark = '#264653';   // Success button color in dark mode (can be adjusted if needed)
const dangerButtonLight = '#780000';   // Danger button color in light mode (for delete)
const dangerButtonDark = '#780000';    // Danger button color in dark mode (can be adjusted if needed)

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    successButton: successButtonLight, // Added success button color
    dangerButton: dangerButtonLight,   // Added danger button color
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    successButton: successButtonDark,   // Added success button color
    dangerButton: dangerButtonDark,     // Added danger button color
  },
};
