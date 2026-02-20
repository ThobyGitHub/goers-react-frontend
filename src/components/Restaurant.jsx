import React, {useState} from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import BusinessIcon from '@material-ui/icons/Business';
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import UpdateArea from "./UpdateArea";


function Restaurant(props) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [open, setOpen] = useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const openTimes = props.restaurant.open_times ?? [];

  // function to call function in app.jsx to delete a restaurant
  function handleDeleteClick(e) {
    e.stopPropagation();
    setOpenDeleteDialog(true);
  }
  
  function confirmDelete() {
    props.onDelete(props.id);
    setOpenDeleteDialog(false);
  }
  
  function cancelDelete() {
    setOpenDeleteDialog(false);
  }

  // function to open dialog info
  function openDialogInfo() {
    setOpen(true);
  };

  // function to close dialog info
  function closeDialogInfo() {
    setOpen(false);
  };

  // this function to remove second in time from API
  function formatTime(time) {
    if (!time) return "";
    return time.substring(0, 5);
  }

  // function to get html code of open times list info
  function OpenTimesList({ openTimes, days, formatTime }) {
    if (openTimes.length === 0) {
      return <p>No open times data found.</p>;
    }
  
    return (
      <div className="open-times">
        <strong>Open Times:</strong>
        <ul>
          {openTimes.map((ot) => (
            <li key={ot.id}>
              <strong>
                {ot.day_start === ot.day_end
                  ? days[ot.day_start - 1]
                  : days[ot.day_start - 1] + " to " + days[ot.day_end - 1]}
              </strong>: {formatTime(ot.time_start)} - {formatTime(ot.time_end)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <>
      {/* Card */}
      <div className="restaurant-card" onClick={openDialogInfo} style={{ cursor: "pointer" }}>
        <div className="card-header" onClick={(e) => e.stopPropagation()} style={{ alignItems: "center", gap: "8px" }}>
          <BusinessIcon color="primary" style={{ fontSize: 28 }} />
          <h2 style={{ flexGrow: 1 }}>{props.restaurant.name}</h2>

          {props.isUserAdmin && (
            <div className="action-buttons">
              <IconButton
                variant="contained"
                color="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  e.currentTarget.blur();
                  setOpenUpdateDialog(true);
                }}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                variant="contained"
                color="secondary"
                size="small"
                onClick={handleDeleteClick}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          )}

          <UpdateArea
            open={openUpdateDialog}
            onClose={() => setOpenUpdateDialog(false)}
            onUpdate={props.onUpdate}
            restaurant={props.restaurant}
          />
        </div>
        <div className="card-body">
          <OpenTimesList
            openTimes={openTimes}
            days={days}
            formatTime={formatTime}
          />
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onClose={closeDialogInfo} maxWidth="sm" fullWidth>
        <DialogTitle>
          <BusinessIcon color="primary" style={{ fontSize: 28, paddingTop:5 }} />
            {props.restaurant.name}
          <IconButton aria-label="close" onClick={closeDialogInfo} style={{position: "absolute", right:8, top:8}}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {props.restaurant.address && (
            <Typography variant="body1" gutterBottom>
              <strong>Address:</strong> {props.restaurant.address}
            </Typography>
          )}
          {props.restaurant.phone_number && (
            <Typography variant="body1" gutterBottom>
              <strong>Phone:</strong> {props.restaurant.phone_number}
            </Typography>
          )}
          {props.restaurant.note && (
            <Typography variant="body1" gutterBottom>
              <strong>Note:</strong> {props.restaurant.note}
            </Typography>
          )}

          <OpenTimesList openTimes={openTimes} days={days} formatTime={formatTime} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={cancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete <strong>{props.restaurant.name}</strong>?
          </Typography>

          <div className="delete-button">
            <IconButton onClick={cancelDelete}>
              <CloseIcon />
            </IconButton>

            <IconButton color="secondary" onClick={confirmDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Restaurant;
