import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

function CreateArea(props) {

  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    phone_number: "",
    note: "",
    open_times: [
      {
        id:"",
        day_start: "",
        day_end: "",
        time_start: "",
        time_end: ""
      }
    ]
  });

  // function to sync state value of restaurant
  function handleChange(event) {
    const { name, value } = event.target;

    setRestaurant(prevRestaurant => {
      return {
        ...prevRestaurant,
        [name]: value
      };
    });
  }

  // handle state value of open times
  function handleOpenTimeChange(index, event) {
    const { name, value } = event.target;
  
    const updated = [...restaurant.open_times];
    updated[index][name] = value;
  
    setRestaurant(prev => ({
      ...prev,
      open_times: updated
    }));
  }
  
  function addOpenTimeRow() {
    setRestaurant(prev => ({
      ...prev,
      open_times: [
        ...prev.open_times,
        { day_start: "", day_end: "", time_start: "", time_end: "" }
      ]
    }));
  }
  
  function removeOpenTimeRow(index) {
    const updated = restaurant.open_times.filter((_, i) => i !== index);
  
    setRestaurant(prev => ({
      ...prev,
      open_times: updated
    }));
  }
  // ---

  // function to call function in app.jsx to create a new restaurant
  async function submitRestaurant(event) {
    event.preventDefault();
    await props.onAdd(restaurant);
    setRestaurant({
      name: "",
      address: "",
      phone_number: "",
      note: "",
      open_times: [
        {
          id:"",
          day_start: "",
          day_end: "",
          time_start: "",
          time_end: ""
        }
      ]
    });
    props.onClose()
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Add New Restaurant
        <IconButton
          aria-label="close"
          onClick={props.onClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={submitRestaurant} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Name"
            name="name"
            value={restaurant.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Address"
            name="address"
            value={restaurant.address}
            onChange={handleChange}
          />
          <TextField
            label="Phone Number"
            name="phone_number"
            value={restaurant.phone_number}
            onChange={handleChange}
          />
          <TextField
            label="Note"
            name="note"
            value={restaurant.note}
            onChange={handleChange}
            multiline
            rows={3}
          />
          <h4>Open Hours</h4>

          {restaurant.open_times.map((openTime, index) => (
            <div key={index} style={{ 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr 1fr 1fr auto",
              gap: "10px",
              alignItems: "center"
            }}>
              
              {/* <TextField
                label="Day Start"
                name="day_start"
                value={openTime.day_start}
                onChange={(e) => handleOpenTimeChange(index, e)}
              /> */}
              <select name="day_start" onChange={(e) => handleOpenTimeChange(index, e)} value={openTime.day_start}>
                <option value="0">Select Day</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="7">Sunday</option>
              </select>

              {/* <TextField
                label="Day End"
                name="day_end"
                value={openTime.day_end}
                onChange={(e) => handleOpenTimeChange(index, e)}
              /> */}
              <select name="day_end" onChange={(e) => handleOpenTimeChange(index, e)} value={openTime.day_end}>
                <option value="0">Select Day</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
                <option value="7">Sunday</option>
              </select>

              <TextField
                type="time"
                label="Time Start"
                name="time_start"
                InputLabelProps={{ shrink: true }}
                value={openTime.time_start}
                onChange={(e) => handleOpenTimeChange(index, e)}
              />

              <TextField
                type="time"
                label="Time End"
                name="time_end"
                InputLabelProps={{ shrink: true }}
                value={openTime.time_end}
                onChange={(e) => handleOpenTimeChange(index, e)}
              />

              <Button
                color="secondary"
                onClick={() => removeOpenTimeRow(index)}
              >
                X
              </Button>
            </div>
          ))}
          
          <Button
            onClick={addOpenTimeRow}
            variant="outlined"
          >
            + Add Open Hour
          </Button>

          <Button type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
            Add Restaurant
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateArea;
