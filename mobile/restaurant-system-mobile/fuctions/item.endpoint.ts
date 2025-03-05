import { CreateItemDTO } from "@/dto/create-item.dto";
import { UpdateItemDTO } from "@/dto/update-item.dto";
import { IApiResponse } from "@/interface/IApiResponse";
import { IItem } from "@/interface/IItem";
import axios from "axios";

export class ItemEndpoint {
    private apiUrl: string|undefined

    constructor() {
        this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    };

    async getAll(jwtToken: string|null): Promise<IApiResponse> {
        let apiResponse: IApiResponse;

        const apiResult = await axios.get(`${this.apiUrl}/item`, 
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

    async create(item: CreateItemDTO, jwtToken: string|null): Promise<IApiResponse> {
        let apiResponse: IApiResponse;

        const apiResult = await axios.post(`${this.apiUrl}/item`, item,
            {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            }
        )
        .then((response) => {
            return apiResponse = {data: response.data, statusCode: 201}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });
        return apiResult;
    }

    async edit(item: UpdateItemDTO, jwtToken: string|null): Promise<IApiResponse> {
        let apiResponse: IApiResponse;

        const apiResult = await axios.put(`${this.apiUrl}/item/${item.id}`, item,
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

        console.log(item)

        return apiResult;
    }
}