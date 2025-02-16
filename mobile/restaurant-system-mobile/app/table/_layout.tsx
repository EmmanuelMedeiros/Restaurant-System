import { Stack, Tabs } from "expo-router";

export default function TableLayout() {
  return (
    <Stack screenOptions={{headerShown: false, animation: "slide_from_left"}} initialRouteName="tables">
      <Stack.Screen name="tables" options={{animation: 'slide_from_right'}}/>
      <Stack.Screen name="createOrder" options={{animation: 'slide_from_right'}}/>
    </Stack>
  )
}
