import axios from "axios";

const DEFAULT_BASE_URL = "https://api.myregistry.com/v1";

const resolveBaseUrl = () => {
  const raw = (process.env.MYREGISTRY_BASE_URL || DEFAULT_BASE_URL).trim();
  return raw.replace(/\/+$/, "");
};

const ensureApiKey = () => {
  const apiKey = process.env.MYREGISTRY_API_KEY;
  if (!apiKey) {
    throw new Error("MYREGISTRY_API_KEY is not configured");
  }
  return apiKey;
};

const client = axios.create({
  baseURL: resolveBaseUrl(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "TaylorMadeBabyCo/Backend",
  },
});

client.interceptors.request.use((config) => {
  config.baseURL = resolveBaseUrl();
  const headerContainer = config.headers ?? {};

  if (typeof headerContainer.set === "function") {
    headerContainer.set("Authorization", `Bearer ${ensureApiKey()}`);
  } else {
    headerContainer.Authorization = `Bearer ${ensureApiKey()}`;
  }

  config.headers = headerContainer;
  return config;
});

const mapAxiosError = (error) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const details = error.response.data;
      const responseMessage =
        (typeof details === "string" && details) ||
        details?.message ||
        details?.error ||
        `MyRegistry request failed (${error.response.status})`;
      return new Error(responseMessage);
    }
    if (error.request) {
      return new Error("No response received from MyRegistry API");
    }
  }
  return new Error(error?.message || "Unexpected MyRegistry error");
};

const requireString = (value, fieldName) => {
  if (value === undefined || value === null) {
    throw new Error(`${fieldName} is required`);
  }
  const normalized = String(value).trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
};

const optionalTrimmedString = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }
  const normalized = String(value).trim();
  return normalized || undefined;
};

export async function getHealthCheck() {
  try {
    const { data } = await client.get("/health");
    return data;
  } catch (error) {
    throw mapAxiosError(error);
  }
}

export async function signupUser({ email, firstName, lastName } = {}) {
  const payload = {
    email: requireString(email, "email"),
    firstName: optionalTrimmedString(firstName),
    lastName: optionalTrimmedString(lastName),
  };

  if (!payload.firstName) delete payload.firstName;
  if (!payload.lastName) delete payload.lastName;

  try {
    const { data } = await client.post("/users/signup", payload);
    return data;
  } catch (error) {
    throw mapAxiosError(error);
  }
}

export async function getShippingAddress(registryId) {
  const id = requireString(registryId, "registryId");
  try {
    const { data } = await client.get(`/registries/${id}/shipping`);
    return data;
  } catch (error) {
    throw mapAxiosError(error);
  }
}

export async function setGiftAsPurchased({ registryId, itemId, orderId } = {}) {
  const id = requireString(registryId, "registryId");
  const normalizedItemId = requireString(itemId, "itemId");
  const normalizedOrderId = requireString(orderId, "orderId");

  try {
    const { data } = await client.post(`/registries/${id}/purchases`, {
      itemId: normalizedItemId,
      orderId: normalizedOrderId,
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
