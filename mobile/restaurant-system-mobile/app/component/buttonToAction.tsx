import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ButtonToActionProps {
    buttonTitle: string,
    textStyle: {fontSize: number, color: string},
    buttonStyle: {backgroundColor: string}
}

export default function ButtonToAction({buttonTitle, textStyle, buttonStyle}: ButtonToActionProps) {
    return(
        <TouchableOpacity style={[{...buttonStyle}, buttonToActionStyle.button]}>
            <Text style={{...textStyle, fontWeight: 'bold'}}>{buttonTitle}</Text>
        </TouchableOpacity>
    )
}

const buttonToActionStyle = StyleSheet.create({

    button: {
        padding: 20,
        borderRadius: 10
    }

})