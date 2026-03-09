import axios from "axios"
import { getContentType } from "./api.helper"

const API = process.env.NEXT_PUBLIC_API_URL

export const api = axios.create({
  baseURL: API,
  headers: getContentType(),
  withCredentials: true
})

// Auth uses httpOnly cookies; no need to set Authorization header

export default api