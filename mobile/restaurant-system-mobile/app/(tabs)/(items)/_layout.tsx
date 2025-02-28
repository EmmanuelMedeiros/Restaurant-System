import { Stack } from "expo-router";

export default function ItemsLayout() {

    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name={"itemsView"}/>
            <Stack.Screen name={"newItem"}/>
        </Stack>
    )

}