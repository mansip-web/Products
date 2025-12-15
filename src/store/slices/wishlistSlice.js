import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, products(*)")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async ({ userId, productId }, { rejectWithValue, dispatch }) => {
    try {
      // Check if exists
      const { data: existing } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (existing && existing.length > 0) {
        // Remove
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", productId);
        if (error) throw error;
      } else {
        // Add
        const { error } = await supabase
          .from("wishlist")
          .insert([{ user_id: userId, product_id: productId }]);
        if (error) throw error;
      }

      dispatch(fetchWishlist(userId));
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
