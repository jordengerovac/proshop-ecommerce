import { USERS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data: any) => ({
				url: `${USERS_URL}/auth`,
				method: "POST",
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/logout`,
				method: "POST",
			}),
		}),
		register: builder.mutation({
			query: (data: any) => ({
				url: `${USERS_URL}`,
				method: "POST",
				body: data,
			}),
		}),
		profile: builder.mutation({
			query: (data: any) => ({
				url: `${USERS_URL}/profile`,
				method: "PUT",
				body: data,
			}),
		}),
		getUsers: builder.query({
			query: () => ({
				url: USERS_URL,
			}),
			keepUnusedDataFor: 5, // Cache for 5 seconds
			providesTags: ["User"] as any,
		}),
		getUserDetails: builder.query({
			query: ({ id }: { id: string }) => ({
				url: `${USERS_URL}/${id}`,
			}),
			keepUnusedDataFor: 5, // Cache for 5 seconds
		}),
		updateUser: builder.mutation({
			query: (data: any) => ({
				url: `${USERS_URL}/${data.userId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["User"] as any,
		}),
		deleteUser: builder.mutation({
			query: ({ userId }: { userId: string }) => ({
				url: `${USERS_URL}/${userId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["User"] as any,
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useProfileMutation,
	useGetUsersQuery,
	useDeleteUserMutation,
	useGetUserDetailsQuery,
	useUpdateUserMutation,
} = usersApiSlice;
