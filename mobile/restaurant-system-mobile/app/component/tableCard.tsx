import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icons from '@expo/vector-icons/Feather'
import ButtonToAction from "./buttonToAction";
import { TableStatus } from "../enum/TableStatus";
import { ITable } from "../interface/ITable";

import { Link, router } from "expo-router";

interface TableCardProps {
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    table: ITable | undefined
}

export default function TableCard({setShow, table}: TableCardProps) {


    let statusColor: "grey"|"#A87F26" = "grey";
    let closeOrderBGColor: "#255247"|"rgba(37, 82, 71, .3)" = "#255247"

    table?.status === TableStatus.BUSY ? [statusColor = "#A87F26", closeOrderBGColor = "#255247"]: [statusColor = "grey", closeOrderBGColor = "rgba(37, 82, 71, .3)"];

    function goToCreateOrder() {
        router.push("/table/createOrder")
    }

    return(
        <View 
            style={tableCardStyle.container}
            >

            <View style={tableCardStyle.card}>
                
                <View style={tableCardStyle.statusView}>
                    <View style={[tableCardStyle.statusBullet, {backgroundColor: statusColor}]}/>
                    <Text style={{color: 'white'}}>{table?.status}</Text>
                </View>
                <Text style={tableCardStyle.tableName}>Mesa {table?.id}</Text>

                <View style={tableCardStyle.cardButtons}>

                    <View style={{height: '30%', width: '130%', marginRight: 20}}>
                        <ButtonToAction
                            buttonTitle={table?.status === TableStatus.BUSY ? 'Pedidos' : 'Abrir Pedido'}
                            textStyle={
                                {
                                    color: '#181818',
                                    fontSize: 15
                                }
                            }
                            buttonStyle={
                                {
                                    backgroundColor: '#C1C1C1'
                                }
                            }
                            isDisabled={false}
                            onPress={() => {table?.status === TableStatus.BUSY ? null : goToCreateOrder()}}
                        />
                    </View>
                    
                    <View style={{height: '30%', width: '130%', marginRight: 20}}>
                        <ButtonToAction
                            buttonTitle="Fechar Conta"
                            textStyle={
                                {
                                    color: closeOrderBGColor === "#255247" ? '#C1C1C1' : 'rgba(193, 193, 193, .4)',
                                    fontSize: 15
                                }
                            }
                            buttonStyle={
                                {
                                    backgroundColor: closeOrderBGColor
                                }
                            }
                            isDisabled={table?.status == TableStatus.SLEEPING ? true : false}
                        />
                    </View>
                </View>

            </View>

        </View>
    )    
}

const tableCardStyle = StyleSheet.create({
    container: {
        marginBlock: 'auto',
        justifyContent: 'center',
        alignItems: 'center'
    },

    tableName: {
        color: 'white',

        fontSize: 30
    },

    card: {
        backgroundColor: '#181818',
        height: '100%',
        width: '90%',

        paddingInline: 20,

        justifyContent: 'space-between',

        borderRadius: 10,

        shadowColor: 'red',
        elevation: 20,

        flexDirection: 'row',
        alignItems: 'center',

        position: 'relative'
        
    },

    cardButtons: {
        display: 'flex',

        gap: 20,

        alignItems: 'center'
    },

    statusView: {
        position: 'absolute',

        top: 20,
        left: 20,

        flexDirection: 'row',
        alignItems: 'center',

        gap: 10
    },

    statusBullet: {
        width: 15,
        height: 15,

        borderRadius: '100%'
    }
    
})