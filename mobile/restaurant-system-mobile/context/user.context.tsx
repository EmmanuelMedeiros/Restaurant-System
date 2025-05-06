import { UserRole } from "@/enum/UserRole";
import { AuthEndpoint } from "@/fuctions/auth.endpoint";
import { createContext, useEffect, useState } from "react";

let role: UserRole|undefined;
let setRole: React.Dispatch<React.SetStateAction<UserRole | undefined>> = () => {};
let saveRefreshToken: (refreshToken: string) => Promise<void> = async () => {};
let saveOnCache: (key: string, value: any) => Promise<void> = async () => {};
let getRefreshToken: () => Promise<string|null> = async () => {return null};
let jwtToken: string|undefined;
let setJwtToken: React.Dispatch<React.SetStateAction<string | undefined>> = async () => {};
let generateJwtToken: (refreshToken: string|null) => Promise<string|null> = async (refreshToken: string|null) => {return null};

const UserContext = createContext(
    {
        role,
        setRole,
        saveRefreshToken,
        saveOnCache,
        getRefreshToken,
        jwtToken,
        setJwtToken,
        generateJwtToken
    }
)

export function UserContextProvider(props: React.PropsWithChildren) {

    const [role, setRole] = useState<UserRole|undefined>();
    const [jwtToken, setJwtToken] = useState<string>();

    useEffect(() => {
        getStoredData('role');
    }, [])

    const authEndpoint: AuthEndpoint = new AuthEndpoint();

    async function getStoredData(key: string) {
        const userRole = await authEndpoint.getStoredData(key);
        setRole(userRole as UserRole);
    }

    async function saveRefreshToken(refreshToken: string) {
        const insertOnCacheResponse = await authEndpoint.saveRefreshTokenOnCache(refreshToken);
        if(!insertOnCacheResponse) {
            console.log("Error while trying to cache token");
            return
        };
    }

    async function saveOnCache(key: string, value: any): Promise<void> {
        const insertOnCacheResponse = await authEndpoint.saveDataOnCache(key, value);
        if(!insertOnCacheResponse) {
            console.log("Error while trying to cache token");
            return
        };
    }

    async function generateJwtToken(refreshToken: string|null): Promise<string|null> {
        return await authEndpoint.generateJwtToken(refreshToken);
    }
    
    async function getRefreshToken(): Promise<string|null> {
        const storedRefreshToken = await authEndpoint.getStoredRefreshToken();
        if(!storedRefreshToken) {
            console.log("Error while trying to cache token");
            return null
        };
        return storedRefreshToken;
    }

    
    const context = {
        role,
        setRole,
        saveRefreshToken,
        saveOnCache,
        getRefreshToken,
        jwtToken,
        setJwtToken,
        generateJwtToken
    }

    return(
        <UserContext.Provider value={context}>{props.children}</UserContext.Provider>
    )
}


export default UserContext