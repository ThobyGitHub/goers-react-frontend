import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Restaurant from "./Restaurant";
import CreateArea from "./CreateArea";
import FilterArea from "./FilterArea";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

import axios from "axios";

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [userLogin, setUserLogin] = useState({
    name: "",
    email: "",
    token: "",
    role_name: "",
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

  // function to check if logged in user is admin
  function isUserAdmin(){
    if(userLogin === null){
      return false
    }
    if(userLogin.name !== "" && userLogin.email !=="" && userLogin.token !== "" && userLogin.role_name === "admin"){
      return true
    }
    return false
  }

  // function to get list of restaurant
  async function fetchRestaurants(filters = {}) {
    try {
      const params = {};

      if (filters.name) params.name = filters.name;
      if (filters.day) params.day = filters.day;
      if (filters.time) params.time = filters.time;

      const res = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/restaurants`, { params });
      setRestaurants(res.data);
    } catch (error) {
      console.error("Error fetching restaurants", error);
    }
  }

  // function to get detail of user info based on token (login)
  async function getUserInfo() {
    try {
      const token = localStorage.getItem("token");
      await axios.get(`${process.env.REACT_APP_BASE_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setUserLogin(res.data);
      })
      .catch(() => {
        setUserLogin(null);
      });
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("token");
        setUserLogin(null);
      }
      console.error("Error fetch user login", error);
    }
  }
  
  // Fetch restaurants from API on mount and get user info when first load
  useEffect(() => {
    fetchRestaurants() 
    if(localStorage.getItem("token")){
      getUserInfo()
    }
  }, []);
  
  // function to handleLogout
  function handleLogout() {
    localStorage.removeItem("token");
    setUserLogin(null);
  }

  // function to send request to API to create new restaurant
  async function addResto(newRestaurant) {
    const token = localStorage.getItem("token");
    await axios.post(`${process.env.REACT_APP_BASE_API_URL}/restaurants`, newRestaurant, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log("Restaurant saved:", response.data);
        // Optionally update with backend ID
        setRestaurants(prevRestaurants => {
          return [...prevRestaurants, response.data];
        });
      })
      .catch(error => {
        console.error("Error saving restaurant:", error);
      });
  }

  // function to send request to API to update a restaurant
  async function updateResto(updatedRestaurant) {
    const token = localStorage.getItem("token");
    await axios.patch(`${process.env.REACT_APP_BASE_API_URL}/restaurants/${updatedRestaurant.id}`, updatedRestaurant, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log("Restaurant updated:", response.data);
        setRestaurants(prevRestaurants =>
          prevRestaurants.map(resto =>
            resto.id === response.data.id ? response.data : resto
          )
        );
      })
      .catch(error => {
        console.error("Error updating restaurant:", error);
      });
  }

  // function to send request to API to delete a restaurant
  async function  deleteResto(id) {
    const restaurantToDelete = restaurants.find(r => r.id === id);
    
    const token = localStorage.getItem("token");
    await axios.delete(`${process.env.REACT_APP_BASE_API_URL}/restaurants/${restaurantToDelete.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        console.log("Restaurant deleted:", response.data);
      })
      .catch(error => {
        console.error("Error deleting restaurant:", error);
      });
    setRestaurants(prevRestaurants => {
      return prevRestaurants.filter((restaurantItem, index) => {
        return restaurantItem.id !== id;
      });
    });
  }

  return (
    <div>
      <Header isUserAdmin={isUserAdmin()} onLogin={setUserLogin} userLogin={userLogin} onLogout={handleLogout}/>

      {/* create section */}
      {isUserAdmin() && 
      <div>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenCreateDialog(true)}
          className="create-fab"
        >
          <AddIcon />
        </Fab>

        <CreateArea
          open={openCreateDialog}
          onClose={() => setOpenCreateDialog(false)}
          onAdd={addResto}
      />
      </div>}

      {/* filter section */}
      <FilterArea onFilter={fetchRestaurants} />
      
        {restaurants.length === 0 ? (
          <div
            className="no-restaurant-found"
          >
            <div>
              <div className="no-restaurant-icon">
                <span role="img" aria-label="restaurant">
                  🍽️
                </span>
              </div>
              <p className="no-restaurant-text">
                No restaurants found.
              </p>
            </div>
          </div>
        ) : (
          <div className="restaurant-list">
            {restaurants.map((resto) => (
                <Restaurant
                  key={resto.id}
                  id={resto.id}
                  restaurant={resto}
                  onDelete={deleteResto}
                  isUserAdmin={isUserAdmin()}
                  onUpdate={updateResto}
                />
              ))
            }
          </div>
        )}

      <Footer />
    </div>
  );
}

export default App;
