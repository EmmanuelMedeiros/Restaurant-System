import { IApiResponse } from '@/interface/IApiResponse';
import axios from 'axios';

export class TablesEndpoint {

    private apiUrl: string|undefined

    constructor() {
        this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    }


    async getAll(jwtToken: string): Promise<IApiResponse> {

        let apiResponse: IApiResponse;

        const apiResult = await axios.get(`${this.apiUrl}/table`, 
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
    };

    async getOne(id: number, jwtToken: string|null): Promise<IApiResponse> {
        let apiResponse: IApiResponse;

        const apiResult = await axios.get(`${this.apiUrl}/table/${id}`, 
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