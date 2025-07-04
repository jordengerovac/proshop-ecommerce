import { Container, Row } from "react-bootstrap";

function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="bg-dark text-light py-3">
			<Container>
				<Row className="justify-content-center">
					<p className="text-center mb-0">&copy; {year} ProShop. All rights reserved.</p>
				</Row>
			</Container>
		</footer>
	);
}

export default Footer;
