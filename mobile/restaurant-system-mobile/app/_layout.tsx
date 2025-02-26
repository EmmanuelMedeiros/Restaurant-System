import { router, Stack, Tabs } from "expo-router";

import { UserContextProvider } from "@/context/user.context";
import { View } from "react-native";

export default function RootLayout() {

  return (
    <UserContextProvider>
        <Stack initialRouteName="(tabs)" screenOptions={{headerShown: false}}>
              <Stack.Screen name="(authentication)" />
              <Stack.Screen name="(tabs)"/>

        </Stack>
    </UserContextProvider>
  )
}
