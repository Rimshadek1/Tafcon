import React, { useEffect, useState, useRef, useContext } from 'react';
import './assets/css/style.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css'
import randomColor from 'randomcolor';
function Home() {
    const navigate = useNavigate();
    const [suc, setSuc] = useState();
    const [imageUrl, setImageUrl] = useState('');
    const [events, setEvents] = useState([]);
    const [fine, setFine] = useState(0)
    const [withdraw, setWithraw] = useState(0)
    const [income, setIncome] = useState(0)
    const [balance, setBalance] = useState(0)
    //all amounts
    useEffect(() => {
        axios.get('http://localhost:3001/amount').then(res => {
            if (res.data) {
                setFine(res.data.fine.totalFine)
                setWithraw(res.data.withdraw.totalWithdraw)
                setIncome(res.data.income.total)
                setBalance(res.data.balance)
            }


        }).catch(err => console.log(err))
    }, []);

    //transactions

    const [details, setDetails] = useState([]);
    const [detailsFine, setDetailsFine] = useState([]);
    const [detailsOt, setDetailsOt] = useState([]);
    const [detailsWithdraw, setDetailsWithdraw] = useState([]);
    const [mergedDetails, setMergedDetails] = useState([]);
    useEffect(() => {
        // Fetch salary details
        axios.get('http://localhost:3001/viewSalary')
            .then((res) => {
                if (res.data.status === 'success') {
                    setDetails(res.data.details);
                } else {
                    alert('Something went wrong');
                }
            })
            .catch((error) => {
                console.error('Error fetching salary data:', error);
                alert('Failed to fetch data from the server');
            });

        // Fetch fine details
        axios.get('http://localhost:3001/viewFine')
            .then((res) => {
                if (res.data.status === 'success') {
                    setDetailsFine(res.data.details);
                } else {
                    alert('Something went wrong');
                }
            })
            .catch((error) => {
                console.error('Error fetching fine data:', error);
                alert('Failed to fetch data from the server');
            });

        // Fetch overtime details
        axios.get('http://localhost:3001/ot')
            .then((res) => {
                if (res.data.status === 'success') {
                    setDetailsOt(res.data.details);
                } else {
                    alert('Something went wrong');
                }
            })
            .catch((error) => {
                console.error('Error fetching OT data:', error);
                alert('Failed to fetch data from the server');
            });
    }, []);
    // Fetch withdraw details
    useEffect(() => {
        // Fetch withdraw details
        axios.get('http://localhost:3001/withdrawf')
            .then((res) => {
                if (res.data.status === 'success') {
                    setDetailsWithdraw(res.data.details);
                } else {
                    alert('Something went wrong');
                }
            })
            .catch((error) => {
                console.error('Error fetching withdraw data:', error);
                alert('Failed to fetch data from the server');
            });
    }, []);

    // Merge salary, fine, OT, and withdraw details
    useEffect(() => {
        const merged = [...details, ...detailsFine, ...detailsOt, ...detailsWithdraw];
        // Sort the merged array by date in descending order
        const sortedDetails = merged.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMergedDetails(sortedDetails);
    }, [details, detailsFine, detailsOt, detailsWithdraw]);


    // slider

    const sliderRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [role, setRole] = useState()
    const [showButton, setShowButton] = useState(false);
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - sliderRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Adjust the speed of dragging as needed
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    // Function to generate a random dark color
    function getRandomDarkColor() {
        const color = randomColor({
            luminosity: 'dark', // Generates dark colors
        });
        return color;
    }

    // getting events
    useEffect(() => {
        axios.get('http://localhost:3001/getevents').then(res => {


            setEvents(res.data)

        }).catch(err => console.log(err))
    }, []);

    //security
    useEffect(() => {
        axios.get('http://localhost:3001/').then(res => {
            if (res.data.status === 'success') {
                setRole(res.data.role)

                setSuc('success okk')
            } else {
                alert('status failed')
                navigate('/login')
            }
        }).catch(err => console.log(err))
    }, []);

    //profilepicture
    useEffect(() => {
        // Make an HTTP GET request to fetch the image URL
        axios.get('http://localhost:3001/profile-image')
            .then((res) => {
                // Check if imageUrl is not empty before setting it
                if (res.data.imageUrl) {
                    setImageUrl(res.data.imageUrl);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    function handleAddButtonClick(eventId) {
        const confirmed = window.confirm('Do you want to add this event to your list?');

        if (confirmed) {
            axios.post(`http://localhost:3001/confirmbooking/${eventId}`)
                .then((res) => {
                    if (res.data.status === 'success') {
                        alert('Booking confirmed');
                        navigate('/bookings');
                    } else if (res.data.status === 'already booked') {
                        alert('This event is already booked.');
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            // Handle the case where the user clicked cancel
            console.log('Add action canceled.');
        }
    }
    const getBackgroundColor = () => {
        // Define colors for different roles
        if (role === 'class-A') {
            return 'yellow';
        } else if (role === 'class-C') {
            return 'violet';
        } else if (role === 'class-B') {
            return 'green'
        } else if (role === 'main-boy') {
            return 'gold'
        }
        // Default background color (you can change this to another color if needed)
        return 'white';
    };

    //site details
    useEffect(() => {
        if (role === 'main-boy') {
            setShowButton(true);
        }
    }, [role]);

    return (
        <div>
            {/* Header */}
            <div className="appHeader bg-danger text-light">
                <div className="left text-white">
                    <a href="#" className="headerButton" data-bs-toggle="modal" data-bs-target="#sidebarPanel">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" id="menu" fill="#FFFFFF">
                            <g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                                <g stroke="#FFFFFF" stroke-width="2" transform="translate(-1629 -1753)">
                                    <g transform="translate(1630 1754)">
                                        <path d="M0 6h18M0 0h18M0 12h18"></path>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </a>
                </div>
                <div className="pageTitle">
                    <img src="logo/tafcon.png" alt="logo" className="logo" />
                </div>
                <div className="right">
                    <Link to="/bookings" className="headerButton">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="bag" fill="none">
                            <g fill="none" fill-rule="evenodd" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" transform="translate(2.5 1.5)">
                                <path fill="none" d="M14.01373 20.0000001L5.66590392 20.0000001C2.59954235 20.0000001.247139589 18.8924486.915331812 14.4347827L1.69336385 8.39359272C2.10526317 6.16933642 3.52402748 5.31807783 4.76887874 5.31807783L14.9473685 5.31807783C16.2105264 5.31807783 17.5469108 6.23340964 18.0228834 8.39359272L18.8009154 14.4347827C19.3684211 18.3890161 17.0800916 20.0000001 14.01373 20.0000001zM14.1510298 5.09839819C14.1510298 2.71232585 12.216736 .7779932 9.83066366 .7779932L9.83066366.7779932C8.68166274.773163349 7.57805185 1.22619323 6.76386233 2.03694736 5.9496728 2.84770148 5.49199087 3.94938696 5.49199087 5.09839819L5.49199087 5.09839819"></path>
                                <line x1="12.796" x2="12.751" y1="9.602" y2="9.602"></line>
                                <line x1="6.966" x2="6.92" y1="9.602" y2="9.602"></line>
                            </g>
                        </svg>

                        <span className="badge badge-success"></span>
                    </Link>
                    <div className='class' style={{ background: getBackgroundColor() }} >
                        {role && (
                            <h4 className='classed'>
                                {role}
                            </h4>
                        )}
                    </div>
                    <Link to="/settings" className="headerButton">
                        <img src={'http://127.0.0.1:3001/Profile-pictures/' + imageUrl} class="imaged w32" ></img>
                    </Link>
                </div>
            </div >
            {/* Header */}
            {/* body */}
            <div id="appCapsule">
                <div className="section wallet-card-section pt-1 mt-0">
                    <div className="wallet-card">
                        <div className="balance">
                            <div className="left">
                                <span className="title">Total Balance is </span>
                                <h1 className="total">{balance}</h1>
                            </div>
                        </div>

                        <div className="wallet-footer">
                            <div className="item text-light">
                                <a href="/" data-bs-toggle="modal" data-bs-target="#withdrawActionSheet">
                                    <div className="icon-wrapper bg-danger">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" id="arrow-down" width="24" height="24" style={{ fill: '#FFFFFF', width: '24px', height: '24px' }}>
                                            <rect width="200" height="200" fill="none"></rect>
                                            <line x1="128" x2="128" y1="40" y2="216" fill="none" stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line>
                                            <polyline fill="none" stroke="#FFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" points="56 144 128 216 200 144"></polyline>
                                        </svg>
                                    </div>
                                    <strong>Withdraw</strong>
                                </a>
                            </div>

                            <div className="item">
                                <a href="/">
                                    {/* data-bs-toggle="modal" data-bs-target="#depositActionSheet" */}
                                    <div className="icon-wrapper">
                                        <ion-icon name="cash-outline"></ion-icon>
                                    </div>
                                    <strong>G-Pay</strong>
                                </a>
                            </div>
                            <div className="item">
                                <a href="/">
                                    {/* data-bs-toggle="modal" data-bs-target="#sendActionSheet" */}
                                    <div className="icon-wrapper bg-success">
                                        <ion-icon name="phone-portrait-outline"></ion-icon>
                                    </div>
                                    <strong>Phone Pay</strong>
                                </a>
                            </div>
                            <div className="item">
                                <a href="/">
                                    {/* data-bs-toggle="modal" data-bs-target="#exchangeActionSheet" */}
                                    <div className="icon-wrapper bg-warning">
                                        <ion-icon name="hand-left-outline"></ion-icon>
                                    </div>
                                    <strong>Cash in hand</strong>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="row mt-2">
                        <div className="col-6">
                            <div className="stat-box">
                                <div className="title">Income</div>
                                <div className="value text-success">{income}</div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="stat-box">
                                <div className="title">Fine</div>
                                <div className="value text-danger">{fine}</div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-6">
                            <div className="stat-box">
                                <div className="title">Withdraw</div>
                                <div className="value">{withdraw}</div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="stat-box">
                                <div className="title">Balance</div>
                                <div className="value">{balance}</div>
                            </div>
                        </div>
                    </div>
                </div>




                <div className="section mt-4">
                    <div className="section-heading">
                        <h2 className="title">Transactions</h2>
                        <Link to="/transactions" className="link">View All</Link>
                    </div>
                    {Array.isArray(mergedDetails) && mergedDetails.length > 0 ? (
                        mergedDetails.slice(0, 3).map((detail, index) => (

                            <div className="section" key={index}>
                                <div className="section-title">
                                    Date: {`${new Date(detail.date).getDate()}-${new Date(detail.date).getMonth() + 1}-${new Date(detail.date).getFullYear()}`}
                                </div>
                                <div className="transactions">
                                    <Link to="/" className="item">
                                        <div className="detail">
                                            {
                                                detail.finefor ? (
                                                    <img src="transaction/fine.jpg" alt="img" className="image-block imaged w48" />
                                                ) : detail.otfor ? (
                                                    <img src="transaction/ot.jpg" alt="img" className="image-block imaged w48" />
                                                ) : detail.amount ? (
                                                    <img src="transaction/withdraw.jpg" alt="img" className="image-block imaged w48" />
                                                ) : (
                                                    <img src="transaction/salary.jpg" alt="img" className="image-block imaged w48" />
                                                )
                                            }
                                            ,
                                            <div>
                                                {detail.finefor ? (
                                                    <strong>Fine for: {detail.finefor}</strong>
                                                ) : detail.otfor ? (
                                                    <strong>OT for: {detail.otfor}</strong>
                                                ) : detail.amount ? (
                                                    <strong>withdraw for: Personal</strong>
                                                ) : (
                                                    <strong>Salary of Event: {detail.events}</strong>
                                                )},

                                            </div>
                                        </div>
                                        <div className="right">
                                            {detail.fine ? (
                                                <div className="price text-danger">₹ {detail.fine}</div>
                                            ) : detail.ot ? (
                                                <div className="price text-success">₹ {detail.ot}</div>
                                            ) : detail.amount ? (
                                                <div className="price text-danger">₹ {detail.amount}</div>
                                            ) : (
                                                <div className="price text-success">₹ {detail.salary}</div>
                                            )},

                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="section">
                            <div className="section-title">No details available.</div>
                        </div>
                    )
                    }
                </div>



                <div className="section full mt-4">
                    <div className="section-heading padding">
                        <h2 className="title">Works</h2>
                        <Link to="/events" className="link">View All</Link>
                    </div>


                    <div className='slider-container'>
                        <div
                            className='slider-box'
                            ref={sliderRef}
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onMouseMove={handleMouseMove}
                        >
                            {events.map((event, index) => (
                                <div
                                    className='boxes'
                                    style={{ backgroundColor: getRandomDarkColor() }}
                                    key={index}
                                >
                                    <div className="content">
                                        <div>
                                            <h3 className='text-white location'>Location</h3>
                                            <h1 className='text-white location1'>{event.location}</h1>
                                        </div>
                                        <div>
                                            <h3 className='text-white slot'>Slot Left</h3>
                                            <h1 className='text-white slot1'>{event.slot}</h1>
                                        </div>
                                    </div>
                                    <button className="btn btn-success rounded add"
                                        onClick={() => handleAddButtonClick(event._id)}
                                    >Add</button>
                                </div>
                            ))}


                        </div>
                    </div>

                    <div >
                        {showButton && (
                            <div>
                                <Link to='/sitedetails' className=' btn btn-success'>
                                    Site details
                                </Link>
                            </div>
                        )}
                    </div>



                    <div class="appFooter">
                        <div class="footer-title">
                            App by @ tafcon
                        </div>

                    </div>
                </div >
                {/* body */}
                {/* footer */}
                <div className="appBottomMenu">
                    <Link to="/" className="item active">
                        <div className="col">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="pie-chart" width="25" height="25" stroke="#FF396F">
                                <path d="M25,17H15V7a1,1,0,0,0-1-1A12,12,0,1,0,26,18,1,1,0,0,0,25,17ZM14,28A10,10,0,0,1,13,8.05V18a1,1,0,0,0,1,1H24A10,10,0,0,1,14,28ZM18,2a1,1,0,0,0-1,1V14a1,1,0,0,0,1,1H29a1,1,0,0,0,1-1A12,12,0,0,0,18,2Zm1,11V4.05a10,10,0,0,1,9,9Z" data-name="96  Pie Chart, Chart, Diagram, Pie"></path>
                            </svg>


                            <strong>Overview</strong>
                        </div>
                    </Link>
                    <Link to="/transactions" className="item">
                        <div className="col">
                            <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 16 16" id="text-file" width="25" height="25"><polygon fill="none" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round" points="13 14 3 14 3 2 9.98 2 11.51 3.35 13 4.79 13 14"></polygon><polyline fill="none" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round" points="9.78 2.54 9.78 5.54 12.78 5.54"></polyline><line x1="5" x2="8" y1="8" y2="8" fill="none" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round"></line><line x1="5" x2="9" y1="10" y2="10" fill="none" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round"></line>
                                <line x1="5" x2="10" y1="12" y2="12" fill="none" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round"></line></svg>
                            <strong>Transaction</strong>
                        </div>
                    </Link>
                    <Link to="/bookings" className="item">
                        <div className="col">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="slack" width="25" height="25">
                                <path d="M17.5 14a3.5 3.5 0 0 0 3.5-3.5v-5a3.5 3.5 0 0 0-7 0v5a3.5 3.5 0 0 0 3.5 3.5zM16 5.5a1.5 1.5 0 0 1 3 0v5a1.5 1.5 0 0 1-3 0zM8.5 9H11a1 1 0 0 0 1-1V5.5A3.5 3.5 0 1 0 8.5 9zm0-5A1.5 1.5 0 0 1 10 5.5V7H8.5a1.5 1.5 0 0 1 0-3zM24 12h2.5A3.5 3.5 0 1 0 23 8.5V11a1 1 0 0 0 1 1zm1-3.5a1.5 1.5 0 1 1 1.5 1.5H25zM23.5 22H21a1 1 0 0 0-1 1v2.5a3.5 3.5 0 1 0 3.5-3.5zm0 5a1.5 1.5 0 0 1-1.5-1.5V24h1.5a1.5 1.5 0 0 1 0 3zM8 20H5.5A3.5 3.5 0 1 0 9 23.5V21a1 1 0 0 0-1-1zm-1 3.5A1.5 1.5 0 1 1 5.5 22H7zm7-9a3.5 3.5 0 0 0-3.5-3.5h-5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 0 3.5-3.5zM10.5 16h-5a1.5 1.5 0 0 1 0-3h5a1.5 1.5 0 0 1 0 3zm4 2a3.5 3.5 0 0 0-3.5 3.5v5a3.5 3.5 0 0 0 7 0v-5a3.5 3.5 0 0 0-3.5-3.5zm1.5 8.5a1.5 1.5 0 0 1-3 0v-5a1.5 1.5 0 0 1 3 0zM26.5 14h-5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 0 0-7zm0 5h-5a1.5 1.5 0 0 1 0-3h5a1.5 1.5 0 0 1 0 3z" data-name="Layer 20"></path></svg>
                            <strong>My Bookings</strong>
                        </div>
                    </Link>
                    <Link to="/events" className="item">
                        <div className="col">
                            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 48 48" viewBox="0 0 48 48" id="card-payment" width="25" height="25"><path d="M44,11H4c-0.55,0-1,0.45-1,1v6v18c0,0.55,0.45,1,1,1h40c0.55,0,1-0.45,1-1V18v-6C45,11.45,44.55,11,44,11z M43,35H5V19h38
		V35z M43,17H5v-4h38V17z"></path><path d="M9,33h6c0.55,0,1-0.45,1-1v-6c0-0.55-0.45-1-1-1H9c-0.55,0-1,0.45-1,1v6C8,32.55,8.45,33,9,33z M10,27h4v4h-4V27z"></path></svg>
                            <strong>Event</strong>
                        </div>
                    </Link>
                    <Link to="/settings" className="item">
                        <div className="col">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" id="settings" width="25" height="25"><path d="m19.7 3.6.4 2.8.2 1.6 1.5.6c.8.3 1.6.8 2.3 1.3l1.3 1 1.6-.6 2.6-1.1 1.7 2.9-2.2 1.9-1.3 1 .2 1.7c.1.9.1 1.8 0 2.6l-.2 1.7 1.3 1 2.2 1.8-1.7 2.9-2.6-1.1-1.5-.6-1.3 1c-.7.5-1.5 1-2.3 1.3l-1.6.7-.2 1.6-.4 2.8h-3.4l-.4-2.8-.2-1.6-1.5-.6c-.8-.3-1.6-.8-2.2-1.4l-1.3-1-1.7.6-2.6 1.1-1.7-2.9L6.9 22l1.3-1-.2-1.7c-.1-.4-.1-.9-.1-1.3s0-.9.1-1.3l.2-1.7-1.3-1-2.2-1.8 1.7-2.9L9 10.4l1.5.6 1.3-1c.7-.5 1.5-1 2.3-1.3l1.6-.7.2-1.6.4-2.8h3.4M21.5.7h-7c-.4 0-.8.3-.8.7L13 6c-1 .4-2 1-2.9 1.7L5.8 6c-.1 0-.2-.1-.3-.1-.3 0-.6.2-.7.4l-3.5 6c-.2.4-.1.8.2 1.1l3.7 2.8C5 16.9 5 17.4 5 18c0 .6 0 1.1.1 1.7l-3.6 2.9c-.3.3-.4.7-.2 1.1l3.5 6c.2.3.4.4.8.4.1 0 .2 0 .3-.1l4.3-1.7C11 29 12 29.6 13 30l.6 4.6c.1.4.4.7.8.7h7c.4 0 .8-.3.8-.7L23 30c1-.4 2-1 2.9-1.7l4.3 1.7c.1 0 .2.1.3.1.3 0 .6-.2.7-.4l3.5-6c.2-.4.1-.8-.2-1.1l-3.6-2.8c.1-1.1.1-2.3 0-3.4l3.6-2.9c.3-.3.4-.7.2-1.1l-3.5-6c-.2-.3-.4-.4-.8-.4-.1 0-.2 0-.3.1l-4.3 1.7C25 7 24 6.4 23 6l-.7-4.6c0-.4-.4-.7-.8-.7z">
                            </path><path d="M18 24.1c-3.4 0-6.1-2.7-6.1-6.1s2.7-6.1 6.1-6.1 6.1 2.7 6.1 6.1c0 3.3-2.8 6.1-6.1 6.1z"></path></svg>
                            <strong>Settings</strong>
                        </div>
                    </Link>
                </div >
                {/* footer */}
            </div >
        </div >


    );
}

export default Home;
