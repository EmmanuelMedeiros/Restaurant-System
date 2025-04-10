import { BackHandler, ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Table from "@/components/table";
import React, { useCallback, useContext, useEffect, useState } from "react";
import TableCard from "@/components/tableCard";
import { TablesEndpoint } from "@/fuctions/table.endpoint";
import { ITable } from "@/interface/ITable";
import { IApiResponse } from "@/interface/IApiResponse";
import { router, useFocusEffect } from "expo-router";
import UserContext from "@/context/user.context";
import { AuthEndpoint } from "@/fuctions/auth.endpoint";

const blackboardBG = require('../../../assets/images/blackboard_bg.png')

export default function TablesScreen() {

    const userContext = useContext(UserContext);

    const tablesEndpoint: TablesEndpoint = new TablesEndpoint();
    const authEndpoint: AuthEndpoint = new AuthEndpoint();

    const [openTableCard, setOpenTableCard] = useState<boolean>(false);
    const [selectedTable, setSelectedTable] = useState<ITable>();

    const [ticks, setTicks]                   = useState<number>(0);
    const [stopRefreshing, setStopRefreshing] = useState<boolean>(false);

    const [tablesList, setTablesList] = useState<ITable[]>([]);

    async function getAllTables() {

        const storedRefreshToken: string|null = await userContext.getRefreshToken();
        let jwtToken: string|null = "";

        if(storedRefreshToken) {
            const verifyJWT: boolean = await authEndpoint.verifyJWTToken(userContext.jwtToken as string);

            if(!verifyJWT) {
                const refreshToken: string|null = await userContext.getRefreshToken();
                const token = await userContext.generateJwtToken(refreshToken);
                jwtToken = token;
                userContext.setJwtToken(token as string);

                if(!token) {
                    console.log("Invalid token for getAllTables request (It may be expired)")
                    router.replace('/(authentication)/login')
                    return;
                }

            }
        } else {
            console.log("SEM TOKEN")
            router.replace('/(authentication)/login')
            return;
        };

        const apiResult: IApiResponse = await tablesEndpoint.getAll(jwtToken as string);
        if(apiResult.statusCode != 200) {
            return console.log(apiResult.data);
        };

        const tableList: ITable[] = apiResult.data;
        tableList.sort((a, b) => a.id - b.id);
        return setTablesList(tableList.reverse());

    }

    useFocusEffect(
        useCallback(() => {
            getAllTables();
            backToLoginScreen();
            setOpenTableCard(false);
            
            setStopRefreshing(false);
            setTicks((prev) => (prev += 1))

            return(() => {
                setStopRefreshing(true);
            }) 
        }, [])
    )

    BackHandler.addEventListener("hardwareBackPress", () => {
        setOpenTableCard(false);
        return true;
    })

    async function backToLoginScreen() {

        const userJWTRefreshToken: string|null = await userContext.getRefreshToken();

        if(!userJWTRefreshToken) {
            router.replace('/(authentication)/login');
            return;
        }
        return;

    }

    useEffect(() => {
        getAllTables();
    }, []) 

    useEffect(() => {
        if(!stopRefreshing) {
            setTimeout(() => {
                getAllTables()
                setTicks((prev) => (prev += 1))
            }, 3000);
        }
    }, [ticks])

    return(
        <View 
            style={tableScreenStyle.container}
        >   
        
            <ImageBackground source={blackboardBG} style={ [{flex: 1, justifyContent: 'center', width: '100%', height: '110%'}, openTableCard ? {opacity: .7} : null] }>
        
                <StatusBar hidden={true}/>

                <Pressable 
                    style={{height: '80%', width: '90%'}}
                    onPressIn={() => setOpenTableCard(false)}    
                >
                    <ScrollView horizontal={true}>
                        <ScrollView 
                            style={tableScreenStyle.tableScroll}
                            horizontal={true}
                            alwaysBounceVertical={true}
                            showsHorizontalScrollIndicator={true}
                            contentContainerStyle={{flexWrap: "wrap", width: '105%', flexDirection: 'column', justifyContent: "flex-end"}}
                        >
                            {tablesList.map((element) => (
                                <View 
                                    style={tableScreenStyle.tableList}
                                    key={element.id}
                                >
                                    <TouchableOpacity 
                                        key={element.id}
                                        onLongPress={() => {setOpenTableCard(true) , setSelectedTable(element)}}
                                    >
                                        <Table
                                            tableName={element.name}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </ScrollView>
                </Pressable>

            </ImageBackground>

            <View style={[tableScreenStyle.tableCard, !openTableCard ? tableScreenStyle.notShow : {display: 'flex'}]}>
                    <TableCard
                        table={selectedTable}
                        setShow={setOpenTableCard}
                    />
                </View>

        </View>
    )

}


const tableScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        paddingBottom: 80,
    },

    tableList: {
        marginBlock: 10,
        marginInline: 20,
    },
    
    tableScroll: {
        width: '100%',  
    },

    tableCard: {

        height: '30%',
        width: '100%',

        position: 'absolute',
        zIndex: 10,
        
    },

    notShow: {
        display: 'none'
    }
})