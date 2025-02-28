import { BackHandler, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Table from "@/components/table";
import React, { useCallback, useContext, useEffect, useState } from "react";
import TableCard from "@/components/tableCard";
import { TableStatus } from "@/enum/TableStatus";
import { TablesEndpoint } from "@/fuctions/table.endpoint";
import { ITable } from "@/interface/ITable";
import { IApiResponse } from "@/interface/IApiResponse";
import { router, useFocusEffect, useNavigation } from "expo-router";
import UserContext from "@/context/user.context";

export default function TablesScreen() {

    const userContext = useContext(UserContext);

    const tablesEndpoint: TablesEndpoint = new TablesEndpoint();

    const [openTableCard, setOpenTableCard] = useState<boolean>(false);
    const [selectedTable, setSelectedTable] = useState<ITable>();


    const [tablesList, setTablesList] = useState<ITable[]>([]);

    const tableObject: {id: string, status: TableStatus }[] = [
        {id: "01", status: TableStatus.BUSY}, {id: "02", status: TableStatus.SLEEPING}, {id: "03", status: TableStatus.SLEEPING},
        {id: "04", status: TableStatus.SLEEPING},  {id: "05", status: TableStatus.BUSY},  {id: "06", status: TableStatus.BUSY}
    ];

    async function getAllTables() {
        const refreshToken: string|null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        if(!token) {
            console.log("Invalid token for getAllTables request (It may be expired)")
            router.replace('/(authentication)/login')
            return;
        }
        const apiResult: IApiResponse = await tablesEndpoint.getAll(token);
        if(apiResult.statusCode != 200) {
            return console.log(apiResult.data);
        };

        const tableList: ITable[] = apiResult.data;
        tableList.sort((a, b) => a.id - b.id);
        return setTablesList(tableList.reverse());

    }

    useFocusEffect(
        useCallback(() => {
            backToLoginScreen();
            getAllTables();
            setOpenTableCard(false);
        }, [])
    )

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => {
            setOpenTableCard(false);
            return true;
        })
    }, [])

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



    return(
        <View 
            style={ !openTableCard ? tableScreenStyle.container : tableScreenStyle.greyBackgroundContainer }
        >   

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
                                onTouchEnd={() => setOpenTableCard(true)}
                            >
                                <TouchableOpacity 
                                    key={element.id}
                                    onPressIn={() => setSelectedTable(element)}
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
        backgroundColor: '#181818',
    },

    greyBackgroundContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .7)',
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