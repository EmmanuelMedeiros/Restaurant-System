import { router, Stack, Tabs, useFocusEffect } from "expo-router";

import UserContext, { UserContextProvider } from "@/context/user.context";
import { View } from "react-native";
import { useCallback, useContext, useState } from "react";
import { ItemEndpoint } from "@/fuctions/item.endpoint";
import { IItem } from "@/interface/IItem";
import { IApiResponse } from "@/interface/IApiResponse";

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
