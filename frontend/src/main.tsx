import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./store";
import "./styles/bootstrap.custom.scss";
import "./styles/index.scss";
import App from "./App";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen";
import OrderListScreen from "./screens/admin/OrderListScreen";
import ProductListScreen from "./screens/admin/ProductListScreen";
import UserListScreen from "./screens/admin/UserListScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";
import UserEditScreen from "./screens/admin/UserEditScreen";

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />}>
			<Route index={true} path="/" element={<HomeScreen />} />
			<Route path="/page/:pageNumber" element={<HomeScreen />} />
			<Route path="/search/:keyword" element={<HomeScreen />} />
			<Route path="/search/:keyword/page/:pageNumber" element={<HomeScreen />} />
			<Route path="/product/:id" element={<ProductScreen />} />
			<Route path="/cart" element={<CartScreen />} />
			<Route path="/login" element={<LoginScreen />} />
			<Route path="/register" element={<RegisterScreen />} />
			<Route path="" element={<PrivateRoute />}>
				<Route path="/shipping" element={<ShippingScreen />} />
				<Route path="/payment" element={<PaymentScreen />} />
				<Route path="/placeorder" element={<PlaceOrderScreen />} />
				<Route path="/order/:id" element={<OrderScreen />} />
				<Route path="/profile" element={<ProfileScreen />} />
			</Route>
			<Route path="" element={<AdminRoute />}>
				<Route path="/admin/productlist" element={<ProductListScreen />} />
				<Route path="/admin/productlist/:pageNumber" element={<ProductListScreen />} />
				<Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
				<Route path="/admin/userlist" element={<UserListScreen />} />
				<Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
				<Route path="/admin/orderlist" element={<OrderListScreen />} />
			</Route>
		</Route>,
	),
);

const rootElement = document.getElementById("root");
if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<HelmetProvider>
				<Provider store={store}>
					<PayPalScriptProvider deferLoading={true} options={{ clientId: "" }}>
						<RouterProvider router={router} />
					</PayPalScriptProvider>
				</Provider>
			</HelmetProvider>
		</StrictMode>,
	);
} else {
	throw new Error('Root element with id "root" not found');
}
