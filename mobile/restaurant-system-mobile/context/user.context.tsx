import { UserRole } from "@/enum/UserRole";
import { createContext, useState } from "react";

let role: UserRole|undefined;
let setRole: React.Dispatch<React.SetStateAction<UserRole | undefined>> = () => {};
let refreshToken: string|undefined;
let saveRefreshToken: () => Promise<void> = async () => {};
let jwtToken: string|undefined;
let setJwtToken: React.Dispatch<React.SetStateAction<string | undefined>> = () => {}

const UserContext = createContext(
    {
        role,
        setRole,
        refreshToken,
        saveRefreshToken,
        jwtToken,
        setJwtToken
    }
)

export function UserContextProvider(props: React.PropsWithChildren) {

    const [role, setRole] = useState<UserRole|undefined>();
    const [jwtToken, setJwtToken] = useState<string>();

    async function saveRefreshToken() {
        return;
    }

    const context = {
        role,
        refreshToken,
        setRole,
        saveRefreshToken,
        jwtToken,
        setJwtToken
    }

    return(
        <UserContext.Provider value={context}>{props.children}</UserContext.Provider>
    )
}


export default UserContext