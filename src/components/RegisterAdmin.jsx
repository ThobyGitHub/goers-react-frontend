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

function RegisterAdmin(props) {
  const [errorMessage, setErrorMessage] = useState("");

  const [formRegisterAdmin, setFormRegisterAdmin] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  // function to sync state value of form
  function handleChange(event) {
    const { name, value } = event.target;

    setFormRegisterAdmin(prevFormRegisterAdmin => {
      return {
        ...prevFormRegisterAdmin,
        [name]: value
      };
    });
  }
  
  // function to send request to API to Register Admin
  async function submitRegisterAdmin(event) {
    event.preventDefault();
    setErrorMessage("");
    try {

      // call RegisterAdmin
      await axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/register`,
        { name: formRegisterAdmin.name, email: formRegisterAdmin.email, password: formRegisterAdmin.password, password_confirmation: formRegisterAdmin.password_confirmation },
      );

      alert("admin has been added, you can try login later.")
      // localStorage.setItem("token", response.data.token);
      // props.onRegisterAdmin(response.data);

      // clear form
      setFormRegisterAdmin({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
      });
      // close dialog
      props.onClose()
    } catch (error) {
      console.error(error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Register Admin failed");
      } else {
        // Network error
        setErrorMessage("Network error. Please try again.");
      }
    }
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Register Admin
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
        <form onSubmit={submitRegisterAdmin} className="register-form">
          <TextField
            label="name"
            name="name"
            value={formRegisterAdmin.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="email"
            name="email"
            value={formRegisterAdmin.email}
            onChange={handleChange}
            required
          />
          <TextField
            type="password"
            label="password"
            name="password"
            value={formRegisterAdmin.password}
            onChange={handleChange}
          />
          <TextField
            type="password"
            label="retype password"
            name="password_confirmation"
            value={formRegisterAdmin.password_confirmation}
            onChange={handleChange}
          />
          
          <Button type="submit" variant="contained" color="primary" startIcon={<LockOpenIcon />}>
            Register Admin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RegisterAdmin;
