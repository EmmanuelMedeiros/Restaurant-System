import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import EntireMenuComponent from "@/components/entireMenu";
import { OrderCreationStates } from "../../../enum/OrderCreationStates";
import PreInsertOrderItem from "../../../components/preInsertOrderItem";
import { IItem } from "../../../interface/IItem";
import { IOrderItem } from "../../../interface/IOrderItem";
import { useLocalSearchParams } from "expo-router";
import { IApiResponse } from "../../../interface/IApiResponse";
import { TablesEndpoint } from "@/fuctions/table.endpoint";
import { ITable } from "../../../interface/ITable";
import { ItemEndpoint } from "@/fuctions/item.endpoint";

export default function CreateOrder() {

    const tablesEndpoint: TablesEndpoint = new TablesEndpoint();

    const [currentState, setCurrentState]                   = useState<OrderCreationStates>(OrderCreationStates.CREATE);
    const [choosenItems, setChooseItems]                    = useState<IItem[]>([]);
    const [preInsertOrderItems, setPreInsertOrderItems]     = useState<IOrderItem[]>([]);
    const [itemList, setItemList]                           = useState<IItem[]>([]);

    const [currentTable, setCurrentTable]                   = useState<ITable>();

    const itemEndpoint: ItemEndpoint = new ItemEndpoint();

    const {tableID} = useLocalSearchParams<{tableID: string}>();

    async function getTable() {
        const apiResult: IApiResponse = await tablesEndpoint.getOne(Number(tableID));
        if(apiResult.statusCode != 200) {
            return console.log(apiResult.data);
        };
        setCurrentTable(apiResult.data)
        return;
    }

    async function getAllItems() {
        const apiResponse: IApiResponse = await itemEndpoint.getAll();
        if(apiResponse.statusCode !== 200) {
            console.log("ERRO EM GETALLITEMS");
            return;
        }
        setItemList(() => {
            return(apiResponse.data)
        })
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
        getAllItems();
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
                            itemsList={itemList}
                        />
                    </View>
                :
                <View style={createOrderStyle.menuComponent}>
                    <PreInsertOrderItem
                        setOrderItemList={setPreInsertOrderItems}
                        orderItemList={preInsertOrderItems}
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