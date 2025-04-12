import { Text, TouchableOpacity, View } from "react-native";
import Icons from '@expo/vector-icons/Feather'
import { useContext } from "react";
import PageContext from "@/context/page.context";

interface PopupParams {
    text: string,
    buttonTitle: string
}

export default function Popup({text, buttonTitle}: PopupParams) {

    const pageContext = useContext(PageContext)

    if(!pageContext?.showPopup) {
        return(null)
    }

    return(
        <View style={

                {
                    zIndex: 1000,
                    backgroundColor: 'white',
                    paddingBlock: 44,
                    height: '140%',
                    width: '70%',
                    position: 'relative',
                    borderRadius: 10,
                }
            }>

            <Text style={
                {
                    textAlign: 'center',
                    fontSize: 13,
                    fontFamily: 'inknutAntiqua-regular',
                    lineHeight: 25
                }
            }>
                {text}
            </Text>

            <TouchableOpacity style=
                {
                    {
                        position: 'absolute',
                        bottom: -30,
                        borderRadius: 10,
                        left: 65,
                        right: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#255247',
                        width: '50%',
                        paddingBlock: 20
                    }
                }
                onPress={
                    () => { 
                        setTimeout(() => {
                            pageContext.setIsPositive(false)
                        }, 2000);
                        pageContext.setIsPositive(true),
                        pageContext.setShowPopup(false);
                    }
                }
            >
                <Text 
                    style=
                    {
                        {
                            color: 'white',
                        }
                    }
                >
                    SIM
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={
                    {
                        position: 'absolute',
                        right: 5,
                    }
                }
                onPress={
                    () => pageContext.setShowPopup(false)
                }
            >

                <Icons
                    name="x"
                    color='#6C3232'
                    size={25}
                />

            </TouchableOpacity>

        </View>
    )
}