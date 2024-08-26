import noimage from "../assets/noimage.jpg";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { StarIcon } from "./moviecard";
import { Modal } from "flowbite-react"
import Movie from "../pages/movie";

const ProductCard = ({ product }) => {
  // console.log('this is product',product);
  const { name, image, rating, rank, description, trailer } = product;
  // console.log(trailer);
  const [openModal, setOpenModal] = useState(false);

    function onCloseModal() {
      setOpenModal(false);
    }

  return (
    <>  
      <div className=" hover:scale-110 transition-transform duration-300 transform-gpu mx-auto flex w-full max-w-[375px] flex-col overflow-hidden border-gray-100 rounded-3xl shadow-xl">
        <div className=" rounded-3xl w-[375px] shadow-2xl bg-slate-100">
          <img
            src={image ? image : noimage}
            width="375px"
            height="350px"
            className="rounded-t-3xl justify-center h-[350px] grid object-cover"
            alt="movie.title"
          />
          <Link onClick={() => setOpenModal(true)}>
            <div className="group p-6 grid z-10">
              <div className="group-hover:text-cyan-700 font-bold sm:text-2xl line-clamp-1 transition-all">
                {name}
              </div>
              <span className="text-slate-400 pt-2 font-semibold">(2023)</span>
              <div className="grid-cols-2 flex group justify-between">
                <div className="font-black flex flex-col">
                  <span className="text-yellow-500 text-xl">IMDB SCORE</span>
                  <span className="text-3xl flex gap-x-1 items-center group-hover:text-yellow-500 transition-all">
                    {rating}
                    <StarIcon fill="#eab308" />
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <div className="h-7"></div>
                  <span className="text-3xl font-bold gap-x-2 text-slate-300">
                    # {rank}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <Modal
        className=" bg-black"
        show={openModal}
        size="8xl"
        onClose={onCloseModal}
        popup
      >
        <Modal.Header className="bg-black" />
        <div className=" w-full h-full bg-black">
          <Movie moviename={name} src={image} rate={rating} rank={rank} description={description} trailer={trailer}/>
        </div>
      </Modal>
    </>
  );
};

export default ProductCard;
