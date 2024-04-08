import axios from "axios";

import Logger from "./logger";

import { IHttpClient, IHttpClientResp } from "../src/types";

const httpClient = async ({
  endPoint = "",
  method = "get",
  body = {},
  headers,
}: IHttpClient) => {
  const payload = {
    url: endPoint,
    method: method,
    headers: headers || {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...(body && { data: body }),
  };

  try {
    const { success, message, statusText, ...rest }: IHttpClientResp = await axios(payload);

    return {
      success: true,
      message: statusText,
      ...rest,
    };
  } catch (error: any) {
    Logger.info(
      `httpClient | endPoint - ${endPoint} | Error Message - ${error.message}`
    );

    const { success, message, statusText, ...rest }: IHttpClientResp = error;

    return {
      success: false,
      message,
      ...rest,
    };
  }
};

export default httpClient;
