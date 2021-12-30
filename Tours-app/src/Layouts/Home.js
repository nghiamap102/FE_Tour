import React from "react";
import { Col,  Pagination, Row } from "react-bootstrap";
import cookies from 'react-cookies'
import API, { endpoints } from "../Configs/API";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { useState } from "react";
import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { Redirect, useHistory } from "react-router";
import $ from 'jquery'



export default function Home(){


    const [tour , setTour] = useState([])
    const [page ,setPage] = useState(1)
    const location = useLocation()

    const history = useHistory()

    const [tour_id, setTour_id] = useState(null)
    const [time_from, setTime_from] = useState(null)
    const [time_to, setTime_to] = useState(null)
    const [price, setPrice] = useState(null)
    const [cmt_list_lastest10, setCmt_list_lastest10] = useState([])
    const [blog_list_lastest10, setBlog_list_lastest10] = useState([])

    const options = {
        loop: true,
        nav: false,
        margin: 30,
        responsiveClass: true,
        autoplay: true,
        autoplayTimeout: 4000,
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            600: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
   useEffect( async() => {

        let res = await API.get(`${endpoints['tour_total_all']}`)
        setTour(res.data.results)

        let res_cmt = await API.get(endpoints['all_cmt_blog'])

        if (res_cmt.data.results.length < 10){
            setCmt_list_lastest10(res_cmt.data.results.splice(0,res_cmt.data.results.length))
        }else{
            setCmt_list_lastest10(res_cmt.data.results.splice(10,res_cmt.data.results.length))
        }

        let res_blog = await API.get(endpoints['get_blog_all'])
       
        if (res_blog.data.results.length < 10){
            setBlog_list_lastest10(res_blog.data.results.splice(0,res_blog.data.results.length))
        }else{
            setBlog_list_lastest10(res_blog.data.results.splice(10,res_blog.data.results.length))
        }

        let res_view = await API.get(endpoints['inc_view'])

    } ,[])
  
    const search = (e)=>{
        e.preventDefault()

        var a = []
        var path = ''

        a.push(tour_id,time_from,time_to,price)
        for ( let  i = 0 ; i <= a.length ; i ++) {
            if (i == 0 ){
                if (a[i] !== null){
                    if (path !== null && path !== ''){
                        path  +=  `?&name=${tour_id}`
                    }
                    else{
                        path  +=  `?name=${tour_id}`
                    }
                }else{
                    console.log('abc')
                }
            }
            if (i == 1) {
                if (a[i] !== null){
                    if (path !== null && path !== ''){
                        path += `&time_from=${time_from}`
                    }else{
                        path += `?time_from=${time_from}`
                    }
                }else{
                    console.log('abc')
                }
            }
            if (i == 2) {
                if (a[i] !== null){
                    if (path !== null && path !== ''){
                        path += `&time_to=${time_to}`
                    }else{
                        path += `?time_to=${time_to}`
                    }
                }else{
                    console.log('abc')
                }
            }
            if (i == 3) {
                if (a[i] !== null){
                    if (path !== null && path !== ''){
                        path += `&price=${price}`
                    }else{
                        path += `?price=${price}`
                    }
                }else{
                    console.log('abc')
                }
            }
        }
        history.push(`/search/${path}`)
      
    }


    const onchange_tour = (e)=>{
        var a = e.target.options[e.target.selectedIndex].getAttribute("value") 
        setTour_id(a)      
    }

    const onchange_price = (e)=>{
        var a = e.target.options[e.target.selectedIndex].getAttribute("value") 
        setPrice(a)      
    }
    $('#header-top').show()

    if(tour !== '' && tour!== undefined && tour !== null && 
    cmt_list_lastest10 !== '' && cmt_list_lastest10!== undefined && cmt_list_lastest10 !== null){

return(
<>
<div class="main-top-video">
    <div class="overlay-bl">
    </div>
    <div class="container">
        <div class="row align-items-center justify-content-start no-gutters">
            <div class="col-md-7 animated text-left">
                <span class="subheading">Welcome to Stomy Tours</span>
                <h1>Discover Your Favorite Place with Us</h1>
                <p>Full experience at an affordable price</p>
            </div>
            <a href="https://vimeo.com/197757517" class="video-ads popup-zoom-video d-flex align-items-center ml-auto">
                <span class="material-icons-outlined">
                    play_circle
                </span>
            </a>
        </div>
    </div>
</div>

<section class="ftco-section">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="ftco-search">
                    <div class="row">
                        <div class="col-md-12 nav-link-wrapper">
                            <div class="nav nav-pills text-center" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                <a class="nav-link mr-md-1 active" id="v-pills-1-tab" data-toggle="pill" href="#v-pills-1" role="tab" aria-controls="v-pills-1" aria-selected="true">Search Tour</a>
                                {/* <a class="nav-link" id="v-pills-2-tab" data-toggle="pill" href="#v-pills-2" role="tab" aria-controls="v-pills-2" aria-selected="false">Hotel</a> */}
                            </div>
                        </div>
                        <div class="col-md-12 tab-wrapper">
                            <div class="tab-content" id="v-pills-tabContent">
                                <div class="tab-pane search-tour fade active show" id="v-pills-1" role="tabpanel" aria-labelledby="v-pills-nextgen-tab">
                                    <form onSubmit={search} class="search-property-1">
                                        <div class="row no-gutters">
                                            <div class="col-md d-flex">
                                                <div class="form-group p-4">
                                                    <label for="destination">Destination</label>
                                                    <div class="form-field">
                                                        <div class="icon_search"><span class="fa fa-search"></span></div>
                                                        <select className="select_search" onChange={onchange_tour} >
                                                            <option value="" key=""></option>
                                                            {tour.map((u,index) => <option  value={u.name} key={index}>{u.name}</option> )}
                                                        </select>    
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md d-flex">
                                                <div class="form-group p-4">
                                                    <label for="checkin">Check-in date</label>
                                                    <div class="form-field form_date">
                                                        <div class="icon_search"><span class="fa fa-calendar"></span></div>
                                                        <input type="date" id="date" name="date" value={time_from} 
                                                        onChange={(event) => setTime_from(event.target.value)} class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md d-flex">
                                                <div class="form-group p-4">
                                                    <label for="checkin">Check-in date</label>
                                                    <div class="form-field form_date">
                                                        <div class="icon_search"><span class="fa fa-calendar"></span></div>
                                                        <input type="date" id="date" name="date" value={time_to} 
                                                        onChange={(event) => setTime_to(event.target.value)} class="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md d-flex">
                                                <div class="form-group p-4">
                                                    <label for="price_search">Price Limit</label>
                                                    <div class="form-field">
                                                        <div class="select-wrap">
                                                            <div class="icon_search"><span class="fa fa-chevron-down"></span></div>
                                                            <select className="select_search longer"   onChange={onchange_price} >
                                                                <option value="">Please Select Price</option>
                                                                <option value="500000"> &lt;&#61; 500000</option>
                                                                <option value="1000000">&lt;&#61; 1000000</option>
                                                                <option value="2000000">&lt;&#61; 2000000</option>
                                                                <option value="3000000">&lt;&#61; 3000000</option>
                                                            </select>    
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md d-flex">
                                                <div class="form-group d-flex w-100">
                                                    <div class="form-field w-100 align-items-center d-flex">
                                                        <input type="submit" value="Search" class="align-self-stretch btn-search form-control btn btn-primary"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<div class="service-section py-5">
    <div class="container py-5">
        <div class="row d-flex align-items-center">
            <div class="col-md-6">
                <div class="row">
                    <div class="col-lg-6 col-md-12 d-flex animated">
                        <div class="service-1 banner1">
                            <div class="icon-flaticon">
                                <i class="flaticon-paragliding"></i>
                            </div>
                            <div class="body">
                                <h3 class="mb-3">Activities</h3>
                                <p>Organize healthy sightseeing and picnic activities</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12 d-flex animated">
                        <div class="service-1 banner2">
                            <div class="icon-flaticon">
                                <i class="flaticon-destination"></i>
                            </div>
                            <div class="body">
                                <h3 class="mb-3">Travel Arrangements</h3>
                                <p>The trip is arranged flexibly and professionally according to the needs of the guests</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12 d-flex animated">
                        <div class="service-1 banner3">
                            <div class="icon-flaticon">
                                <i class="flaticon-map"></i>
                            </div>
                            <div class="body">
                                <h3 class="mb-3">Location Manager</h3>
                                <p>The place is strictly managed and discreet</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12 d-flex animated">
                        <div class="service-1 banner4">
                            <div class="icon-flaticon">
                                <i class="flaticon-guide"></i>
                            </div>
                            <div class="body">
                                <h3 class="mb-3">Private Guide</h3>
                                <p>there are tall and handsome six pack tour guides</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-6 content-service">
                <div class="content-service-wrapper">
                    <span class="subheading">Welcome to Stomy Tours</span>
                    <h2 class="under-subheading">It's time to start your adventure</h2>
                    <p class="text-p">A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                    <p class="text-p">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean. A small river
                        named Duden flows by their place and supplies it with the necessary regelialia.</p>
                    <a href="/" class="btn btn-primary py-3 px-4">Search Destination</a>
                </div>
            </div>
        </div>
    </div>
</div> 

<div class="tours-remaining">
    
    <div class="container container2 py-3">
        <div class="heading-tours text-center">
            <span class="subheading">Tormy Provide Places</span>
            <h2 class="under-subheading">Select Your Destination</h2>
        </div>
    </div>
    <div class="container container2 ">
        <div class="more_tour">
            <a href="/listour" class="card_more d-flex justify-content-center align-items-center">
            <i class="fa fa-plus" aria-hidden="true"></i>

            </a>
        </div>
        <div class="row">
            <div class="col-md-12">
                <OwlCarousel className='owl-theme' loop margin={10} nav {...options}>
                    {tour.map((u,index) =><Items key={index} tour = {u}/>)} 
                </OwlCarousel>
            </div>
        </div>
    </div>
</div> 
{/* <div class="tour-packed py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-12 heading-section text-center">
                    <span class="subheading">Destination</span>
                    <h2 class="under-subheading mb-4">Tour Destination</h2>
                </div>
            </div>
            <div className="row">
                {this.state.tours.map(u=> <Tours tours = {u} />)}
            </div>
        </div>
    </div>  */}
<div class="tour-about-video">
    <div class="container py-5">
        <div class="row align-items-center py-4">
            <div class="col-md-12 align-items-center wrapper-video justify-content-center d-flex">
                <a href="https://vimeo.com/197757517" class="video-ads popup-zoom-video">
                    <span class="far fa-play-circle"></span>
                </a>
            </div>
        </div>
    </div>
</div>

<div class="tour-about-content">
    <div class="container">
        <div class="row d-flex">
            <div class="col-lg-6 col-md-12 img-about-wrapper d-flex align-items-stretch">
                <div class="img-about d-flex align-content-center justify-content-center">
                </div>
            </div>
            <div class="col-lg-6 col-md-12 content-about-wrapper py-5 pl-5 align-content-center">
                <div class="content-about">
                    <span class="subheading">About Us</span>
                    <h2 class="under-subheading">Make Your Tour Memorable and Safe With Us</h2>
                    <p class="text-p">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
                    <a href="/" class="btn btn-primary">
                        Book Your Destination
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>
     
<div class="feedback py-5">
    <div class="overlay1"></div>
    <div class="container py-5">
    <div class="row animated text-center pb-5">
        <div class="col-md text-center animated">
            <span class="heading">Testimonial</span>
            <h2>Tourist Feedback</h2>
        </div>
    </div>
        <div class="row animated">
            <div class="col-md-12">
                <OwlCarousel className='owl-theme' loop margin={10} nav {...options}>
                    {cmt_list_lastest10.map((u,index)=> feedback(u))}
                </OwlCarousel>
            </div>
        </div>
    </div>
</div> 

<div class="blog py-5">
    <div class="container">
        <div class="row">
            <div class="col-md-12 animated text-center">
                <span class="subheading">Our Blog</span>
                <h2 class="under-subheading">Recent Post</h2>
            </div>
        </div>
        <div class="row pt-5">
            {blog_list_lastest10.map((u,index) => blog(u))}
        </div>
    </div> 
</div>

</>
        )
    }else{
        return(
<>
    <h1> Đang load tutu đợi xí</h1>
</>
        )
    }
}


     
//chưa xog cái này
function Tours () { 

    return(
<>
<Col md = {4}>
    <div class="packed-wrapper mb-4">
        <a href="booking.html" class="src-packed vt-packed">
            <span class="price-packed">$100/person</span>
        </a>
        <div class="decription-packed">
            <p class="subheading ">3 DAYS TOUR</p>
            <h5 class="">{this.props.tours.name}</h5>
            <p class="specialties">
                <span class="material-icons-outlined">
                    explore
                </span>Beach,Banh Khot,Views
            </p>
            <ul class="list-decription">
                <li className="item">
                    <i>
                        <img src="./image/am.svg" alt=""/>
                    </i>
                    <span>2</span>

                </li>
                <li className="item">

                    <i>
                        <img src="./image/pm.svg" alt=""/>
                    </i>
                    <span>2</span>

                </li>
                <li className="tags">
                </li>
            </ul>   
        </div>
    </div>
</Col> 
</>
    )
}

function Items(props){
    let path = ""
    if(props.type ==='tours'){
        path = `/tours/${props.tour.id}`
    }
    else
        path = 'abc'
        
    return(
<>
<div class="item">
    <div class="card-tour-remaining">
        <a href={path} className="card-item" style= {{background : `url(${props.tour.image})`,backgroundPosition : "center"
         ,backgroundSize : "cover"}}>
            <div class="text">
                <h3>{props.tour.name}</h3>
                <span>{props.tour.count} Available</span>
            </div>
        </a>
    </div>
</div>



</>
    )
}

function feedback (props){
    return(
<>
<div class="item">
    <div class="testimonial-content">
        <div class="rate-start">
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
        </div>
        <div class="content-feedback">
            <p>{props.content}</p>
        </div>
        <div class="bottom-info d-flex align-items-center">
            <div class="img-testimonial ava1" style={{'backgroundImage' : `url(${props.customer[2]})`}}>
            </div>
            <div class="infor">
                <p class="name">{props.customer[4]}</p>
                <span class="profession">{props.customer[1]}</span>
            </div>
        </div>
    </div>
</div>
</>
    )
}

function blog(props){

    var b = "";
    var a = props.created_date

    switch(a){
        case 1: b = "January";
            break;
        case 2: b = "February";
            break;
        case 3: b = "March";
            break;
        case 4: b = "April";
            break;
        case 5: b = "May";
            break;
        case 6: b = "June"; 
            break;
        case 7: b = "July";
            break;
        case 8: b = "August";
            break;
        case 9: b = "September";
            break;
        case 10: b = "October";
            break;
        case 11: b = "November";
            break;
        case 12: b = "December";
            break;
        default: b = "abc";
        
        }

    return(
<>
<div class="col-md-4 animated">
    <div class="card-blog">
        <a href="/" class="img_blog" style={{'backgroundImage' : `url(${props.image})`}}>
            <div class="blog-text">
                <div class="time">
                    <div class="fist">
                        <span>11</span>
                    </div>
                    <div class="twice">
                        <span class="year">2021</span>
                        <span class="month">September</span>
                    </div>
                </div>
            </div>
        </a>
        <div class="bottom-blog">
            <h5>
                <a href="/">
                    The place most foreigners visit
                </a>
            </h5>
            <a href="/" class="btn btn-primary twice-src">
                Read more
            </a>
        </div>
    </div>
</div>
</>
    )
}

