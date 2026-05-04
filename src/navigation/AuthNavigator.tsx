import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen/SignupScreen';

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};
