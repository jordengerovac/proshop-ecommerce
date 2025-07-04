import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils.js";

const initialState = localStorage.getItem("cart")
	? JSON.parse(localStorage.getItem("cart") as string)
	: {
			cartItems: [],
			shippingAddress: {},
			paymentMethod: "PayPal",
		};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state: any, action: any) => {
			const item = action.payload;

			const existItem = state.cartItems.find((x: any) => x._id === item._id);

			if (existItem) {
				state.cartItems = state.cartItems.map((x: any) => (x._id === existItem._id ? item : x));
			} else {
				state.cartItems = [...state.cartItems, item];
			}

			return updateCart(state);
		},
		removeFromCart: (state: any, action: any) => {
			state.cartItems = state.cartItems.filter((x: any) => x._id !== action.payload);

			return updateCart(state);
		},
		saveShippingAddress: (state: any, action: any) => {
			state.shippingAddress = action.payload;
			return updateCart(state);
		},
	},
});

export const { addToCart, removeFromCart, saveShippingAddress } = cartSlice.actions;

export default cartSlice.reducer;
