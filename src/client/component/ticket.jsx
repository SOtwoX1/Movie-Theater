import React from "react";
import "../index.css"; // Import the custom CSS file

const Ticket = ({
  movieName,
  theatreName,
  duration,
  seatName,
  showtime,
  date,
  imageUrl,
}) => {
  return (
    <div className="flex bg-white rounded-lg w-full shadow-lg mb-6 overflow-hidden mx-2 rainbow-border">
      <img
        src={imageUrl}
        alt="Movie Poster"
        className="w-1/3 object-cover rounded-l-lg"
      />
      <div className="w-2/3 p-6 flex flex-col justify-between text-black">
        <div>
          <h1 className="text-3xl font-bold mb-2">{movieName}</h1>
          <p className="text-lg mb-1">Theatre: {theatreName}</p>
          <p className="text-lg mb-1">Duration: {duration}</p>
          <p className="text-lg mb-2">Showtime: {showtime}</p>
        </div>
        <div className="flex justify-between mt-4">
          <div className="text-left">
            <p className="text-md font-semibold">Date</p>
            <p className="text-md">{date}</p>
          </div>
          <div className="text-right">
            <p className="text-md font-semibold">Seat</p>
            <p className="text-md">{seatName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
