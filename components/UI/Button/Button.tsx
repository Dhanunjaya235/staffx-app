import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Divide as LucideIcon } from 'lucide-react-native';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: typeof LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  type = 'button',
}) => {
  const variantClasses = {
    primary: 'bg-[#394253] text-white',
    secondary: 'bg-gray-200 text-gray-900',
    danger: 'bg-red-500 text-white',
    success: 'bg-green-500 text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center rounded-lg ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? 'black' : 'white'} className="mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon width={16} height={16} color={variant === 'secondary' ? '#000' : '#fff'} style={{ marginRight: 8 }} />
      ) : null}

      <Text className={`${variant === 'secondary' ? 'text-gray-900' : 'text-white'} font-medium`}>
        {children}
      </Text>

      {Icon && iconPosition === 'right' && !loading && (
        <Icon width={16} height={16} color={variant === 'secondary' ? '#000' : '#fff'} style={{ marginLeft: 8 }} />
      )}
    </TouchableOpacity>
  );
};

export default Button;
