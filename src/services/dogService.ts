import axios from "axios";

export const fetchDogsAsync = async (page?: string) => {
  try {
    const apiEndpointWithParams = page ? page : "/dogs/search";
    const response = await axios.get(
      `https://frontend-take-home-service.fetch.com${apiEndpointWithParams}`,
      {
        withCredentials: true,
      }
    );
    const dogList = await fetchDogs(response.data.resultIds);
    return {
      dogs: dogList,
      next: response.data.next,
      prev: response.data.prev,
      status: "OK",
    };
  } catch (error) {
    console.error("Error fetching dogs:", error);
    return { status: "NOK", message: "", payload: JSON.stringify(error) };
  }
};

const fetchDogs = async (dogIds: Array<string>) => {
  try {
    const response = await axios.post(
      "https://frontend-take-home-service.fetch.com/dogs",
      dogIds,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("fetchDogs", error);
    throw new Error(JSON.stringify(error));
  }
};

export const fetchBreedsAsync = async () => {
  try {
    const response = await axios.get(
      "https://frontend-take-home-service.fetch.com/dogs/breeds",
      {
        withCredentials: true,
      }
    );
    return { breeds: response.data, status: "OK" };
  } catch (error) {
    console.error("Error fetching breeds:", error);
    return { status: "NOK", message: "", payload: JSON.stringify(error) };
  }
};

export const generateMatchAsync = async (favoriteList: Array<string>) => {
  try {
    const response = await axios.post(
      "https://frontend-take-home-service.fetch.com/dogs/match",
      favoriteList,
      { withCredentials: true }
    );
    return { status: "OK", match: response.data.match };
  } catch (error) {
    console.error("Error generating match:", error);
    return { status: "NOK", message: "", payload: JSON.stringify(error) };
  }
};
