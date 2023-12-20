import { Container } from "react-bootstrap";
import logo from "./images/Cribl.svg";
import { Button, Navbar, Nav } from 'react-bootstrap'

const Header = () => {
    return (
        <Navbar bg={"dark"} variant={"dark"}>
            <Container fluid={true}>
                <Navbar.Brand href={"https://cribl.io"} target={"_blank"} className={"p-0"}><img src={logo} alt="cribl" height={30} /></Navbar.Brand>
                <Nav>
                    <Nav.Link className={"ms-auto p-0"} href={"https://docs.cribl.io/stream/scaling/"} >
                    <Button variant="outline-light" style={{color: "#ff6600", border: "1px solid #ff6600"}}>
                        Documentation
                    </Button>
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default Header;
