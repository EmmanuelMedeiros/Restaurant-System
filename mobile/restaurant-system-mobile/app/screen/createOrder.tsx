import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import EntireMenuComponent from "../component/entireMenu";
import { useEffect, useState } from "react";
import { OrderCreationStates } from "../enum/OrderCreationStates";
import PreInsertOrderItem from "../component/preInsertOrderItem";
import { IItem } from "../interface/IItem";
import { IOrderItem } from "../interface/IOrderItem";

export default function CreateOrder() {

    const [currentState, setCurrentState]                   = useState<OrderCreationStates>(OrderCreationStates.CREATE);
    const [choosenItems, setChooseItems]                    = useState<IItem[]>([]);
    const [preInsertOrderItems, setPreInsertOrderItems]     = useState<IOrderItem[]>([]);

    useEffect(() => {

        if(currentState === OrderCreationStates.CONFIRM) {

            const orderItems: IOrderItem[] = choosenItems.map((element) => {

                const alreadyChosenItem: IOrderItem|undefined = preInsertOrderItems.find(x => x.item === element);
                if(!alreadyChosenItem) {
                    return {item: element, quantity: 1};
                };
                return {item: element, quantity: alreadyChosenItem.quantity};
            });

            setPreInsertOrderItems(orderItems);
        }

    }, [currentState])

    return(
        <SafeAreaView style={createOrderStyle.container}>

            {currentState === OrderCreationStates.CREATE
                ?
                    <View style={createOrderStyle.menuComponent}>
                        <EntireMenuComponent
                            setStoredItems={setChooseItems}
                            storedItems={choosenItems}
                            setOrderState={setCurrentState}
                        />
                    </View>
                :
                <View style={createOrderStyle.menuComponent}>
                    <PreInsertOrderItem
                        itemList={preInsertOrderItems}
                        setOrderState={setCurrentState}
                    />
                </View>
            }

        </SafeAreaView>
    )
}

const createOrderStyle = StyleSheet.create({
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