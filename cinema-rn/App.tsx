import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MovieCatalogScreen from "./src/screens/MovieCatalog";
import ReservationEventsScreen from "./src/screens/ReservationEvents";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  MovieCatalog: undefined;
  ReservationEvents: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Menú" }} />
        <Stack.Screen name="MovieCatalog" component={MovieCatalogScreen} options={{ title: "Movie Catalog" }} />
        <Stack.Screen name="ReservationEvents" component={ReservationEventsScreen} options={{ title: "Reservation Events" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}