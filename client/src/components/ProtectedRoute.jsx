// import React from "react";

// import {
//     Navigate,
// } from "react-router-dom";

// import useAuthStore from "../store/useAuthStore";

// const ProtectedRoute = ({
//     children,
// }) => {

//     const {
//         authUser,
//     } = useAuthStore();

//     if (!authUser) {

//         return (
//             <Navigate
//                 to="/"
//             />
//         );
//     }

//     return children;
// };

// export default ProtectedRoute;

import React from "react";

import {
  Navigate,
} from "react-router-dom";

import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = ({
  children,
}) => {

  const { authUser } =
    useAuthStore();

  if (!authUser) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;