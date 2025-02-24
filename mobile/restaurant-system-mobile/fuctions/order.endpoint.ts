import { CreateOrderDTO } from "@/dto/create-order.dto";
import { IApiResponse } from "@/interface/IApiResponse";
import { IOrder } from "@/interface/IOrder";
import { IOrderItem } from "@/interface/IOrderItem";
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

    async getByTableID(tableID: number): Promise<IApiResponse> {

        let apiResponse: IApiResponse;

        const apiResult = await axios.get(`${this.apiUrl}/order?tableID=${tableID}`)
        .then((response) => {
            return apiResponse = {data: response.data, statusCode: 200}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });
        return apiResult;
    }

    async getSpecificOrderItems(orderID: string): Promise<IApiResponse> {
        
        let apiResponse: IApiResponse;

        const apiResult = await axios.get(`${this.apiUrl}/order/order-items/${orderID}`)
        .then((response) => {
            return apiResponse = {data: response.data, statusCode: 200}
        })
        .catch((err) => {
            return apiResponse = {data: err.response.data.message, statusCode: err.response.status};
        });
        return apiResult;
    }
}