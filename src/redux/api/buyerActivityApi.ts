// NEW FLOW: buyer activity tracking.
import { IBuyerActivity } from "@/types";
import { IApiResponse } from "@/types/api-response";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const buyerActivityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Params: page, limit, searchTerm, buyer, property, seller, sortBy,
    // sortOrder.
    getBuyerActivities: builder.query<
      IApiResponse<IBuyerActivity[]>,
      Record<string, string>
    >({
      query: (params) => ({
        url: "/buyer-activities",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.buyerActivities],
    }),
  }),
});

export const { useGetBuyerActivitiesQuery } = buyerActivityApi;

export default buyerActivityApi;
