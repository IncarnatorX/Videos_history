import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../utils/api";

const AuthLogin = () => {
  const navigate = useNavigate();

  const handleAuthFormLogin = async (event) => {
    event.preventDefault();

    const authFormLoginObject = {};

    const formData = new FormData(event.target);

    for (const [name, value] of formData) {
      authFormLoginObject[name] = value;
    }

    console.log(authFormLoginObject);
    event.target.reset();

    // try {
    //   const response = await fetch("http://localhost:8080/login", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },

    //     body: JSON.stringify(authFormLoginObject),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     navigate("/");
    //     toast.success(data.message);
    //   } else {
    //     toast.error(data.message);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }

    try {
      const response = await api.post("/login", authFormLoginObject);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        "Login Error: ",
        error.response.data.message || error.message
      );
    }
  };

  return (
    <form className="form" onSubmit={handleAuthFormLogin}>
      <div style={{ width: "100%" }}>
        <button
          onClick={() => navigate("/")}
          className="back-btn"
          style={{ alignSelf: "flex-start" }}
        >
          <svg
            height="16"
            width="16"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 1024 1024"
          >
            <path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path>
          </svg>
          <span>Back</span>
        </button>
      </div>
      <span className="auth-title">Login</span>

      <div className="auth-div">
        <label htmlFor="auth-email" className="label">
          Email
        </label>

        <input
          type="email"
          id="auth-email"
          name="email"
          required
          className="auth-input"
        />
      </div>
      <div className="auth-div">
        <label htmlFor="auth-password" className="label">
          Password
        </label>
        <input
          type="password"
          id="auth-password"
          name="password"
          required
          className="auth-input"
        />
      </div>

      <button type="submit" className="submit">
        Login{" "}
      </button>
    </form>
  );
};

export default AuthLogin;
