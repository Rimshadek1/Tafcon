import React from 'react';
import './assets/css/style.css';
import { Link } from 'react-router-dom';
function Header() {
    return (
        <div className="appHeader bg-primary text-light">
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
                <img src="assets/img/logo.png" alt="logo" className="logo" />
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
                <Link to="/settings" className="headerButton">
                    <img src="assets/img/sample/avatar/avatar1.jpg" alt="image" className="imaged w32" />
                </Link>
            </div>
        </div >
    )
}

export default Header