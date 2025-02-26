import { AuthUserDTO } from "@/dto/authUser.dto";
import { IApiResponse } from "@/interface/IApiResponse";
import axios from "axios";

export class AuthEndpoint {
    private apiUrl: string|undefined

    constructor() {
        this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    };

    async authenticate(userToAuthenticate: AuthUserDTO): Promise<IApiResponse> {
        
        let apiResponse: IApiResponse;

        const apiResult: IApiResponse = await axios.post(`${this.apiUrl}/auth`, userToAuthenticate)
        .then((response) => {
            return apiResponse = {data: response.data, statusCode: response.data.status}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });

        return apiResult;
    }
}