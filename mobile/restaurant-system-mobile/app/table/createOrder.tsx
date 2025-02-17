import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import EntireMenuComponent from "../component/entireMenu";
import { useEffect, useState } from "react";
import { OrderCreationStates } from "../enum/OrderCreationStates";
import PreInsertOrderItem from "../component/preInsertOrderItem";
import { IItem } from "../interface/IItem";
import { IOrderItem } from "../interface/IOrderItem";
import { useLocalSearchParams } from "expo-router";
import { IApiResponse } from "../interface/IApiResponse";
import { TablesEndpoint } from "../fuctions/tables/table.endpoint";
import { ITable } from "../interface/ITable";
import { TableStatus } from "../enum/TableStatus";

export default function CreateOrder() {

    const tablesEndpoint: TablesEndpoint = new TablesEndpoint();

    const [currentState, setCurrentState]                   = useState<OrderCreationStates>(OrderCreationStates.CREATE);
    const [choosenItems, setChooseItems]                    = useState<IItem[]>([]);
    const [preInsertOrderItems, setPreInsertOrderItems]     = useState<IOrderItem[]>([]);

    const [currentTable, setCurrentTable]                   = useState<ITable>();

    const {tableID} = useLocalSearchParams<{tableID: string}>();

    async function getTable() {
        const apiResult: IApiResponse = await tablesEndpoint.getOne(Number(tableID));
        if(apiResult.statusCode != 200) {
            return console.log(apiResult.data);
        };
        setCurrentTable(apiResult.data)
        return;
    }

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

    }, [currentState]);

    useEffect(() => {
        getTable();
    }, [])

    return(
        <SafeAreaView style={createOrderStyle.container}>

            {currentState === OrderCreationStates.CREATE
                ?
                    <View style={createOrderStyle.menuComponent}>
                        <EntireMenuComponent
                            currentTable={currentTable}
                            setStoredItems={setChooseItems}
                            storedItems={choosenItems}
                            setOrderState={setCurrentState}
                        />
                    </View>
                :
                <View style={createOrderStyle.menuComponent}>
                    <PreInsertOrderItem
                        itemList={preInsertOrderItems}
                        setItemList={setChooseItems}
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