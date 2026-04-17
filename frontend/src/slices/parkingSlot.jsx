import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axiosInstance";
import { toast } from "react-toastify";

export const AddSlot = createAsyncThunk("VendorSlot/AddSlot", async ({ form }, { rejectWithValue }) => {
    try {
        console.log({ "Form inside the Slices": form });
        const response = await axios.post("/vendor/addSlot", form, { headers: { Authorization: localStorage.getItem("token") } });
        console.log(response.data);
      toast.success("Slot Added successfully..")
        return response.data;
    } catch (error) {
        const msg = error?.response?.data?.error;
        console.log(msg);
        return rejectWithValue(msg);
    }
})



export const FetchSlots = createAsyncThunk("VendorSlots/FetchSlots", async (
    { page = 1, limit = 24, search = "", vehicleType = "all" }, 
    { rejectWithValue }
) => {
    try {
        const response = await axios.get("/user/fetchSlots", {
            headers: { Authorization: localStorage.getItem("token") }, 
            params: {
                page,
                limit,
                search,
                vehicleType
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
        toast.success("Slot Updated successfully..")
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
        loading:false,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            pageSize: 10,
        }


    },
    extraReducers: (builder) => {
        builder.addCase(AddSlot.fulfilled, (state, action) => {
            state.Slot.push(action.payload.newSlot);
                state.loading = false;
        })
        builder.addCase(AddSlot.pending, (state) => {
            state.error = null
            state.loading = true;
        })
        builder.addCase(AddSlot.rejected, (state, action) => {
            state.error = action.payload;
            state.loading=false;
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
        builder.addCase(updateSlot.pending, (state, action) => {
            state.error = null;
            state.loading=true;
        })
        builder.addCase(updateSlot.fulfilled, (state, action) => {
            const updated = action.payload;
            state.Slot = state.Slot.map(slot =>
                slot._id === updated._id ? updated : slot
            );
            state.loading=false;
        })
        builder.addCase(updateSlot.rejected, (state) => {
            state.error = null;
            state.loading=false;
        })
        builder.addCase(deleteSlot.fulfilled, (state, action) => {
            const deletedId = action.meta.arg;
            state.Slot = state.Slot.filter(slot => slot._id !== deletedId);
            state.loading=false;
        });
        builder.addCase(deleteSlot.pending, (state) => {
            state.error = null;     
            state.loading=true;
        })
        builder.addCase(deleteSlot.rejected, (state) => {
            state.error = null;
            state.loading=false;
        })

    }
})


export default ParkingSlices.reducer;