import UserContext from "@/context/user.context";
import { ItemCategoryEndpoint } from "@/fuctions/itemCategory.endpoint";
import { IApiResponse } from "@/interface/IApiResponse";
import { IItemCategory } from "@/interface/IItemCategory";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TextBase, TextInput, TouchableOpacity, View } from "react-native";

import Icons from '@expo/vector-icons/Feather'
import ProjectSelectInput from "@/components/projectSelectInput";
import InputComponent from "@/components/inputComponent";

import Constants from 'expo-constants';
import { ItemEndpoint } from "@/fuctions/item.endpoint";
import { CreateItemDTO } from "@/dto/create-item.dto";

export default function NewCategory() {

    const userContext = useContext(UserContext);
    const itemCategoryEndpoint: ItemCategoryEndpoint = new ItemCategoryEndpoint();
    const itemEndpoint: ItemEndpoint = new ItemEndpoint();

    const [categoryTitle, setCategoryTitle]   = useState<string>("");

    async function createCategory() {
        const refreshToken: string|null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        const apiResponse: IApiResponse = await itemCategoryEndpoint.create(categoryTitle, token);
        if(apiResponse.statusCode !== 200) {
            console.log("Erro em createCategory endpoint: " + apiResponse.data);
            return;
        }
        router.back();
        return;
    }

    return(
        
        <View style={{flex: 1, backgroundColor: '#181818', position: 'relative'}}>

                <View style={newItemStyle.creationContainer}>

                    <Text style={{textAlign: 'center', marginTop: 40, fontSize: 18}}>CADASTRO DE CATEGORIA</Text>
                    <View style={newItemStyle.blackHorizontalLine}/>

                    <ScrollView style={{position: 'relative'}}>

                        <View style={{flexDirection: 'row', marginTop: 55 , justifyContent: "space-between", padding: 20, position: 'relative'}}>

                            <View style={{width: '100%', height: 60}}>
                                <InputComponent
                                    inputBgColor="#D9D9D9"
                                    inputTextColor="#181818"
                                    isNumeric={false}
                                    isPassword={false}
                                    placeholderText="Nome da categoria"
                                    setInputValue={setCategoryTitle}
                                    customFontSize={15}
                                />
                            </View>

                        </View>

                    </ScrollView>


                </View>

                    <TouchableOpacity 
                             style={{paddingBlock: 30, marginBottom: 20, backgroundColor: '#255247', width: '90%', borderRadius: 10, marginInline: 'auto'}}
                             onPress={() => createCategory()}
                        >
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, position: 'relative'}}>

                                <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>Adicionar Categoria</Text>

                                <Icons 
                                    name="check" 
                                    size={30}
                                    style={{position: 'absolute', right: 35 ,backgroundColor: '#D9D9D9', borderRadius: 100, width: 35, height: 35, padding: 3}}
                                />
                            </View>
                    </TouchableOpacity>

        </View>
    )
}

const newItemStyle = StyleSheet.create({

    creationContainer: {
        margin: 'auto',
        marginTop: 95,
        marginBottom: 25,


        width: '90%',
        height: '60%',

        backgroundColor: '#C1C1C1',
    },

    lighHorizontalLine: {
        backgroundColor: '#A8A8A8',

        width: '100%',
        height: 1,
        marginBlock: 25
    },

    blackHorizontalLine: {
        width: '100%',
        height: 1,

        backgroundColor: '#171717',
        marginBlock: 25
    },
})