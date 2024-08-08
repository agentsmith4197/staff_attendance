import React from "react";
import { useLocation } from "react-router-dom";
import UserDropdown from './UserDropdown';

function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  const title = pathname.replace('/dashboard/', '').replace('/', ' ');

  return (
    <div className="sticky top-0 font-kanit flex justify-center py-2 z-50 shadow-3xl bg-[#0A0A1F]">
      <div className="container mx-auto items-center">
        <div className="px-5 flex justify-between items-center">
          <div>
            <h2 className="capitalize font-bold text-[30px] text-[#6A5EFF]">{title}</h2>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-4 cursor-pointer">
              <UserDropdown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
