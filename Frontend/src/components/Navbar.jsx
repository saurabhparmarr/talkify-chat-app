import { Link } from "react-router-dom";
import  useAuthStore  from "../store/useAuthStore";
const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  return (
    <div className="navbar relative z-50 min-h-16 shrink-0 overflow-visible border-b border-white/10 bg-[#090815] px-4 text-white shadow-lg shadow-black/20">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold text-white hover:bg-white/10">
          Talkify
        </Link>
      </div>
      {authUser && (
  <div className="flex-none">
    <div className="dropdown dropdown-end relative z-50">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar hover:bg-white/10"
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
        className="menu menu-sm dropdown-content z-[100] mt-3 w-52 rounded-xl border border-white/10 bg-[#151326] p-2 text-violet-50 shadow-2xl"
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
