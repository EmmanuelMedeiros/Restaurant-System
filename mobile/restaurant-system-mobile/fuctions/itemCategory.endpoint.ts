import { IApiResponse } from "@/interface/IApiResponse";
import axios from "axios";

export class ItemCategoryEndpoint {
  private apiUrl: string | undefined;

  constructor() {
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL;
  }

  async delete(id: string | number, jwtToken: string | null): Promise<IApiResponse> {
    let apiResponse: IApiResponse;

    const apiResult = await axios
      .delete(`${this.apiUrl}/item-category/${id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        return (apiResponse = { data: response.data, statusCode: 200 });
      })
      .catch((err) => {
        return (apiResponse = {
          data: err.response.data.message,
          statusCode: err.response.status,
        });
      });
    return apiResult;
  }

  async getAll(jwtToken: string | null): Promise<IApiResponse> {
    let apiResponse: IApiResponse;

    const apiResult = await axios
      .get(`${this.apiUrl}/item-category`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        return (apiResponse = { data: response.data, statusCode: 200 });
      })
      .catch((err) => {
        return (apiResponse = {
          data: err.response.data.message,
          statusCode: err.response.status,
        });
      });
    return apiResult;
  }

  async create(
    categoryTitle: string,
    jwtToken: string | null
  ): Promise<IApiResponse> {
    let apiResponse: IApiResponse;

    const newCategory = { title: categoryTitle };

    const apiResult = await axios
      .post(`${this.apiUrl}/item-category`, newCategory, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        return (apiResponse = { data: response.data, statusCode: 200 });
      })
      .catch((err) => {
        return (apiResponse = {
          data: err.response.data.message,
          statusCode: err.response.status,
        });
      });
    return apiResult;
  }
}
