import { PRODUCTS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const productsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query({
			query: () => ({
				url: PRODUCTS_URL,
			}),
			keepUnusedDataFor: 5, // Cache for 5 seconds
			providesTags: ["Products"] as any,
		}),
		getProductDetails: builder.query({
			query: ({ id }: { id: string }) => ({
				url: `${PRODUCTS_URL}/${id}`,
			}),
			keepUnusedDataFor: 5, // Cache for 5 seconds
		}),
		createProduct: builder.mutation({
			query: () => ({
				url: `${PRODUCTS_URL}`,
				method: "POST",
			}),
		}),
		updateProduct: builder.mutation({
			query: (data: any) => ({
				url: `${PRODUCTS_URL}/${data.productId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["Products"] as any,
		}),
		deleteProduct: builder.mutation({
			query: ({ productId }: { productId: string }) => ({
				url: `${PRODUCTS_URL}/${productId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Products"] as any,
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductDetailsQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
} = productsApiSlice;
