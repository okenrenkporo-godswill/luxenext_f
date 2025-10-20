"use client";

import React from "react";
import Headers from "./Headers";
import ProductsPage from "@/app/product/page";
import HeroBanner from "./HeroBanner";
import Footer from "./Footer";

import Message from "./Message";
import CategoryProducts from "./Category";


const HomePage = () => {
  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Sticky header */}
      
      <main className="pt-24 w-full"> {/* space from header */}
        {/* Hero Banner Section */}
        <section className="w-full -mt-8">
        
          <HeroBanner />
        </section>

        {/* Products Page Section */}
        <section className="mt-10 px-4 md:px-0 max-w-full">
          <ProductsPage />
          
   
        </section>  <Message/>
        <section className="mt-10 px-4 md:px-0 max-w-full">
          <CategoryProducts />
        </section>
        {/* Footer Section */}
      
      
      </main>
    </div>
  );
};

export default HomePage;
