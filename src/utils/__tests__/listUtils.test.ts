import {
  defaultMockDogList,
  mockDogListByAgeAsc,
  mockDogListByAgeDesc,
  mockDogListByBreedAsc,
  mockDogListByBreedDesc,
  mockDogListByNameAsc,
  mockDogListByNameDesc,
} from "../../mockData";
import { sortListBasedOnFilter } from "../listUtils";

describe("test all list util functions", () => {
  const mockList = defaultMockDogList;
  it("sortListBasedOnFilter breed:asc", () => {
    const sortedList = sortListBasedOnFilter("breed:asc", mockList);
    expect(sortedList).toEqual(mockDogListByBreedAsc);
  });

  it("sortListBasedOnFilter breed:desc", () => {
    const sortedList = sortListBasedOnFilter("breed:desc", mockList);
    expect(sortedList).toEqual(mockDogListByBreedDesc);
  });

  it("sortListBasedOnFilter name:asc", () => {
    const sortedList = sortListBasedOnFilter("name:asc", mockList);
    expect(sortedList).toEqual(mockDogListByNameAsc);
  });

  it("sortListBasedOnFilter name:desc", () => {
    const sortedList = sortListBasedOnFilter("name:desc", mockList);
    expect(sortedList).toEqual(mockDogListByNameDesc);
  });

  it("sortListBasedOnFilter age:asc", () => {
    const sortedList = sortListBasedOnFilter("age:asc", mockList);
    expect(sortedList).toEqual(mockDogListByAgeAsc);
  });

  it("sortListBasedOnFilter age:desc", () => {
    const sortedList = sortListBasedOnFilter("age:desc", mockList);
    expect(sortedList).toEqual(mockDogListByAgeDesc);
  });
});
