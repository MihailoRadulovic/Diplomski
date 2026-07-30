import { Pressable, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: 'primary' | 'outline' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({ onPress, label, variant = 'primary', loading, disabled }: ButtonProps) {
  const base = 'flex-row items-center justify-center px-4 py-3 rounded-xl';
  const variants = {
    primary: 'bg-[#639922]',
    outline: 'border border-[#639922]',
    ghost: '',
  };
  const textVariants = {
    primary: 'text-white font-semibold',
    outline: 'text-[#639922] font-semibold',
    ghost: 'text-[#639922]',
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${disabled ? 'opacity-50' : ''}`}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? 'white' : '#639922'} />
        : <Text className={textVariants[variant]}>{label}</Text>
      }
    </Pressable>
  );
}
