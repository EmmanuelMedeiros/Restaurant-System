import { Tabs } from "expo-router";

import Icons from '@expo/vector-icons/Feather'

export default function TablesTabs() {
    return(
        <Tabs screenOptions={{headerShown: false}}>
            <Tabs.Screen name="(tables)" 
                options={
                    {
                        title: 'Tables',
                        tabBarIcon: () => <Icons name="codepen" size={20}/>
                    }
                }
            />
        </Tabs>
    )
}