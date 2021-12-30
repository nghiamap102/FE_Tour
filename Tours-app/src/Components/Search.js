import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import API, { AuthAPI, endpoints } from "../Configs/API";
import MyCard from "../Layouts/Template";
import $ from 'jquery'
import Modal from "react-modal";
import { toast } from "react-toastify";
import cookie from 'react-cookies'
import { Redirect, useHistory } from "react-router";
import DatePicker, { DateObject } from "react-multi-date-picker";


export default function Search (){
    const [detail , setDetail] = useState([])
    const [transport,setTransport] = useState([])

    const location = useLocation()
    const history =  useHistory()
    
    const [departure , setDeparture] = useState([])
    const [destination , setDestination] = useState([])
    const [tag_tour,setTag_tour] = useState([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( async()=>{

        let res = await API.get(`${endpoints['tour_detail_all']}${location.search}`)
        setDetail(res.data.results)
        console.log(res.data.results)

        let res_transport = await API.get(endpoints['get_transport'])
        setTransport(res_transport.data.results)

        let res_departure = await API.get(endpoints['tour_total_all'])
        setDeparture(res_departure.data.results)

        let res_destination = await API.get(endpoints['destination_all'])
        setDestination(res_destination.data.results)

        let res_tag = await API.get(endpoints['get_tag_tour_detail'])
        setTag_tour(res_tag.data.results)
    },[location.search])

    const onchange_search_departure= (e)=>{
        var a = e.target.options[e.target.selectedIndex].getAttribute("value") 
        history.push(`/search/?departure=${a}`)
    }
    const onchange_search_destination = (e)=>{
        var a = e.target.options[e.target.selectedIndex].getAttribute("value") 
        history.push(`/search/?destination=${a}`)
    }

    const onchange_search_price = (e)=>{
        var a = e.target.options[e.target.selectedIndex].getAttribute("value") 
        history.push(`/search/?price=${a}`)
    }

    let split_id =(id) =>{
        if(id.length == 3 ){
            var a = id.slice(0,1)
            var b = id.slice(2,3)
        }
        if (id.length == 4 ){
            var a = id.slice(0,1)
            var b = id.slice(2,4)
        }
        if (id.length == 2 ){
            var a = id.slice(0,2)
            var b = 0
        }
    
        return [a ,b]
    }

    
    if (detail !== '' && detail.length !== 0  && detail !== null && detail!== undefined){

return(
<>


<div className="src-title-layout bg-img ">
    <div className="overlay-bl">
    </div>
    <div className="container">
        <div className="row d-flex align-items-center justify-content-center">
            <div className="col-md-9  fadeInUp animated text-center">
                <div className="src-page">
                    <ul>
                        <li>
                            Home <i className="fa fa-angle-double-right" aria-hidden="true"></i> 
                        </li>
                        <li>
                            Search
                        </li>
                    </ul>
                </div>
                <h1 className="h1">Tours List</h1>
            </div>
        </div>
    </div>
</div>

<div className="listour py-5">
    <div className="container py-5">
        <div className="row">
        <div className="search_field_tour col-md-3 col-sm-4">
                <div className="title_search">
                    <span>Filter</span>             
                </div>
                <div className="cate_tour">
                    {/* {tour_by_id.name} */}
                </div>
                <form className="form_search_tour p-2" >
                    <div className="group_search">
                        <div className="label_search">
                            point of departure
                        </div>
                        <div className="select_time">
                            <select onChange={onchange_search_departure} className="form-control" >
                                <option value="" key="">--Point Of Departure--</option>
                                {departure.map((u,index)=> <option value={u.id} key={index}>{u.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="group_search">
                        <div className="label_search">
                            destination
                        </div>
                        <div className="select_time">
                            <select onChange={onchange_search_destination} className="form-control">
                                <option value="" key="">--Destination--</option>
                                {destination.map((u,index)=> <option value={u.id} key={index}>{u.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="group_search">
                        <div className="label_search">
                            Time
                        </div>
                        <div className="list_btn">
                            <label type="button" name="duration" for="1_3" className="form-control" 
                             onClick={(e)=> {
                                var a =$(e.target).closest('label').attr('for')
                                history.push(`/search/?duration_from=${split_id(a)[0]}&duration_to=${split_id(a)[1]}`)
                                // setDuration_from(split_id(a)[0])
                                // setDuration_to(split_id(a)[1])
                             }}>1-3 days</label>
                            
                            <input type="radio" id="1_3"name="rr" className="radio_option" />
                           
                            <label type="button" name="duration" for="4_7" className="form-control "
                             onClick={(e)=> {
                                var a =$(e.target).closest('label').attr('for')
                                history.push(`/search/?duration_from=${split_id(a)[0]}&duration_to=${split_id(a)[1]}`)

                             }}>4-7  days</label>
                            
                            <input type="radio" id="4_7" name="rr" className="radio_option"/>
                           
                            <label type="button" name="duration" for="7_14" className="form-control " 
                             onClick={(e)=> {
                                var a =$(e.target).closest('label').attr('for')
                                history.push(`/search/?duration_from=${split_id(a)[0]}&duration_to=${split_id(a)[1]}`)

                             }}>7-14 days</label>
                            
                            <input type="radio" id="7_14" name="rr" className="radio_option"/>
                            
                            <label type="button" name="duration" for="14" className="form-control "
                             onClick={(e)=> {
                                var a =$(e.target).closest('label').attr('for')
                                history.push(`/search/?duration_from=${split_id(a)[0]}`)
                             }}>Over 14 days</label>
                            
                            <input type="radio" id="14" name="rr" className="radio_option" />
                        </div>
                    </div>
                    <div className="group_search">
                        <div className="label_search">
                            time start
                        </div>
                        <div className="form-control date_picker">

                            
                            <DatePicker
                            onFocusedDateChange = {(date)=> 
                            history.push(`/search/?time_from=${new DateObject(date).year}-${new DateObject(date).month}-${new DateObject(date).day}`
                            )} placeholder="YY/MM/DD"/>
                             <div className="icon_date">
                                <span class="material-icons-outlined">
                                date_range
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="group_search">
                        <div className="label_search">
                            Price
                        </div>
                        <div className="">
                            <select className="form-control"  onChange={onchange_search_price} >
                                <option value="">--Please Select Price--</option>
                                <option value="500000"> &lt;&#61; 500000</option>
                                <option value="1000000">&lt;&#61; 1000000</option>
                                <option value="2000000">&lt;&#61; 2000000</option>
                                <option value="3000000">&lt;&#61; 3000000</option>
                            </select>                          
                        </div>
                    </div>
                    <div className="group_search">
                        <div className="label_search">
                            Transport
                        </div>
                        <div className="list_btn">
                            
                            {transport.map((u,index) => <TransportMap history= {history} transport = {u} />)}
                        </div>
                    </div>
                    <div className="group_search">
                        <div className="label_search">
                            Category
                        </div>
                        <div className="list_btn">
                            {tag_tour.map((u,index)=><label type="button" name="duration" for={u.name} className="form-control" 
                             onClick={(e)=> {
                                var a =$(e.target).closest('label').attr('for')
                                history.push(`/search/?tag=${a}`)
                             }}>{u.name}</label>)}
                            
                            
                            <input type="radio" id="1_3"name="rr" className="radio_option" />
                        </div>
                    </div>
                    <div className="group_search">
                        <div className="label_search">
                            Filter
                        </div>
                        <div className="filter_discount">
                            <div class="filter_">
                                <label class="switch">
                                    <input type="checkbox" class="promotion" onChange={(e)=>
                                        {if(e.target.checked){
                                            setTimeout(() => {
                                                history.push(`/search/?discount=1`)
                                            }, 1000);
                                        }}} />
                                    <span class="slider round"></span>
                                </label>
                                Discount
                            </div>
                            <div class="filter_">
                                <label class="switch">
                                    <input type="checkbox" class="promotion"onChange={(e)=>
                                        {if(e.target.checked){
                                            setTimeout(() => {
                                                history.push(`/search/?slot=1`)
                                            }, 1000);  
                                        }}} />
                                    <span class="slider round"></span>
                                </label>
                                Remaining
                            </div>     
                        </div>
                    </div>
                    
                </form>
            </div>  
            <div className="col-md-9">
            <div className="heading_listdetail">
                    <div className="tour_tag">
                        <h3>Search</h3> 
                    </div>
                    <div className="content_bot">
                        {/* <p>{tour_by_id.content}</p> */}
                    </div>
                </div>

                <div className="row">
                    {detail.map( (u,index)=> <Tour key={index} tour = {u} />)}
             
                </div>

            </div>
        </div>
    </div>
</div>

</>
        )
    }else{
        return(
<>
<h1>search tào lao dậy má</h1>
</>
        )
    }
}
function Tour(props){
    let path = ""
    let remain = ''
    
    var b = props.tour.time_start

    var d  =  b.slice(0,10)
    var c  =  b.slice(10,b.length)

    var price = ''

    path = `/tour_detail/${props.tour.id}/`
    
    b =  b.replace(/[ZT]/g,' ')
    
    
    if (props.tour.slot <= 0 ){
        remain = <>
        <span>Out of slot:</span><span className="slot">{props.tour.slot}</span>  
    </>
    }else{
        remain = <>
            <span>Remaining:</span><span className="slot">{props.tour.slot}</span>  
        </>
    }
   
    if (props.tour.discount >=1 ){
        price = <>
            <div className="price_present">
                {props.tour.price_tour} VND
            </div>
            <div className="">
                <span class="material-icons-outlined">
                    trending_down
                </span>
            </div>
            <div className="price_discount">
                {props.tour.total} VND
            </div>
        </>
    }else{
        price = <>
            <div className="price_present">
            {props.tour.price_tour} VND
            </div>
        </>
        
    }


    return(
<>
<div className="col-md-4">
    <div className="card_wrapper">
        <div className="img_" style={{'backgroundImage' : `url(${props.tour.image})`}} >
            <a href={`/tour_detail/${props.tour.id}/`}>

            </a>
            <div className="rate_">
                <span>{props.tour.rate[0].rate__avg}</span>
            </div>
            <div className="count_cmt">
            </div>
            <div className="like_list">
                <span class="material-icons-outlined">
                    favorite_border
                </span>
            </div>
        </div>
        <div className="body_">
            <div className="time_start">
                <p style={{marginBottom : '0px' , fontSize : '13px'}}>{d} - {props.tour.duration}D{props.tour.duration-1}N</p>
                <span  style={{marginBottom : '0px' , fontSize : '13px'}}>Time Start: {c}</span>
                
            </div>
            <div className="path_detail">
                <a href={path}>{props.tour.name}</a>
                
            </div>
            <div className="departure"  style={{marginBottom : '0px' , fontSize : '13px'}}>
                Departure: {props.tour.departure.name}
            </div>
            <div className="price_">
                {price}
            </div>
        </div>  
        <div className="footer_">
            <div className="btn_">
                <div className="btn__">
                    <div className="btn_booking">
                        <a type="button" href={`/tour_detail/${props.tour.id}/booking/`} className="form-control btn_booking">
                            <span class="material-icons-outlined">
                            shopping_cart
                            </span><span>Booking</span>  
                        </a>
                    </div>
                    <div className="btn_detail">
                        <a type="button" href={`/tour_detail/${props.tour.id}/`} className="form-control btn_detail">
                            <span class="material-icons-outlined">
                            info
                            </span><span>Detail</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="remaining_">
                {remain}
            </div>
        </div>
    </div>
</div>

</>
    )
}

function TransportMap (props){
    return(
<>
<label type="button" name="transport" for={props.transport.id} className="form-control" 
onClick={(e)=> props.history.push(`/search/?transport=${props.transport.name}`)}>{props.transport.name}</label>
<input type="radio" id={props.transport.id} name="transport" className="radio_option" />
</>
    )
}