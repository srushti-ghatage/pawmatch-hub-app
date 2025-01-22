import { Dog } from "../@types/types";

export const sortListBasedOnFilter = (sortBy: string, list: Array<Dog>) => {
  switch (sortBy) {
    case "breed:asc":
      return sortListByBreed(true, list);
    case "bread:desc":
      return sortListByBreed(false, list);
    case "name:asc":
      return sortListByName(true, list);
    case "name:desc":
      return sortListByName(false, list);
    case "age:asc":
      return sortListByAge(true, list);
    case "age:desc":
      return sortListByAge(false, list);
    default:
      return list
  }
};

const sortListByBreed = (ascending: boolean, list: Array<Dog>) => {
  if (ascending) {
    return list.sort((a, b) => a.breed.localeCompare(b.breed));
  } else {
    return list.sort((a, b) => b.breed.localeCompare(a.breed));
  }
};

const sortListByName = (ascending: boolean, list: Array<Dog>) => {
  if (ascending) {
    return list.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    return list.sort((a, b) => b.name.localeCompare(a.name));
  }
};

const sortListByAge = (ascending: boolean, list: Array<Dog>) => {
  if (ascending) {
    return list.sort((a, b) => a.age - b.age);
  } else {
    return list.sort((a, b) => b.age - a.age);
  }
};
