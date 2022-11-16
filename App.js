import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import { store } from "./store/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { Colors } from "./constants/styles";
import AuthContextProvider, { AuthContext } from "./store/auth-context";
import IconButton from "./components/UI/IconButton";
import PostDetailsScreen from "./screens/PostDetailsScreen";
import AddPostScreen from "./screens/AddPostScreen";
import Map from "./screens/Map";
// import LoadingOverlay from "./components/UI/LoadingOverlay";
import MyPostsScreen from "./screens/MyPostsScreen";
// import { init } from "./util/database";

function Navigation() {
  const authCtx = useContext(AuthContext);
  // const [dbInitialized, setDbInitialized] = useState(false);
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  // useEffect(() => {
  //   init()
  //     .then(() => {
  //       setDbInitialized(true);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // if (!dbInitialized) {
  //   return <LoadingOverlay message="Loading data..." />;
  // }
  const DrawerNavigator = () => {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary800 },
          headerTintColor: "white",
          sceneContainerStyle: { backgroundColor: Colors.primary500 },
          drawerContentStyle: { backgroundColor: Colors.primary800 },
          drawerInactiveTintColor: "white",
          drawerActiveTintColor: Colors.primary800,
          drawerActiveBackgroundColor: Colors.primary100,
        }}
      >
        <Drawer.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={({ navigation }) => ({
            title: "Home",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
            headerRight: ({ tintColor }) => (
              <View style={{ flexDirection: "row" }}>
                <IconButton
                  icon="add"
                  size={24}
                  color={tintColor}
                  onPress={() => navigation.navigate("AddPost")}
                />
                <IconButton
                  icon="exit"
                  color={tintColor}
                  size={24}
                  onPress={authCtx.logout}
                />
              </View>
            ),
          })}
        />
        <Drawer.Screen
          name="MyPosts"
          component={MyPostsScreen}
          options={({ navigation }) => ({
            title: "My Posts",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="layers-outline" color={color} size={size} />
            ),
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="add"
                size={24}
                color={tintColor}
                onPress={() => navigation.navigate("AddPost")}
              />
            ),
          })}
        />
      </Drawer.Navigator>
    );
  };
  function AuthStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary800 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: Colors.primary500 },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    );
  }

  function AuthenticatedStack() {
    const authCtx = useContext(AuthContext);
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary800 },
          headerTintColor: "white",
          contentStyle: { backgroundColor: Colors.primary500 },
        }}
      >
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
        <Stack.Screen
          name="AddPost"
          component={AddPostScreen}
          options={{
            title: "Add a new Post",
          }}
        />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem("token");
      const storedEmail = await AsyncStorage.getItem("email");

      if (storedToken && storedEmail) {
        authCtx.authenticate(storedToken, storedEmail);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  if (isTryingLogin) {
    return <AppLoading />;
  }

  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
      </Provider>
    </>
  );
}
