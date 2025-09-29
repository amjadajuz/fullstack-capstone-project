import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage/LoginPage";
import MainPage from "./components/MainPage/MainPage";
import Navbar from "./components/Navbar/Navbar";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import SearchPage from "./components/SearchPage/SearchPage";
import DetailsPage from "./components/DetailsPage/DetailsPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
        <Route path="/app/search" element={<SearchPage />} />
         <Route path="/app/product/:productId" element={<DetailsPage />} />
      </Routes>
    </>
  );
}
export default App;
