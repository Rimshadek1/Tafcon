import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Fine() {
    const { user_id } = useParams();
    const eventId = new URLSearchParams(window.location.search).get('eventId'); // Access eventId from query parameter

    const navigate = useNavigate();
    const [fineFor, setFineFor] = useState();
    const [fine, setFine] = useState();

    const handleSubmit = () => {
        axios.post(`http://localhost:3001/fine/${user_id}`, { eventId: eventId, fineFor, fine })
            .then((res) => {
                if (res.data.status === 'ok') {
                    alert('Fine given');
                    navigate(-1); // Go back to the previous page
                } else {
                    alert('Error: ' + res.data.message); // Alert the error message
                }
            })
            .catch((error) => {
                console.error(error);
                alert('Fine is already marked for this user and event');
            });
    }


    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 g-5">
                    <form onSubmit={handleSubmit}>
                        <legend>Add Event</legend>
                        <div className="form-group mt-4">
                            <label htmlFor="fineFor">Fine for</label>
                            <input
                                type="text"
                                className="form-control"
                                name="fineFor"
                                id="fineFor"
                                placeholder="Fine For"
                                onChange={(e) => setFineFor(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="time">Fine amount</label>
                            <input
                                type="number"
                                className="form-control"
                                name="fine"
                                id="fine"
                                placeholder="Fine"
                                onChange={(e) => setFine(e.target.value)}
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

export default Fine;
