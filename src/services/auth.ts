import axios from "axios";
import { LoginCredentials } from "../@types/types";

export const login = async ({ name, email }: LoginCredentials) => {
  const responseObject = {
    isSuccess: false,
    payload: null,
    error: { message: "" },
  };
  try {
    const response = await axios.post(
      "https://frontend-take-home-service.fetch.com/auth/login",
      {
        name,
        email,
      },
      { withCredentials: true }
    );
    console.log(response);
    responseObject.isSuccess = true;
  } catch (error) {
    console.error("Login failed:", error);
    responseObject.error = {
      message: "Authentication failed. Please try later.",
    };
  }
  return responseObject;
};

export const logout = async () => {
  try {
    const response = await axios.post(
      "https://frontend-take-home-service.fetch.com/auth/logout",
      { withCredentials: true }
    );
    return { status: "OK" };
  } catch (error) {
    console.error("Logout failed:", error);
    return {
      status: "NOK",
      message: "Unable to log out. Please try again later.",
    };
  }
};
