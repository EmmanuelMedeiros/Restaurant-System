import EntireMenuComponent from "@/components/entireMenu";
import Menu from "@/components/menu";
import { IItem } from "@/interface/IItem";
import { SafeAreaView, StyleSheet, View } from "react-native";

import Icons from '@expo/vector-icons/Feather'
import { useEffect, useState } from "react";
import QuantityFloatComponent from "@/components/quantityFloatComponent";
import { IOrderItem } from "@/interface/IOrderItem";

const items: IOrderItem[] = [
    {
        item: {
            category: {id: 1, title: ''},
            createdAt: '',
            id: 1,
            name: 'Item A',
            price: 40,
        },
        quantity: 10
    },
    {
        item: {
            category: {id: 1, title: ''},
            createdAt: '',
            id: 2,
            name: 'Item B',
            price: 40,
        },
        quantity: 2
    },
    {
        item: {
            category: {id: 2, title: ''},
            createdAt: '',
            id: 3,
            name: 'Item C',
            price: 40,
        },
        quantity: 3
    }
]

export default function TableOrder() {

    const [itemList, setItemList]               = useState<IOrderItem[]>(items);
    const [itemsToRemove, setItemsToRemove]     = useState<IOrderItem[]>([]);

    function toggleItemFromRemoveItemsList(orderItem: IOrderItem): void {

        const itemPosInRemoveList: number = itemsToRemove.findIndex(x => x.item.id === orderItem.item.id);
        if(itemPosInRemoveList !== -1) {
            const newArray = itemsToRemove.toSpliced(itemPosInRemoveList, 1);
            setItemsToRemove(newArray);
            return;
        }

        setItemsToRemove((prev) => (
            [...prev, orderItem]
        ))
        return
    }

    return(
        <SafeAreaView style={tableOrder.container}>

            <View style={tableOrder.menuComponent}>
                <Menu
                    orderItemList={itemList}
                    posActionItemList={itemsToRemove}
                    itemPressableIcon={[<Icons name="trash-2" size={20}/>, <Icons name="plus" size={20}/>]}
                    pressableIconFunction={toggleItemFromRemoveItemsList}
                />
            </View>

            <QuantityFloatComponent
                quantity={3}
                icon={<Icons name="trash" size={30}/>}
            />
            
        </SafeAreaView>
    )
}


const tableOrder = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',

        backgroundColor: '#181818',

        margin: 'auto'
    },

    menuComponent: {
        margin: 'auto',

        width: '90%',
        height: '90%'
    }
})