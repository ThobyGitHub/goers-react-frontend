import React, { useState } from "react";
import StorefrontIcon from "@material-ui/icons/Storefront";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import ContactMailIcon from '@material-ui/icons/ContactMail';
import Button from "@material-ui/core/Button";
import Login from "./Login";
import RegisterAdmin from "./RegisterAdmin";

function Header({ userLogin, onLogin, onLogout, isUserAdmin }) {
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterAdminDialog, setOpenRegisterAdminDialog] = useState(false);

  return (
    <header className="app-header">
      <h1 className="logo">
        <StorefrontIcon className="logo-icon" />
        RestoranKu
      </h1>

      <div className="header-right">
        {!userLogin?.name ? (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LockOpenIcon />}
              onClick={() => setOpenLoginDialog(true)}
            >
              Login
            </Button>

            <Login
              open={openLoginDialog}
              onClose={() => setOpenLoginDialog(false)}
              onLogin={onLogin}
            />
          </>
        ) : (
          <div className="user-section">
            <span className="welcome-text">
              Hello, <strong>{userLogin.name}</strong>
            </span>

            {isUserAdmin && (
              <>
                <Button
                  variant="contained"
                  color="default"
                  startIcon={<ContactMailIcon />}
                  size="small"
                  onClick={() => setOpenRegisterAdminDialog(true)}
                >
                  Register Admin
                </Button>

                <RegisterAdmin
                  open={openRegisterAdminDialog}
                  onClose={() => setOpenRegisterAdminDialog(false)}
                />
              </>
            )}

            <Button
              variant="outlined"
              color="inherit"
              size="small"
              startIcon={<ExitToAppIcon />}
              onClick={onLogout}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
