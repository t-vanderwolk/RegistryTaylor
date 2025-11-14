import axios from "axios";

const BASE_URL = (process.env.MYREGISTRY_BASE_URL || "https://api.myregistry.com/v1").replace(/\/$/, "");
const API_KEY = process.env.MYREGISTRY_API_KEY;

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((config) => {
  if (!API_KEY) {
    throw new Error("MYREGISTRY_API_KEY is not configured");
  }
  config.headers.Authorization = `Bearer ${API_KEY}`;
  return config;
});

const mapAxiosError = (error) => {
  if (error.response) {
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      `MyRegistry request failed (${error.response.status})`;
    return new Error(message);
  }
  if (error.request) {
    return new Error("No response received from MyRegistry API");
  }
  return new Error(error.message || "Unexpected MyRegistry error");
};

export async function getHealthCheck() {
  try {
    const { data } = await client.get("/health");
    return data;
  } catch (error) {
    throw mapAxiosError(error);
  }
}

export async function signupUser({ email, firstName, lastName }) {
  if (!email) {
    throw new Error("Email is required");
  }
  try {
    const { data } = await client.post("/users/signup", {
      email,
      firstName,
      lastName,
    });
    return data;
  } catch (error) {
    throw mapAxiosError(error);
  }
}

export async function getShippingAddress(registryId) {
  if (!registryId) {
    throw new Error("registryId is required");
  }
  try {
    const { data } = await client.get(`/registries/${registryId}/shipping`);
    return data;
  } catch (error) {
    throw mapAxiosError(error);
  }
}

export async function setGiftAsPurchased({ registryId, itemId, orderId }) {
  if (!registryId || !itemId || !orderId) {
    throw new Error("registryId, itemId, and orderId are required");
  }
  try {
    const { data } = await client.post(`/registries/${registryId}/purchases`, {
      itemId,
      orderId,
    });
    return data;
  } catch (error) {
    throw mapAxiosError(error);
  }
}

export default {
  getHealthCheck,
  signupUser,
  getShippingAddress,
  setGiftAsPurchased,
};
