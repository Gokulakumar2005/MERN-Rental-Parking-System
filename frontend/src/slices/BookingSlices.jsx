

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axiosInstance.jsx";


export const createOrder = createAsyncThunk(
  "booking/createOrder",
  async (amount, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/payment/create-order",
        { amount },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);


export const verifyPayment = createAsyncThunk(
  "booking/verifyPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "/payment/verify",
        payload,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchBookings = createAsyncThunk("booking/fetchBookings", async (
  { page = 1, limit = 24, search = "", status = "all" },
  { rejectWithValue }
) => {
  try {
    const response = await axios.get("/user/myBookings", {
      headers: { Authorization: localStorage.getItem("token") }, 
      params: {
        page,
        limit,
        search,
        status
      },
    });
    console.log(response.data);
    return response.data;

  } catch (error) {
    console.log(error.response?.data);
    return rejectWithValue(error.response?.data);
  }
})

export const CancelBooking = createAsyncThunk("booking/CancelBooking", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/user/cancelBooking/${id}`, id, { headers: { Authorization: localStorage.getItem("token") } });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error.response.data);
    return rejectWithValue(error.response.data);
  }
})
const BookingSlices = createSlice({
  name: "booking",
  initialState: {
    myBooking: [],
    loading: false,
    order: null,
    success: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 10,
    }
  },

  reducers: {
    resetPaymentState: (state) => {
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
     builder.addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      builder.addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      builder.addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      builder.addCase(verifyPayment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      builder.addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder.addCase(fetchBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.myBooking = action.payload?.data || [];  
      state.pagination = action.payload?.pagination || {};
    });
    builder.addCase(fetchBookings.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;  
    });
    builder.addCase(fetchBookings.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    builder.addCase(CancelBooking.fulfilled, (state, action) => {
      const updatedBooking = action.payload.booking;

      const index = state.myBooking.findIndex(
        (b) => b._id === updatedBooking._id
      );
      if (index !== -1) {
        state.myBooking[index] = updatedBooking;
      }
      state.loading = false;
    });
    builder.addCase(CancelBooking.rejected, (state, action) => {
      state.error = action.payload;
      state.loading=false;
    });

    builder.addCase(CancelBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
  },
});

export const { resetPaymentState } = BookingSlices.actions;

export default BookingSlices.reducer;