import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icons from '@expo/vector-icons/Feather'
import ButtonToAction from "./buttonToAction";

interface TableCardProps {
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    tableName: string
}

export default function TableCard({setShow, tableName}: TableCardProps) {

    return(
        <View 
            style={tableCardStyle.container}
            >

            <View style={tableCardStyle.card}>
                <Text style={tableCardStyle.tableName}>Mesa {tableName}</Text>

                <View style={tableCardStyle.cardButtons}>
                    <ButtonToAction
                        buttonTitle="Abrir Pedido"
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
                    />

                    <ButtonToAction
                        buttonTitle="Fechar Conta"
                        textStyle={
                            {
                                color: '#181818',
                                fontSize: 15
                            }
                        }
                        buttonStyle={
                            {
                                backgroundColor: '#255247'
                            }
                        }
                    />
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
        
    },

    cardButtons: {
        display: 'flex',

        gap: 20,

        alignItems: 'center'
    }
})