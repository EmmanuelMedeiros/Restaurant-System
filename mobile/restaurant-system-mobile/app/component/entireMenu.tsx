import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IItem } from "../interface/IItem";

import Icons from '@expo/vector-icons/Feather'
import { IChooseableItem } from "../interface/IChooseableItem";
import { IItemCategory } from "../interface/IItemCategory";
import { useEffect, useState } from "react";


const itemList: IItem[] = [
    {
        category: {id: 1, title: 'olá'},
        createdAt: '2024/02/23',
        id: 1,
        name: 'CARNE DE SOL DE BOI - PRATO COMPLETO',
        price: 75.50
    },
    {
        category: {id: 1, title: 'Tira-gosto'},
        createdAt: '2024/02/23',
        id: 2,
        name: 'CARNE DE SOL DE PORCO - PRATO COMPLETO',
        price: 45.10
    },
    {
        category: {id: 2, title: 'Tira-gosto'},
        createdAt: '2024/02/23',
        id: 3,
        name: 'CALDINHO DE SURURU',
        price: 10.00
    },
    {
        category: {id: 2, title: 'Tira-gosto'},
        createdAt: '2024/02/23',
        id: 4,
        name: 'CALDINHO DE SIRI',
        price: 10.00
    },
    {
        category: {id: 3, title: 'Bebida'},
        createdAt: '2024/02/23',
        id: 5,
        name: 'SUCO DE LARANJA',
        price: 10.00
    }
];

const menuCategoryList: IItemCategory[] = [
    {id: 1, title: "ALMOÇO"}, {id: 2, title: "TIRA-GOSTO"}, {id: 3, title: "BEBIDAS"}, {id: 4, title: "GUARNIÇÕES"}
];

export default function EntireMenuComponent() {

    const [itemsList, setItemsList]                     = useState<IItem[]>(itemList);
    const [itemCategoryToShow, setItemCategoryToShow]   = useState<number>(1);
    const [storedItems, setStoredItems]                 = useState<IItem[]>([]);


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

    return(
        <View style={entireMenuStyle.container}>
            
            <TouchableOpacity
                style={{position: 'absolute', right: 10, top: 10, zIndex: 10}}
            >
                <Icons name='x' 
                    size={30} 
                    color={'#6C3232'}
                />

            </TouchableOpacity>

            <Text style={entireMenuStyle.title}>Mesa X</Text>
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
                {itemsList.filter(x => x.category.id === itemCategoryToShow).map((element) => (
                    <View>
                        <View 
                            style={entireMenuStyle.eachItem}
                            key={element.id}
                        >
                            <Text>R$ {element.price.toFixed(2)}</Text>
                            <Text style={entireMenuStyle.itemName}>{element.name}</Text>
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

                <TouchableOpacity>
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