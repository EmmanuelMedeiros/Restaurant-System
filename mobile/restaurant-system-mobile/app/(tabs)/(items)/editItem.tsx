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

export default function NewItem() {

    const userContext = useContext(UserContext);
    const itemCategoryEndpoint: ItemCategoryEndpoint = new ItemCategoryEndpoint();
    const itemEndpoint: ItemEndpoint = new ItemEndpoint();

    const [allCategories, setAllCategories]         = useState<IItemCategory[]>([]);
    const [selectedCategory, setSelectedCategory]   = useState<IItemCategory>();
    const [itemPrice, setItemPrice]                 = useState<string>("");
    const [itemName, setItemName]                   = useState<string>("");
    const [itemDescription, setItemDescription]     = useState<string>("");
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

    async function createItem() {
        const refreshToken: string|null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        if(selectedCategory) {
            const itemToCreate: CreateItemDTO = new CreateItemDTO(
                itemName,
                Number(itemPrice.replace(',', '.')),
                selectedCategory,
                itemDescription
            );

            const apiResponse: IApiResponse = await itemEndpoint.create(itemToCreate, token);
            if(apiResponse.statusCode !== 201) {
                console.log("Error while creating item: " + apiResponse.data);
                return; 
            }
            router.back();
            return;
        };

        console.log("You need to select a category to create an item!")
    }

    
    useFocusEffect(
      useCallback(() => {
        getAllCategories()
      }, [])
    )
    


    return(
        
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#181818', position: 'relative'}} behavior="position" enabled={enableKeyLifting}>

                <View style={newItemStyle.creationContainer}>

                    <Text style={{textAlign: 'center', marginTop: 40, fontSize: 18}}>CADASTRO DE ITEM</Text>
                    <View style={newItemStyle.blackHorizontalLine}/>

                    <ScrollView style={{position: 'relative'}}>

                        <View style={{width: '50%', marginInline: 'auto', position: 'absolute', right: '25%', left: '25%'}}>
                            <ProjectSelectInput
                                items={allCategories}
                                placeholder="Categorias"
                                selectedItem={selectedCategory}
                                setSelectItem={setSelectedCategory}
                                customFontSize={15}
                            />
                        </View>

                        <View style={{flexDirection: 'row', marginTop: 55 , justifyContent: "space-between", padding: 20, position: 'relative'}}>

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
                                setInputValue={setItemDescription}
                                customFontSize={15}
                                onFocusFunction={() => setEnableLifting(true)}
                            />
                        </View>

                    </ScrollView>


                </View>

                    <TouchableOpacity 
                             style={{paddingBlock: 30, marginBottom: 20, backgroundColor: '#255247', width: '90%', borderRadius: 10, marginInline: 'auto'}}
                            onPress={() => createItem()}
                        >
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, position: 'relative'}}>

                                <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>Adicionar Item</Text>

                                <Icons 
                                    name="check" 
                                    size={30}
                                    style={{position: 'absolute', right: 35 ,backgroundColor: '#D9D9D9', borderRadius: 100, width: 35, height: 35, padding: 3}}
                                />
                            </View>
                    </TouchableOpacity>

        </KeyboardAvoidingView>
    )
}

const newItemStyle = StyleSheet.create({

    creationContainer: {
        margin: 'auto',
        paddingBottom: 10,
        marginTop: 75,
        marginBottom: 25,

        width: '90%',
        height: '70%',

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