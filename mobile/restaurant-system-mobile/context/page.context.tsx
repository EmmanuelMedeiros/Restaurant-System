import Popup from '@/components/popup';
import { createContext, useState } from 'react';
import { Text, View } from 'react-native';

interface PageContextType {
    showPopup: boolean;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setPopupSettings: React.Dispatch<React.SetStateAction<{ title: string, buttonTitle: string } | undefined>>;
    isPositive: boolean,
    setIsPositive: React.Dispatch<React.SetStateAction<boolean>>
}


const PageContext = createContext<PageContextType | undefined>(undefined);

export function PageContextProvider(props: React.PropsWithChildren) {

    const [showPopup, setShowPopup]         = useState(false);
    const [popupSettings, setPopupSettings] = useState<{title: string, buttonTitle: string}>();
    const [isPositive, setIsPositive]       = useState<boolean>(false);

    const context = {
        showPopup,
        setShowPopup,
        setPopupSettings,
        isPositive,
        setIsPositive
    }

    return(
        <PageContext.Provider value={context}>
            <View style={{position: 'absolute', height: 100, right: 0, left: 0, justifyContent: 'center', alignItems: 'center', marginBlock: 'auto', margin: 'auto', top: '30%'}}>
             <Popup
                 text={popupSettings?.title as string}
                 buttonTitle={popupSettings?.buttonTitle as string}
             />
            </View>
            {props.children}
        </PageContext.Provider>
    )

}

export default PageContext;