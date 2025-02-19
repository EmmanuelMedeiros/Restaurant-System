import { CreateOrderDTO } from "@/dto/create-order.dto";
import { IApiResponse } from "@/interface/IApiResponse";
import { IOrder } from "@/interface/IOrder";
import axios from "axios";

export class OrderEndpoint {
    private apiUrl: string|undefined

    constructor() {
        this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    };

    async create(order: CreateOrderDTO): Promise<IApiResponse> {
        
        let apiResponse: IApiResponse;

        const apiResult = await axios.post(`${this.apiUrl}/order`, order)
        .then((response) => {
            return apiResponse = {data: response.data, statusCode: 201}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });
        return apiResult;
    }
}