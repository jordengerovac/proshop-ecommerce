import { ORDERS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const ordersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createOrder: builder.mutation({
			query: (order) => ({
				url: ORDERS_URL,
				method: "POST",
				body: { ...order },
			}),
		}),
		addOrderItems: builder.mutation({
			query: (order) => ({
				url: ORDERS_URL,
				method: "POST",
				body: order,
			}),
		}),
		getMyOrders: builder.query({
			query: () => ({
				url: `${ORDERS_URL}/mine`,
			}),
		}),
		getOrderDetails: builder.query({
			query: (id) => ({
				url: `${ORDERS_URL}/${id}`,
			}),
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useAddOrderItemsMutation,
	useGetMyOrdersQuery,
	useGetOrderDetailsQuery,
} = ordersApiSlice;
