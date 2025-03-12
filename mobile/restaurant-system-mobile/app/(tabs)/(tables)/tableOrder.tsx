import Menu from "@/components/menu";
import { BackHandler, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

import Icons from '@expo/vector-icons/Feather'
import { useCallback, useContext, useEffect, useState } from "react";
import { IOrderItem } from "@/interface/IOrderItem";
import { OrderScreens } from "@/enum/OrderScreens";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { IApiResponse } from "@/interface/IApiResponse";
import { OrderEndpoint } from "@/fuctions/order.endpoint";
import { IOrder } from "@/interface/IOrder";
import UserContext from "@/context/user.context";


export default function TableOrder() {

    const userContext = useContext(UserContext);

    const [order, setOrder]                             = useState<Pick<IOrder, "uuid"|"createdAt"|"modifiedAt"|"finishedAt">>();

    const [itemList, setItemList]                       = useState<IOrderItem[]>([]);
    const [itemsToRemove, setItemsToRemove]             = useState<IOrderItem[]>([]);
    const [currentOrderScreen, setCurrentOrderScreen]   = useState<OrderScreens>(OrderScreens.ORDER);

    const [editableItemList, setEditableItemList]       = useState<IOrderItem[]>([]);



    const {tableID} = useLocalSearchParams<{tableID: string}>();
    const orderEndpoint: OrderEndpoint = new OrderEndpoint();

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

    async function orderByTableID() {
        try{
            const refreshToken: string|null = await userContext.getRefreshToken();
            const token = await userContext.generateJwtToken(refreshToken);
            const apiResponse: IApiResponse = await orderEndpoint.getByTableID(Number(tableID), token);
            if(apiResponse.statusCode !== 200) {
                console.log(`getByTableID endpoint failed | err: ${JSON.stringify(apiResponse.data)}`);
                return
            } else {
                setOrder(apiResponse.data);
                return;
            }
        }catch(err) {
            console.log(err)
        }
    }

    async function manipulateOrder(editedOrder: IOrderItem[]) {

        if(order) {

            if(editedOrder === itemList && itemsToRemove.length === 0) {
                console.log("Tudo igualzinho");
                setCurrentOrderScreen(OrderScreens.ORDER);
                return;
            };

            const manipulatedOrder: IOrderItem[] = editableItemList.map((element: IOrderItem) => {
                if(itemsToRemove.find(x => x.item.id === element.item.id)) {
                    return {item: element.item, quantity: 0, uuid: element.uuid};
                } else {
                    return element;
                };
            });

            const refreshToken: string|null = await userContext.getRefreshToken();
            const token = await userContext.generateJwtToken(refreshToken);

            const apiResponse: IApiResponse = await orderEndpoint.manipulateOrderItems(String(order.uuid), manipulatedOrder, token)
            if(apiResponse.statusCode !== 200) {
                console.log(`getByTableID endpoint failed | err: ${JSON.stringify(apiResponse.data)}`);
                return
            } else {
                setItemList(apiResponse.data);
                setCurrentOrderScreen(OrderScreens.ORDER);
                return;
            }
        } else {
            console.log("No order to edit!");
            return
        }
    }

    async function getOrderItemsByOrderID() {
        try{
            if(order) {
                const refreshToken: string|null = await userContext.getRefreshToken();
                const token = await userContext.generateJwtToken(refreshToken);

                const apiResponse: IApiResponse = await orderEndpoint.getSpecificOrderItems(order.uuid, token)
                if(apiResponse.statusCode !== 200) {
                    console.log(`get order's items endpoint failed | err: ${JSON.stringify(apiResponse.data)}`);
                    setItemList([])
                    return
                } else {
                    setItemList(apiResponse.data);
                    return;
                }
            } else {
                console.log("No order to fetch!");
                return;
            };
        }catch(err) {
            console.log(err)
        }
    }

    useFocusEffect(
        useCallback(() => {
            orderByTableID()
        }, [])
    )

    useEffect(() => {
        if(order) {
            getOrderItemsByOrderID();
        };
    }, [order])

    useEffect(() => {
        setEditableItemList(itemList);
    }, [itemList])

    useEffect(() => {
        if(currentOrderScreen === OrderScreens.ADD_ITEM) {

            const alreadyExistingItemsID: number[] = itemList.map((element) => {
                return(element.item.id);
            })

            router.push(
                {pathname: "/(tabs)/(tables)/createOrder", params: 
                    {   
                        tableID: tableID, 
                        alreadyExistingItemsID: alreadyExistingItemsID,
                        isInsertion: 1,
                        orderUUID: order?.uuid
                    }
                });
            setCurrentOrderScreen(OrderScreens.ORDER)
        };  
        return;
    }, [currentOrderScreen])

    return(
        <SafeAreaView style={tableOrder.container}>

            <View style={tableOrder.menuComponent}>

                {currentOrderScreen === OrderScreens.ORDER
                    ?   
                        <View>
                            <Menu
                                orderItemList={itemList}
                                posActionItemList={[]}
                                itemPressableIcon={[<Icons name="info" size={20}/>]}
                                pressableIconFunction={toggleItemFromRemoveItemsList}
                                showHeader={true}
                                title={`PEDIDO`}
                                subtitle={`MESA ${tableID}`}
                                bottomButton={
                                    [
                                        
                                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignContent: 'center'}}>
                                            <TouchableOpacity 
                                                style={ itemList.length > 0 ? { padding: 20 } : {display: 'none'} }
                                                onPress={() => setCurrentOrderScreen(OrderScreens.EDIT)}    
                                            >
                                                <Icons 
                                                    name="edit" 
                                                    size={30}
                                                    color={'rgba(0, 0, 0, .5)'}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity 
                                                style={{ padding: 20 }}
                                                onPress={() => setCurrentOrderScreen(OrderScreens.ADD_ITEM)}
                                            >
                                                <Icons 
                                                    name="plus" 
                                                    size={30}
                                                    color={'rgba(37, 82, 71, .8)'}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ]
                                }
                            />
                        </View>
                    :
                        null
                }

                    {currentOrderScreen === OrderScreens.EDIT
                        ?   
                            <View>
                                <Menu
                                    orderItemList={editableItemList}
                                    setOrderItemList={setEditableItemList}
                                    posActionItemList={itemsToRemove}
                                    showHeader={false}
                                    itemPressableIcon={[<Icons name="trash-2" size={20}/>, <Icons name="plus" size={20}/>]}
                                    pressableIconFunction={toggleItemFromRemoveItemsList}
                                    goBackFunction={() => setCurrentOrderScreen(OrderScreens.ORDER)}
                                    title="EDITAR"
                                    subtitle={`MESA ${tableID}`}
                                    isQuantityChangeable={true}
                                    bottomButton={
                                        [
                                            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around', alignContent: 'center'}}>
                                                <TouchableOpacity 
                                                    style={{ padding: 20 }}
                                                    onPress={() => setCurrentOrderScreen(OrderScreens.ORDER)}    
                                                >
                                                    <Icons 
                                                        name="x" 
                                                        size={30}
                                                        color={'rgba(108, 50, 50, .8)'}
                                                    />
                                                </TouchableOpacity>

                                                <TouchableOpacity 
                                                    style={{ padding: 20 }}
                                                    onPress={() => manipulateOrder(editableItemList)}
                                                >
                                                    <Icons 
                                                        name="check" 
                                                        size={30}
                                                        color={'rgba(37, 82, 71, .8)'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ]
                                    }
                                />
                            </View>
                        :
                            null
                    }


            </View>
            
{/*             {currentOrderScreen === OrderScreens.EDIT && itemsToRemove.length > 0
                ?
                    <QuantityFloatComponent
                        quantity={itemsToRemove.length}
                        icon={<Icons name="trash" size={30}/>}
                        floatAction={() => setCurrentOrderScreen(OrderScreens.TRASH)}
                    />
                :
                    null
            } */}
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