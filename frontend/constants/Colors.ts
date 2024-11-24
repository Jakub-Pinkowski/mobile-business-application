/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * These include primary, secondary, tertiary, and danger colors.
 * Other UI components such as buttons, icons, etc., will use these base colors.
 */

export const Colors = {
  light: {
    text: '#11181C',                       // Dark gray - text color for light mode
    background: '#fff',                    // White - background color for light mode
    tabBackground: '#0C171D',              // Dark - background color for light mode
    primary: '#2a9d8f',                    // Teal - primary color for light mode
    secondary: '#e9c46a',                  // Yellow - secondary color for light mode
    tertiary: '#f4a261',                   // Orange - tertiary color for light mode
    danger: '#c1121f',                     // Red - danger color for light mode
    tint: '#2a9d8f',                       // Teal - tint color for icons, highlights
    icon: '#687076',                       // Muted gray - icon color in light mode
    tabIconDefault: '#687076',             // Muted gray - default tab icon color in light mode
    tabIconSelected: '#2a9d8f',            // Teal - selected tab icon color in light mode
  },
  dark: {
    text: '#ECEDEE',                       // Light gray - text color for dark mode
    background: '#151718',                 // Dark gray - background color for dark mode
    tabBackground: '#0C171D',              // Dark - background color for dark mode
    primary: '#2a9d8f',                    // Teal - primary color for dark mode
    secondary: '#e9c46a',                  // Yellow - secondary color for dark mode
    tertiary: '#f4a261',                   // Orange - tertiary color for dark mode
    danger: '#c1121f',                     // Red - danger color for dark mode
    tint: '#2a9d8f',                       // Teal - tint color for icons, highlights
    icon: '#9BA1A6',                       // Light gray - icon color in dark mode
    tabIconDefault: '#9BA1A6',             // Light gray - default tab icon color in dark mode
    tabIconSelected: '#2a9d8f',            // Teal - selected tab icon color in dark mode
  },
};
