/* eslint-disable no-unused-vars */
import { createContext } from "react";

let dynamicBaseAPI = import.meta.env.VITE_BASE_API;
let dynamicBaseURL = import.meta.env.VITE_BASE_URL;

export const ApiUrl = createContext(dynamicBaseAPI);

export const UrlBaseBackend = createContext(dynamicBaseURL);
export const api = dynamicBaseAPI;
export const baseApi = dynamicBaseAPI;
export const baseUrl = dynamicBaseURL;
