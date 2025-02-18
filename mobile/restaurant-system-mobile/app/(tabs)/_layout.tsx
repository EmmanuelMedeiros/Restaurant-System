import { Tabs } from "expo-router";

export default function TablesTabs() {
    return(
        <Tabs screenOptions={{headerShown: false}}>
            <Tabs.Screen name="(tables)" options={{title: 'Tables'}}/>
        </Tabs>
    )
}