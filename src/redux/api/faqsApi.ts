import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export type ReorderFaqsPayload = {
  orders: { id: string; order: number }[];
};

const faqsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFaqs: build.query({
      query: (params) => ({
        url: "/faqs",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.faqs],
    }),
    createFaq: build.mutation({
      query: (data) => ({
        url: "/faqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.faqs],
    }),
    deleteFaq: build.mutation({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.faqs],
    }),
    updateFaq: build.mutation({
      query: ({ id, ...data }) => ({
        url: `/faqs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.faqs],
    }),
    reorderFaqs: build.mutation({
      query: (data: ReorderFaqsPayload) => ({
        url: "/faqs/reorder",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.faqs],
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useUpdateFaqMutation,
  useReorderFaqsMutation,
} = faqsApi;
