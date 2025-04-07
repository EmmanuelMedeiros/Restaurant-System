import { Stack, Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{headerShown: false, animation: 'none'}}>
      <Stack.Screen name="index"        options={{animation: 'none'}}/>
      <Stack.Screen name="createOrder"  options={{animation: 'none'}}/>
      <Stack.Screen name="tableOrder"   options={{animation: 'none'}}/>
      <Stack.Screen name="finishOrder"   options={{animation: 'none'}}/>
    </Stack>
  )
}
