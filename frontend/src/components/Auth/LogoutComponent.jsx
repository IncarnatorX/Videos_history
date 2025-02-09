import { useContext, useState } from "react";
import { AuthContext } from "../../Context/Context";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../utils/api";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AvatarComponent from "../Avatar/AvatarComponent";

const LogoutComponent = () => {
  const { user, setUser, setUserLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleUserLogout() {
    try {
      const response = await api.post("/logout", user._id, {
        withCredentials: true,
      });

      if (response.status === 200) {
        sessionStorage.removeItem("user");
        setUser({});
        setUserLoggedIn(false);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error("Error while logging out!!");
      console.error(error.message);
    } finally {
      handleClose();
    }
  }

  function handleUserAccount() {
    navigate("/account", { state: user });
  }

  return (
    <div className="cursor-pointer">
      <div
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <AvatarComponent owner={user} />
      </div>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleUserAccount}>My account</MenuItem>
        <MenuItem onClick={handleUserLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default LogoutComponent;
