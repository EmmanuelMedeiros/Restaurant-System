import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import EntireMenuComponent from "../component/entireMenu";

export default function CreateOrder() {
    return(
        <SafeAreaView style={createOrderStyle.container}>

            <View style={createOrderStyle.menuComponent}>
                <EntireMenuComponent/>
            </View>

        </SafeAreaView>
    )
}

const createOrderStyle = StyleSheet.create({
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