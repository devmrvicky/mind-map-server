import axios, { AxiosInstance } from "axios";
import { env } from "../env/env";
import {logger} from "./logger.config"

export const openrouter: AxiosInstance = axios.create({
  baseURL: env.OPENROUTER_BASE_URL, // OpenRouter API base
  timeout: 15000, // 15s timeout
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.OPENROUTER_API_KEY}`, // API Key
  },
});

// Response interceptor
openrouter.interceptors.response.use(
  (response) => response.data,
  (error) => {
    logger.error("OpenRouter Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);
