import { useState, forwardRef } from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, hint, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <View className="flex flex-col gap-1">
        <Text className="text-sm font-medium text-tekst-primarni dark:text-[#E8F5E2]">
          {label}
        </Text>
        <TextInput
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
          accessibilityState={{ disabled: props.editable === false }}
          className="w-full rounded-lg bg-pozadina dark:bg-zinc-900 px-3 py-3 text-tekst-primarni dark:text-[#E8F5E2] placeholder:text-zinc-400"
          style={{
            borderWidth: 1,
            borderColor: error ? '#C0392B' : focused ? '#639922' : '#C8DEB8',
          }}
          {...props}
        />
        {hint && !error && (
          <Text className="text-xs text-tekst-blagi dark:text-zinc-400">{hint}</Text>
        )}
        {error && (
          <Text accessibilityRole="alert" className="text-xs text-[#C0392B]">{error}</Text>
        )}
      </View>
    );
  }
);
Input.displayName = 'Input';
