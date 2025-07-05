import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

function ProductCarousel() {
	const { data: products, isLoading, error } = useGetTopProductsQuery({});

	return isLoading ? null : error ? (
		<Message variant="danger">{(error as any)?.data?.message || (error as any).error}</Message>
	) : (
		<Carousel pause="hover" className="bg-primary mb-4">
			{products.map((product: any) => (
				<Carousel.Item key={product._id}>
					<Link to={`/product/${product._id}`}>
						<Image src={product.image} alt={product.name} fluid />
						<Carousel.Caption className="carousel-caption">
							<h2 className="text-white text-right">
								{product.name} (${product.price})
							</h2>
						</Carousel.Caption>
					</Link>
				</Carousel.Item>
			))}
		</Carousel>
	);
}

export default ProductCarousel;
