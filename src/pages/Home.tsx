import React from "react";
import SkidHavenHeader from "@/components/SkidHavenHeader";
import SkidHavenFooter from "@/components/SkidHavenFooter";
import Index from "./Index";

const Home = () => {
  return (
    <>
      <SkidHavenHeader />
      <Index />
      <SkidHavenFooter />
    </>
  );
};

export default Home;