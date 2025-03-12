import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ButtonToActionProps {
    buttonTitle: string,
    textStyle: {fontSize: number, color: string},
    buttonStyle: {backgroundColor: string},
    isDisabled: boolean,
    onPress?: () => void;
}

export default function ButtonToAction({buttonTitle, textStyle, buttonStyle, isDisabled, onPress}: ButtonToActionProps) {

    return(
        <TouchableOpacity 
            onPress={onPress}
            style={[{...buttonStyle}, buttonToActionStyle.button]}
            disabled={isDisabled}
        >
            <Text style={{...textStyle, fontFamily: 'inknutAntiqua-regular', textAlign: 'center', margin: 'auto'}}>{buttonTitle}</Text>
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