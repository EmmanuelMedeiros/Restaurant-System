import { Stack } from "expo-router";

export default function ItemsLayout() {

    return(
        <Stack screenOptions={{headerShown: false, animation: 'none'}}>
            <Stack.Screen name={"itemsView"}/>
            <Stack.Screen name={"newItem"}/>
            <Stack.Screen name={"newCategory"}/>
        </Stack>
    )

}