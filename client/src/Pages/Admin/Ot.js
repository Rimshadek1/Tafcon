import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function Ot() {
    const { user_id } = useParams();
    const eventId = new URLSearchParams(window.location.search).get('eventId'); // Access eventId from query parameter

    const navigate = useNavigate();
    const [otFor, setOtFor] = useState();
    const [ot, setOt] = useState();
    const handleSubmit = () => {
        axios.post(`http://localhost:3001/ot/${user_id}`, { eventId: eventId, otFor, ot })
            .then((res) => {
                if (res.data.status === 'ok') {
                    alert('Ot given');
                    navigate(-1); // Go back to the previous page
                } else {
                    alert('Error: ' + res.data.message); // Alert the error message
                }
            })
            .catch((error) => {
                console.error(error);
                alert(error);
            });
    }
    return (
        <div className="container">
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 g-5">
                    <form onSubmit={handleSubmit}>
                        <legend>Add Event</legend>
                        <div className="form-group mt-4">
                            <label htmlFor="otFor">Over time for</label>
                            <input
                                type="text"
                                className="form-control"
                                name="otFor"
                                id="otFor"
                                placeholder="Ot For"
                                onChange={(e) => setOtFor(e.target.value)}
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="ot">OT amount</label>
                            <input
                                type="number"
                                className="form-control"
                                name="ot"
                                id="ot"
                                placeholder="ot"
                                onChange={(e) => setOt(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary mt-2">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Ot