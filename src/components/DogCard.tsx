import { Card, Col, Row, Image } from "react-bootstrap";
import { Dog } from "../@types/types";
interface DogCardProps {
  dog: Dog | null;
  toggleFavorite?: Function;
  isFavorite?: boolean;
  hideFavoriteOption?: boolean;
}
const DogCard = ({
  dog,
  toggleFavorite,
  isFavorite,
  hideFavoriteOption = false,
}: DogCardProps) => {
  if (!dog) return <div>Loading...</div>;

  return (
    <Card
      bg={"light"}
      key={"light"}
      text={"dark"}
      style={{ width: "18rem" }}
      className="mb-2 custom-card"
    >
      <Card.Img
        variant="top"
        src={dog.img}
        width={"auto"}
        height={300}
        className="custom-card-img"
      />
      <Card.Body>
        <Card.Title className="card-title-text">{dog.name} </Card.Title>
        <Row className="card-row-text">
          <Col>{`Age`}</Col>
          <Col className="text-right">{dog.age}</Col>
        </Row>
        <Row className="card-row-text">
          <Col>{`Breed`}</Col>
          <Col className="text-right">{dog.breed}</Col>
        </Row>
        <Row className="card-row-text">
          <Col>{`Zip Code`}</Col>
          <Col className="text-right">{dog.zip_code}</Col>
        </Row>
        {!hideFavoriteOption && (
          <div
            id="mark-favorite-checkbox"
            className="mark-favorite-checkbox d-flex"
            onClick={() => toggleFavorite && toggleFavorite(dog.id)}
          >
            <Image
              id="favorite-checkbox"
              src={
                isFavorite
                  ? require("../assets/checked-favorite.png")
                  : require("../assets/unchecked-favorite.png")
              }
              fluid
              width={25}
              height={25}
            />
            <label htmlFor="favorite-checkbox">Mark as Favorite</label>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default DogCard;
