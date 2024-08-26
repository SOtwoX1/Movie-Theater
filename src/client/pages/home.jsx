import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavbarFlow } from "../component/navbar";
import Megabar from "./../component/megabar";
import Imageslider from "./../component/imageslider";
import Products from "./../component/Product";
import Footer from "./../component/footer";
import ProductSearchForm from "./../component/ProductSearchForm";
import { TermOfService } from "../component/termofservice";
import ContactForm from "./contact"

export function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [test,setTest] =useState([])
  // console.log('Filtered products from parent component:', filteredProducts);
  console.log('test',test);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const currentTime = new Date().getTime();

    if (token && tokenExpiration && currentTime < tokenExpiration) {
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
    }
  }, []);

  return (
    <div id="home">
    {/* <TermOfService /> */}
    {isLoggedIn ? <NavbarFlow /> : <Megabar />}
    <div id="member">
        <Imageslider />
      </div>
      <div id="search">
        <ProductSearchForm setFilteredProducts={setFilteredProducts} />
      </div>
      <div id="product">
        <Products props={filteredProducts} />
      </div>
      <div id="contact" >
        <ContactForm />
        <Footer />
      </div>
    </div>
  );
}
