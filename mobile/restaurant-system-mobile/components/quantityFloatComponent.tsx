import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

interface FloatProps {
    quantity: number,
    icon: any,
    floatAction: () => void
}

export default function QuantityFloatComponent({quantity, icon, floatAction}: FloatProps) {
    return(
        <View style={quantityFloatComponentStyle.container}>
            <TouchableOpacity
                onPress={floatAction}
            >
                <View style={{width: 25, height: 25, borderRadius: '100%', backgroundColor: '#171717', position: 'absolute', right: 0, top: 0, marginTop: -15, zIndex: 10}}>
                    <Text style={{margin: 'auto', color: '#C1C1C1'}}>{quantity || 0}</Text>
                </View>
                {icon}
            </TouchableOpacity>
        </View>
    )

}

const quantityFloatComponentStyle = StyleSheet.create({
    container: {
        position: 'absolute', 
        bottom: 50, 
        left: 40, 
        width: 50,
    }
})