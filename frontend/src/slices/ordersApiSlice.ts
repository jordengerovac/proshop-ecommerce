import { ORDERS_URL, PAYPAL_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const ordersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createOrder: builder.mutation({
			query: ({ order }: { order: any }) => ({
				url: ORDERS_URL,
				method: "POST",
				body: { ...order },
			}),
		}),
		addOrderItems: builder.mutation({
			query: ({ order }: { order: any }) => ({
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
			query: ({ id }: { id: string }) => ({
				url: `${ORDERS_URL}/${id}`,
			}),
		}),
		payOrder: builder.mutation({
			query: ({ orderId, details }: { orderId: any; details: any }) => ({
				url: `${ORDERS_URL}/${orderId}/pay`,
				method: "PUT",
				body: { ...details },
			}),
		}),
		getPayPalClientId: builder.query({
			query: () => ({
				url: PAYPAL_URL,
			}),
			keepUnusedDataFor: 5,
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useAddOrderItemsMutation,
	useGetMyOrdersQuery,
	useGetOrderDetailsQuery,
	usePayOrderMutation,
	useGetPayPalClientIdQuery,
} = ordersApiSlice;
