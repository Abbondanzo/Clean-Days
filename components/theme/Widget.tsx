import { Layout, Text } from '@ui-kitten/components';
import { ReactNode } from 'react';
import { StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
  title?: string;
}

export const Widget = ({ children, title }: Props) => {
  return (
    <Layout style={styles.widget}>
      {title && (
        <Text category="label" style={styles.titleText}>
          {title}
        </Text>
      )}
      {children}
    </Layout>
  );
};

const styles = StyleSheet.create({
  titleText: {
    paddingBottom: 16,
    fontSize: 14,
  },
  widget: {
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
  },
});
