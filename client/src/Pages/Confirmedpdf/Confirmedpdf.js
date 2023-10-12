import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Confirmedpdf() {
    const { id } = useParams();
    const [values, setValues] = useState([]);
    const navigate = useNavigate();

    // Take event details
    useEffect(() => {
        axios.get(`http://localhost:3001/confirmedpdf/${id}`)
            .then((res) => {
                if (res.data && res.data.users && res.data.users.length > 0) {
                    setValues(res.data.users);
                    console.log(res.data);
                } else {
                    alert('No users booked');
                    navigate('/sitedetails');
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id]);

    return (
        <div>
            <section>
                <div className="container">
                    <div className="row mt-5">
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
                                {values.map((user, index) => (
                                    <tr key={user._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{user.name}</td>
                                        <td>{user.place}</td>
                                        <td>{user.number}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            <Link className="btn btn-danger">Fine</Link>
                                            &nbsp;&nbsp;
                                            <button className="btn btn-success">Onsite</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Confirmedpdf;
