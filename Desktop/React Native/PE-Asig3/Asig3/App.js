import "react-native-gesture-handler";
import { Button, IconButton } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

import FavoriteList from "./screens/FavoriteList";
import DetailsPage from "./screens/DetailsPage";
import HomePage from "./screens/HomePage";
import Ionicons from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Favorite") {
            iconName = focused ? "heart" : "heart-o";
          }
          return <Ionicons name={iconName} color={color} size={20} />;
        },
        tabBarActiveTintColor: "#C1F2B0",
        tabBarInactiveTintColor: "grey",
      })} 
    >
      <Tab.Screen
        name="Home"
        component={HomePage}
        options={{ headerShown: false }}
      />
      {/* <Tab.Screen
        name="Details"
        component={DetailsPage}
        options={{ headerShown: false }}
      /> */}
      <Tab.Screen
        name="Favorite"
        component={FavoriteList}
        options={{ title: "Favorite " }}
      />
    </Tab.Navigator>
  );
}

function StackNavigation() {
  const navigation = useNavigation();
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={TabNavigator}
        options={{
          title: "Tôi Mệt Quá:))))",
          headerStyle: {
            backgroundColor: "#FFB534",
          },
          headerTitleStyle: {
            display: "flex",
            fontWeight: "700",
            color: "white",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsPage}
        options={{
          title: "DETAIL",
          headerBackTitleStyle: {
            backgroundColor: "red",
          },
          headerLeft: (props) => (
            <IconButton
              icon={"arrow-left"}
              size={25}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
});
