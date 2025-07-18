import { Helmet } from "react-helmet-async";

function Meta({
	title,
	description,
	keywords,
}: {
	title: string;
	description: string;
	keywords: string;
}) {
	return (
		<Helmet>
			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="keyword" content={keywords} />
		</Helmet>
	);
}

Meta.defaultProps = {
	title: "Welcome To ProShop",
	description: "We sell the best products for cheap",
	keywords: "electronics, buy electronics, cheap electroincs",
};

export default Meta;
