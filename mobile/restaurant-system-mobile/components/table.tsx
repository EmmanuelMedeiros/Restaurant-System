import { StyleSheet, Text, View } from "react-native"

interface TableProps {
    tableName: string
}

export default function Table({tableName}: TableProps) {
    return(
        <View style={{display: "flex", justifyContent: 'center', alignItems: 'center'}}>
            <View style={tableStyle.chair}/>

            <View style={{marginBlock: 5, display: "flex", flexDirection: 'row', alignItems: 'center'}}>

                <View style={tableStyle.verticalChair}/>
                <View style={tableStyle.table}/>
                <View style={tableStyle.verticalChair}/>

            </View>

            <View style={tableStyle.chair}/>
            <Text style={tableStyle.tableName}>{tableName}</Text>
        </View>
    )
}
const tableStyle = StyleSheet.create({
    chair: {
        width: 25,
        height: 3,
        backgroundColor: '#D9D9D9',

        borderRadius: 20
    },
    verticalChair: {
        width: 3,
        height: 25,
        backgroundColor: '#D9D9D9',

        margin: 5,

        borderRadius: 20
    },
    table: {
        width: 50,
        height: 50,

        borderRadius: '100%',
        
        backgroundColor: '#D9D9D9'
    },
    tableName: {
        color: 'white',
        
        marginTop: 7
    }
})  