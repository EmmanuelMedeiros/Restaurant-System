import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IItem } from "../interface/IItem";

import Icons from '@expo/vector-icons/Feather'
import { IItemCategory } from "../interface/IItemCategory";
import { useContext, useEffect, useState } from "react";
import { OrderCreationStates } from "../enum/OrderCreationStates";

import { BackHandler } from "react-native";

import { Link, router } from "expo-router";
import { ITable } from "../interface/ITable";
import { ItemEndpoint } from "@/fuctions/item.endpoint";
import { IApiResponse } from "@/interface/IApiResponse";
import { ItemCategoryEndpoint } from "@/fuctions/itemCategory.endpoint";
import UserContext from "@/context/user.context";


interface EntireMenuComponentProps {
    storedItems: IItem[],
    setStoredItems: React.Dispatch<React.SetStateAction<IItem[]>>,
    setOrderState: React.Dispatch<React.SetStateAction<OrderCreationStates>>,
    currentTable: ITable | undefined,
    itemsList: IItem[]|undefined 
}

export default function EntireMenuComponent({storedItems, setStoredItems, setOrderState, currentTable, itemsList}: EntireMenuComponentProps) {

    const userContext = useContext(UserContext);
    const itemCategoryEndpoint: ItemCategoryEndpoint = new ItemCategoryEndpoint();

    const [itemCategoryToShow, setItemCategoryToShow]   = useState<number>(1);
    const [menuCategoryList, setMenuCategoryList]     = useState<IItemCategory[]>([]);

    async function getItemCategory() {
        try{
            const refreshToken: string|null = await userContext.getRefreshToken();
            const token = await userContext.generateJwtToken(refreshToken);

            const apiResponse: IApiResponse = await itemCategoryEndpoint.getAll(token);
            if(apiResponse.statusCode !== 200) {
                console.log(`Get ALL item categories endpoint failed | err: ${JSON.stringify(apiResponse.data)}`);
                return
            } else {
                setMenuCategoryList(apiResponse.data);
                return;
            }
        }catch(err) {
            console.log(err)
        }
    }

    const toggleItemChooseOnHandle = (item: IItem) => {

        const itemPositionInStorage: number = storedItems.findIndex(x => x === item);
        if(itemPositionInStorage === -1) {
            setStoredItems((prev) => (
                [...prev, item]
            ));
            return;
        };
        const newArray = storedItems.toSpliced(itemPositionInStorage, 1);
        setStoredItems(() => {
            return(newArray);
        });
        return;

    }

    useEffect(() => {
        getItemCategory();
        BackHandler.addEventListener("hardwareBackPress", () => {
            const isPossible: boolean = router.canGoBack();
            router.back()
            return true;
        });
    }, [])

    return(
        <View style={entireMenuStyle.container}>
            
            <TouchableOpacity
                style={{position: 'absolute', right: 10, top: 10, zIndex: 10}}
                onPress={() => router.dismiss()}
            >
                <Icons name='x' 
                    size={30} 
                    color={'#6C3232'}
                />

            </TouchableOpacity>

            <Text style={entireMenuStyle.title}>MENU</Text>
            <Text style={entireMenuStyle.subTitle}>MESA {currentTable?.name}</Text>

            <View style={entireMenuStyle.lighHorizontalLine}/>

            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                contentContainerStyle={{height: 90,}}
                style={{ maxHeight: 50 }}
            >
                {menuCategoryList.map((element, index) => (
                    <TouchableOpacity 
                        key={index}
                        id={index.toString()}
                        style={entireMenuStyle.menuCategoryList}
                        onPressOut={() => setItemCategoryToShow(element.id)}
                    >
                        <Text style={itemCategoryToShow == element.id ? {textDecorationLine: 'underline', fontWeight: 'bold'} : null}>{element.title.toUpperCase()}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            
            <View style={{marginTop: -30}}>
                <View style={entireMenuStyle.blackHorizontalLine}/>
            </View>

            <ScrollView
            contentContainerStyle={{paddingBottom: 20}}
                showsVerticalScrollIndicator={true}
            >
                {itemsList?.filter(x => x.category.id === itemCategoryToShow).map((element, index) => (
                    <View
                        key={index}
                    >
                        <View 
                            style={entireMenuStyle.eachItem}
                            key={element.id}
                        >
                            <Text>R$ {Number(element.price).toFixed(2)}</Text>
                            <Text style={entireMenuStyle.itemName}>{element.name.toUpperCase()}</Text>
                            <TouchableOpacity
                                onPressIn={() => toggleItemChooseOnHandle(element)}
                            >
                                <Text style={entireMenuStyle.addIcon}>{storedItems.find(x => x === element) ? '-' : '+'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginBlock: -15}}>
                            <View style={entireMenuStyle.lighHorizontalLine}/>
                        </View>
                    </View>
                ))}

            </ScrollView>

            
            <View style={storedItems.length < 1 ? entireMenuStyle.notShow : {position: 'absolute', bottom: 10, left: 10, width: 50} }>

                <TouchableOpacity
                    onPress={() => setOrderState(OrderCreationStates.CONFIRM)}
                >
                    <View style={{width: 25, height: 25, borderRadius: '100%', backgroundColor: '#171717', position: 'absolute', right: 0, top: 0, marginTop: -15, zIndex: 10}}>
                        <Text style={{margin: 'auto', color: '#C1C1C1'}}>{storedItems.length}</Text>
                    </View>

                    <Icons name="shopping-cart" size={30}/>
                </TouchableOpacity>
            </View>


        </View>
    )
}

const entireMenuStyle = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginTop: 20,

        fontSize: 25,
        fontWeight: 'bold'
    },

    subTitle: {
        textAlign: 'center',

        fontSize: 18
    },

    container: {
       backgroundColor: '#C1C1C1',

       height: '100%',
       width: '100%',

       position: 'relative'
    },

    lighHorizontalLine: {
        backgroundColor: '#A8A8A8',

        width: '100%',
        height: 1,
        marginBlock: 25
    },

    blackHorizontalLine: {
        width: '100%',
        height: 1,

        backgroundColor: '#171717',
        marginBlock: 25
    },

    menuCategoryList: {
        marginInline: 10,

        paddingInline: 10
    },

    eachItem: {
        paddingInline: 20,

        flexDirection: 'row',
        justifyContent: 'space-between',

        alignItems: 'center'
    },

    itemPrice: {
        fontSize: 13,
    },

    addIcon: {
        color: '#255247',
        fontSize: 30,

        padding: 10,
    },

    itemName: {
        width: 165,
        
        fontSize: 13,

        marginRight: -20,
        textAlign: 'left'
    },

    notShow: {
        display: 'none'
    }
})