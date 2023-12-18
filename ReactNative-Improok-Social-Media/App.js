import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeRouter } from 'react-router-native';
import MyUserReducer from "./src/reducers/MyUserReducer";
import Login from './src/components/Login';
import Register from './src/components/Register';
import MainScreen from './src/screen/MainScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from './src/components/Profile';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import StatusPost from './src/layouts/StatusPost';
import Comment from './src/layouts/Comment';
import Post from './src/layouts/Post';

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
            <Stack.Screen
              name="Trang cá nhân"
              component={Profile}
              options={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                  color: 'black',
                  fontSize: 18,
                },
                headerStyle: {
                  shadowColor: '#fff',
                  elevation: 0,
                },
                headerRight: () => (
                  <View style={{ marginRight: 10 }}>
                    <FontAwesome5.Button
                      name="search"
                      size={20}
                      backgroundColor="#fff"
                      color="black"
                    />
                  </View>
                ),
              }}
            />
            <Stack.Screen name="Post" component={Post} />
            <Stack.Screen name="Bài đăng" component={StatusPost} />
            <Stack.Screen name="Bình luận" component={Comment} />
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
