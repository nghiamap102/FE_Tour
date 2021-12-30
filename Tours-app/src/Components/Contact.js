import React from "react";
import '../CSS/Contact.css'


export default class Contact extends React.Component{


    componentDidMount(){

    }

    render(){
        return(
    <>
    <div class="src-title-layout bg-img js-auto-height">
        <div class="overlay-bl">
        </div>
        <div class="container">
            <div class="row d-flex align-items-center justify-content-center">
                <div class="col-md-9  fadeInUp animated text-center">
                    <div class="src-page">
                        <ul>
                            <li>
                                Home <i class="fa fa-angle-double-right" ></i>
                            </li>
                            <li>
                                Contact
                            </li>
                        </ul>
                    </div>
                    <h1 class="h1">Contact</h1>
                </div>
            </div>
        </div>
    </div>

    <section class="contact-section mb-4 py-5">
        <div class="container">
            <div class="row d-flex contact-info">
                <div class="col-md-3 d-flex">
                    <div class="box-contact p-4 text-center">
                        <div class="icon-contact">
                            <span class="material-icons-outlined">
                                room
                            </span>
                        </div>
                        <h3 class="mb-2">Address</h3>
                        <p>371 Nguyen Kiem, Go Vap Distric</p>
                    </div>
                </div>
                <div class="col-md-3 d-flex">
                    <div class="box-contact p-4 text-center">
                        <div class="icon-contact">
                            <span class="material-icons-outlined">
                                support_agent
                                </span>
                        </div>
                        <h3 class="mb-2">Contact Number</h3>
                        <p><a href="tel://0358833453">+84 35 8833 453</a></p>
                    </div>
                </div>
                <div class="col-md-3 d-flex">
                    <div class="box-contact p-4 text-center">
                        <div class="icon-contact">
                            <span class="material-icons-outlined">
                                archive
                                </span>
                        </div>
                        <h3 class="mb-2">Email Address</h3>
                        <p><a href="mailto:1851050093Nghia@ou.edu.vn">1851050093Nghia@ou.edu.vn</a></p>
                    </div>
                </div>
                <div class="col-md-3 d-flex">
                    <div class="box-contact p-4 text-center">
                        <div class="icon-contact">
                            <span class="material-icons-outlined">
                                public
                                </span>
                        </div>
                        <h3 class="mb-2">Website</h3>
                        <p><a href="youtube.com">youtube.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="message py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <div id="map_canvas_container" style={{overflowX : 'scroll'}}>
                        <div id="map" class="map_part" style={{height: '600px'}}>
                            <iframe id="map-canvas" class="map_part" width="100%" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=371%20nguy%E1%BB%85n%20ki%E1%BB%87m+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-wrapper d-flex">
                        <form action="#" method="post" name="form-contact" class="form-contact">
                            <input type="text" name="name-contact" id="name-contact" placeholder="Your Name" class="form-control"/>
                            <input type="text" name="email-contact" id="email-contact" placeholder="Your Email" class="form-control"/>
                            <input type="text" name="phone-contact" id="phone-contact" placeholder="Your Phone" class="form-control"/>
                            <textarea name="" id="" cols="30" rows="7" class="form-control" placeholder="Message"></textarea>
                            <button class="btn btn-primary">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    </>
        )
    }
}