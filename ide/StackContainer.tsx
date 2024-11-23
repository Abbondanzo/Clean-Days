import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  component: ReactNode;
  label: string;
}

export const StackContainer = ({ component, label }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.componentContainer}>{component}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  componentContainer: {
    borderRadius: 16,
    width: 393,
    height: 852,
    overflow: 'hidden',
  },
  label: {
    width: '100%',
    color: 'white',
    paddingHorizontal: 16,
    paddingBottom: 8,
    fontSize: 20,
  },
});
