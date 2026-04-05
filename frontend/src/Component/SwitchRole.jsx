import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { switchRole } from "../slices/authSlices";
import { useNavigate } from "react-router-dom";
import { UserAccount } from "../slices/authSlices";
export default function SwitchRole() {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [AccountOpen, setAccountOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(UserAccount());
        }
    }, [dispatch]);

    const handleChangeRole = async () => {
        const result = await dispatch(switchRole(user._id));

        if (result.meta.requestStatus === "fulfilled") {
            setAccountOpen(false);
            navigate("/dashboard");
        }
    };
    return (
        <div>
            <div className="relative">
                <button
                    onClick={() => setAccountOpen(!AccountOpen)}
                    className="text-gray-700 font-medium hover:text-blue-600 transition flex items-center gap-1"
                >
                    👤 Account
                </button>

                {AccountOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg p-2">
                        <button
                            onClick={handleChangeRole}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                        >
                            🔄 Switch Role
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}