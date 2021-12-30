import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Container ,Button, Form} from "react-bootstrap";
import API, { AuthAPI, endpoints } from "../Configs/API";
import { useLocation,useHistory } from "react-router";
import $ from 'jquery'; 
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";
import cookie from "react-cookies"
import { Pagination } from '@mui/material';
import '../CSS/Departure.css';

export default function Departure () {
    
    const [tour , setTour] = useState([])
    const [name , setName] = useState(null)
    const [tag , setTag] = useState([])

    const [tag_add , setTag_add] = useState([])
    const [tag_info , setTag_info] = useState([])

    const [content , setContent] = useState([])
    const [active, setActive] = useState(true)
    const [ID, setID] = useState(null)


    const [page, setPage] = useState(1)
    const [prev, setPrev] = useState(null)
    const [next , setNext] = useState(null)
    const location = useLocation()
    const [change,setChange] = useState(1)
    const [is_open , setIs_open] = useState(false)
    const [is_open_add , setIs_open_add] = useState(false)

    const user_selector = useSelector(state => state.user.user)
    const [user,setUser] = useState([])

    const [count , setCount] = useState(0)
    const image = useRef()
    const history = useHistory()

    const [name_search,setName_search] = useState([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( async()=>{
        let query = location.search
        
            if(query ==='')
                query = `?page=${page}`
       

        let res = await API.get(`${endpoints['tour_total_all']}${query}`)
        console.log(res.data.results)
        let res_tag = await API.get(endpoints['get_tag_country'])
        setTag(res_tag.data.results)

         if (user_selector !== undefined && user_selector !== null){
            let res_user = await API.get(endpoints['current_user'],{
                headers :{
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            setUser(res_user.data)
        }

        setTour(res.data.results)
        setNext(res.data.next)
        setPrev(res.data.previous)
        setCount(res.data.count)
        
    },[location.search,page,next,prev,change,user_selector])

   
    let openMOdal  = (e)=>{
        setIs_open(true)
        var a = $(e.target).closest('.slick_img').attr('id')
        get_tour_selected(a)
    }

    const get_tour_selected = (tourID)=>{
        let get_tour = async () =>{
            let res = await API.get(endpoints['tour_total_by_id'](tourID),{
                headers : { 
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })

            setName(res.data.name)
            setActive(res.data.active)
            setContent(res.data.content)
            setTag_info(res.data.tag[0].name)
            if (tag_info !== '' && tag_info !== null){

                if (tag_info){  
                    $("#tag_add option").each(function(){
                        if ($(this).text() === res.data.tag[0].name){
                            $(this).attr("selected","selected");
                        }
                    })
                }
            }
            setID(res.data.id)
        }
        get_tour()
    }
    let get_value = (event)=>{
        setTag_info(event.target.options[event.target.selectedIndex].getAttribute("value"))
        setChange(change+1)
    }

    let closeModal  = ()=>{
        setIs_open(false)
        setName(null)
        setActive(true)
        setContent([])
        setTag_info([])
        setID(null)
    }

    let openMOdal_add  = ()=>{
        setIs_open_add(true)
    }
   
    let closeModal_add  = ()=>{
        setIs_open_add(false)
        setName(null)
        setActive(true)
        setContent([])
        setTag_add([])
        setTag_info([])
        setID(null)
    }
    let fail_notice = () =>{
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
    let success_notice = () => {
            toast.success('Success', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    };
    const update_departure = async(e)=>{
        e.preventDefault()

        try{
            const formdata  = new FormData()
            formdata.append("name",name)
            formdata.append("content",content)
            formdata.append("image",image.current.files[0])
            formdata.append("active",active)
            formdata.append("id" , ID)

            let res = await API.patch(endpoints['tour_total_by_id'](ID),formdata,{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            },[])
            closeModal()
            update_tag_tour(res.data.id)
            setChange(change+1)
            success_notice()

        }catch(er){
            console.log(er)
            fail_notice()
        }
    }
    const update_tag_tour = (tourID)=>{
        let update_tag = async () =>{
            let res = await API.post(endpoints['tour_total_update_tag'](tourID),{
                'tag1' : tag_info,
            },{
                headers : { 
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            console.log(res.data)
        }
        update_tag()
    }

    let info_btn = (onclick)=>{
        return(
            <>
            <div className="icon_infor" onClick={onclick}>
                <span class="material-icons-outlined">
                info
                </span>
            </div>
            </>
        )
    }   

    let del_btn = (onclick)=>{
        return(
            <>
            <div className="icon_del" onClick={onclick}>
                <span class="material-icons-outlined">
                delete_outline
                </span>
            </div>
            </>
        )
    }

    const add_tag_tour = async(tourID)=>{
        let res = await API.post(endpoints['tour_total_add_tag'](tourID),{
            'tag' : tag_info
        },{
            headers : { 
                'Authorization' : `Bearer ${cookie.load('access_token')}`
            }
        })
    }


    const add_departure = async(e)=>{
        e.preventDefault()
        try{
            const formdata  = new FormData()
            formdata.append("name",name)
            formdata.append("content",content)
            formdata.append("image",image.current.files[0])
            formdata.append("active",active)
            let res = await API.post(endpoints['tour_total_all'],formdata,{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            add_tag_tour(res.data.id)
            setChange(change+1)
            closeModal_add()
        }catch(er){
            console.error(er)
        }
    }
    let del_tour_selected =(e) =>{
        var a = $(e.target).closest('.slick_img').attr('id')
        del_tour(a)
    }
    const del_tour = async (tourID)=>{
        try{
            let res = await API.delete(endpoints['tour_total_by_id'](tourID),{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            },[])
            tour.slice(res.data,1)
            setTour(tour)
            setChange(change+1)  
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
   
    let info = ''
    let del = ''
    let btn_add = ''
    if (tour !== null && tour !== '' && tour !== undefined ){

        if (user.length !== 0 && user.is_superuser == true || user.length !== 0 && user.staff.activeStaff == true ){
            info = info_btn(openMOdal)
            del = del_btn(del_tour_selected)
            btn_add =  <div className="group_search">
            <div className="label_search">
                Add Departure
            </div>
            <div className="list_btn">
                <Button variant="primary"  onClick={openMOdal_add} className="btn_add">
                    <div className="save_btn d-flex">
                        <span class="material-icons-outlined">
                        add_circle_outline
                        </span>Add
                    </div>
                </Button>
            </div>
        </div>
        }

        $('.option_wrapper').hide()
        var a = document.querySelectorAll('.slick_img')
        var b = document.querySelectorAll('.option_wrapper')
        for(let i = 0 ; i< a.length ; i ++){
            $(a[i]).mousemove(function(){
                $(b[i]).show()  
            })
            $(a[i]).mouseleave(function(){
                $(b[i]).hide()  
            })
        }

        
    
    return (
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
                            Departure List 
                        </li>
                      
                    </ul>
                </div>
                <h1 className="h1">Departure List</h1>
            </div>
        </div>
    </div>
</div>
<Container className="py-5">

<div class="tour-packed py-5">
    <div class="container">
        <div class="row ">
            <div class="col-md-12 heading-section text-center">
                <span class="subheading">Departure</span>
                <h2 class="under-subheading mb-4">Tour Departure</h2>
            </div>
        </div>
    </div>
</div>

<div className="list_tour row">
    <div className="search_field_tour col-md-3 col-sm-4">
        <div className="title_search">
            <span>Filter</span>             
        </div>
        <div className="cate_tour">
        </div>
        <form className="form_search_tour p-2" onKeyDown={(e)=>{
                if (e.key === 'Enter') {
                    history.push(`/departure/?name=${name_search}`)
                }
            }} onSubmit={(e)=>e.preventDefault()}>
            <div className="group_search">
                <div className="label_search">
                    Destination
                </div>
                <div className="select_time">
                    <input type="text" value={name_search} className="form-control" 
                    onChange={(event)=>setName_search(event.target.value)}  />
                </div>
            </div>
            <div className="group_search">
                <div className="label_search">
                    Category
                </div>
                <div className="list_btn">
                    
                    {tag.map((u,index)=> <TagMap key={index} history={history} tag = {u}/>)}
                </div>
            </div>
            {btn_add}
        </form>
    </div>  
    <div className="col-md-9 col-sm-8">
        <div className="list_tour_inner row" style={{margin : '0px'}}>
            {tour.map( (u,index)=> <Tour key={index} tours = {u} info= {info} del_btn ={del} />)}
            <Col md={3} xs={6} className="py-3">
               
            </Col>
        </div>
    </div>
    <Pagination count={Math.ceil(count/6)}   onChange={(event, value) => setPage(value)} page={page}
    style= {{outline : 'none',border:'none'}} color="secondary" />


</div>
   
</Container> 
<ToastContainer />
{/* -------------------------modal_info---------------------- */}
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
        <h3 className="">Information's Tour</h3>
        <Form onSubmit={update_departure} className="form_add">
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
                    <label for="username">Content</label>
                </div>
                <div className="input_wrapper">
                    <input type="text" id="content_add" value={content} onChange={(event)=>setContent(event.target.value)} />
                </div>
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Tags</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_value} id="tag_add" style={{marginRight : '15px'}}>
                        {tag.map((u,index) => <option value={u.name} key={index}>{u.name}</option> )}
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

{/* ----------------------modal_add----------------------- */}

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
        <h3 className="">Add Departure</h3>
        <Form onSubmit={add_departure} className="form_add">
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
                    <label for="username">Content</label>
                </div>
                <div className="input_wrapper">
                    <input type="text" id="content_add" value={content} onChange={(event)=>setContent(event.target.value)} />
                </div>
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Tags</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_value} id="tag_add" style={{marginRight : '15px'}}>
                        {tag.map((u,index) => <option value={u.name} key={index}>{u.name}</option> )}
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
                <div className="save_btn d-flex">
                    <span class="material-icons-outlined">
                        save
                    </span>Save
                </div>
            </Button>
        </Form>
    </div>
</div>
</Modal>

</>
        )
    }else{
        return(
<>
    <h1>Đang load</h1>
</>
        )
    }
}



function Tour(props){
    let path = ""

    path = `/departure/${props.tours.id}/`

    return(
<>
<Col md={4}  className="py-3">
    <div className="slick_img" style={{'backgroundImage' : `url(${props.tours.image})`}} id={props.tours.id}>
        
        <div className="available">
            <span>{props.tours.count} Available</span>
        </div>
        <div className="br_name">
            <div className="name_tour_br">
                {props.tours.name}
            </div>
        </div>
        
        
        <div className="option_wrapper">
            <div className="overlay-bl">
            </div>
            <a href={path} className="src_detail">
            </a>
            <div className="btn_wrapper_option">
                {props.info}
                {props.del_btn}
            </div>
        </div>
       
    </div>
</Col>
</>
    )
}


function TagMap (props){
    return(
<>
<div className="">
    <label type="button" name="tag" for={props.tag.id} className="form-control" 
    onClick={(e)=> props.history.push(`/departure/?tag=${props.tag.name}`)}>{props.tag.name}</label>
    <input type="radio" id={props.tag.id} name="transport" className="radio_option" />
</div>

</>
    )
}


       

// constructor() {
//     super()
//     this.state = {
//         'tours': [],
//         'count': 0,
//         'prev' : false,
//         'next' : false
//     }
// }

// componentDidMount() {
//     this.loadTours()
// }

// loadTours = (page = "?page=1") => {
//     API.get(`${endpoints['tours']}${page}`).then(res => {
//         this.setState({
//             'tours': res.data.results,
//             'count': res.data.count,
//             'prev' : true,
//             'next':true
//         })
//     })
// }
//   <Button className="btn_next btn_tour" varient = "info" onClick={()=>paging(+1)} disabled={!next}>&gt;&gt;</Button> 
//      <Button className="btn_prev btn_tour" varient = "info" onClick={()=>paging(-1)} disabled={!prev}>&lt;&lt;</Button> 
//  <label type="button" name="duration" for="1_3" className="form-control" 
//                             onClick={(e)=> {
//                             var a =$(e.target).closest('label').attr('for')
//                             history.push(`/search/?duration_from=`)
//                             // setDuration_from(split_id(a)[0])
//                             // setDuration_to(split_id(a)[1])
//                             }}>1-3 days</label>
                        
//                         <input type="radio" id="1_3"name="rr" className="radio_option" />