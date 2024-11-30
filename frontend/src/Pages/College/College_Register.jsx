import React from 'react';
import { Col_Reg } from './Col_Reg';
import wpimage from "./wp7213440.jpg";

export const College_Register = () => {
  return (
    <div className="flex h-screen">
      <img src={wpimage} alt="BackImage" className="w-full h-full absolute inset-0 object-cover z--1"></img>
      <div className="z-10 flex items-center justify-center w-full">
      <Col_Reg />
      </div>
    </div>
  );
};

