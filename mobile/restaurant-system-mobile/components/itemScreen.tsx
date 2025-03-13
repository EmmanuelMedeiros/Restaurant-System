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

import { ItemEndpoint } from "@/fuctions/item.endpoint";
import { CreateItemDTO } from "@/dto/create-item.dto";
import { UpdateItemDTO } from "@/dto/update-item.dto";
import { TablesEndpoint } from "@/fuctions/table.endpoint";

interface EditItemProps {
    currentItemID: number,
    currentItemCategory: IItemCategory,
    currentItemPrice: string,
    currentItemName: string,
    currentItemDescription: string,
    isEditing: boolean,
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ItemScreen({currentItemID, currentItemCategory, currentItemDescription, currentItemName, currentItemPrice, isEditing, setIsEditing}: EditItemProps) {

    const userContext = useContext(UserContext);
    const itemCategoryEndpoint: ItemCategoryEndpoint = new ItemCategoryEndpoint();
    const itemEndpoint: ItemEndpoint = new ItemEndpoint();

    const [allCategories, setAllCategories]         = useState<IItemCategory[]>([]);
    const [selectedCategory, setSelectedCategory]   = useState<IItemCategory>(currentItemCategory);
    const [itemPrice, setItemPrice]                 = useState<string>(currentItemPrice);
    const [itemName, setItemName]                   = useState<string>(currentItemName);
    const [itemDescription, setItemDescription]     = useState<string>(currentItemDescription);
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
            )

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

    async function editItem() {
        const refreshToken: string|null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        if(selectedCategory) {
            const itemToEdit: UpdateItemDTO = new UpdateItemDTO(
                currentItemID,
                itemName,
                Number(itemPrice.replace(',', '.')),
                selectedCategory,
                itemDescription
            );

            const apiResponse: IApiResponse = await itemEndpoint.edit(itemToEdit, token)
            if(apiResponse.statusCode !== 200) {
                console.log("Error while creating item: " + apiResponse.data);
                return; 
            }
            setIsEditing(false);
            return;
        };
    }

    async function deleteItem() {
        const refreshToken: string|null = await userContext.getRefreshToken();
        const token = await userContext.generateJwtToken(refreshToken);

        if(currentItemID) {
            const apiResponse: IApiResponse = await itemEndpoint.delete(currentItemID, token);
            if(apiResponse.statusCode !== 200) {
                console.log("Error while deleting item: " + apiResponse.data);
                return; 
            }
            setIsEditing(false);
        };
        return;
    };

    
    useFocusEffect(
      useCallback(() => {
        getAllCategories()
      }, [])
    )
    

    return(
        
        <KeyboardAvoidingView style={{flex: 1, backgroundColor: '#181818', position: 'relative'}} behavior="position" enabled={enableKeyLifting}>

                <View style={newItemStyle.creationContainer}>

                    <Text style={{textAlign: 'center', marginTop: 40, fontSize: 18}}>{isEditing ? "EDIÇÃO DE ITEM" : "CADASTRO DE ITEM" }</Text>
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
                                    placeholderText={ currentItemName || "Nome do item"}
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
                                    placeholderText={"R$ " + currentItemPrice || "R$"}
                                    setInputValue={setItemPrice}
                                    customFontSize={11}
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
                                placeholderText={currentItemDescription || "Descrição"}
                                setInputValue={setItemDescription}
                                customFontSize={15}
                                onFocusFunction={() => setEnableLifting(true)}
                            />
                        </View>

                    </ScrollView>


                </View>
                    
                    <TouchableOpacity 
                             style={{paddingBlock: 10, marginBottom: 5, backgroundColor: '#255247', width: '90%', borderRadius: 10, marginInline: 'auto'}}
                             onPress={() => {isEditing ? editItem() : createItem()}}
                        >
                            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, position: 'relative'}}>

                                <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>{isEditing ? "Editar" : "Adicionar Item"}</Text>

                                <Icons 
                                    name="check" 
                                    size={30}
                                    style={{position: 'absolute', right: 35 ,backgroundColor: '#D9D9D9', borderRadius: 100, width: 35, height: 35, padding: 3}}
                                />
                            </View>
                    </TouchableOpacity>

                    {isEditing 
                        ?
                            <TouchableOpacity 
                                style={{paddingBlock: 10, backgroundColor: '#6C3232', width: '90%', borderRadius: 10, marginInline: 'auto'}}
                                onPress={() => deleteItem()}
                            >
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, position: 'relative'}}>

                                   <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>Deletar</Text>

                                   <Icons 
                                       name="x" 
                                       size={30}
                                       style={{position: 'absolute', left: 35 ,backgroundColor: '#D9D9D9', borderRadius: 100, width: 35, height: 35, padding: 3}}
                                   />
                                </View>
                            </TouchableOpacity>
                        :
                            null
                    }
                    


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