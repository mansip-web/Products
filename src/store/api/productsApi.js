import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../../utils/supabaseClient";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getProducts: builder.query({
      queryFn: async () => {
        try {
          const { data, error } = await supabase.from("products").select("*");
          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
    getProductById: builder.query({
      queryFn: async (id) => {
        try {
          const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("id", id)
            .single();
          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
