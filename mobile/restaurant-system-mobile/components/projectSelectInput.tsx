import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, SafeAreaView } from 'react-native'

import Icons from '@expo/vector-icons/Ionicons'
import { useState } from 'react'

interface SelectProps {
    placeholder: string,
    items: Array<any>,
    setSelectItem: any, //setState do item
    selectedItem: any, //estado do item (useState)
    setListClick?: React.Dispatch<React.SetStateAction<boolean>>,
    customFontSize?: number
}

export default function ProjectSelectInput({placeholder, items, setSelectItem, selectedItem, setListClick, customFontSize}: SelectProps) {

    const [showContent, setShowContent] = useState<boolean>(false)

    return(
        <SafeAreaView style={{zIndex: 999}}>

            <TouchableOpacity 
                style={selectInput.input}
                onPressOut={() => setShowContent((prev: boolean) => (!prev))}
                >
                <Text style={[selectInput.inputText, {fontSize: customFontSize || 15}]}>{selectedItem == undefined ? placeholder : selectedItem.title}</Text>

                <View
                    >
                    <Icons
                        name={!showContent ? 'chevron-down' : 'chevron-up'}
                        size={25}
                    />
                </View>

            </TouchableOpacity>

        
            <FlatList
                showsVerticalScrollIndicator={false}
                style={showContent ? selectInput.openTab : selectInput.closedTab}
                data={items} 
                alwaysBounceVertical={true}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}: any) => {
                    
                    const listLength: number = items.length
                    let separatorLine: boolean = false 

                    index + 1 == listLength ? separatorLine = true : false

                    return(
                        <View style={selectInput.itemContainer}>
                        <TouchableOpacity onPress={() => {setSelectItem(item), setShowContent(false), setListClick ? setListClick((prev: boolean) => (!prev)) : null}}>
                            <Text numberOfLines={0}> 
                                {item.title}
                            </Text>
                        </TouchableOpacity>

                        <View style={ separatorLine ? {display: 'none'} : {borderBottomWidth: 1, borderBottomColor: '#181818', opacity: .2, marginTop: 15}}/>

                        </View>
                        
                    )
                }}
            />

        </SafeAreaView>
    )
}


const selectInput = StyleSheet.create({
    input: {
        paddingVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',

        gap: 20,

        marginLeft: 20,
        
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    inputText: {
        color: 'black',
        opacity: .5,
        textAlign: 'center',
    },
    openTab: {
        width: '100%',
        display: 'flex',
        height: 'auto',

        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        
        backgroundColor: '#c1c1c1',
        borderColor: '#181818',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },
    closedTab: {
        opacity: 0,
        display: 'none'
    },
    itemContainer: {
        paddingVertical: 15,
        paddingHorizontal: 15,
    }
})