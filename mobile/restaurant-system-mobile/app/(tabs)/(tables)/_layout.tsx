import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" options={{animation: 'slide_from_left'}}/>
      <Stack.Screen name="createOrder" options={{animation: 'slide_from_right'}}/>
    </Stack>
  )
}
