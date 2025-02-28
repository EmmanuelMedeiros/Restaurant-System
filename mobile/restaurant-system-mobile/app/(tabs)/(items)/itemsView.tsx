import Menu from "@/components/menu";
import UserContext from "@/context/user.context";
import { ItemEndpoint } from "@/fuctions/item.endpoint";
import { IApiResponse } from "@/interface/IApiResponse";
import { IItem } from "@/interface/IItem";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icons from '@expo/vector-icons/Feather'

export default function ItemsView() {

    
  const userContext = useContext(UserContext);
  const itemEndpoint: ItemEndpoint = new ItemEndpoint();

  const [itemList, setItemList] = useState<IItem[]>([]);

  async function getAllItems() {

    const refreshToken: string|null = await userContext.getRefreshToken();
    const token = await userContext.generateJwtToken(refreshToken);
    const apiResponse: IApiResponse = await itemEndpoint.getAll(token);

    if(apiResponse.statusCode !== 200) {
        console.log("ERRO EM GETALLITEMS: " + apiResponse.data);
        return;
    }

    setItemList(apiResponse.data)
    return;
  }

  useFocusEffect(
    useCallback(() => {
      getAllItems();
    }, [])
  )

    return(
        <SafeAreaView style={itemsViewStyle.container}>

            <View style={itemsViewStyle.menuComponent}>
                <Menu
                    posActionItemList={[]}
                    itemList={itemList}
                    showHeader={true}
                    title="Items"
                />
            </View>

            <TouchableOpacity 
                style={{paddingBlock: 30, marginBottom: 20, backgroundColor: '#333333', width: '90%', borderRadius: 10}}
                onPress={() => router.navigate('/(tabs)/(items)/newItem')}    
            >
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, position: 'relative'}}>

                    <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>Adicionar Item</Text>

                    <Icons 
                        name="arrow-right" 
                        size={30}
                        style={{position: 'absolute', right: 35 ,backgroundColor: '#D9D9D9', borderRadius: 100, width: 35, height: 35, padding: 3}}
                    />
                </View>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

const itemsViewStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    },

    menuComponent: {
        margin: 'auto',
        marginBottom: 30,

        width: '90%',
        height: '70%',
    }
})