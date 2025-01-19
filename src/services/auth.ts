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
