import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axiosInstance.jsx";


export const RegisterUser = createAsyncThunk('auth/RegisterUser', async ({ FormData, redirect }, { rejectWithValue }) => {
    try {
        console.log({ "FormData": FormData })
        const response = await axios.post('/user/register', FormData);
        alert("successfully registered");
        console.log(response.data)
        redirect();
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.error || err.message || "Something went wrong";
        console.log(msg);
        return rejectWithValue(msg);
    }
})
export const GoogleLoginUser = createAsyncThunk("auth/GoogleLoginUser", async ({ credential, redirect }, { rejectWithValue }) => {
    try {
        const response = await axios.post("/user/google-login", { token: credential });
        alert("successfully logged in with google");
        localStorage.setItem("token", response.data.token);
        const userResponse = await axios.get("/user/account", { headers: { Authorization: localStorage.getItem("token") } });
        redirect();
        return userResponse.data;
    } catch (err) {
        const msg = err.response?.data?.error || err.message || "Something went wrong";
        return rejectWithValue(msg);
    }
})

export const LoginUser = createAsyncThunk("auth/LoginUser", async ({ formData, redirect, loginRedirect }, { rejectWithValue }) => {
    try {
        const response = await axios.post("/user/login", formData);
        alert("successfully logged in");
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        const userResponse = await axios.get("/user/account", { headers: { Authorization: localStorage.getItem("token") } });
        redirect();
        return userResponse.data;

    } catch (err) {
        const msg = err.response?.data?.error || err.message || "Something went wrong";
        if (msg === "invalid user" || msg === "invalid Email") {
            alert(msg);
        }
        return rejectWithValue(msg);
    }

})


export const UserAccount = createAsyncThunk("auth/UserAccount", async (_, { rejectWithValue }) => {

    try {
        const response = await axios.get("/user/account", { headers: { Authorization: localStorage.getItem("token") } });
        // console.log(response.data);
        return response.data;
    } catch (err) {
        const msg = err.response?.data?.error || err.message || "Something went wrong";
        console.log(msg);
        return rejectWithValue(msg);
    }
})

export const UpdateProfile = createAsyncThunk("auth/UpdateProfile", async ({ formData }, { rejectWithValue }) => {
    console.log({ "Update form Data ": formData });
    const id = formData.get("id");
    console.log({ "userId": id });
    try {
        const response = await axios.put(`/update/profile/${id}`, formData, {
            headers: {
                Authorization: localStorage.getItem("token"),
                "Content-Type": "multipart/form-data"
            }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        const msg = err.response?.data?.error || err.message || "Something went wrong";
        console.log(msg);
        return rejectWithValue(msg);
    }
})

export const switchRole = createAsyncThunk("auth/switchRole", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/user/switchRole/${id}`, { id }, { headers: { Authorization: localStorage.getItem("token") } });
        console.log(response.data);

        return response.data;
    } catch (error) {
        const msg = error.response?.data?.error || error.message || "Something went wrong";
        console.log(msg);
        return rejectWithValue(msg);
    }
})
export const FetchAllUser = createAsyncThunk("auth/FetchAllUser", async (
    { page = 1, limit = 24 },
    { rejectWithValue }
) => {
    try {
        const response = await axios.get("/admin/fetch/allUser", {
            headers: { Authorization: localStorage.getItem("token") }, params: {
                page,
                limit,
            },
        });
        console.log({ "response": response.data });
        return response.data;
    } catch (error) {
        const msg = error.response?.data?.error || error.message || "Something went wrong";
        console.log(msg);
        return rejectWithValue(msg);
    }
})
const authSlices = createSlice({
    name: "auth",
    initialState: {
        user: null,
        Alluser: [],
        isLoggedIn: false,
        Error: null,
        pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: 0,
            pageSize: 10,
        }

    },

    reducers: {
        logoutUser: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            localStorage.removeItem("token");

        }
    },

    extraReducers: (builder) => {

        builder.addCase(RegisterUser.pending, (state) => {
            state.Error = null;
        })
        builder.addCase(RegisterUser.fulfilled, (state, action) => {
            state.user = action.payload;

        })
        builder.addCase(RegisterUser.rejected, (state, action) => {
            state.Error = action.payload
        })

        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.Error = null;

        })
        builder.addCase(LoginUser.pending, (state) => {
            state.Error = null
        })

        builder.addCase(LoginUser.rejected, (state, action) => {
            state.Error = action.payload;
            state.isLoggedIn = false;
        })

        builder.addCase(GoogleLoginUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.Error = null;
        })

        builder.addCase(UserAccount.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.Error = null;

        })
        builder.addCase(UserAccount.pending, (state) => {
            state.Error = null
        })
        builder.addCase(UserAccount.rejected, (state, action) => {
            state.Error = action.payload;
            state.isLoggedIn = false
        })
        builder.addCase(UpdateProfile.fulfilled, (state, action) => {
            state.user = action.payload;
            //  state.Error = null;
        })
        builder.addCase(UpdateProfile.rejected, (state, action) => {
            state.Error = action.payload;
            // state.isLoggedIn = false;
        })
        builder.addCase(switchRole.fulfilled, (state, action) => {
            state.user.role = action.payload.user.role;
            state.Error = null;

        })
        builder.addCase(switchRole.rejected, (state, action) => {
            state.Error = action.payload;
        })
        builder.addCase(switchRole.pending, (state) => {
            state.Error = null
        })
        builder.addCase(FetchAllUser.fulfilled, (state, action) => {
            state.Alluser = action?.payload?.data || [];
            state.Error = null;
            state.pagination = action.payload?.pagination || {};
        })
        builder.addCase(FetchAllUser.pending, (state) => {
            state.Error = null;
        })
        builder.addCase(FetchAllUser.rejected, (state, action) => {
            state.Error = action.payload
        })


    }


})

export const { logoutUser } = authSlices.actions;
export default authSlices.reducer;