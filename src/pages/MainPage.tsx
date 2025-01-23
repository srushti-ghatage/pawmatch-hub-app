/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import DogCard from "../components/DogCard";
import { Dog, DogFilter, Pagination } from "../@types/types";
import Header from "../components/Header";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Form,
  Modal,
  CloseButton,
} from "react-bootstrap";
import BasicPagination from "../components/BasicPagination";
import {
  fetchBreedsAsync,
  fetchDogsAsync,
  generateMatchAsync,
} from "../services/dogService";
import {
  DEFAULT_FILTERS,
  SORT_BY_OPTIONS,
} from "../constants/DropdownConstants";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { mergeListItemsById, sortListBasedOnFilter } from "../utils/listUtils";

const MainPage = () => {
  const navigate = useNavigate();
  const [dogs, setDogs] = useState<Array<Dog>>([]);
  const allDogs = useRef<Array<Dog>>([]);
  const [breeds, setBreeds] = useState<Array<string>>([]);
  const [zipCodes, setZipCodes] = useState<Array<string>>([]);
  const [favorites, setFavorites] = useState<Array<string>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>({
    show: false,
    message: "",
    toRedirect: false,
  });
  const [pagination, setPagination] = useState<Pagination>({
    prev: "",
    next: "",
  });
  const [filters, setFilters] = useState<DogFilter>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showMatchFoundModal, setShowMatchFoundModal] = useState(false);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    fetchDogs();
    fetchBreeds();
  }, []);

  useEffect(() => {
    const availableZipCodes = dogs.map((dog) => dog.zip_code);
    setZipCodes(availableZipCodes);
  }, [dogs]);

  const fetchDogs = async (page?: string) => {
    const dogResponse = await fetchDogsAsync(page);
    if (dogResponse.status === "OK") {
      // This makes sure that the sorting filter is persisted across every fetch dog API call
      // since I am not passing sort filter to the API to avoid discrepancies in the list
      handleSortEvent(filters.sort, dogResponse.dogs);
      // setDogs(dogResponse.dogs);
      setPagination({
        next: dogResponse.next,
        prev: dogResponse.prev,
      });
      setTimeout(() => {
        containerRef?.current?.scrollIntoView({ behavior: "smooth" });
      }, 1000);
    } else {
      setError({ show: true, message: dogResponse.message, toRedirect: true });
    }
    setIsLoading(false);
  };

  // Fetch available dog breeds
  const fetchBreeds = async () => {
    const breedsResponse = await fetchBreedsAsync();
    if (breedsResponse.status === "OK") {
      setBreeds(breedsResponse.breeds);
    } else {
      setError({
        show: true,
        message: breedsResponse.message,
        toRedirect: true,
      });
    }
  };

  const handleZipCodeFilterChange = (zipCode: string) => {
    const selectedZipCodes = [...filters.zipCodes];
    const zipCodeIndex = selectedZipCodes.findIndex((code) => code === zipCode);
    if (zipCodeIndex < 0) {
      selectedZipCodes.push(zipCode);
    } else {
      selectedZipCodes.splice(zipCodeIndex, 1);
    }
    setFilters({ ...filters, zipCodes: selectedZipCodes });
  };

  const handleBreedsFilterChange = (breed: string) => {
    const selectedBreeds = [...filters.breeds];
    const breedIndex = selectedBreeds.findIndex((code) => code === breed);
    if (breedIndex < 0) {
      selectedBreeds.push(breed);
    } else {
      selectedBreeds.splice(breedIndex, 1);
    }
    setFilters({ ...filters, breeds: selectedBreeds });
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
    const matchResponse = await generateMatchAsync(favorites);
    if (matchResponse.status === "OK") {
      const match = allDogs.current.filter(
        (dog) => dog.id === matchResponse.match
      )[0];
      if (match) {
        setMatchedDog(match);
        setShowMatchFoundModal(true);
      } else {
        setError({
          show: true,
          message: "Something went wrong. Please try again later",
          toRedirect: false,
        });
      }
    } else {
      setError({
        show: true,
        message: matchResponse.message,
        toRedirect: true,
      });
    }
  };

  const handleLogout = async () => {
    // eslint-disable-next-line no-restricted-globals
    const result = confirm("Are you sure you want to logout?");
    if (result) {
      const response = await logout();
      if (response.status === "OK") {
        navigate("/login");
      } else {
        setError({ show: true, message: response.message, toRedirect: true });
      }
    }
  };

  const handleApplyFiltersClick = () => {
    let params = "?";
    Object.keys(filters).map((key) => {
      if (key === "breeds" && filters.breeds?.length > 0) {
        const breedsString = encodeURIComponent(filters.breeds.join(","));
        params += `${key}=${breedsString}&`;
      } else if (key === "zipCodes" && filters.breeds?.length > 0) {
        const zipCodesString = encodeURIComponent(filters.zipCodes.join(","));
        params += `${key}=${zipCodesString}&`;
      } else if (key === "sort" && filters.sort) {
        // params += `${key}=${filters.sort}&`;
      } else if (key === "ageMax" && filters.ageMax) {
        params += `${key}=${filters.ageMax}&`;
      } else if (key === "ageMin" && filters.ageMin) {
        params += `${key}=${filters.ageMin}&`;
      } else if (key === "size" && filters.size) {
        params += `${key}=${filters.size}&`;
      }
    });
    setShowFilters(false);
    const url = `/dogs/search${params}`;
    fetchDogs(url);
  };

  const handleResetFiltersClick = () => {
    setFilters({ ...DEFAULT_FILTERS, sort: filters.sort });
    fetchDogs();
  };

  const handleSortEvent = (sortBy: string, dogList: Array<Dog>) => {
    const sortedList = sortListBasedOnFilter(sortBy, dogList);
    allDogs.current = mergeListItemsById(allDogs.current, sortedList);
    setDogs([...sortedList]);
    setFilters({ ...filters, sort: sortBy });
  };

  useEffect(() => {
    if (error.show) {
      setTimeout(() => {
        setError({ show: false, message: "", toRedirect: false });
        if (error.toRedirect) navigate("/login");
      }, 3000);
    }
  }, [error]);

  return (
    <Container fluid className="p-0" ref={containerRef}>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={error.show}
      >
        <Modal.Body>
          <CloseButton
            className="float-end"
            onClick={() => {
              setError({ show: false, message: "", toRedirect: true });
            }}
          />
          <Container className="d-flex flex-column align-items-center container">
            <p style={{ color: "red", fontSize: "large" }}>{error.message}</p>
          </Container>
        </Modal.Body>
      </Modal>
      <Modal
        show={showMatchFoundModal}
        onHide={() => setShowMatchFoundModal(false)}
      >
        <Modal.Body>
          <CloseButton
            className="float-end"
            onClick={() => setShowMatchFoundModal(false)}
          />
          <Container className="d-flex flex-column align-items-center container">
            <h3>We have found a match for you!</h3>
            <div className="pt-4 pb-4">
              <DogCard dog={matchedDog} hideFavoriteOption={true} />
            </div>
          </Container>
        </Modal.Body>
      </Modal>
      <Header onLogout={() => handleLogout()} />
      <div id="main-page" className="m-0 p-4">
        <div
          id="filter-section"
          className="p-0 d-flex flex-column align-items-end pb-4"
        >
          <Container
            fluid
            className="d-flex justify-content-end align-items-end mb-3 p-0"
          >
            <Container className="d-flex justify-content-start align-items-start p-0">
              <Row className="flex-grow-1">
                <Col>
                  {favorites.length > 0 && (
                    <p className="favorite-selected-text">{`${favorites.length} favorites selected`}</p>
                  )}
                </Col>
                <Col>
                  {favorites.length > 0 && (
                    <Button
                      className="generate-match-button"
                      disabled={favorites.length === 0}
                      size="lg"
                      onClick={handleGenerateMatch}
                    >
                      Generate Match
                    </Button>
                  )}
                </Col>
              </Row>
            </Container>
            <Container className="d-flex justify-content-end p-0">
              <Dropdown className="sort-by-dropdown">
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                  className="secondary-btn"
                >
                  {`Sort by`}
                </Dropdown.Toggle>
                <Dropdown.Menu className="custom-dropdown-menu">
                  {SORT_BY_OPTIONS.map((option, index) => (
                    <Dropdown.Item
                      key={index}
                      href="#"
                      onClick={() => {
                        handleSortEvent(option.value, dogs);
                      }}
                      active={option.value === filters.sort}
                    >
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              <Button
                className="secondary-btn"
                type="submit"
                onClick={(
                  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                ) => {
                  setShowFilters(!showFilters);
                }}
              >
                <span>{`${showFilters ? "Hide" : "Show"} filters`}</span>
              </Button>
            </Container>
          </Container>

          {showFilters && (
            <Container fluid className="m-0 mt-3 p-0">
              <Row>
                <Col xxl={5} xl={5} lg={4} md={3} sm={1} xs={0} />
                <Col>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="success"
                      id="dropdown-basic"
                      className="secondary-btn"
                    >
                      Filter by Breeds
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu">
                      {breeds.map((breed, index) => (
                        <Dropdown.Item
                          key={index}
                          href="#"
                          active={filters.breeds.includes(breed)}
                          onClick={() => handleBreedsFilterChange(breed)}
                        >
                          {breed}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                {zipCodes.length > 0 && (
                  <Col>
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="success"
                        id="dropdown-basic"
                        className="secondary-btn"
                      >
                        Filter by Zip Codes
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="custom-dropdown-menu">
                        {zipCodes.map((zipCode, index) => (
                          <Dropdown.Item
                            key={index}
                            href="#"
                            active={filters.zipCodes.includes(zipCode)}
                            onClick={() => handleZipCodeFilterChange(zipCode)}
                          >
                            {zipCode}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                )}
                <Col>
                  <Form.Control
                    value={filters.ageMin || ""}
                    type="number"
                    placeholder="Minimum age"
                    onChange={(e: React.ChangeEvent<any>) =>
                      setFilters({ ...filters, ageMin: e.target.value })
                    }
                  />
                </Col>
                <Col>
                  <Form.Control
                    value={filters.ageMax || ""}
                    type="number"
                    placeholder="Maximum age"
                    onChange={(e: React.ChangeEvent<any>) =>
                      setFilters({ ...filters, ageMax: e.target.value })
                    }
                  />
                </Col>
              </Row>
              <Col lg={3} className="float-end">
                <Button
                  className="apply-filter-button"
                  onClick={() => {
                    handleApplyFiltersClick();
                  }}
                >
                  Apply filters
                </Button>
                <Button
                  className="reset-filter-button"
                  onClick={() => {
                    handleResetFiltersClick();
                  }}
                >
                  Reset filters
                </Button>
              </Col>
            </Container>
          )}
        </div>
        <Container fluid className="m-0 p-0">
          <Row>
            {dogs.length === 0
              ? !isLoading && (
                  <Container fluid className="text-center">
                    <h3>No results found!</h3>
                  </Container>
                )
              : dogs.map((dog, idx) => (
                  <Col
                    key={idx}
                    className="mt-3"
                    xxl={3}
                    xl={3}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <DogCard
                      key={dog.id}
                      dog={dog}
                      toggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(dog.id)}
                    />
                  </Col>
                ))}
          </Row>
        </Container>
        {dogs.length > 0 && (
          <Container
            id="pagination-container"
            fluid
            className="m-0 mt-5 p-0 d-flex justify-content-center"
          >
            <BasicPagination
              hasNext={pagination.next}
              hasPrev={pagination.prev}
              onNextClick={() => fetchDogs(pagination.next)}
              onPrevClick={() => fetchDogs(pagination.prev)}
            />
          </Container>
        )}
      </div>
    </Container>
  );
};

export default MainPage;
