import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PublicRoute = ({ children }) => {

    const authUser = useAuthStore(
        (state) => state.authUser
    );

    if (authUser) {

        return <Navigate to="/new-tests" />;
    }

    return children;
};

export default PublicRoute;