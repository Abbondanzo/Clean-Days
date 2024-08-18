import { ScrollView, type ScrollViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export interface ThemedScrollViewProps extends ScrollViewProps {}

export function ThemedScrollView({
  style,

  ...otherProps
}: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor({}, 'background');

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}
