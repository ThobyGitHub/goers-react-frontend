import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import Zoom from "@material-ui/core/Zoom";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";

function FilterArea(props) {
  const [isExpanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState({ name: "", day: "", time: "" });

  // function to sync state value of filter
  function handleChange(e) {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }

  // function to expand form
  function expand() {
    setExpanded(true);
  }

  // function to close form
  function closeForm() {
    setFilters({ name: "", day: "", time: "" });
    props.onFilter({ name: "", day: "", time: "" });
    setExpanded(false);
  }

  // function to call function in app.jsx to filter the list of restaurant
  function submitFilter(e) {
    e.preventDefault();
    props.onFilter(filters);
  }

  return (
    <div>
      <form className="filter-restaurant" onSubmit={submitFilter}>
        
        {/* Close Button */}
        {isExpanded && (
          <IconButton
            size="small"
            onClick={closeForm}
            className="close-button"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}

        <input
          name="name"
          onClick={expand}
          onChange={handleChange}
          value={filters.name}
          placeholder="Type name to filter..."
        />

        {isExpanded && (
          <span style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <select name="day" onChange={handleChange} value={filters.day}>
              <option value="">Select Day</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="7">Sunday</option>
            </select>

            <input
              type="time"
              name="time"
              onChange={handleChange}
              value={filters.time}
            />
          </span>
        )}

        <Zoom in={isExpanded}>
          <Fab type="submit" color="primary" className="search-button">
            <SearchIcon />
          </Fab>
        </Zoom>

      </form>
    </div>
  );
}

export default FilterArea;
