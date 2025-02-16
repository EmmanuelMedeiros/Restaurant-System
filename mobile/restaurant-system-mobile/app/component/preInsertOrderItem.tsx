import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IItem } from "../interface/IItem";

import { BackHandler } from "react-native";
import { useEffect, useState } from "react";
import { OrderCreationStates } from "../enum/OrderCreationStates";

import Icons from '@expo/vector-icons/Feather'
import { IOrderItem } from "../interface/IOrderItem";
import ButtonToAction from "./buttonToAction";

interface PreInsertOrderItemProps {
    itemList: IOrderItem[]
    setOrderState: React.Dispatch<React.SetStateAction<OrderCreationStates>>
};

export default function PreInsertOrderItem({itemList, setOrderState}: PreInsertOrderItemProps) {

    const [orderItems, setOrderItems] = useState<IOrderItem[]>([])

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => {
            setOrderState(OrderCreationStates.CREATE);
            return true;
        });
    }, [])

    return(
        <SafeAreaView style={preInsertOrderItemStyle.container}>
            <TouchableOpacity
                style={{position: 'absolute', right: 10, top: 10, zIndex: 10}}
            >
                <Icons name='x' 
                    size={30} 
                    color={'#6C3232'}
                />

            </TouchableOpacity>

            <Text style={preInsertOrderItemStyle.title}>Confirmação</Text>
            <Text style={preInsertOrderItemStyle.subTitle}>Itens do pedido</Text>

            <View style={preInsertOrderItemStyle.lighHorizontalLine}/>

                <ScrollView
                contentContainerStyle={{paddingBottom: 20}}
                    showsVerticalScrollIndicator={true}
                >  
                {itemList.map((element) => (
                    <View>
                        <View 
                            style={preInsertOrderItemStyle.eachItem}
                            key={element.item.id}
                        >   
                            <View style={{alignItems: 'center'}}>
                                <Text>{element.quantity}</Text>
                                <Text>R$ {element.item.price.toFixed(2)}</Text>
                            </View>

                            <Text style={preInsertOrderItemStyle.itemName}>{element.item.name}</Text>

                            <TouchableOpacity
                                onPressIn={() => null}
                                style={{zIndex: 10}}
                            >
                                <Icons name="trash-2" size={20}/>
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