/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/..\components\settings\DailyTargetCountWidget` | `/..\components\settings\StartOfWeekWidget` | `/..\components\theme\ThemeProvider` | `/..\components\theme\Widget` | `/..\context\ThemeContext` | `/..\extract` | `/..\hooks\useTheme` | `/..\ide\ColorSchemeToggle` | `/..\screens\Settings` | `/..\store\settingsStore` | `/..\store\storage` | `/_sitemap` | `/settings`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
