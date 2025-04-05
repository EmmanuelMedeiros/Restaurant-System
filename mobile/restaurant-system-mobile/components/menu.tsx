import { router } from "expo-router"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import { BackHandler } from "react-native";

import Icons from '@expo/vector-icons/Feather'
import { IItemCategory } from "@/interface/IItemCategory";
import { IItem } from "@/interface/IItem";
import { useContext, useEffect, useState } from "react";
import { IOrderItem } from "@/interface/IOrderItem";
import UserContext from "@/context/user.context";
import { IApiResponse } from "@/interface/IApiResponse";
import { ItemCategoryEndpoint } from "@/fuctions/itemCategory.endpoint";

const menuCategoryList: IItemCategory[] = [
    {id: 0, title: "TODOS"}, {id: 1, title: "ALMOÇO"}, {id: 2, title: "TIRA-GOSTO"}, {id: 3, title: "BEBIDAS"}, {id: 4, title: "GUARNIÇÕES"}
];

interface MenuProps {
    title: string,
    subtitle?: string
    posActionItemList: IItem[]|IOrderItem[],
    itemPressableIcon?: any[],
    pressableIconFunction?: any,
    itemList?: IItem[]|undefined,
    setItemList?: React.Dispatch<React.SetStateAction<IItem[]>>,
    orderItemList?: IOrderItem[]|undefined,
    setOrderItemList?: React.Dispatch<React.SetStateAction<IOrderItem[]>>,
    showHeader: boolean,
    goBackFunction?: () => void,
    bottomButton?: any[],
    isQuantityChangeable?: boolean
}

