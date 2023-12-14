import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useReducer } from 'react';
import { StyleSheet } from 'react-native';
import { NativeRouter } from 'react-router-native';
import MyUserReducer from "./src/reducers/MyUserReducer.js";
import Login from './src/components/Login';
import Register from './src/components/Register';
import MainScreen from './src/screen/MainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MyUserContext = createContext();

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, AsyncStorage.getItem("user") || null)
  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NativeRouter>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Đăng nhập" component={Login} />
            <Stack.Screen name="Đăng ký" component={Register} />
            <Stack.Screen name="Trang chủ" component={MainScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeRouter>
    </MyUserContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
