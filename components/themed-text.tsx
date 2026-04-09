import { StyleSheet, Text, TextStyle } from 'react-native';

import { useDailyColor } from '@/context/dailyColorContext';

export type ThemedTextProps = {
  children?: React.ReactNode;
  style?: TextStyle;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'headline' | 'overline' | 'profile';
};

export function ThemedText({ type = 'default', children, style }: ThemedTextProps) {
  const { theme } = useDailyColor();

  return (
    <Text
      style={[
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'profile' ? styles.profile : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'headline' ? styles.headline : undefined,
        type === 'overline' ? styles.overline : undefined,
        { color: theme.opaque },
        style
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  profile: {
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    textDecorationLine: 'underline', 
  },
  headline: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 48,
  },
  overline: {
    fontSize: 24,
    fontWeight: '600',
  }
});