export default function Menu({bottomButton, title, subtitle, posActionItemList ,itemPressableIcon, pressableIconFunction, itemList, orderItemList, setOrderItemList, showHeader, goBackFunction, isQuantityChangeable}: MenuProps) {

    const userContext = useContext(UserContext);
    const itemCategoryEndpoint: ItemCategoryEndpoint = new ItemCategoryEndpoint();

    const [itemCategoryToShow, setItemCategoryToShow] = useState<number>(0);
    const [menuCategoryList, setMenuCategoryList]     = useState<IItemCategory[]>([]);

    const increaseItemQuantity = (index: number) => {
        if(orderItemList && setOrderItemList) {
            const newArray = orderItemList.map((element, pos) => {
                if(index === pos) {
                    element.quantity++
                };
                return element
            });
            setOrderItemList(newArray);
        }
        return;
    }

    const decreaseItemQuantity = (index: number) => {
        if(orderItemList && setOrderItemList) {
            const newArray = orderItemList.map((element, pos) => {
                if(index === pos && element.quantity > 1) {
                    element.quantity--
                };
                return element
            });
            setOrderItemList(newArray);
        }
        return;
    };

    async function getItemCategory() {
        try{
            const refreshToken: string|null = await userContext.getRefreshToken();
            const token = await userContext.generateJwtToken(refreshToken);

            const apiResponse: IApiResponse = await itemCategoryEndpoint.getAll(token);
            if(apiResponse.statusCode !== 200) {
                console.log(`Get ALL item categories endpoint failed | err: ${JSON.stringify(apiResponse.data)}`);
                return
            } else {
                setMenuCategoryList(apiResponse.data);
                return;
            }
        }catch(err) {
            console.log(err)
        }
    }

    useEffect(() => {

        getItemCategory();

        BackHandler.addEventListener("hardwareBackPress", () => {
            if(goBackFunction) {
                goBackFunction();
                return true;
            };
            router.back();
            return true;
        });
    }, [])

    return(
        <View style={entireMenuStyle.container}>

            {!goBackFunction
                ?
                    <TouchableOpacity
                        style={{position: 'absolute', right: 10, top: 10, zIndex: 10}}
                        onPress={() => router.back()}
                    >
                        <Icons name='x' 
                            size={30} 
                            color={'#6C3232'}
                        />
                    </TouchableOpacity>
                :
                    <TouchableOpacity
                        style={{position: 'absolute', left: 10, top: 20, zIndex: 10}}
                        onPress={goBackFunction}
                    >
                        <Icons name='chevron-left' 
                            size={30} 
                            color={'#171717'}
                        />
                    </TouchableOpacity>
            }

            <Text style={entireMenuStyle.title}>{title}</Text>
            <Text style={entireMenuStyle.subTitle}>{subtitle}</Text>

            <View style={entireMenuStyle.lighHorizontalLine}/>

            {showHeader
                ?
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        contentContainerStyle={{height: 90,}}
                        style={{ maxHeight: 50 }}
                    >
                        {menuCategoryList.map((element, index) => (
                            <TouchableOpacity 
                                key={index}
                                id={index.toString()}
                                style={entireMenuStyle.menuCategoryList}
                                onPressOut={() => setItemCategoryToShow(element.id)}
                            >
                                <Text style={itemCategoryToShow === element.id ? {fontWeight: 'bold', textDecorationLine: 'underline'} : null }>{element.title.toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                :
                    null
            }

            {showHeader
                ?
                    <View style={{marginTop: -30}}>
                        <View style={entireMenuStyle.blackHorizontalLine}/>
                    </View>
                :
                    null
            }

            <ScrollView
            contentContainerStyle={{paddingBottom: 20}}
                showsVerticalScrollIndicator={true}
            >

                {itemList?.filter(x => itemCategoryToShow === 0 ? x.category.id !== itemCategoryToShow : x.category.id === itemCategoryToShow).map((element, index) => (
                    <View
                        key={index}
                    >
                        <View 
                            style={entireMenuStyle.eachItem}
                            key={element.id}
                        >
                            <Text>R$ {Number(element.price).toFixed(2)}</Text>
                            <Text style={[entireMenuStyle.itemName, 
                                posActionItemList.find(x => x === element) ? {textDecorationLine: 'line-through'} : null
                            ]}>{element.name.toUpperCase()}</Text>

                            {itemPressableIcon
                                ?
                                    <TouchableOpacity
                                        onPress={() => pressableIconFunction(element)}
                                    >  

                                        {!posActionItemList.find(x => x === element) ? itemPressableIcon[0] : itemPressableIcon[1]}
                                    </TouchableOpacity>
                                :
                                    null
                            }

                        </View>
                        <View style={{marginBlock: -15}}>
                            <View style={entireMenuStyle.lighHorizontalLine}/>
                        </View>
                    </View>
                ))}

                
                {orderItemList?.filter(x => itemCategoryToShow === 0 ? x.item.category.id !== itemCategoryToShow : x.item.category.id === itemCategoryToShow).map((element, index) => (
                    <View
                        key={index}
                    >
                        <View 
                            style={entireMenuStyle.eachItem}
                            key={element.item.id}
                        >   

                            <View style={{alignItems: 'center', gap: 8}}>

                                <TouchableOpacity 
                                    style={!isQuantityChangeable ? {display: 'none'} : null}
                                    onPress={() => increaseItemQuantity(index)}
                                >
                                    <Icons name="chevron-up" size={20} style={{padding: 3}}/>
                                </TouchableOpacity>

                                <Text>QTD.: {element.quantity}</Text>
                                
                                <TouchableOpacity 
                                    style={!isQuantityChangeable ? {display: 'none'} : null}
                                    onPress={() => decreaseItemQuantity(index)}
                                >
                                    <Icons name="chevron-down" size={20} style={{padding: 3}}/>
                                </TouchableOpacity>
                                
                                <Text>R$ {Number(element.item.price * element.quantity).toFixed(2)}</Text>

                            </View>


                            <Text style={[entireMenuStyle.itemName, 
                                posActionItemList.find(x => x === element) ? {textDecorationLine: 'line-through'} : null
                            ]}>{element.item.name.toUpperCase()}</Text>

                            {itemPressableIcon
                                ?
                                    <TouchableOpacity style={{ padding: 10 }}
                                        onPress={() => pressableIconFunction(element)}
                                    >  
    
                                        {!posActionItemList.find(x => x === element) ? itemPressableIcon[0] : itemPressableIcon[1]}
                                    </TouchableOpacity>
                                :
                                    null
                            }

                        </View>
                        <View style={{marginBlock: -15}}>
                            <View style={entireMenuStyle.lighHorizontalLine}/>
                        </View>
                    </View>
                ))} 

                {bottomButton?.map((element, index) => (
                    <View key={index} style={{width: '100%', height: 80, marginInline: 'auto', marginTop: 20}}>
                        {element}
                    </View>
                ))
                }

            </ScrollView>

        </View>
    )
}

const entireMenuStyle = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginTop: 20,

        fontSize: 25,
        fontWeight: 'bold'
    },

    subTitle: {
        textAlign: 'center',

        fontSize: 18
    },

    container: {
       backgroundColor: '#C1C1C1',

       height: '95%',
       width: '100%',


       position: 'relative'
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

    menuCategoryList: {
        marginInline: 10,

        paddingInline: 10
    },

    eachItem: {
        paddingInline: 20,

        flexDirection: 'row',
        justifyContent: 'space-between',

        alignItems: 'center'
    },

    itemPrice: {
        fontSize: 13,
    },

    addIcon: {
        color: '#255247',
        fontSize: 30,

        padding: 10,
    },

    itemName: {
        width: 165,
        
        fontSize: 13,

        marginRight: -20,
        textAlign: 'left'
    },

    notShow: {
        display: 'none'
    }
})