import { IPropertyContract } from "@/types";
import { IApiResponse, IApiSingleDataResponse } from "@/types/api-response";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const propertyContractApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPropertyContracts: builder.query<
      IApiResponse<IPropertyContract[]>,
      Record<string, string>
    >({
      query: (params) => ({
        url: "/property-contracts",
        method: "GET",
        params,
      }),
      providesTags: [tagTypes.propertyContracts],
    }),
    getSinglePropertyContract: builder.query<
      IApiSingleDataResponse<IPropertyContract>,
      string
    >({
      query: (id) => ({
        url: `/property-contracts/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.propertyContracts],
    }),
  }),
});

export const {
  useGetPropertyContractsQuery,
  useGetSinglePropertyContractQuery,
} = propertyContractApi;

export default propertyContractApi;
