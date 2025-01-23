export const SORT_BY_OPTIONS = [
  { label: "Breed: Ascending", value: "breed:asc" },
  { label: "Breed: Descending", value: "breed:desc" },
  { label: "Name: Ascending", value: "name:asc" },
  { label: "Name: Descending", value: "name:desc" },
  { label: "Age: Ascending", value: "age:asc" },
  { label: "Age: Descending", value: "age:desc" },
];

export const DEFAULT_FILTERS = {
  breeds: [],
  sort: "breed:asc",
  zipCodes: [],
  ageMax: null,
  ageMin: null,
  size: 25,
};
