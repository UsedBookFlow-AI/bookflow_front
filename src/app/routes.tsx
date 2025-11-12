// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./AppLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import InventoryNew from "@/pages/InventoryNew";
import Recommendations from "@/pages/Recommendations";
import RecommendationResult from "@/pages/RecommendationResult";
import MyPage from "@/pages/MyPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,      // ✅ children prop 넘기지 않음
    children: [
      { index: true, element: <Home /> },                // /
      { path: "login", element: <Login /> },             // /login
      { path: "signup", element: <Signup /> },           // /signup
      { path: "inventory/new", element: <InventoryNew /> }, // /inventory/new
      { path: "recommendations", element: <Recommendations /> }, // /recommendations
      {
        path: "/recommendations/result",
        element: <RecommendationResult />,
      },
      { path: "mypage", element: <MyPage /> },           // /mypage
    ],
  },
]);