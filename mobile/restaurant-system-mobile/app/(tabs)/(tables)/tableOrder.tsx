import EntireMenuComponent from "@/components/entireMenu";
import Menu from "@/components/menu";
import { IItem } from "@/interface/IItem";
import { BackHandler, SafeAreaView, StyleSheet, View } from "react-native";

import Icons from '@expo/vector-icons/Feather'
import { useEffect, useState } from "react";
import QuantityFloatComponent from "@/components/quantityFloatComponent";
import { IOrderItem } from "@/interface/IOrderItem";
import { OrderScreens } from "@/enum/OrderScreens";
import ButtonToAction from "@/components/buttonToAction";
import { router, useLocalSearchParams } from "expo-router";
import { goBack } from "expo-router/build/global-state/routing";
import { IApiResponse } from "@/interface/IApiResponse";
import { OrderEndpoint } from "@/fuctions/order.endpoint";
import { IOrder } from "@/interface/IOrder";

const items: IOrderItem[] = [
    {
        item: {
            category: {id: 1, title: ''},
            createdAt: '',
            id: 1,
            name: 'Item A',
            price: 40,
        },
        quantity: 10,
        uuid: "a"
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
        ,
        uuid: "b"
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
        ,
        uuid: "c"
    }
]

export default function TableOrder() {

    const [order, setOrder]                             = useState<Pick<IOrder, "uuid"|"createdAt"|"modifiedAt"|"finishedAt">>();

    const [itemList, setItemList]                       = useState<IOrderItem[]>([]);
    const [itemsToRemove, setItemsToRemove]             = useState<IOrderItem[]>([]);
    const [currentOrderScreen, setCurrentOrderScreen]   = useState<OrderScreens>(OrderScreens.ORDER)

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
            const apiResponse: IApiResponse = await orderEndpoint.getByTableID(Number(tableID));
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

    function updateOrderItemsInThreeSeconds() {
        const updateTimeout = setTimeout(() => {
            console.log("OrderItems")
            getOrderItemsByOrderID();
            clearTimeout(updateTimeout)
            updateOrderItemsInThreeSeconds()
        }, 3000)
    }

    async function getOrderItemsByOrderID() {
        try{
            if(order) {
                const apiResponse: IApiResponse = await orderEndpoint.getSpecificOrderItems(order.uuid)
                if(apiResponse.statusCode !== 200) {
                    console.log(`getByTableID endpoint failed | err: ${JSON.stringify(apiResponse.data)}`);
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

    useEffect(() => {
        orderByTableID();
    }, [])

    useEffect(() => {
        if(order) {
            getOrderItemsByOrderID();
        };
    }, [order])

    return(
        <SafeAreaView style={tableOrder.container}>

            <View style={tableOrder.menuComponent}>

                {currentOrderScreen === OrderScreens.ORDER
                    ?   
                        <View>
                            <Menu
                                orderItemList={itemList}
                                posActionItemList={itemsToRemove}
                                itemPressableIcon={[<Icons name="trash-2" size={20}/>, <Icons name="plus" size={20}/>]}
                                pressableIconFunction={toggleItemFromRemoveItemsList}
                                showHeader={true}
                                title={`MESA ${tableID}`}
                                subtitle={`PEDIDO`}
                                bottomButton=
                                    {   
                                        <ButtonToAction
                                            buttonStyle={
                                                {
                                                    backgroundColor: '#c1c1c1'
                                                }
                                            }
                                            buttonTitle="Adicionar Item"
                                            isDisabled={false}
                                            textStyle={
                                                {
                                                    color: 'rgba(37, 82, 71, .8)',
                                                    fontSize: 20
                                                }
                                            }
                                            onPress={() => {}}
                                        />
                                    }
                            />
                        </View>
                    :
                        null
                }

                {currentOrderScreen === OrderScreens.TRASH
                    ?
                        <Menu
                            orderItemList={itemsToRemove}
                            posActionItemList={itemsToRemove}
                            showHeader={false}
                            goBackFunction={() => setCurrentOrderScreen(OrderScreens.ORDER)}
                            title="Confirmar Exclusão"
                            bottomButton={
                                <ButtonToAction
                                    buttonStyle={
                                        {
                                            backgroundColor: '#c1c1c1'
                                        }
                                    }
                                    buttonTitle="Excluir Itens"
                                    isDisabled={false}
                                    textStyle={
                                        {
                                            color: 'rgba(108, 50, 50, .8)',
                                            fontSize: 20
                                        }
                                    }
                                    onPress={() => {}}
                                />
                            }
                        />
                    :
                        null
                }

            </View>
            
            {currentOrderScreen === OrderScreens.ORDER && itemsToRemove.length > 0
                ?
                    <QuantityFloatComponent
                        quantity={itemsToRemove.length}
                        icon={<Icons name="trash" size={30}/>}
                        floatAction={() => setCurrentOrderScreen(OrderScreens.TRASH)}
                    />
                :
                    null
            }

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