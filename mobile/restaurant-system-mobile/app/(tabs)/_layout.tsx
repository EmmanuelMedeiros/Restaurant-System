import { Tabs } from "expo-router";

import Icons from '@expo/vector-icons/Feather'
import { StyleSheet } from "react-native";
import { Image } from "react-native";

const tableIcon = require('../../assets/images/tableIcon.png')
const activeTableIcon = require('../../assets/images/activeTableIcon.png')

const itemsIcon = require('../../assets/images/itemsIcon.png')
const activeItemsIcon = require('../../assets/images/activeItemsIcon.png')

export default function TablesTabs() {
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