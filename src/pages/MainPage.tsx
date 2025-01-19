import React, { useState, useEffect } from "react";
import axios from "axios";
import DogCard from "../components/DogCard";
import { Dog, DogFilter, Pagination } from "../@types/types";

const MainPage = () => {
  const [dogs, setDogs] = useState<Array<Dog>>([]);
  const [breeds, setBreeds] = useState<Array<string>>([]);
  const [favorites, setFavorites] = useState<Array<string>>([]);
  const [pagination, setPagination] = useState<Pagination>({
    prev: "",
    next: "",
  });
  const [filters, setFilters] = useState<DogFilter>({
    breeds: [],
    sort: "breed:asc",
    size: 20,
  });

  // Fetch dogs based on filters and sort
  const fetchDogIds = async (page = "") => {
    try {
      const apiEndpointWithParams = page ? page : "/dogs/search";
      const response = await axios.get(
        `https://frontend-take-home-service.fetch.com${apiEndpointWithParams}`,
        {
          withCredentials: true,
        }
      );
      fetchDogs(response.data.resultIds);
      setPagination({ next: response.data.next, prev: response.data.prev });
    } catch (error) {
      console.error("Error fetching dogs:", error);
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
      setDogs(response.data);
    } catch (error) {
      console.error("Error fetching dog details:", error);
    }
  };

  // Fetch available dog breeds
  const fetchBreeds = async () => {
    try {
      const response = await axios.get(
        "https://frontend-take-home-service.fetch.com/dogs/breeds",
        {
          withCredentials: true,
        }
      );
      setBreeds(response.data);
      // return response.data;
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  // Handle filter changes like breed or sort
  const handleFilterChange = (e: { target: { value: string } }) => {
    setFilters((prevFilters) => ({ ...prevFilters, breed: e.target.value }));
  };

  const handleSortChange = (e: { target: { value: string } }) => {
    setFilters((prevFilters) => ({ ...prevFilters, sort: e.target.value }));
  };

  const toggleFavorite = (dogId: string) => {
    if (favorites.includes(dogId)) {
      setFavorites(favorites.filter((id) => id !== dogId));
    } else {
      setFavorites([...favorites, dogId]);
    }
  };

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) {
      alert("Please select at least one favorite dog!");
      return;
    }
    try {
      const response = await axios.post(
        "https://frontend-take-home-service.fetch.com/dogs/match",
        favorites,
        { withCredentials: true }
      );
      alert(`Your match is dog ID: ${response.data.match}`);
    } catch (error) {
      console.error("Error generating match:", error);
    }
  };

  useEffect(() => {
    const paramsData: DogFilter = { ...filters };
    // paramsData.breed = "French Bulldog";
    // if (!paramsData.breed) {
    //   delete paramsData.breed;
    // }
    // if (!paramsData.size) {
    //   delete paramsData.size;
    // }
    // if (!paramsData.sort) {
    //   delete paramsData.sort;
    // }
    const queryParams = ""; //new URLSearchParams(paramsData);
    fetchDogIds(`/dogs/search?${queryParams.toString()}`);
  }, [filters]);

  useEffect(() => {
    fetchBreeds();
  }, []);

  return (
    <div id="main-page">
      <h1>Dog Search</h1>

      {/* Breed Filter */}
      <div>
        <label>Filter by Breed: </label>
        <select
          id="filter-by-breed"
          name="filter-by-breed"
          // value={filters.breed}
          onChange={handleFilterChange}
        >
          {breeds.map((breed) => (
            <option value={breed}>{breed}</option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div>
        <label>Sort By: </label>
        <select onChange={handleSortChange} value={filters.sort}>
          <option value="breed:asc">Breed: Ascending</option>
          <option value="breed:desc">Breed: Descending</option>
          <option value="name:asc">Name: Ascending</option>
          <option value="name:desc">Name: Descending</option>
        </select>
      </div>

      {/* Display dog list */}
      <div>
        {dogs.map((dog) => (
          <DogCard
            key={dog.id}
            dog={dog}
            toggleFavorite={toggleFavorite}
            isFavorite={favorites.includes(dog.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div>
        {pagination.prev && (
          <button onClick={() => fetchDogIds(pagination.prev)}>Previous</button>
        )}
        {pagination.next && (
          <button onClick={() => fetchDogIds(pagination.next)}>Next</button>
        )}
      </div>

      {/* Generate Match Button */}
      <button onClick={handleGenerateMatch}>Generate Match</button>
    </div>
  );
};

export default MainPage;
