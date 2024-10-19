import React from "react";
import convertTime from "../../utils/convertTime";
const SidePanel = ({doctorId,ticketPrice,timeSlots}) => {
  return (
    <div className="p-3 rounded-md shadow-panelShadow lg:p-5 ">
      <div className="flex items-center justify-between">
        <p className="mt-0 font-semibold text_para">Ticket price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {ticketPrice} BDT
        </span>
      </div>

      <div className="mt-[30px]">
        <p className="mt-0 font-semibold text_para text-headingColor">
          Available time slots:
        </p>
        <ul className="mt-3">
          {timeSlots?.map((item,index) => (
                      <li key={index} className="flex items-center justify-between mb-2">
                      <p className="text-[15px] leading-6 text-textColor font-semibold">
                        {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
                      </p>
                      <p className="text-[15px] leading-6 text-textColor font-semibold">
                        {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
                      </p> 
                    </li>
          ))}


        </ul>
      </div>
      <button className="w-full px-2 rounded-md btn">Book appointment</button>
    </div>
  );
};

export default SidePanel;
