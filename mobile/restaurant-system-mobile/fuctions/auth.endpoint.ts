import { AuthUserDTO } from "@/dto/authUser.dto";
import { IApiResponse } from "@/interface/IApiResponse";
import axios from "axios";

import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthEndpoint {
    private apiUrl: string|undefined

    constructor() {
        this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    };

    async authenticate(userToAuthenticate: AuthUserDTO): Promise<IApiResponse> {
        
        let apiResponse: IApiResponse;

        const apiResult: IApiResponse = await axios.post(`${this.apiUrl}/auth`, userToAuthenticate)
        .then((response) => {
            return apiResponse = {data: response.data.data, statusCode: response.data.status}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });

        return apiResult;
    };

    async saveRefreshTokenOnCache(refreshToken: string): Promise<boolean> {
        try {
            await AsyncStorage.setItem("refreshToken", refreshToken);
            return true;
        }catch(err) {
            console.log(err);
            return false;
        };
    };

    async getStoredRefreshToken(): Promise<string|null> {
        try {
            const refreshToken: string|null = await AsyncStorage.getItem("refreshToken");
            return refreshToken;
        }catch(err) {
            console.log(err);
            return null;
        }
    }

}