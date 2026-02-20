import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import axios from "axios";

function Login(props) {
  const [errorMessage, setErrorMessage] = useState("");

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  // function to sync state value of form
  function handleChange(event) {
    const { name, value } = event.target;

    setFormLogin(prevFormLogin => {
      return {
        ...prevFormLogin,
        [name]: value
      };
    });
  }
  
  // function to send request to API to login
  async function submitLogin(event) {
    event.preventDefault();
    setErrorMessage("");
    try {

      // call login
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/login`,
        { email: formLogin.email, password: formLogin.password },
      );

      localStorage.setItem("token", response.data.token);
      props.onLogin(response.data);

      // clear form
      setFormLogin({
        email: "",
        password: ""
      });
      // close dialog
      props.onClose()
    } catch (error) {
      console.error(error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Login failed");
      } else {
        // Network error
        setErrorMessage("Network error. Please try again.");
      }
    }
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Login
        <IconButton
          aria-label="close"
          onClick={props.onClose}
          className="close-button"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {errorMessage && (
          <div className="error-box">
            {errorMessage}
          </div>
        )}
        <form onSubmit={submitLogin} className="login-form">
          <TextField
            label="email"
            name="email"
            value={formLogin.email}
            onChange={handleChange}
            required
          />
          <TextField
            type="password"
            label="password"
            name="password"
            value={formLogin.password}
            onChange={handleChange}
          />
          
          <Button type="submit" variant="contained" color="primary" startIcon={<LockOpenIcon />}>
            Login
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default Login;
