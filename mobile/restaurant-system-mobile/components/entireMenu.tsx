import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IItem } from "../interface/IItem";

import Icons from '@expo/vector-icons/Feather'
import { IItemCategory } from "../interface/IItemCategory";
import { useEffect, useState } from "react";
import { OrderCreationStates } from "../enum/OrderCreationStates";

import { BackHandler } from "react-native";

import { Link, router } from "expo-router";
import { ITable } from "../interface/ITable";
import { ItemEndpoint } from "@/fuctions/item.endpoint";
import { IApiResponse } from "@/interface/IApiResponse";

const itemList: IItem[] = [
    {
        category: {id: 1, title: 'olá'},
        createdAt: '2024/02/23',
        id: 1,
        name: 'CARNE DE SOL DE PORCO - PRATO COMPLETO',
        price: 75.50,
    },
    {
        category: {id: 1, title: 'olá'},
        createdAt: '2024/02/23',
        id: 1,
        name: 'CARNE DE SOL DE BOI - PRATO COMPLETO',
        price: 75.50,
    },
];

const menuCategoryList: IItemCategory[] = [
    {id: 1, title: "ALMOÇO"}, {id: 2, title: "TIRA-GOSTO"}, {id: 3, title: "BEBIDAS"}, {id: 4, title: "GUARNIÇÕES"}
];

interface EntireMenuComponentProps {
    storedItems: IItem[],
    setStoredItems: React.Dispatch<React.SetStateAction<IItem[]>>,
    setOrderState: React.Dispatch<React.SetStateAction<OrderCreationStates>>,
    currentTable: ITable | undefined,
    itemsList: IItem[]|undefined 
}

export default function EntireMenuComponent({storedItems, setStoredItems, setOrderState, currentTable, itemsList}: EntireMenuComponentProps) {

    const [itemCategoryToShow, setItemCategoryToShow]   = useState<number>(1);

    const itemEndpoint: ItemEndpoint = new ItemEndpoint();

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
        BackHandler.addEventListener("hardwareBackPress", () => {
            router.navigate('/(tabs)/(tables)');
            return true;
        });
    }, [])

    return(
        <View style={entireMenuStyle.container}>
            
            <TouchableOpacity
                style={{position: 'absolute', right: 10, top: 10, zIndex: 10}}
                onPress={() => router.navigate('/(tabs)/(tables)')}
            >
                <Icons name='x' 
                    size={30} 
                    color={'#6C3232'}
                />

            </TouchableOpacity>

            <Text style={entireMenuStyle.title}>Table {currentTable?.name}</Text>
            <Text style={entireMenuStyle.subTitle}>Adicionar Item</Text>

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
                        <Text style={itemCategoryToShow == element.id ? {textDecorationLine: 'underline', fontWeight: 'bold'} : null}>{element.title}</Text>
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