import {Container} from "react-bootstrap";
import logo from "./Cribl.svg";
import gh from "./Github.svg"
import {Navbar, Nav} from 'react-bootstrap'

const Header = () => {
    return (
        <Navbar bg={"dark"} variant={"dark"}>
            <Container fluid={true}>
                <Navbar.Brand href={"#"} className={"p-0"}><img src={logo} alt="cribl" height={30}/></Navbar.Brand>
                <Nav.Link className={"ms-auto p-0"} href={"https://github.com/bdalpe/criblsizing.info"}><img src={gh} alt={"Github"} height={30} /></Nav.Link>
            </Container>
        </Navbar>
    );
};

export default Header;
