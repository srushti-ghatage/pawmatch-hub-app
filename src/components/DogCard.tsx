import { Dog } from "../@types/types";
interface DogCardProps {
  dog: Dog;
  toggleFavorite: Function;
  isFavorite: boolean;
}
const DogCard = ({ dog, toggleFavorite, isFavorite }: DogCardProps) => {
  if (!dog) return <div>Loading...</div>;

  return (
    <div>
      <img src={dog.img} alt={dog.name} width="100" height="100" />
      <h3>{dog.name}</h3>
      <p>Age: {dog.age}</p>
      <p>Breed: {dog.breed}</p>
      <p>Zip: {dog.zip_code}</p>

      <label>
        Favorite:
        <input
          type="checkbox"
          checked={isFavorite}
          onChange={() => toggleFavorite(dog.id)}
        />
      </label>
    </div>
  );
};

export default DogCard;
