import { Stack, Tabs } from "expo-router";

export default function UsersLayout() {
  return (
    <Stack initialRouteName="main" screenOptions={{headerShown: false, animation: 'none'}}>
      <Stack.Screen name="main"          options={{animation: 'none'}}/>
      <Stack.Screen name="createUser"    options={{animation: 'none'}}/>
      <Stack.Screen name="editUser"      options={{animation: 'none'}}/>
    </Stack>
  )
}
