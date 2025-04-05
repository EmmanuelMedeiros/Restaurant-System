import { router, Stack, Tabs, useFocusEffect } from "expo-router";

import UserContext, { UserContextProvider } from "@/context/user.context";
import { ImageBackground, View } from "react-native";
import { useCallback, useContext, useState } from "react";
import { ItemEndpoint } from "@/fuctions/item.endpoint";
import { IItem } from "@/interface/IItem";
import { IApiResponse } from "@/interface/IApiResponse";

import { useFonts } from 'expo-font'

import "@expo/metro-runtime";

const blackboardBG = require('../assets/images/blackboard_bg.png')

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'inknutAntiqua-regular': require('../assets/fonts/InknutAntiqua-Regular.ttf')
  })

  return (
    <UserContextProvider>
        <Stack initialRouteName="(tabs)"  screenOptions={{headerShown: false}}>
            <Stack.Screen name="(authentication)" />
            <Stack.Screen name="(tabs)"/>
        </Stack>
    </UserContextProvider>
  )
}
