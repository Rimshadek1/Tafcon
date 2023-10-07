import React, { useState } from 'react'
import axios from 'axios';
function Addevents() {
    const [location, setLocation] = useState()
    const [time, setTime] = useState()
    const [date, setDate] = useState()
    const [event, setEvent] = useState()
    const [slot, setSlot] = useState()

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('location', location);
        formData.append('time', time);
        formData.append('date', date);
        formData.append('event', event);
        formData.append('slot', slot);

        axios.post('http://localhost:3001/addevent', formData)
            .then((res) => {
                // Check the response for success
                if (res.data.status === 'ok') {
                    // Redirect to the home page or perform any other action on success
                    window.location.href = '/viewevents';
                } else {
                    // Handle any specific error messages from the server and show an alert
                    alert('Failed to add event. Please check your data and try again.');
                }
            })
            .catch((error) => {
                // Handle network errors or unexpected errors
                console.error(error);
                alert('An error occurred while adding the event.');
            });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 g-5">
                    <form onSubmit={handleSubmit}>
                        <legend>Add Event</legend>

                        <div className="form-group mt-4">
                            <label htmlFor="location">Location</label>
                            <input
                                type="text"
                                className="form-control"
                                name="location"
                                id="location"
                                placeholder="Location of work"
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor="time">Time</label>
                            <input
                                type="text"
                                className="form-control"
                                name="time"
                                id="time"
                                placeholder="Time of work"
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                id="date"
                                placeholder="Date of work"
                                onChange={(e) => setDate(e.target.value)}

                            />
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor="event">Event Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="event"
                                placeholder="Event name"
                                id="event"
                                onChange={(e) => setEvent(e.target.value)}
                            />
                        </div>

                        <div className="form-group mt-2">
                            <label htmlFor="slot">Slot Left</label>
                            <input
                                type="number"
                                className="form-control"
                                name="slot"
                                placeholder="Slot left"
                                id="slot"
                                onChange={(e) => setSlot(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary mt-2">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Addevents