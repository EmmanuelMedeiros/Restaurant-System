import UserContext from "@/context/user.context";
import { UserRole } from "@/enum/UserRole";
import { AuthEndpoint } from "@/fuctions/auth.endpoint";
import { router } from "expo-router";
import { useContext, useEffect } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const blackboardBG = require('../../../assets/images/blackboard_bg.png')

export default function MainUser() {

    const userContext = useContext(UserContext);

    const authEndpoint: AuthEndpoint = new AuthEndpoint();

    const onHandleLogout = () => {
        userContext.setJwtToken('');
        authEndpoint.clearStoredRefreshToken();
        router.replace('/(authentication)/login');
    }; 

    return(
        <SafeAreaView style={{flex: 1}}>

            <ImageBackground source={blackboardBG} style={ [{flex: 1, justifyContent: 'center', width: '100%', height: '110%'}]} >
    
            <View style={mainUserStyles.buttonsContainer}>

                <TouchableOpacity 
                    style={userContext.role === UserRole.ADMIN ? mainUserStyles.touchableOpacityStyle : mainUserStyles.dontShow}
                    onPress={() => router.push('/(tabs)/(users)/createUser')}    
                >
                    <Text style={{textAlign: 'center', fontFamily: 'inknutAntiqua-regular', color: '#C1C1C1'}}>Adicionar Usuário</Text>
                </TouchableOpacity>
            
                <TouchableOpacity 
                    style={userContext.role === UserRole.ADMIN ? mainUserStyles.touchableOpacityStyle : mainUserStyles.dontShow}
                    onPress={() => router.push('/(tabs)/(users)/editUser')}
                >
                    <Text style={{textAlign: 'center', fontFamily: 'inknutAntiqua-regular', color: '#C1C1C1'}}>Editar Usuário</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={mainUserStyles.touchableOpacityStyle}
                    onPress={onHandleLogout}
                >
                    <Text style={{textAlign: 'center', fontFamily: 'inknutAntiqua-regular', color: '#C1C1C1'}}>Sair da conta</Text>
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
    },

    dontShow: {
        display: 'none'
    }
})