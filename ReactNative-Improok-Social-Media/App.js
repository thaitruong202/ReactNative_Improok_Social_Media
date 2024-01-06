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
import AccountManagement from './src/layouts/AccountManagement';
import GroupManagement from './src/layouts/GroupManagement';
import GroupMember from './src/layouts/GroupMember';
import GroupEdit from './src/layouts/GroupEdit';
import InvitationPost from './src/layouts/InvitationPost';
import SurveyPost from './src/layouts/SurveyPost';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';
import SurveyForm from './src/layouts/SurveyForm';
import FormTest from './src/layouts/FormTest';
import Survey from './src/layouts/Survey';
import Invitation from './src/layouts/Invitation';
import SurveyDetail from './src/layouts/SurveyDetail';
import { NativeBaseProvider } from 'native-base';
import Toast from 'react-native-toast-message';
// import { NativeBaseConfigProvider } from 'native-base/lib/typescript/core/NativeBaseContext';

export const MyUserContext = createContext();

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, AsyncStorage.getItem("user") || null)
  return (
    <MyUserContext.Provider value={[user, dispatch]}>
      <NativeBaseProvider>
        <AutocompleteDropdownContextProvider>
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
                          color="black" />
                      </View>
                    ),
                  }}
                />
                <Stack.Screen name="Post" component={Post} />
                <Stack.Screen name="Bài đăng" component={StatusPost} />
                <Stack.Screen name="Bình luận" component={Comment} />
                <Stack.Screen name="Quản lý tài khoản" component={AccountManagement} />
                <Stack.Screen name="Quản lý nhóm" component={GroupManagement} />
                <Stack.Screen name="Thành viên nhóm" component={GroupMember} />
                <Stack.Screen name="Chỉnh sửa nhóm" component={GroupEdit} />
                <Stack.Screen name="Tạo sự kiện" component={InvitationPost} />
                <Stack.Screen name="Tạo khảo sát" component={SurveyPost} />
                <Stack.Screen name="Tạo đơn khảo sát" component={SurveyForm} />
                <Stack.Screen name="Test" component={FormTest} />
                <Stack.Screen name="Khảo sát" component={Survey} />
                <Stack.Screen name="Sự kiện" component={Invitation} />
                <Stack.Screen name="Chi tiết khảo sát" component={SurveyDetail} />
              </Stack.Navigator>
              <Toast />
            </NavigationContainer>
          </NativeRouter>
        </AutocompleteDropdownContextProvider>
      </NativeBaseProvider>
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
