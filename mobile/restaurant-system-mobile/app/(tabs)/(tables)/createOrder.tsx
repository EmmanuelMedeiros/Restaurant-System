import { BackHandler, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import EntireMenuComponent from "@/components/entireMenu";
import { OrderCreationStates } from "../../../enum/OrderCreationStates";
import PreInsertOrderItem from "../../../components/preInsertOrderItem";
import { IItem } from "../../../interface/IItem";
import { router, useLocalSearchParams } from "expo-router";
import { IApiResponse } from "../../../interface/IApiResponse";
import { TablesEndpoint } from "@/fuctions/table.endpoint";
import { ITable } from "../../../interface/ITable";
import { ItemEndpoint } from "@/fuctions/item.endpoint";
import { OrderEndpoint } from "@/fuctions/order.endpoint";
import { CreateOrderDTO } from "@/dto/create-order.dto";
import { CreateOrderItemDTO } from "@/dto/create-orderItem.dto";
import UserContext from "@/context/user.context";

export default function CreateOrder() {

    const userContext = useContext(UserContext);

    const tablesEndpoint: TablesEndpoint = new TablesEndpoint();
    const itemEndpoint: ItemEndpoint = new ItemEndpoint();
    const orderEndpoint: OrderEndpoint = new OrderEndpoint();

    const [currentState, setCurrentState]                   = useState<OrderCreationStates>(OrderCreationStates.CREATE);
    const [choosenItems, setChooseItems]                    = useState<IItem[]>([]);
    const [preInsertOrderItems, setPreInsertOrderItems]     = useState<CreateOrderItemDTO[]>([]);
    const [itemList, setItemList]                           = useState<IItem[]>([]);

    const [currentTable, setCurrentTable]                   = useState<ITable>();
    const [orderReady, setOrderReady]                       = useState<boolean>(false);

    const {tableID, alreadyExistingItemsID, isInsertion, orderUUID} = useLocalSearchParams();

    async function getTable() {

        const refreshToken: string|null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        const apiResult: IApiResponse = await tablesEndpoint.getOne(Number(tableID), token);
        if(apiResult.statusCode != 200) {
            return console.log("GET TABLE'S ERROR:" +  apiResult.data);
        };
        setCurrentTable(apiResult.data)
        return;
    }

    async function getAllItems() {
        const refreshToken: string|null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        const apiResponse: IApiResponse = await itemEndpoint.getAll(token);
        if(apiResponse.statusCode !== 200) {
            console.log("ERRO EM GETALLITEMS");
            return;
        }

        if(!alreadyExistingItemsID) {
            setItemList(() => {
                return(apiResponse.data)
            })
            return;
        }

        const alreadyExistingOrderItemsID: string[] = alreadyExistingItemsID.toString().split(",");
        let itemsToShow: IItem[] = apiResponse.data.map((element: IItem) => {
            if(!alreadyExistingOrderItemsID.find(x => Number(x) === element.id)) {
                return element
            }
        });

        itemsToShow = itemsToShow.filter(x => x !== undefined);

        setItemList(() => {
            return(itemsToShow);
        });

        return;
    }

    async function createOrder() {
        if(currentTable) {
            
            console.log("OLÁ")

            const refreshToken: string|null = await userContext.getRefreshToken();
            const token = await userContext.generateJwtToken(refreshToken);

            const table: {id: number}  = {id: currentTable.id}
            const waiter: {uuid: string} = {uuid: "dfd36b3b-f40b-42d9-ab51-aa1a8460cea9"};
            const createOrderDTO: CreateOrderDTO = new CreateOrderDTO(
                table,
                waiter,
                preInsertOrderItems
            );  

            const apiResponse: IApiResponse = await orderEndpoint.create(createOrderDTO, token);
            if(apiResponse.statusCode !== 201) {
                console.log("ERRO NA CRIAÇÃO DE ORDER" + apiResponse.data);
                setOrderReady(false);  
                return;
            }
            router.replace({pathname: "/(tabs)/(tables)/tableOrder", params: {tableID: tableID}})
            return;
        }
    };

    async function insertToOrder() {
        
        if(orderUUID) {
            const refreshToken: string|null = await userContext.getRefreshToken();
            const token = await userContext.generateJwtToken(refreshToken);

            const apiResponse: IApiResponse = await orderEndpoint.manipulateOrderItems(String(orderUUID), preInsertOrderItems, token)
            if(apiResponse.statusCode !== 200) {
                console.log(`getByTableID endpoint failed | err: ${JSON.stringify(apiResponse.data)}`);
                return
            } else {
                router.back();
            }
        } else {
            console.log("No order to insert item!");
            return
        }
    }

    useEffect(() => {
        if(orderReady) {
            if(!isInsertion || Number(isInsertion) === 0) {
                createOrder();
            } else {
                insertToOrder();
            };
        };
        return;
    }, [orderReady])

    useEffect(() => {

        if(currentState === OrderCreationStates.CONFIRM) {
            const orderItems: CreateOrderItemDTO[] = choosenItems.map((element) => {
                const alreadyChosenItem: CreateOrderItemDTO|undefined = preInsertOrderItems.find(x => x.item === element);
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
    }, []);

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
                        setOrderReady={setOrderReady}
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

        paddingBottom: 120,
        paddingTop: 50,

        margin: 'auto'
    },

    menuComponent: {
        margin: 'auto',

        width: '90%',
        height: '90%'
    }
})