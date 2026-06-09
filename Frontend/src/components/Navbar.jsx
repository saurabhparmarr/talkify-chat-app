import { Link } from "react-router-dom";
import  useAuthStore  from "../store/useAuthStore";
const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          Talkify
        </Link>
      </div>
      {authUser && (
  <div className="flex-none">
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="profile"
            src={
              authUser?.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
          />
        </div>
      </div>

      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
      >
        <li>
          <Link to="/profile">Profile</Link>
        </li>

        <li>
          <p onClick={logout}>Logout</p>
        </li>
      </ul>
    </div>
  </div>
)}
    </div>
  );
};
export default Navbar;