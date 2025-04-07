import Menu from "@/components/menu";
import UserContext from "@/context/user.context";
import { ItemEndpoint } from "@/fuctions/item.endpoint";
import { IApiResponse } from "@/interface/IApiResponse";
import { IItem } from "@/interface/IItem";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { BackHandler, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";

const tableIcon = require('../../../assets/images/tableIcon.png')

import Icons from '@expo/vector-icons/Feather'
import ItemScreen from "@/components/itemScreen";
import { TablesEndpoint } from "@/fuctions/table.endpoint";

export default function ItemsView() {

    
  const userContext = useContext(UserContext);
  const itemEndpoint: ItemEndpoint = new ItemEndpoint();
  const tableEndpoint: TablesEndpoint = new TablesEndpoint();


  const [itemList, setItemList] = useState<IItem[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<IItem>();

    async function getAllItems() {

        console.log("Olá")

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

  const editItemOnHandle = (item: IItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

    async function postTable() {
        const refreshToken: string|null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        if(token) {
            const apiResponse: IApiResponse = await tableEndpoint.post(token);
            if(apiResponse.statusCode !== 201) {
                console.log(`table's post endpoint error: ${JSON.stringify(apiResponse.data)}`);
                return;
            }
            router.replace('/(tabs)/(tables)')
        } else {
            console.log("JWT Token wasn't provided when trying to use table's post endpoint")
        }
    }

  useFocusEffect(
    useCallback(() => {
      getAllItems();
        

    }, [])
  )

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isEditing) {
        setIsEditing(false);
      } else {
        router.back();
      }
      return true;
    });
  
    return () => backHandler.remove();
  });

  useEffect(() => {
    if(!isEditing) {
        getAllItems();
    }
    return;
  }, [isEditing])

    return(
        <SafeAreaView style={itemsViewStyle.container}>

            {isEditing && currentItem
                ?   
                    <View style={{width: '100%', height: '100%'}}>
                        <ItemScreen
                            currentItemCategory={currentItem.category}
                            currentItemDescription={currentItem.description || ""}
                            currentItemName={currentItem.name}
                            currentItemPrice={currentItem.price.toString()}
                            isEditing={true}
                            setIsEditing={setIsEditing}
                            currentItemID={currentItem.id}
                        />
                    </View>
                :   
                    <View style={{width: '100%', height: '98%', marginTop: 10}}>
                        <View style={itemsViewStyle.menuComponent}>
                        <Menu
                            posActionItemList={[]}
                            itemList={itemList}
                            showHeader={true}
                            title="Items"
                            itemPressableIcon={[<Icons name="edit" size={20} color={'rgba(0, 0, 0, .5)'}/>]}
                            pressableIconFunction={editItemOnHandle}
                        />
                         </View>


                        <TouchableOpacity 
                            style={{paddingBlock: 10, marginBottom: 5, marginTop: -25, backgroundColor: '#333333', width: '90%', borderRadius: 10, marginInline: 'auto'}}
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


                        <TouchableOpacity 
                            style={{paddingBlock: 10, marginBottom: 60, marginTop: 0, backgroundColor: '#333333', width: '90%', borderRadius: 10, marginInline: 'auto'}}
                            onPress={() => postTable()}
                        >
                            <View style={{flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 20, position: 'relative'}}>

                                <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>Adicionar Mesa</Text>

                                <Image 
                                    source={tableIcon} 
                                    style={{width: 35, height: 35, position: 'absolute', left: 30}}
                                />
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity 
                            style={{paddingBlock: 10, marginBottom: 5, marginTop: -53, backgroundColor: '#333333', width: '90%', borderRadius: 10, marginInline: 'auto'}}
                            onPress={() => router.navigate('/(tabs)/(items)/newCategory')}
                        >
                            <View style={{flexDirection: 'row-reverse', justifyContent: 'center', alignItems: 'center', gap: 20, position: 'relative'}}>

                                <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>Adicionar Categoria</Text>

                                <Icons name="archive" size={25} style={{color: 'white', position: 'absolute', right: 30}}/>

                                {/* <Image 
                                    source={tableIcon} 
                                    style={{width: 35, height: 35, position: 'absolute', left: 30}}
                                /> */}
                            </View>
                        </TouchableOpacity>
                    </View>
            }


        </SafeAreaView>
    )
}

const itemsViewStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',

        paddingBottom: 100
    },

    menuComponent: {
        margin: 'auto',
        marginBottom: 30,

        width: '90%',
        height: '70%',
    }
})