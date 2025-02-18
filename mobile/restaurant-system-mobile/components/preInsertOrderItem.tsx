import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IItem } from "../interface/IItem";

import { BackHandler } from "react-native";
import { useEffect, useState } from "react";
import { OrderCreationStates } from "../enum/OrderCreationStates";

import Icons from '@expo/vector-icons/Feather'
import { IOrderItem } from "../interface/IOrderItem";
import ButtonToAction from "./buttonToAction";

interface PreInsertOrderItemProps {
    orderItemList: IOrderItem[],
    setItemList: React.Dispatch<React.SetStateAction<IItem[]>>,
    setOrderState: React.Dispatch<React.SetStateAction<OrderCreationStates>>
    setOrderItemList: React.Dispatch<React.SetStateAction<IOrderItem[]>>,
};

export default function PreInsertOrderItem({orderItemList, setOrderItemList, setItemList, setOrderState}: PreInsertOrderItemProps) {

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => {
            setOrderState(OrderCreationStates.CREATE);
            return true;
        });
    }, [])

    const deleteItemOnHandle = (itemIndex: number) => {

        orderItemList.splice(itemIndex, 1);
        const menuItemList: IItem[] = orderItemList.map((element) => {
            return(
                element.item
            )
        });
        setItemList(menuItemList);
        return;
    }

    const increaseItemQuantity = (index: number) => {
        const newArray = orderItemList.map((element, pos) => {
            if(index === pos) {
                element.quantity++
            };
            return element
        });
        setOrderItemList(newArray);
        return;
    }

    const decreaseQuantity = (index: number) => {
        const newArray = orderItemList.map((element, pos) => {
            if(index === pos && element.quantity > 1) {
                element.quantity--
            };
            return element
        });
        setOrderItemList(newArray);
        return;
    }

    return(
        <SafeAreaView style={preInsertOrderItemStyle.container}>
            <TouchableOpacity
                onPressOut={() => setOrderState(OrderCreationStates.CREATE)}
                style={{position: 'absolute', left: 10, top: 10, zIndex: 10}}
            >
                <Icons name='chevron-left' 
                    size={30} 
                    color={'#171717'}
                />

            </TouchableOpacity>

            <Text style={preInsertOrderItemStyle.title}>Confirmação</Text>
            <Text style={preInsertOrderItemStyle.subTitle}>Itens do pedido</Text>

            <View style={preInsertOrderItemStyle.lighHorizontalLine}/>

                <ScrollView
                contentContainerStyle={{paddingBottom: 20}}
                    showsVerticalScrollIndicator={true}
                >  
                {orderItemList.map((element, index) => (
                    <View>
                        <View 
                            style={preInsertOrderItemStyle.eachItem}
                            key={element.item.id}
                        >   
                            <View style={{alignItems: 'center'}}>
                                <TouchableOpacity onPressIn={() => increaseItemQuantity(index)}>
                                    <Icons name="chevron-up" size={25}/>
                                </TouchableOpacity>

                                <Text>{element.quantity}</Text>

                                <TouchableOpacity onPressIn={() => decreaseQuantity(index)}>
                                    <Icons name="chevron-down" size={25}/>
                                </TouchableOpacity>

                                <Text>R$ {(element.item.price * element.quantity).toFixed(2)}</Text>
                            </View>

                            <Text style={preInsertOrderItemStyle.itemName}>{element.item.name}</Text>

                            <TouchableOpacity
                                onPressIn={() => deleteItemOnHandle(index)}
                                style={{zIndex: 10}}
                            >
                                <Icons name="trash-2" size={20} style={{padding: 8}}/>
                            </TouchableOpacity>

                        </View>
                        <View style={{marginBlock: -15}}>
                            <View style={preInsertOrderItemStyle.lighHorizontalLine}/>
                        </View>
                    </View>
                ))}
    
                </ScrollView>
                
                <View style={{margin: 'auto', paddingBlock: 20, width: '90%', height: '17%'}}>
                    <ButtonToAction
                        buttonStyle={
                            {
                                backgroundColor: '#255247'
                            }
                        }
                        buttonTitle="Enviar ao pedido"
                        isDisabled={false}
                        textStyle={
                            {
                                color: '#C1C1C1',
                                fontSize: 15
                            }
                        }
                    />
                </View>

        </SafeAreaView>
    )
}

const preInsertOrderItemStyle = StyleSheet.create({
    container: {
        backgroundColor: '#C1C1C1',
 
        height: '100%',
        width: '100%',
 
        position: 'relative'
     },

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

    lighHorizontalLine: {
        backgroundColor: '#A8A8A8',

        width: '100%',
        height: 1,
        marginBlock: 25
    },

    eachItem: {
        paddingInline: 20,

        flexDirection: 'row',
        justifyContent: 'space-between',

        alignItems: 'center'
    },

    itemName: {
        width: 165,
        
        fontSize: 13,

        marginRight: -20,
        textAlign: 'left'
    },
})