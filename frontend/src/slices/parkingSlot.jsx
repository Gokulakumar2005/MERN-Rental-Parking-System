import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axiosInstance";


export const AddSlot = createAsyncThunk("VendorSlot/AddSlot", async ({ form }, { rejectWithValue }) => {
    try {
        console.log({ "Form inside the Slices": form });
        const response = await axios.post("/vendor/addSlot", form, { headers: { Authorization: localStorage.getItem("token") } });
        console.log(response.data);
        alert("Registered Succesfully");
        return response.data;
    } catch (error) {
        const msg = error?.response?.data?.error;
        console.log(msg);
        return rejectWithValue(msg);
    }
})



export const FetchSlots = createAsyncThunk("VendorSlots/FetchSlots", async ({ page = 1, limit = 24 }, { rejectWithValue }) => {
    try {
        const response = await axios.get("/user/fetchSlots", {
            headers: { Authorization: localStorage.getItem("token") }, params: {
                page,
                limit,
            },
        });
        console.log({ "response inside the slices": response.data });
        return response.data;
    } catch (error) {
        const msg = error?.response?.data?.error;
        console.log(msg);
        return rejectWithValue(msg);
    }
})
export const updateSlot = createAsyncThunk("VendorSlots/updateSlot", async ({ formData }, { rejectWithValue }) => {
    try {
        const response = await axios.put("/update/vendor/slot", formData, { headers: { Authorization: localStorage.getItem("token") } });
        console.log(response.data);
        return response.data
    } catch (error) {
        const msg = error?.response?.data?.error;
        console.log(msg);
        return rejectWithValue(msg);
    }
})
export const deleteSlot = createAsyncThunk("VendorSlots/deleteSlot", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`/vendor/delete/slot/${id}`, { headers: { Authorization: localStorage.getItem("token") } });
        console.log(response.data);
        return response.data
    } catch (error) {
        const msg = error?.response?.data?.error;
        console.log(msg);
        return rejectWithValue(msg);
    }
})
const ParkingSlices = createSlice({
    name: "VendorSlot",
    initialState: {
        Slot: [],
        error: null,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            pageSize: 10,
        }


    },
    extraReducers: (builder) => {
        builder.addCase(AddSlot.fulfilled, (state, action) => {
            // state.Slot = action.payload;
            state.Slot.push(action.payload);
            // push(action.payload);
        })
        builder.addCase(AddSlot.pending, (state) => {
            state.error = null
        })
        builder.addCase(AddSlot.rejected, (state, action) => {
            state.error = action.payload;
        })
        builder.addCase(FetchSlots.fulfilled, (state, action) => {
            state.Slot = action.payload?.data || [];
            state.loading = false;
            state.pagination = action.payload?.pagination || {};
        })
        builder.addCase(FetchSlots.pending, (state) => {
            state.error = null;
            state.loading = true;
        })
        builder.addCase(FetchSlots.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })
        // builder.addCase(updateSlot.fulfilled, (state, action) => {
        //     state.Slot = action.payload;
        // })
        builder.addCase(updateSlot.pending, (state, action) => {
            state.error = null;
        })
        builder.addCase(updateSlot.fulfilled, (state, action) => {
            const updated = action.payload;
            state.Slot = state.Slot.map(slot =>
                slot._id === updated._id ? updated : slot
            );
        })
        builder.addCase(updateSlot.rejected, (state) => {
            state.error = null;
        })
        // builder.addCase(deleteSlot.fulfilled, (state, action) => {
        //     state.Slot = action.payload;
        // })
        builder.addCase(deleteSlot.fulfilled, (state, action) => {
            const deletedId = action.meta.arg;
            state.Slot = state.Slot.filter(slot => slot._id !== deletedId);
        });
        builder.addCase(deleteSlot.pending, (state) => {
            state.error = null;
        })
        builder.addCase(deleteSlot.rejected, (state) => {
            state.error = null;
        })

    }
})


export default ParkingSlices.reducer;