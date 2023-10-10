import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './css/Empinfo.css'
function Empinfo() {
    const [user, setUser] = useState([]);
    const [zoomed, setZoomed] = useState(null);
    useEffect(() => {

        axios.get('http://localhost:3001/viewuser').then((res) => {
            console.log(res.data);
            setUser(res.data)
        })
    }, [])
    // Function to handle image click
    const handleImageClick = (userId) => {
        // Toggle zoomed state for the clicked image
        if (zoomed === userId) {
            setZoomed(null); // Zoom out
        } else {
            setZoomed(userId); // Zoom in
        }
    };

    return (
        <div>
            <section>
                <div className="container">
                    <div className="row mt-5">
                        <div className="col">
                            <Link to="/addevents" className="btn btn-primary ml-auto">
                                Add Event
                            </Link>
                        </div>
                        <div className="col">
                            <Link to="/empinfo" className="btn btn-info ml-auto">
                                View Employees
                            </Link>
                        </div>
                        <div className="col">
                            <a href="/admin/add-salary" className="btn btn-success ml-auto">
                                Add Salary
                            </a>
                        </div>
                        <div className="col">
                            <a href="/admin/view-salary" className="btn btn-warning ml-auto">
                                View Salary
                            </a>
                        </div>
                        <div className="col">
                            <a href="/admin/withdraw" className="btn btn-danger ml-auto">
                                Withdraw Salary
                            </a>
                        </div>
                    </div>
                    <table className="table mt-5">
                        <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Place</th>
                                <th scope="col">Number</th>
                                <th scope="col">Role</th>
                                <th scope="col">Profile</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((users, index) => (
                                <tr key={users._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{users.name}</td>
                                    <td>{users.place}</td>
                                    <td>{users.number}</td>
                                    <td>{users.role}</td>
                                    <td>
                                        <img
                                            className={`imaged w32 pointer-cursor ${zoomed === users._id ? 'zoom-image zoomed' : ''}`}
                                            src={`http://127.0.0.1:3001/Profile-pictures/${users._id}.png`} // PNG image URL
                                            onError={(e) => {
                                                e.target.onerror = null; // Prevent infinite loop
                                                e.target.src = `http://127.0.0.1:3001/Profile-pictures/${users._id}.jpg`; // Try JPG if PNG fails
                                            }}
                                            onClick={() => handleImageClick(users._id)} // Handle image click
                                            alt={`${users.name}'s Profile`}
                                        />
                                    </td>
                                    <td>
                                        <Link to={`/editrole/${users._id}`} className="btn btn-primary">
                                            Edit Role
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>

                </div>
            </section >
        </div>
    )
}


export default Empinfo;