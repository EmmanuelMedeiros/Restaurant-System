import CreateUserDTO from "@/dto/createUser.dto";
import { IApiResponse } from "@/interface/IApiResponse";
import axios from "axios";

export class UserEndpoint {

    private apiUrl: string|undefined;

    constructor() {
        this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    };

    async getAll(jwtToken: string): Promise<IApiResponse> {
        
        let apiResponse: IApiResponse;

        const apiResult: IApiResponse = await axios.get(`${this.apiUrl}/user`, 
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            }
        )
        .then((response) => {
            return apiResponse = {data: response.data, statusCode: response.status}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });

        return apiResult;
    };

    async create(createUserDTO: CreateUserDTO, jwtToken: string): Promise<IApiResponse> {

        let apiResponse: IApiResponse;

        const apiResult: IApiResponse = await axios.post(`${this.apiUrl}/user`, createUserDTO, 
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            }
        )
        .then((response) => {
            return apiResponse = {data: response.data, statusCode: response.status}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });

        return apiResult;

    }
}