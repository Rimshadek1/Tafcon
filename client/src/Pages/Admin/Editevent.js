import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

function Editevent() {
    const { eventId } = useParams(); // Get the eventId from the URL

    const [event, setEvent] = useState({
        Location: '',
        Time: '',
        Date: '',
        Event_name: '',
        Slot_left: '',
        ppp: ''
    });
    useEffect(() => {
        if (eventId) { // Check if eventId is defined
            // Fetch the event data using the eventId from your backend
            axios.get(`http://localhost:3001/edit-event/${eventId}`)
                .then((res) => {
                    console.log(eventId);

                    const eventData = res.data; // Assuming your backend returns the event data as JSON
                    setEvent(eventData);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [eventId]);



    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform your form submission logic here, e.g., send the updated event data to your backend
        axios.post(`http://localhost:3001/admin/edit-eventss/${eventId}`, event)
            .then((res) => {
                // Check the response for success
                if (res.data.status === 'ok') {
                    // Redirect to the appropriate page on success
                    window.location.href = '/viewevents';
                } else {
                    // Handle any specific error messages from the server and show an alert
                    alert('Failed to update event. Please check your data and try again.');
                }
            })
            .catch((error) => {
                // Handle network errors or unexpected errors
                console.error(error);
                alert('An error occurred while updating the event.');
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent({ ...event, [name]: value });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <form onSubmit={handleSubmit}>
                        <legend>Edit Event</legend>

                        <div className="form-group">
                            <label htmlFor="Location">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Location"
                                id="Location"
                                placeholder="Location"
                                value={event.location}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Time">Time</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Time"
                                id="Time"
                                placeholder="Time"
                                value={event.time}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Date">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="Date"
                                id="Date"
                                placeholder="Date"
                                value={event.date}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Event_name">Event Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="Event_name"
                                placeholder="Event_name"
                                id="Event_name"
                                value={event.event}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Slot_left">Slot Left</label>
                            <input
                                type="number"
                                className="form-control"
                                name="Slot_left"
                                placeholder="Slot_left"
                                id="Slot_left"
                                value={event.slot}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Editevent