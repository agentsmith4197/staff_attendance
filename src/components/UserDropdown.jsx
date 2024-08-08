import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db, doc, getDoc } from "../clients/firebase"; // Import `doc` and `getDoc` correctly
import { IoIosHome } from "react-icons/io";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("Fetching profile for user ID:", user.uid);
          const docRef = doc(db, 'users', user.uid);
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            console.log("Document data:", docSnapshot.data());
            setUserProfile(docSnapshot.data());
          } else {
            console.log("No such document!");
          }
        } else {
          console.log("User not logged in.");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
  
    fetchUserProfile();
  }, []);
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="relative font-amiko w-max mx-auto">
      <button
        type="button"
        className="px-4 py-2 flex items-center text-[#333] text-sm outline-none"
        onClick={toggleMenu}
      >
        <img
          src={
            userProfile
              ? userProfile.profilePicture
              : "https://readymadeui.com/profile.webp"
          }
          className="w-10 h-10 mr-3 rounded-full shrink-0"
          alt="Profile"
        />
        <div>
          <p className="text-lg text-white ">
            {userProfile
              ? `${userProfile.surname} ${userProfile.firstName}`
              : "John Doe"}
          </p>
        </div>
      </button>

      {isOpen && (
        <ul className="absolute bg-white py-2 p-1 z-[1000] min-w-full w-max mt-3 shadow-4xl rounded-md max-h-96 overflow-auto">
          <Link
            to="/dashboard/Profile"
            className="text-black text-sm flex items-center hover:bg-[#6A5EFF] rounded px-4 py-3 transition-all"
            onClick={closeMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-4 h-4 mr-3"
              viewBox="0 0 512 512"
            >
              <path
                d="M337.711 241.3a16 16 0 0 0-11.461 3.988c-18.739 16.561-43.688 25.682-70.25 25.682s-51.511-9.121-70.25-25.683a16.007 16.007 0 0 0-11.461-3.988c-78.926 4.274-140.752 63.672-140.752 135.224v107.152C33.537 499.293 46.9 512 63.332 512h385.336c16.429 0 29.8-12.707 29.8-28.325V376.523c-.005-71.552-61.831-130.95-140.757-135.223zM446.463 480H65.537V376.523c0-52.739 45.359-96.888 104.351-102.8C193.75 292.63 224.055 302.97 256 302.97s62.25-10.34 86.112-29.245c58.992 5.91 104.351 50.059 104.351 102.8zM256 234.375a117.188 117.188 0 1 0-117.188-117.187A117.32 117.32 0 0 0 256 234.375zM256 32a85.188 85.188 0 1 1-85.188 85.188A85.284 85.284 0 0 1 256 32z"
                data-original="#000000"
              />
            </svg>
            View profile
          </Link>

          <Link
            to="/dashboard"
            className="text-black text-sm flex items-center hover:bg-[#6A5EFF] rounded px-4 py-3 transition-all"
            onClick={closeMenu}
          >
            <IoIosHome className="w-[18px] h-[18px] mb-1 mr-3" />
            Dashboard
          </Link>
          <li
            className="text-white text-sm flex items-center hover:bg-[#6A5EFF] rounded px-4 py-3 transition-all"
            onClick={closeMenu}
          >
            <Link
              onClick={handleSignOut}
              className="text-black text-sm flex items-center hover:bg-[#6A5EFF] rounded px-4 py-3 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-4 h-4 mr-3"
                viewBox="0 0 6.35 6.35"
              >
                <path
                  d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663 2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
                  data-original="#000000"
                />
              </svg>
              Logout
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserDropdown;
