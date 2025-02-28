import UserContext from "@/context/user.context";
import { ItemCategoryEndpoint } from "@/fuctions/itemCategory.endpoint";
import { IApiResponse } from "@/interface/IApiResponse";
import { IItemCategory } from "@/interface/IItemCategory";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, TextBase, TextInput, TouchableOpacity, View } from "react-native";

import Icons from '@expo/vector-icons/Feather'
import ProjectSelectInput from "@/components/projectSelectInput";
import InputComponent from "@/components/inputComponent";

import Constants from 'expo-constants';

export default function NewItem() {

    const userContext = useContext(UserContext);
    const itemCategoryEndpoint: ItemCategoryEndpoint = new ItemCategoryEndpoint();

    const [allCategories, setAllCategories]         = useState<IItemCategory[]>([]);
    const [selectedCategory, setSelectedCategory]   = useState<IItemCategory>();
    const [itemPrice, setItemPrice]                 = useState<string>("");
    const [itemName, setItemName]                   = useState<string>();
    const [enableKeyLifting, setEnableLifting]      = useState<boolean>(false);

    async function getAllCategories() {
        const refreshToken: string|null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        const apiResponse: IApiResponse = await itemCategoryEndpoint.getAll(token);
        if(apiResponse.statusCode !== 200) {
            console.log("Erro em getAllCategories endpoint: " + apiResponse.data);
            return;
        }
        setAllCategories(apiResponse.data);
        return;
    }
    
    useFocusEffect(
      useCallback(() => {
        getAllCategories()
      }, [])
    )
    
    useEffect(() => {
        console.log(allCategories)
    }, [allCategories])

    return(
        
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#181818', position: 'relative'}} behavior="position" enabled={enableKeyLifting}>

                <View style={newItemStyle.creationContainer}>

                    <Text style={{textAlign: 'center', marginTop: 40, fontSize: 18}}>CADASTRO DE ITEM</Text>
                    <View style={newItemStyle.blackHorizontalLine}/>

                    <View style={{width: '80%', marginInline: 'auto'}}>
                        <ProjectSelectInput
                            items={allCategories}
                            placeholder="Categorias"
                            selectedItem={selectedCategory}
                            setSelectItem={setSelectedCategory}
                            customFontSize={15}
                        />
                    </View>

                    <View style={{flexDirection: 'row', justifyContent: "space-between", padding: 20, position: 'relative'}}>

                        <View style={{width: '70%', height: 60}}>
                            <InputComponent
                                inputBgColor="#D9D9D9"
                                inputTextColor="#181818"
                                isNumeric={false}
                                isPassword={false}
                                placeholderText="Nome do item"
                                setInputValue={setItemName}
                                customFontSize={15}
                                onFocusFunction={() => setEnableLifting(false)}
                            />
                        </View>

                        <View style={{width: '25%', height: 60}}>
                            <InputComponent
                                inputBgColor="#D9D9D9"
                                inputTextColor="#181818"
                                isNumeric={true}
                                isPassword={false}
                                placeholderText="R$"
                                setInputValue={setItemPrice}
                                customFontSize={15}
                                onFocusFunction={() => setEnableLifting(false)}
                            />
                        </View>
                    </View>

                    <Text style={{textAlign: 'center', marginTop: 10, fontSize: 15}}>DESCRIÇÃO DO ITEM </Text>
                    <Text style={{textAlign: 'center', marginBottom: 20, fontSize: 15}}>(NÃO OBRIGATÓRIO)</Text>

                    <View style={{width: '90%', height: 170, marginInline: 'auto'}}>
                        <InputComponent
                            inputBgColor="#D9D9D9"
                            inputTextColor="#181818"
                            isNumeric={false}
                            isPassword={false}
                            placeholderText="Descrição"
                            setInputValue={setItemPrice}
                            customFontSize={15}
                            onFocusFunction={() => setEnableLifting(true)}
                        />
                    </View>

                </View>

        </KeyboardAvoidingView>
    )
}

const newItemStyle = StyleSheet.create({

    creationContainer: {
        margin: 'auto',
        marginBlock: 100,
        paddingBottom: 10,

        width: '90%',
        height: '75%',

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