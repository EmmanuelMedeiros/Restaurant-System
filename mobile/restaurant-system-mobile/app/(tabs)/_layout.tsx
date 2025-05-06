import { Tabs } from "expo-router";

import Icons from '@expo/vector-icons/Feather'
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { useContext } from "react";
import UserContext from "@/context/user.context";
import { UserRole } from "@/enum/UserRole";

const tableIcon = require('../../assets/images/tableIcon.png')
const activeTableIcon = require('../../assets/images/activeTableIcon.png')

const itemsIcon = require('../../assets/images/itemsIcon.png')
const activeItemsIcon = require('../../assets/images/activeItemsIcon.png')

export default function TablesTabs() {

    const userContext = useContext(UserContext);

    return(
        <Tabs screenOptions={{headerShown: false, tabBarStyle: styles.bar}}>

            <Tabs.Screen name="(tables)" 
                options={
                    {
                        title: 'Tables',
                        tabBarShowLabel: false,
                        tabBarIcon: ({focused}) => focused 
                            ? 
                                <Image source={tableIcon} style={{width: 30, height: 30, marginTop: 10}}/> 
                            :   
                                <Image source={activeTableIcon} style={{width: 30, height: 30, marginTop: 10}}/> 
                    }
                }
            />

            <Tabs.Screen name="(items)"
                options={
                    {
                        href: userContext.role === UserRole.ADMIN ? '/(tabs)/(items)/itemsView' : null,
                        title: 'Items',
                        tabBarShowLabel: false,
                        tabBarIcon: ({focused}) => focused 
                            ?
                                <Image source={itemsIcon} style={{width: 27, height: 27, marginTop: 10}}/>
                            :
                                <Image source={activeItemsIcon} style={{width: 27, height: 27, marginTop: 10}}/>
                    }
                }
            />

            <Tabs.Screen name="(users)"
                options={
                    {
                        title: 'Items',
                        tabBarShowLabel: false,
                        tabBarIcon: ({focused}) => focused 
                            ?
                                <Icons name="user" size={30} color={'white'} style={{marginTop: 5}}/>
                            :
                                <Icons name="user" size={30} color={'#171717'} style={{marginTop: 5}} />
                    }
                }
            />

            
        </Tabs>
    )
}

const styles = StyleSheet.create(
    {
        bar: {
            backgroundColor: '#6C3232',
            width: '95%',
            borderRadius: 20,

            marginLeft: '2%',

            borderColor: '#6C3232',

            left: 0,
            right: 0,

            position: 'absolute'
        }
    }
)