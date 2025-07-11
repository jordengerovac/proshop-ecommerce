import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import IProduct from "../types/product.type";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

function HomeScreen() {
	const { pageNumber, keyword } = useParams();
	const { data, isLoading, error } = useGetProductsQuery({ pageNumber, keyword });

	return (
		<>
			{!keyword ? (
				<ProductCarousel />
			) : (
				<Link to="/" className="btn btn-light">
					Go Back
				</Link>
			)}
			{isLoading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{(error as any)?.data?.message || (error as any)?.error}</Message>
			) : (
				<>
					<h1>Latest Products</h1>
					<Row>
						{data?.products.map((product: IProduct) => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<Paginate pages={data?.pages} page={data?.page}></Paginate>
				</>
			)}
		</>
	);
}

export default HomeScreen;
