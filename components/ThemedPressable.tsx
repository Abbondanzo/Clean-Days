import {
  Pressable,
  type PressableProps,
  StyleProp,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { useMemo } from 'react';

export interface ThemedPressableProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  type?: 'primary' | 'secondary' | 'outlined';
}

export function ThemedPressable({
  style,
  type = 'primary',
  ...rest
}: ThemedPressableProps) {
  const theme = useColorScheme() ?? 'light';

  const baseStyle = useMemo(() => {
    switch (type) {
      case 'primary':
      default:
        return theme === 'light' ? styles.primaryLight : styles.primaryDark;
    }
  }, [theme, type]);

  return <Pressable style={[baseStyle, style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  primaryLight: {
    backgroundColor: 'red',
  },
  primaryDark: {
    backgroundColor: 'blue',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
