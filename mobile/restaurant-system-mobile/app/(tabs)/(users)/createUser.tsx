import InputComponent from "@/components/inputComponent";
import { useContext, useState } from "react";
import { ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import Icons from '@expo/vector-icons/Feather';
import UserContext from "@/context/user.context";
import { AuthEndpoint } from "@/fuctions/auth.endpoint";
import { router } from "expo-router";
import { IApiResponse } from "@/interface/IApiResponse";
import { UserEndpoint } from "@/fuctions/user.endpoint";
import ProjectSelectInput from "@/components/projectSelectInput";
import { UserRole } from "@/enum/UserRole";
import CreateUserDTO from "@/dto/createUser.dto";

const blackboardBG = require('../../../assets/images/blackboard_bg.png');

export default function CreateUser() {

    const userContext = useContext(UserContext);

    const authEndpoint: AuthEndpoint = new AuthEndpoint();
    const userEndpoint: UserEndpoint = new UserEndpoint();

    const [email, setEmail] = useState<string>();
    const [userPwd, setUserPwd]   = useState<string>();
    const [userRole, setUserRole] = useState<{title: UserRole}>();

    const handleCreateUser = async (): Promise<void> => {
    
    let jwtToken: string|undefined = userContext.jwtToken;
    
        const isThisTokenValid = await authEndpoint.verifyJWTToken(jwtToken as string);
        if(!isThisTokenValid) {
    
          const refreshToken: string|null = await userContext.getRefreshToken();
          if(!refreshToken) {
            return router.replace('/(authentication)/login');
          };
          const newJwtToken: string|null = await userContext.generateJwtToken(refreshToken);
          if(!newJwtToken) {
            return router.replace('/(authentication)/login')
          };
          jwtToken = newJwtToken;
          
        }

        const userToCreate: CreateUserDTO = new CreateUserDTO(
            userPwd as string,
            userRole?.title as UserRole,
            email as string
        );

        console.log(userToCreate)
    
        const createUser: IApiResponse = await userEndpoint.create(userToCreate, jwtToken as string);
        if(createUser.statusCode !== 201) {
          return console.log("Error while trying to create new user: " + createUser.data);
        }else {
            router.back();
        }
    
      }

    return(
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

            <ImageBackground source={blackboardBG} style={ [{flex: 1, justifyContent: 'center', alignContent: 'center', width: '100%', height: '110%'}]} >

                <View
                    style={createUserStyles.boardContainer}
                >

                    <Text style={{textAlign: 'center', marginTop: 40, fontSize: 18}}>CADASTRO DE USUÁRIO</Text>
                    <View style={createUserStyles.blackHorizontalLine}/>
                    

                    <View style={{marginTop: 90}}>
                        <View style={{width: '90%', height: 55, marginInline: 'auto'}}>
                            <InputComponent
                                inputBgColor="#D9D9D9"
                                inputTextColor="#181818"
                                isNumeric={false}
                                isPassword={false}
                                placeholderText="Nome de usuário*"
                                setInputValue={setEmail}
                                customFontSize={15}
                            />
                        </View>

                        <View style={{width: '90%', height: 55, marginInline: 'auto', marginTop: 20}}>
                            <InputComponent
                                inputBgColor="#D9D9D9"
                                inputTextColor="#181818"
                                isNumeric={false}
                                isPassword={false}
                                placeholderText="Senha de acesso*"
                                setInputValue={setUserPwd}
                                customFontSize={15}
                            />
                        </View>


                        <View style={{width: '50%', marginInline: 'auto', marginTop: -70, position: 'absolute', right: '25%', left: '25%'}}>
                            <ProjectSelectInput
                                items={[{title: "admin"}, {title: "waiter"}]}
                                placeholder="Cargo"
                                selectedItem={userRole}
                                setSelectItem={setUserRole}
                                customFontSize={15}
                            />
                        </View>


                    </View>

                        <TouchableOpacity 
                            style={{paddingBlock: 30, marginBottom: -95, backgroundColor: '#255247', width: '100%', borderRadius: 10, marginInline: 'auto', left:0, right:0, position: 'absolute', bottom: 0}}
                            onPress={handleCreateUser}
                        >
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, position: 'relative'}}>

                                <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>Adicionar Usuário</Text>

                                <Icons 
                                    name="check" 
                                    size={30}
                                    style={{position: 'absolute', right: 35 ,backgroundColor: '#D9D9D9', borderRadius: 100, width: 35, height: 35, padding: 3}}
                                />
                            </View>
                        </TouchableOpacity>

                </View>

            </ImageBackground>

        </SafeAreaView>
    )
}

const createUserStyles = StyleSheet.create({
    
    boardContainer: {
        flexGrow: 1,
        alignContent: 'center',
        backgroundColor: '#C1C1C1',
    
        width: '90%',
        margin: 'auto',
        marginTop: 90,
        marginBottom: 200,
      },

      blackHorizontalLine: {
        width: '100%',
        height: 1,

        backgroundColor: '#171717',
        marginBlock: 25
      }

})