import { CreateOrderDTO } from "@/dto/create-order.dto";
import { CreateOrderItemDTO } from "@/dto/create-orderItem.dto";
import { IApiResponse } from "@/interface/IApiResponse";
import { IOrder } from "@/interface/IOrder";
import { IOrderItem } from "@/interface/IOrderItem";
import axios from "axios";

export class OrderEndpoint {
    private apiUrl: string|undefined

    constructor() {
        this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
    };

    async create(order: CreateOrderDTO, jwtToken: string|null): Promise<IApiResponse> {
        
        console.log(order)
        let apiResponse: IApiResponse;
        

        const apiResult = await axios.post(`${this.apiUrl}/order`, order, 
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

    async getByTableID(tableID: number, jwtToken: string|null): Promise<IApiResponse> {

        let apiResponse: IApiResponse;

        const apiResult = await axios.get(`${this.apiUrl}/order?tableID=${tableID}`, 
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

    async getSpecificOrderItems(orderID: string, jwtToken:string|null): Promise<IApiResponse> {
        
        let apiResponse: IApiResponse;

        const apiResult = await axios.get(`${this.apiUrl}/order/order-items/${orderID}`, 
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

    async manipulateOrderItems(orderUUID: string, orderItems: IOrderItem[]|CreateOrderItemDTO[], jwtToken:string|null): Promise<IApiResponse> {
        let apiResponse: IApiResponse;

        const apiResult = await axios.put(`${this.apiUrl}/order/update_item/${orderUUID}`, orderItems,
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