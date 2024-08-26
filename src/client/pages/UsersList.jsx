import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarFlow } from "../component/navbar";
import TableStaff from './../component/Table/TableStaff';
import UserList from './../component/Table/TableUser';
import MovieList from './../component/Table/TableMovies';
import ReviewList from './../component/Table/TableReview';
import TheaterList from './../component/Table/TableTheater';
import SeatTable from './../component/Table/Tableseat';
import TicketTable from './../component/Table/TableTicket';
import PaymentTable from './../component/Table/TablePayment';
import MembershipTable from './../component/Table/Tablemembership';
import MovieSearch from './moviesearch';
import ShowtimeList from "../component/Table/TableShowtime";
import MovieStats from './../component/Table/Analyis1';
import MovieStatss from "../component/Table/Analyis2";
import ANA2 from "../component/Table/Analyis2";
import ANA3 from "../component/Table/Analysis3";
import ANA4 from "../component/Table/Analysis4";
import ANA5 from "../component/Table/Analyis5";

function InformationList() {
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    if (role === "user" || role === " " || !role) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      alert("You are not Staff or Admin");
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <NavbarFlow />
      {userRole === "admin" && (
        <>
          <MovieStats />
          <ANA3 />
          <ANA2 />
          <ANA4 />
          <ANA5 />
        </>
      )}
      <UserList />
      <MovieSearch />
      <MovieList />
      <ShowtimeList />
      <TableStaff />
      <TicketTable />
      <PaymentTable />
      <SeatTable />
      <ReviewList />
      <TheaterList />
      <MembershipTable />
    </>
  );
}

export default InformationList;
