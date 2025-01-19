import { Container, Image } from "react-bootstrap";

interface HeaderProps {
  onLogout: Function;
}
const Header = ({ onLogout }: HeaderProps) => {
  return (
    <Container
      className="m-auto p-0 d-flex justify-content-center align-items-center"
      fluid
      id="header"
    >
      <Image
        src={require("../assets/pawmatch-hub-logo.png")}
        height={75}
        width={75}
        roundedCircle
      />
      <h2>PawMatch Hub</h2>
      <a
        onClick={() => {
          onLogout();
        }}
      >
        Log out
      </a>
    </Container>
  );
};

export default Header;
