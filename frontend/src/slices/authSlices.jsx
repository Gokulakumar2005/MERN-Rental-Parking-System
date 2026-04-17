import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../config/axiosInstance.jsx";
import { toast } from "react-toastify";

export const RegisterUser = createAsyncThunk('auth/RegisterUser', async ({ FormData, redirect }, { rejectWithValue }) => {
    try {
        console.log({ "FormData": FormData })
        const response = await axios.post('/user/register', FormData);
        console.log(response.data)
        redirect();
        toast.success("successfully registered");
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
        localStorage.setItem("token", response.data.token);
        const userResponse = await axios.get("/user/account", { headers: { Authorization: localStorage.getItem("token") } });
        redirect();
        toast.success("successfully logged in with google");
        return userResponse.data;
    } catch (err) {
        const msg = err.response?.data?.error || err.message || "Something went wrong";
        return rejectWithValue(msg);
    }
})

export const LoginUser = createAsyncThunk("auth/LoginUser", async ({ formData, redirect, loginRedirect }, { rejectWithValue }) => {
    try {
        const response = await axios.post("/user/login", formData);
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        const userResponse = await axios.get("/user/account", { headers: { Authorization: localStorage.getItem("token") } });
        redirect();
       toast.success("successfully logged in"); 
        return userResponse.data;

    } catch (err) {
      const msg =  err.message|| err.response?.data?.error || "Something went wrong";
    //   alert(msg);
      if (loginRedirect) {
        loginRedirect();
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

export const switchRole = createAsyncThunk(
  "auth/switchRole",
  async (id, { rejectWithValue }) => {
    try {

      const response = await axios.put(
        `/user/switchRole/${id}`,
        {},
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
      }

      return response.data

    } catch (error) {
      const msg = error.response?.data?.error || error.message
      return rejectWithValue(msg)
    }
  }
)
export const FetchAllUser = createAsyncThunk("auth/FetchAllUser", async (
    { page = 1, limit = 12, search = "", role = "all" },
    { rejectWithValue }
) => {
    try {
        const response = await axios.get("/admin/fetch/allUser", {
            headers: { Authorization: localStorage.getItem("token") },
            params: {
                page,
                limit,
                search,
                role
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
        loading:false,
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
            state.loading=  true;
        })
        builder.addCase(RegisterUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading=false;

        })
        builder.addCase(RegisterUser.rejected, (state, action) => {
            state.Error = action.payload;
            state.loading=false;
        })

        builder.addCase(LoginUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;    
            state.loading=false;
            state.Error = null;

        })
        builder.addCase(LoginUser.pending, (state) => {
            state.Error = null;
            state.loading=true;
        })

        builder.addCase(LoginUser.rejected, (state, action) => {
            state.Error = action.payload;
            state.isLoggedIn = false;
            state.loading=false;
        })

        builder.addCase(GoogleLoginUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.Error = null;
            state.loading=false;    
        })
        builder.addCase(GoogleLoginUser.pending, (state) => {
            state.Error = null;
            state.loading=true;
        })
        builder.addCase(GoogleLoginUser.rejected, (state, action) => {
            state.Error = action.payload;
            state.isLoggedIn = false;
            state.loading=false;    
        })

        builder.addCase(UserAccount.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
            state.loading   =false;
            state.Error = null;

        })
        builder.addCase(UserAccount.pending, (state) => {
            state.Error = null;
            state.loading=true;
        })
        builder.addCase(UserAccount.rejected, (state, action) => {
            state.Error = action.payload;
            state.isLoggedIn = false;
            state.loading=false;
        })
        builder.addCase(UpdateProfile.fulfilled, (state, action) => {
            state.user = action.payload;
            state.loading=false;    
            state.Error = null;
        })
        builder.addCase(UpdateProfile.pending, (state) => {
            state.Error = null;
            state.loading=true;
        })
        builder.addCase(UpdateProfile.rejected, (state, action) => {
            state.Error = action.payload;
            state.loading=false;
        })
        builder.addCase(switchRole.fulfilled, (state, action) => {
            state.user = action.payload.user
            state.isLoggedIn = true
            state.loading=false;
            state.Error = null
        })
        builder.addCase(switchRole.rejected, (state, action) => {
            state.Error = action.payload;
            state.loading=false;
        })
        builder.addCase(switchRole.pending, (state) => {
            state.Error = null;
            state.loading=true;
        })
        builder.addCase(FetchAllUser.fulfilled, (state, action) => {
            state.Alluser = action?.payload?.data || [];
            state.Error = null;
            state.loading=false;
            state.pagination = action.payload?.pagination || {};
        })
        builder.addCase(FetchAllUser.pending, (state) => {
            state.Error = null;
            state.loading=true;
        })
        builder.addCase(FetchAllUser.rejected, (state, action) => {
            state.Error = action.payload;
            state.loading=false;
        })


    }


})

export const { logoutUser } = authSlices.actions;
export default authSlices.reducer;