import { ActivityIndicator } from 'react-native';

export function Spinner({ size = 'small' }: { size?: 'small' | 'large' }) {
  return <ActivityIndicator size={size} color="#639922" />;
}
