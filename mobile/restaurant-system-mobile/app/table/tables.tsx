import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Table from "../component/table";
import { useEffect, useState } from "react";
import TableCard from "../component/tableCard";
import { TableStatus } from "../enum/TableStatus";
import { TablesEndpoint } from "../fuctions/tables/table.endpoint";
import { ITable } from "../interface/ITable";
import { IApiResponse } from "../interface/IApiResponse";

export default function TablesScreen() {

    const tablesEndpoint: TablesEndpoint = new TablesEndpoint();

    const [openTableCard, setOpenTableCard] = useState<boolean>(false);
    const [selectedTable, setSelectedTable] = useState<ITable>();

    const [tablesList, setTablesList] = useState<ITable[]>([]);

    const tableObject: {id: string, status: TableStatus }[] = [
        {id: "01", status: TableStatus.BUSY}, {id: "02", status: TableStatus.SLEEPING}, {id: "03", status: TableStatus.SLEEPING},
        {id: "04", status: TableStatus.SLEEPING},  {id: "05", status: TableStatus.BUSY},  {id: "06", status: TableStatus.BUSY}
    ];

    async function getAllTables() {
        const apiResult: IApiResponse = await tablesEndpoint.getAll();
        if(apiResult.statusCode != 200) {
            return console.log(apiResult.data);
        };

        const tableList: ITable[] = apiResult.data;
        tableList.sort((a, b) => a.id - b.id);
        return setTablesList(tableList);

    }

    useEffect(() => {
        getAllTables();
    }, [])

    return(
        <SafeAreaView 
            style={ !openTableCard ? tableScreenStyle.container : tableScreenStyle.greyBackgroundContainer }
        >   
        
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
                        {tablesList.reverse().map((element) => (
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

            <View style={[tableScreenStyle.tableCard, !openTableCard ? tableScreenStyle.notShow : null]}>
                <TableCard
                    table={selectedTable}
                    setShow={setOpenTableCard}
                />
            </View>

        </SafeAreaView>
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