import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/Viewevents.css'
function Viewevents() {
    const [events, setEvents] = useState([]);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [suc, setSuc] = useState();
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    useEffect(() => {
        // Make an HTTP GET request to your backend endpoint that retrieves events
        axios.get('http://localhost:3001/viewevent')
            .then((res) => {
                setEvents(res.data); // Set the events data received from the backend
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    useEffect(() => {
        axios.get('http://localhost:3001/viewevents').then(res => {
            console.log(res.data);
            if (res.data.status === 'success') {
                console.log('ok');
                setSuc('success okk')
            } else {
                alert('status failed')
                navigate('/')
            }
        }).catch(err => console.log(err))
    }, []);


    const handleDelete = (id) => {
        axios.delete(`http://localhost:3001/admin/delete-event/${id}`)
            .then((res) => {
                // Check if the delete operation was successful
                if (res.data.status === 'ok') {
                    setDeleteSuccess(true); // Set the success state to true
                    // Fetch the updated events after successful deletion
                    axios.get('http://localhost:3001/viewevent')
                        .then((res) => {
                            setEvents(res.data);
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
            });
        setTimeout(() => {
            setDeleteSuccess(false);
        }, 5000);

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
                                <th scope="col">Location</th>
                                <th scope="col">Time</th>
                                <th scope="col">Date</th>
                                <th scope="col">Event_name</th>
                                <th scope="col">Slot_left</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={event._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{event.location}</td>
                                    <td>{event.time}</td>
                                    <td>{event.date}</td>
                                    <td>{event.event}</td>
                                    <td>{event.slot}</td>
                                    <td>
                                        <Link to={`/editevents/${event._id}`} className="btn btn-primary ">
                                            Edit
                                        </Link>


                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(event._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {deleteSuccess && (
                        <div className="alert alert-danger delete-alert" role="alert">
                            Event deleted successfully!
                        </div>
                    )}
                </div>
            </section >
        </div >
    );
}

export default Viewevents;
