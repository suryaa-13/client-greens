import axios from "axios";

export const safeGet = async <T>(url: string, params?: Record<string, unknown>): Promise<T | null> => {
  try {
    const res = await axios.get<T>(url, { params });
    return res.data;
  } catch (error: unknown) {
    if (error instanceof axios.AxiosError && error.response?.status === 404) {
      // ❗ NOT an error → data just doesn't exist
      return null;
    }
    console.error("API Error:", error);
    return null;
  }
};
