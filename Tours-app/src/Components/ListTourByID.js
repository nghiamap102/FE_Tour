import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import API, { AuthAPI, endpoints } from "../Configs/API";
import $ from 'jquery'
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import cookie from 'react-cookies'
import { Redirect, useHistory } from "react-router";
import '../CSS/ListDetail.css'
import '@mui/material'
import DatePicker, { DateObject } from "react-multi-date-picker"
import { Button, Form } from "react-bootstrap";
import {  useSelector } from "react-redux";
import { Pagination } from '@mui/material';

export default function ListDetailByidTour (){
    const [list_detail , setList_detail] = useState([])
    const [name , setName] = useState(null)

    //add, update, del
    const [active, setActive] = useState(true)
    const [ID, setID] = useState(null)
    const [price_room , setPrice_room] = useState(null)
    const [price_tour , setPrice_tour] = useState(null)
    const [discount , setDiscount] = useState(null)
    const [time_start , setTime_start] = useState(null)
    const [duration , setDuration] = useState(null)
    const [total ,setTotal] = useState(0)
    const [departure_add_update , setDeparture_add_update] = useState([])
    const [destination_add_update , setDestination_add_update] = useState([])

    const [transport,setTransport] = useState([])
    const [transport_add,setTransport_add] = useState([])
    const [transport_add2,setTransport_add2] = useState([])
    const [tour_by_id,setTour_by_id] = useState([])
    const [departure , setDeparture] = useState([])
    const [destination , setDestination] = useState([])
    const [tag_tour,setTag_tour] = useState([])

    const [change,setChange] = useState(1)
    const [is_open , setIs_open] = useState(false)
    const [is_open_add , setIs_open_add] = useState(false)
    const [is_open_noti , setIs_open_noti] = useState(false)
    const [count , setCount] = useState(0)
    const [page, setPage] = useState(1)
    const [prev, setPrev] = useState(null)
    const [next , setNext] = useState(null)
    //param
    const location = useLocation()
    const history = useHistory()
    const {tourID} = useParams()
    const image = useRef()
    //search
  
    const [discount_search ,setDiscount_search]  = useState(1)

     const user = useSelector(state => state.user.user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( async()=>{
        let query = location.search
        
            if(query ==='')
                query = `?page=${page}`

        if(tourID != undefined){
            console.log(tourID)
            let res = await API.get(`${endpoints['list_tour_detail'](tourID)}`)
            setList_detail(res.data)
        }else{
            let res = await API.get(`${endpoints['tour_detail_all']}${query}`)
            setList_detail(res.data.results)
            setNext(res.data.next)
            setPrev(res.data.previous)
            setCount(res.data.count)        
        }
        
        let res_transport = await API.get(endpoints['get_transport'])
        setTransport(res_transport.data.results)

        let res_tour_by_id = await API.get(endpoints['tour_total_by_id'](tourID))
        setTour_by_id(res_tour_by_id.data)

        let res_departure = await API.get(endpoints['tour_total_all'])
        setDeparture(res_departure.data.results)

        let res_destination = await API.get(endpoints['destination_all'])
        setDestination(res_destination.data.results)

        let res_tag = await API.get(endpoints['get_tag_tour_detail'])
        setTag_tour(res_tag.data.results)

    },[change,tourID,location.search,page,next,prev])

    console.log(page)
   

    let openMOdal  = (e)=>{
        setIs_open(true)
        var a = $(e.target).closest('.img_').attr('id')
        get_tour_detail_selected(a)
    }
    const get_tour_detail_selected = (tourID)=>{
        let get_tour = async () =>{
            let res = await API.get(endpoints['tour_detail_by_id'](tourID),{
                headers : { 
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            setName(res.data.name)
            setDuration(res.data.duration)
            setPrice_room(res.data.price_room)
            setPrice_tour(res.data.price_tour)
            setDiscount(res.data.discount)
            var date = res.data.time_start
            date =  date.slice(0,16)
            setTime_start(date)
            setID(res.data.id)
        }
        get_tour()
    }
    let closeModal  = ()=>{
        setIs_open(false)
        setName(null)
        setPrice_room(null)
        setPrice_tour(null)
        setDiscount(null)
        setDuration(null)
        setTime_start(null)  
    }

    let openMOdal_add  = (e)=>{
        setIs_open_add(true)
        var a = $(e.target).closest('.img_').attr('id')
    }
   
    let closeModal_add  = ()=>{
        setIs_open_add(false)
        setName(null)
        setPrice_room(null)
        setPrice_tour(null)
        setDiscount(null)
        setDuration(null)
        setTime_start(null)   
    }
    
    let openMOdal_noti  = (e)=>{
        setIs_open_noti(true)
    }
   
    let closeModal_noti  = ()=>{
        setIs_open_noti(false)
    }
    const update_tour_detail = (e)=>{
        e.preventDefault()

        let update = async ()=>{
            try{
                const formdata  = new FormData()
                formdata.append("name",name)
                formdata.append("image",image.current.files[0])
                formdata.append("active",active)
                formdata.append("price_room",price_room)
                formdata.append("price_tour",price_tour)
                formdata.append("discount",discount)
                formdata.append("duration",duration)
                formdata.append("time_start",time_start)    
                formdata.append("departure",departure_add_update)    
                formdata.append("destination",destination_add_update)    
                formdata.append("id" , ID)

                let res = await API.patch(endpoints['tour_detail_by_id'](ID),formdata,{
                    headers : {
                        'Authorization' : `Bearer ${cookie.load('access_token')}`
                    }
                })

                console.log(res.data)
                add_tour_detail_transport(res.data.id)
                closeModal()
                setChange(change+1)
            }catch(err){
                console.error(err)
            }
        }
        update()
    }

    let add_tour_detail_transport = async(tourID)=>{
        let res  = await API.post(endpoints['tour_detail_by_id_update_transport'](tourID),{
            'transport1' : transport_add,
            'transport2' : transport_add2
        },{
            headers : {
                'Authorization' : `Bearer ${cookie.load('access_token')}`
            } 
        })
        console.log(res.data)
    }

    let info_btn = (onclick)=>{
        return(
            <>
            <span className="icon_infor" onClick={onclick}>
                <span class="material-icons-outlined">
                info
                </span>
            </span>
            </>
        )
    }   

    let del_btn = (onclick)=>{
        return(
            <>
            <span className="icon_del" onClick={onclick}>
                <span class="material-icons-outlined">
                delete_outline
                </span>
            </span>
            </>
        )
    }

 
    const add_tour_detail = async(e)=>{
        e.preventDefault()
        try{
            const formdata  = new FormData()
            formdata.append("name",name)
            formdata.append("image",image.current.files[0])
            formdata.append("active",active)
            formdata.append("price_room",price_room)
            formdata.append("price_tour",price_tour)
            formdata.append("discount",discount)
            formdata.append("duration",duration)
            formdata.append("time_start",time_start)    
            formdata.append("departure",departure_add_update)    
            formdata.append("destination",destination_add_update)    
            formdata.append("total", price_tour - price_tour * discount/100)    
        
            let res = await API.post(endpoints['tour_detail_all'],formdata,{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            add_tour_detail_transport(res.data.id)
            list_detail.push(res.data)
            closeModal_add()
        }catch(er){
            console.error(er)
        }
    }

   
    let del_tour_selected =(e) =>{
        var a = $(e.target).closest('.img_').attr('id')
        console.log(a)
        del_tour(a)
    }
    
    const del_tour = async (tourID)=>{
        try{
            let res = await API.delete(endpoints['tour_detail_by_id'](tourID),{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            },[])
            list_detail.slice(res.data,1)
            setList_detail(list_detail)
            setChange(change-1)  
            toast.success('Delete success!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }catch(er){
            toast.warn('Có lỗi kìa má ôi!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    ///search
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

    let get_number_of_cmt =  (tourID)=>{
        let get = async () =>{
            let res = await API.get(endpoints['get_cmt_by_tour_detail'](tourID))
            return  res.data.length
        }
        
        get()
    }
    let get_destination_add = (event)=>{
        setDestination_add_update(event.target.options[event.target.selectedIndex].getAttribute("value"))
        setChange(change+1)
    }
    let get_departure_add = (event)=>{
        setDeparture_add_update(event.target.options[event.target.selectedIndex].getAttribute("value"))
        setChange(change+1)
    }

    let get_transport_add = (event)=>{
        setTransport_add(event.target.options[event.target.selectedIndex].getAttribute("value"))
        setChange(change+1)
    }

    let get_transport_add2 = (event)=>{
        setTransport_add2(event.target.options[event.target.selectedIndex].getAttribute("value"))
        setChange(change+1)
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

  
    if (list_detail !== null && list_detail !== '' && list_detail !== undefined ){
        $('.option_wrapper').hide()
        var a = document.querySelectorAll('.card_wrapper')
        var b = document.querySelectorAll('.option_wrapper')
        for(let i = 0 ; i< a.length ; i ++){
            $(a[i]).mousemove(function(){
                $(b[i]).show()  
            })
            $(a[i]).mouseleave(function(){
                $(b[i]).hide()  
            })
        }
return(
<>
<ToastContainer />


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
                            {tour_by_id.name}
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
                    {tour_by_id.name}
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
                                <option value="5000000">&lt;&#61; 5000000</option>
                                <option value="7000000">&lt;&#61; 7000000</option>
                                <option value="9000000">&lt;&#61; 9000000</option>
                            </select>                          
                        </div>
                    </div>
                    <div className="group_search">
                        <div className="label_search">
                            Transport
                        </div>
                        <div className="list_btn">
                            
                            {transport.map((u,index) => <TransportMap key={index} history= {history} transport = {u} />)}
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
                    <div className="group_search">
                        <div className="label_search">
                        Add Tour Detail
                        </div>
                        <div className="list_btn">
                        <Button variant="primary"  onClick={openMOdal_add} className="btn_add">
                            <div className="save_btn d_fl_center">
                                <span class="material-icons-outlined">
                                add_circle_outline
                                </span>Add
                            </div>
                        </Button>
                        </div>
                    </div>
                </form>
            </div>  
            <div className="col-md-9">
                <div className="heading_listdetail">
                    <div className="tour_tag">
                        <h3>Tour's {tour_by_id.name}</h3> 
                    </div>
                    <div className="content_bot">
                        <p>{tour_by_id.content}</p>
                    </div>
                </div>

                <div className="row">
                    {list_detail.map( (u,index)=> <Tour key={index} tour = {u} user = {user}
                    info= {info_btn(openMOdal)} del_btn ={del_btn(del_tour_selected)} />)}
                  
                </div>
                <div className="d-flex justify-content-center mt-5">
                    <Pagination count={Math.ceil(count/20)} onChange={(event, value) => setPage(value)} page={page}
                    style= {{outline : 'none',border:'none'}} color="secondary" />
                </div>
            
            </div>
        </div>
    
    </div>
</div>

{/* ---------------------modal_adđ------------------ */}

<Modal
isOpen={is_open_add}
onRequestClose={closeModal_add}
contentLabel="My dialog"
className="mymodal"
overlayClassName="myoverlay"
closeTimeoutMS={500}
ariaHideApp={false}
>
<div className="close_btn_wrapper" onClick={closeModal_add}>
    <div className="close_btn">
        <span class="material-icons-outlined">
            highlight_off
        </span>
    </div>    
</div>
<div className="modal_wrapper">
    <div className="form_wrapper">
        <h3 className="">Info's TourDetail</h3>
        <Form onSubmit={add_tour_detail} className="form_add">
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="name_add">Name</label>
                </div>
                <div className="input_wrapper">
                    <input id="name_add" type="text" value={name} onChange={(event)=>setName(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Time Start</label>
                </div>
                <div className="input_wrapper">
                    <input type="datetime-local"   value={time_start} onChange={(event)=>setTime_start(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Duration</label>
                </div>
                <div className="input_wrapper">
                    <input type="text"  value={duration} onChange={(event)=>setDuration(event.target.value)} />
                </div>
            </div>
           
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Price Room</label>
                </div>
                <div className="input_wrapper">
                    <input type="text"  value={price_room} onChange={(event)=>setPrice_room(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Price Tour</label>
                </div>
                <div className="input_wrapper">
                    <input type="text"  value={price_tour} onChange={(event)=>setPrice_tour(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Discount</label>
                </div>
                <div className="input_wrapper">
                    <input type="text"  value={discount} onChange={(event)=>setDiscount(event.target.value)} />
                </div>
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Departure</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_departure_add} id="tag_add" style={{marginRight : '15px'}}>
                    <option value="" key="">Departure</option>
                        {departure.map((u,index) => <option value={u.id} key={index}>{u.name}</option> )}
                    </select>
                </div>
                
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Destination</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_destination_add} id="tag_add" style={{marginRight : '15px'}}>
                        <option value="" key="">Destination</option>
                        {destination.map((u,index) => <option value={u.id} key={index}>{u.name}</option> )}
                    </select>
                </div>
                
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Transport</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_transport_add} id="tag_add" style={{marginRight : '15px'}}>
                        <option value={transport_add} key="">Transport</option>
                        {transport.map((u,index) => <option value={u.name} key={index}>{u.name}</option> )}
                    </select>
                    <select  onChange={get_transport_add2} id="tag_add" style={{marginRight : '15px'}}>
                        <option value={transport_add2} key="">Transport</option>
                        {transport.map((u,index) => <option value={u.name} key={index}>{u.name}</option> )}
                    </select>
                </div>
                
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="active_add">Active</label>
                </div>
                <div className="input_wrapper">
                    <input id="active_add" type="checkbox" defaultChecked={active} onChange={(event)=>setActive(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="img_add">Image</label>
                </div>
                <div className="input_wrapper">
                    <Form.Control id="img_add" type="file" ref={image} />
                </div>
            </div>
            
            <Button variant="primary" type="submit" className="btn_add">
                <div className="save_btn d_fl_center">
                    <span class="material-icons-outlined">
                        save
                    </span>Save
                </div>
            </Button>
        </Form>
    </div>
</div>
</Modal>
{/* ------------------------modal_info----------------- */}

<Modal
isOpen={is_open}
onRequestClose={closeModal}
contentLabel="My dialog"
className="mymodal"
overlayClassName="myoverlay"
closeTimeoutMS={500}
ariaHideApp={false}
>
<div className="close_btn_wrapper" onClick={closeModal}>
    <div className="close_btn">
        <span class="material-icons-outlined">
            highlight_off
        </span>
    </div>    
</div>
<div className="modal_wrapper">
    <div className="form_wrapper">
        <h3 className="">Info's TourDetail</h3>
        <Form onSubmit={update_tour_detail} className="form_add">
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="name_add">Name</label>
                </div>
                <div className="input_wrapper">
                    <input id="name_add" type="text" value={name} onChange={(event)=>setName(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Time Start</label>
                </div>
                <div className="input_wrapper">
                    <input type="datetime-local"  value={time_start} onChange={(event)=>setTime_start(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Duration</label>
                </div>
                <div className="input_wrapper">
                    <input type="text"  value={duration} onChange={(event)=>setDuration(event.target.value)} />
                </div>
            </div>
           
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Price Room</label>
                </div>
                <div className="input_wrapper">
                    <input type="text"  value={price_room} onChange={(event)=>setPrice_room(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Price Tour</label>
                </div>
                <div className="input_wrapper">
                    <input type="text"  value={price_tour} onChange={(event)=>setPrice_tour(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="username">Discount</label>
                </div>
                <div className="input_wrapper">
                    <input type="text"  value={discount} onChange={(event)=>setDiscount(event.target.value)} />
                </div>
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Departure</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_departure_add} id="tag_add" style={{marginRight : '15px'}}>
                    <option value="" key="">Departure</option>
                        {departure.map((u,index) => <option value={u.id} key={index}>{u.name}</option> )}
                    </select>
                </div>
                
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Destination</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_destination_add} id="tag_add" style={{marginRight : '15px'}}>
                        <option value="" key="">Destination</option>
                        {destination.map((u,index) => <option value={u.id} key={index}>{u.name}</option> )}
                    </select>
                </div>
                
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Transport</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_transport_add} id="tag_add" style={{marginRight : '15px'}}>
                        <option value={transport_add} key="">Transport</option>
                        {transport.map((u,index) => <option value={u.name} key={index}>{u.name}</option> )}
                    </select>
                    <select  onChange={get_transport_add2} id="tag_add" style={{marginRight : '15px'}}>
                        <option value={transport_add2} key="">Transport</option>
                        {transport.map((u,index) => <option value={u.name} key={index}>{u.name}</option> )}
                    </select>
                </div>
                
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="active_add">Active</label>
                </div>
                <div className="input_wrapper">
                    <input id="active_add" type="checkbox" defaultChecked={active} onChange={(event)=>setActive(event.target.value)} />
                </div>
            </div>
            <div className="form_group">
                <div className="label_wrapper">
                    <label for="img_add">Image</label>
                </div>
                <div className="input_wrapper">
                    <Form.Control id="img_add" type="file" ref={image} />
                </div>
            </div>
            
            <Button variant="primary" type="submit" className="btn_add">
                <div className="save_btn d_fl_center">
                    <span class="material-icons-outlined">
                        save
                    </span>Save
                </div>
            </Button>
        </Form>
    </div>
</div>
</Modal>

<Modal
isOpen={is_open_noti}
onRequestClose={closeModal_noti}
contentLabel="My dialog"
className="mymodal"
overlayClassName="myoverlay"
closeTimeoutMS={500}
ariaHideApp={false}
>
<div className="close_btn_wrapper" onClick={closeModal_noti}>
    <div className="close_btn">
        <span class="material-icons-outlined">
            highlight_off
        </span>
    </div>    
</div>
<div className="modal_wrapper">
    <div className="form_wrapper">
        <h3 className="">Bạn chưa đăng nhập</h3>
        <a href="/login">Login</a>
    </div>
</div>
</Modal>
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
    c =  c.replace(/[ZT]/g,'')
    var price = ''

    path = `/tour_detail/${props.tour.id}/`
    
    b =  b.replace(/[ZT]/g,' ')
    
    let return_rate = (rate) =>{
        if (rate !== null){
            return rate
        }else{
            return 0
        }
    }
    
    let path_bk = <a type="button" href={`/login`} className="form-control btn_booking">
            Login
        </a>
    let btn = <>
      
    </>
    if(props.user != null){
        path_bk =   
    <a type="button" href={`/tour_detail/${props.tour.id}/booking/`} className="form-control btn_booking">
        <span class="material-icons-outlined">
        shopping_cart
        </span><span>Booking</span>  
    </a>
        if(props.user.is_superuser){
            btn = <>
            {props.info}
            {props.del_btn}
        </>
        }
    }

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
                <span>{props.tour.price_tour} VND</span>
            </div>
            <div className="d-flex align-items-center">
                <span class="material-icons-outlined">
                    trending_down
                </span>
            </div>
            <div className="price_discount">
                <span>{props.tour.total} VND</span>
            </div>
        </>
    }else{
        price = <>
            <div className="price_present">
                <span>{props.tour.price_tour} VND</span>
            </div>
        </>
        
    }

    return(
<>
<div className="col-md-4">
    <div className="card_wrapper">
        <div className="img_" style={{'backgroundImage' : `url(${props.tour.image})`}} id={props.tour.id} >

            <div className="option_wrapper" >
                <div className="overlay-bl">
                </div>
                    <a href={`/tour_detail/${props.tour.id}/`} className="src_detail">
                    </a>
                <div className="btn_wrapper_option">
                    {btn}
                </div>
            </div>        
         
            <div className="rate_">
                <span>{return_rate(props.tour.rate[0].rate__avg)}</span>
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
                Departure: {props.tour.departure}
            </div>
            <div className="price_tour_detail">
                {price}
            </div>
        </div>  
        <div className="footer_">
            <div className="btn_">
                <div className="btn__">
                    <div className="btn_booking">
                        {path_bk}
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
<div className="" key={props.key}>
<label type="button" name="transport" for={props.transport.id} className="form-control" 
onClick={(e)=> props.history.push(`/search/?transport=${props.transport.name}`)}>{props.transport.name}</label>
<input type="radio" id={props.transport.id} name="transport" className="radio_option" />
</div>

</>
    )
}