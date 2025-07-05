import { PRODUCTS_URL, UPLOAD_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const productsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProducts: builder.query({
			query: ({ pageNumber, keyword }) => ({
				url: PRODUCTS_URL,
				params: {
					pageNumber,
					keyword,
				},
			}),
			keepUnusedDataFor: 5, // Cache for 5 seconds
			providesTags: ["Product"] as any,
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
			invalidatesTags: ["Product"] as any,
		}),
		deleteProduct: builder.mutation({
			query: ({ productId }: { productId: string }) => ({
				url: `${PRODUCTS_URL}/${productId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Product"] as any,
		}),
		uploadProductImage: builder.mutation({
			query: (data: any) => ({
				url: `${UPLOAD_URL}`,
				method: "POST",
				body: data,
			}),
		}),
		createReview: builder.mutation({
			query: (data) => ({
				url: `${PRODUCTS_URL}/${data.productId}/reviews`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Product"],
		}),
		getTopProducts: builder.query({
			query: () => ({
				url: `${PRODUCTS_URL}/top`,
			}),
			keepUnusedDataFor: 5,
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductDetailsQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
	useUploadProductImageMutation,
	useCreateReviewMutation,
	useGetTopProductsQuery,
} = productsApiSlice;
