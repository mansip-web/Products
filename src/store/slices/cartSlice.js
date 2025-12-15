import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../utils/supabaseClient";

// Async Thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("cart")
        .select("*, products(*)")
        .eq("user_id", userId);
      if (error) throw error;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId }, { rejectWithValue, dispatch }) => {
    try {
      // Check if item exists
      const { data: existingItems } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (existingItems && existingItems.length > 0) {
        // Update quantity
        const item = existingItems[0];
        const { error } = await supabase
          .from("cart")
          .update({ quantity: item.quantity + 1 })
          .eq("id", item.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("cart")
          .insert([{ user_id: userId, product_id: productId, quantity: 1 }]);
        if (error) throw error;
      }

      // Refetch to ensure state is synced
      dispatch(fetchCart(userId));
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, cartId }, { rejectWithValue, dispatch }) => {
    try {
      const { error } = await supabase.from("cart").delete().eq("id", cartId);
      if (error) throw error;
      dispatch(fetchCart(userId));
      return cartId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ userId, cartId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      if (quantity < 1) {
        dispatch(removeFromCart({ userId, cartId }));
        return;
      }
      const { error } = await supabase
        .from("cart")
        .update({ quantity })
        .eq("id", cartId);
      if (error) throw error;
      dispatch(fetchCart(userId));
      return { cartId, quantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
