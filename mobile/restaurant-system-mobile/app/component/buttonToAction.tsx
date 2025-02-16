import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ButtonToActionProps {
    buttonTitle: string,
    textStyle: {fontSize: number, color: string},
    buttonStyle: {backgroundColor: string},
    isDisabled: boolean
}

export default function ButtonToAction({buttonTitle, textStyle, buttonStyle, isDisabled}: ButtonToActionProps) {
    return(
        <TouchableOpacity 
            style={[{...buttonStyle}, buttonToActionStyle.button]}
            disabled={isDisabled}
        >
            <Text style={{...textStyle, fontWeight: 'bold', textAlign: 'center', margin: 'auto'}}>{buttonTitle}</Text>
        </TouchableOpacity>
    )
}

const buttonToActionStyle = StyleSheet.create({

    button: {
        width: '100%',
        height: '100%',

        textAlign: 'center',

        borderRadius: 10
    }

})