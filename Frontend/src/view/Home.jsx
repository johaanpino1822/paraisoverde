import React from "react";
import Carrousel from "../components/Carrousel";
import Card from "../components/Card";
import Mapa from "../components/Mapa";
import Footer from "../components/Footer";
import WppChat from "../components/whatsappchat"
import Bottom from "../components/Bottom"


function Home() {
  return (
    <div>
    <Carrousel/> 
    <Card/>
    <Mapa/>
    <Bottom/>
    
    <Footer/>
    <WppChat/> 
   

    </div>
  );
}

export default Home;
