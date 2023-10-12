import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const [name, setName] = useState()
    const [place, setPlace] = useState()
    const [number, setNumber] = useState()
    const [otp, setOtp] = useState()
    const [password, setPassword] = useState()
    const [image, setImage] = useState(null)
    const navigate = useNavigate()
    //image manage
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };
    //handle submit
    const handleSubmit = (e) => {
        e.preventDefault();


        const formData = new FormData();
        formData.append('name', name);
        formData.append('place', place);
        formData.append('number', number);
        formData.append('otp', otp);
        formData.append('password', password);
        formData.append('image', image);
        formData.append('role', 'class-C');

        axios.post('http://localhost:3001/register', formData)
            .then((res) => {

                navigate('/login')
            })
            .catch((error) => {

                console.error(error);
                alert('An error occurred during registration.');

            });
    };


    return (
        <div>
            <div class="appHeader no-border transparent position-absolute">
                <div class="left">
                    <a href="#" class="headerButton goBack">
                        <ion-icon name="chevron-back-outline"></ion-icon>
                    </a>
                </div>
                <div class="pageTitle"></div>
                <div class="right">
                    <Link to="/login" class="headerButton">
                        Login
                    </Link>
                </div>
            </div>

            {/* body */}
            <div id="appCapsule">
                <div className="section mt-2 text-center">
                    <h1>Register now</h1>
                    <h4>Create an account</h4>
                </div>
                <form onSubmit={handleSubmit} method="POST" enctype="multipart/form-data">
                    <div className="section mb-5 p-2">
                        <div className="card">
                            <div className="card-body">
                                <div className="form-group basic">
                                    <div className="input-wrapper">
                                        <label className="label" htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            required
                                            onChange={(e) => setName(e.target.value)}
                                            id="name"
                                            placeholder="Your Name" />
                                        <i className="clear-input">
                                            <ion-icon name="close-circle"></ion-icon>
                                        </i>
                                    </div>
                                </div>
                                <div className="form-group basic">
                                    <div className="input-wrapper">
                                        <label className="label" htmlFor="place">Place</label>
                                        <input type="text"
                                            className="form-control"
                                            required
                                            name="place" id="place"
                                            onChange={(e) => setPlace(e.target.value)}
                                            placeholder="Your Place" />
                                        <i className="clear-input">
                                            <ion-icon name="close-circle"></ion-icon>
                                        </i>
                                    </div>
                                </div>
                                <div className="form-group basic">
                                    <div className="input-wrapper">
                                        <label className="label" htmlFor="mobile">Mobile Number</label>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="mobile"
                                                id="mobile"
                                                onChange={(e) => setNumber(e.target.value)}
                                                placeholder="Your Mobile Number"
                                                pattern="[0-9]{10}"
                                                required
                                            />
                                            <button className="btn btn-secondary" id="generate-otp-btn" type="button">
                                                Generate OTP
                                            </button>
                                        </div>
                                        <i className="clear-input">
                                            <ion-icon name="close-circle"></ion-icon>
                                        </i>
                                    </div>
                                </div>
                                <div className="form-group basic">
                                    <div className="input-wrapper">
                                        <label className="label" htmlFor="otp">Enter OTP</label>
                                        <input type="text"
                                            className="form-control"
                                            name="otp" id="otp"
                                            required
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="Enter OTP" />
                                        <i className="clear-input">
                                            <ion-icon name="close-circle"></ion-icon>
                                        </i>
                                    </div>
                                </div>
                                <div className="form-group basic">
                                    <div className="input-wrapper">
                                        <label className="label" htmlFor="password1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            className="form-control"
                                            onChange={(e) => setPassword(e.target.value)}
                                            id="password1"
                                            autoComplete="off"
                                            placeholder="Your Password"
                                            name="password1"
                                        />
                                        <i className="clear-input">
                                            <ion-icon name="close-circle"></ion-icon>
                                        </i>
                                    </div>
                                </div>
                                <img alt='Add your profile please' width='200px' height='200px' src={image ? URL.createObjectURL(image) : ''}></img>
                                <div className="form-group basic">
                                    <div className="input-wrapper">
                                        <label className="label" htmlFor="image">Profile Picture</label>

                                        <input
                                            type="file"
                                            required
                                            className="form-control"
                                            id="image"
                                            autoComplete="off"
                                            placeholder="Your Profile Picture"
                                            name="image"
                                            onChange={handleImageChange}
                                        />
                                        <i className="clear-input">
                                            <ion-icon name="close-circle"></ion-icon>
                                        </i>
                                    </div>
                                </div>
                                <div className="custom-control custom-checkbox mt-2 mb-1">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="customCheckb1"
                                        />
                                        <label className="form-check-label" htmlFor="customCheckb1">
                                            I agree{' '}
                                            <a href="#" data-bs-toggle="modal" data-bs-target="#termsModal">
                                                terms and conditions
                                            </a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-button-group transparent">
                            <button
                                type="submit"
                                className="btn btn-primary btn-block btn-lg"
                            >
                                Register
                            </button>

                        </div>
                    </div>
                </form>
            </div >
            {/* body */}
        </div >
    )
}

export default Signup