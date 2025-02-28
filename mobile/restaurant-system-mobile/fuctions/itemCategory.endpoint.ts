import { IApiResponse } from "@/interface/IApiResponse";
import axios from "axios";

export class ItemCategoryEndpoint {
    private apiUrl: string|undefined

    constructor() {
        this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    };

    async getAll(jwtToken: string|null): Promise<IApiResponse> {
        
        let apiResponse: IApiResponse;

        const apiResult = await axios.get(`${this.apiUrl}/item-category`, 
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            }
        )
        .then((response) => {
            return apiResponse = {data: response.data, statusCode: 200}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });
        return apiResult;
    }
}