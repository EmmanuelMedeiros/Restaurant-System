import { router } from "expo-router";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const blackboardBG = require('../../../assets/images/blackboard_bg.png')

export default function MainUser() {
    return(
        <SafeAreaView style={{flex: 1}}>

            <ImageBackground source={blackboardBG} style={ [{flex: 1, justifyContent: 'center', width: '100%', height: '110%'}]} >
    
            <View style={mainUserStyles.buttonsContainer}>

                <TouchableOpacity 
                    style={mainUserStyles.touchableOpacityStyle}
                    onPress={() => router.push('/(tabs)/(users)/createUser')}    
                >
                    <Text style={{textAlign: 'center', fontFamily: 'inknutAntiqua-regular', color: '#C1C1C1'}}>Adicionar Usuário</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={mainUserStyles.touchableOpacityStyle}
                    onPress={() => router.push('/(tabs)/(users)/editUser')}
                >
                    <Text style={{textAlign: 'center', fontFamily: 'inknutAntiqua-regular', color: '#C1C1C1'}}>Editar Usuário</Text>
                </TouchableOpacity>

            </View>

            </ImageBackground>

        </SafeAreaView>
    )
}

const mainUserStyles = StyleSheet.create({
    buttonsContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
    },

    touchableOpacityStyle: {
        backgroundColor: '#333333',
        width: '80%',
        height: 50,
        justifyContent: 'center',

        borderRadius: 10
    }
})