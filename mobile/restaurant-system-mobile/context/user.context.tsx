import { UserRole } from "@/enum/UserRole";
import { AuthEndpoint } from "@/fuctions/auth.endpoint";
import { createContext, useState } from "react";

let role: UserRole|undefined;
let setRole: React.Dispatch<React.SetStateAction<UserRole | undefined>> = () => {};
let refreshToken: string|undefined;
let saveRefreshToken: (refreshToken: string) => Promise<void> = async () => {};
let getRefreshToken: () => Promise<string|null> = async () => {return null};
let jwtToken: string|undefined;
let setJwtToken: React.Dispatch<React.SetStateAction<string | undefined>> = () => {};

const UserContext = createContext(
    {
        role,
        setRole,
        refreshToken,
        saveRefreshToken,
        getRefreshToken,
        jwtToken,
        setJwtToken
    }
)

export function UserContextProvider(props: React.PropsWithChildren) {

    const [role, setRole] = useState<UserRole|undefined>();
    const [jwtToken, setJwtToken] = useState<string>();

    const authEndpoint: AuthEndpoint = new AuthEndpoint();

    async function saveRefreshToken(refreshToken: string) {

        const insertOnCacheResponse = await authEndpoint.saveRefreshTokenOnCache(refreshToken);
        if(!insertOnCacheResponse) {
            console.log("Error while trying to cache token");
            return
        };
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
        refreshToken,
        setRole,
        saveRefreshToken,
        getRefreshToken,
        jwtToken,
        setJwtToken
    }

    return(
        <UserContext.Provider value={context}>{props.children}</UserContext.Provider>
    )
}


export default UserContext