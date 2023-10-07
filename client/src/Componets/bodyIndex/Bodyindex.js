import React from 'react';

function Bodyindex() {
    return (
        <div id="appCapsule">
            <div className="section wallet-card-section pt-1 mt-0">
                <div className="wallet-card">
                    <div className="balance">
                        <div className="left">
                            <span className="title">Total Balance is </span>
                            <h1 className="total">1111</h1>
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
                            <div className="value text-success">200</div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="stat-box">
                            <div className="title">Fine</div>
                            <div className="value text-danger">22</div>
                        </div>
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-6">
                        <div className="stat-box">
                            <div className="title">Withdraw</div>
                            <div className="value">10</div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="stat-box">
                            <div className="title">Balance</div>
                            <div className="value">12</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section mt-4">
                <div className="section-heading">
                    <h2 className="title">Transactions</h2>
                    <a href="/app-transactions" className="link">View All</a>
                </div>
                <div className="transactions">
                    <a href="app-transaction-detail.html" className="item">
                        <div className="detail">
                            <img src="assets/img/sample/brand/1.jpg" alt="img" className="image-block imaged w48" />
                            <div>
                                <strong>vga</strong>
                                <p>11-07-1999</p>
                                <p>Fine = 10</p>
                            </div>
                        </div>
                        <div className="right">
                            <div className="price text-success"> +₹ 144</div>
                        </div>
                    </a>
                </div>
            </div>
            <div className="section full mt-4">
                <div className="section-heading padding">
                    <h2 className="title">Works</h2>
                    <a href="/app-cards" className="link">View All</a>
                </div>

                <div className="carousel-single splide">
                    <div className="splide__track">
                        <ul className="splide__list">
                            <li className="splide__slide">
                                <div className="card-block bg-primary">
                                    <div className="card-main">
                                        <div className="card-button dropdown">
                                            <button type="button" className="btn btn-link btn-icon" data-bs-toggle="dropdown">
                                                <ion-icon name="ellipsis-horizontal"></ion-icon>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <a className="dropdown-item">
                                                    <ion-icon name="pencil-outline"></ion-icon>Add
                                                </a>
                                            </div>
                                        </div>
                                        <div className="balance">
                                            <span className="label">Location</span>
                                            <h1 className="title">Vengara</h1>
                                        </div>
                                        <div className="in">
                                            <div className="card-number">
                                                <span className="label">Date</span>
                                                12-06-2023
                                            </div>
                                            <div className="bottom">
                                                <div className="card-expiry">
                                                    <span className="label">Slot Left</span>
                                                    10
                                                </div>
                                                <div className="card-ccv">
                                                    <span className="label">Price</span>
                                                    450
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="appFooter">
                <div class="footer-title">
                    App by @ 8714122257
                </div>

            </div>
        </div >
    );
}

export default Bodyindex;
