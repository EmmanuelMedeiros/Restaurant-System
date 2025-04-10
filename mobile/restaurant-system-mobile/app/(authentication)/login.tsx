import ButtonToAction from "@/components/buttonToAction";
import InputComponent from "@/components/inputComponent";
import UserContext from "@/context/user.context";
import { AuthUserDTO } from "@/dto/authUser.dto";
import { UserRole } from "@/enum/UserRole";
import { AuthEndpoint } from "@/fuctions/auth.endpoint";
import { IApiResponse } from "@/interface/IApiResponse";
import { parseSync } from "@babel/core";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Login() {

    const authEndpoint: AuthEndpoint = new AuthEndpoint();
    const userContext = useContext(UserContext);

    const [loginCredential, setLoginCredential] = useState<string>("");
    const [pwdCredential, setPwdCredential]     = useState<string>("");

    async function authenticateUser() {

        const userToAuth: AuthUserDTO = new AuthUserDTO(
            loginCredential,
            pwdCredential
        );

        const apiResult: IApiResponse = await authEndpoint.authenticate(userToAuth);
        if(apiResult.statusCode !== 200) {
            console.log("Erro no login: " + apiResult.data);
            return;
        }

        userContext.saveRefreshToken(apiResult.data.refreshToken);
        userContext.setJwtToken(apiResult.data.jwtToken)
        router.replace('/(tabs)/(tables)');
        return
    }
    return(
        <SafeAreaView style={loginStyle.container}>

            <View style={{width: '80%', height: 60, gap: 20}}>

                <Text style={{color: 'white', marginBottom: 60, marginTop: -150, fontSize: 25, marginInline: 'auto', justifyContent: 'center', alignItems: 'center'}}>RESTAURANT SYSTEM</Text>

                <View>
                    <InputComponent
                        isNumeric={false}
                        isPassword={false}
                        placeholderText="Login"
                        setInputValue={setLoginCredential}
                        inputBgColor="#6C3232"
                        inputTextColor="#FFFFFF"
                    />
                </View>

                <View>
                    <InputComponent
                        isNumeric={false}
                        isPassword={true}
                        placeholderText="Password"
                        setInputValue={setPwdCredential}
                        inputBgColor="#6C3232"
                        inputTextColor="#FFFFFF"
                    />
                </View>

                <View >
                    <ButtonToAction
                        buttonStyle={
                            {
                                backgroundColor: '#255247'
                            }
                        }
                        buttonTitle="LOGIN"
                        onPress={() => authenticateUser()}
                        isDisabled={false}
                        textStyle={
                            {
                                color: '#FFFFFF',
                                fontSize: 15
                            }
                        }
                    />
                </View>

            </View>

        </SafeAreaView>
    )
}

const loginStyle = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#181818',
    }

})