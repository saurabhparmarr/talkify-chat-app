import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="navbar border-b border-gray-200 bg-white/90 px-4 shadow-sm backdrop-blur">
      <div className="flex-1">
        <Link to="/" className="text-xl font-semibold tracking-tight text-indigo-600">
          Talkify
        </Link>
      </div>

      {authUser && (
        <div className="flex-none" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-indigo-100 bg-white p-0 shadow-sm transition hover:shadow-md"
          >
            <img
              alt="profile"
              src={
                authUser?.profilePic ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              className="h-10 w-10 rounded-full object-cover"
            />
          </button>

          {isMenuOpen && (
            <div className="absolute right-4 z-50 mt-2 w-48 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
              <Link
                to="/profile"
                className="block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="mt-1 block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;