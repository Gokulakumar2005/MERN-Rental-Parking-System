import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function PrivateRoutes(props) {
    const navigation = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            return navigation("/login");
        }
    }, [])
    if (!localStorage.getItem("token")) {// loading is called before the navigation ,when the user is not logged in 
        return <p>Loading ...</p>
    }
    return props.children;// if token is there then only we will render the children component
}