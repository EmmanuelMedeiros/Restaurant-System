import { IApiResponse } from "@/interface/IApiResponse";
import { IItem } from "@/interface/IItem";
import axios from "axios";

export class ItemEndpoint {
    private apiUrl: string|undefined

    constructor() {
        this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    };

    async getAll(): Promise<IApiResponse> {
        
        let apiResponse: IApiResponse;

        const apiResult = await axios.get(`${this.apiUrl}/item`)
        .then((response) => {
            return apiResponse = {data: response.data, statusCode: 200}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });
        return apiResult;
    }
}