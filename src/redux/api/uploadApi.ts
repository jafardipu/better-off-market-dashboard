import { baseApi } from "./baseApi";

const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fileUpload: builder.mutation({
      query: (data) => ({
        url: "/upload",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useFileUploadMutation } = uploadApi;
