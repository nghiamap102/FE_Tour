
import { useEffect, useState } from "react"
import {  Form,  Spinner,Button } from "react-bootstrap"
import { useParams } from "react-router"
import API, { endpoints } from "../Configs/API"
import 'bootstrap/dist/css/bootstrap.min.css';
import Moment from "react-moment";
import { useSelector } from "react-redux";
import cookie from 'react-cookies'
import Modal from "react-modal";
// import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import '../CSS/Tourdetail.css';
import about from '../image/about.png';
import blog from '../image/blog.png';
import $ from 'jquery'; 
import StarIcon from '@mui/icons-material/Star';
import { Rating } from "@mui/material";
import { LineProgressBar } from "@frogress/line/dist/LineProgressBar";
// import ProgressBarLine from 'react-progressbar-line'

export default function  TourDetail(){

    const [tour_detail , setTour_detail] = useState([])
    const [cmt_content , setCmt_content] = useState([])
    const [list_cmt , setList_cmt] = useState([])

    const {tourdetailId} = useParams()
    const [change ,setChange] = useState(1)
    const [content , setContent] = useState([])
    
    const [rating,setRating] = useState(-1)
    const [rating_total,setRating_total] = useState(0)
    const [is_open_add , setIs_open_add] = useState(false)
    const [is_open_tks , setIs_open_tks] = useState(false)

    const [user,setUser] = useState([])

    const user_selector = useSelector(state=> state.user.user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( async()=>{

        let res = await API.get(endpoints['tour_detail_by_id'](tourdetailId),{
            headers : {
                'Authorization' : `Bearer ${cookie.load('access_token')}`
            }
        })
        setTour_detail(res.data)
        setRating_total(res.data.rate[0].rate__avg)

      

        let res_list_cmt = await API.get(endpoints['get_tour_detail_get_cmt'](tourdetailId))
        setList_cmt(res_list_cmt.data)

        if (user_selector !== null && user_selector !== undefined){
            let res_user = await API.get(endpoints['current_user'],{
                headers :{
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            setUser(res_user.data)
    
            let res_rating = await API.post(endpoints['get_rating'](tourdetailId),{
                    "id" : res_user.data.id
                },{
                headers:{
                    'Authorization': `Bearer ${cookie.load('access_token')}`
                }
            })
            if (res_rating.data !== null && res_rating.data.length !== 0){
                setRating(res_rating.data[0].rate)
                $('.form_rating button').attr('disabled','disabled');
            }
        }
     
        
    },[change])

    let add_cmt = async(event)=>{
        event.preventDefault()
        try{
            let res_cmt = await API.post(endpoints['add_cmt'](tourdetailId),{
                'content': cmt_content
            },{
                headers:{
                    'Authorization': `Bearer ${cookie.load('access_token')}`
                }
            })
            console.log(res_cmt.data)
            setChange(change+1)
           
        }catch(er){
            console.error(er)
        }
      
    }

    const rating_action = async (event) =>{
        event.preventDefault()
        try{
            let resrate = await API.post(endpoints['add_rating'](tourdetailId),{
                "rating" : rating
            },{
            headers:{
                'Authorization': `Bearer ${cookie.load('access_token')}`
            }
        })
        console.info(resrate.data)
        setChange(change+1)
        }catch(er)
            {
                console.error(er)
            }
    }
    
  

    let openMOdal_add  = ()=>{
        setIs_open_add(true)
       
    }
    let closeModal_add  = ()=>{
        setIs_open_add(false)
    }

    let return_null = (ele) =>{
        if(ele.tag !== null && ele.tag.length !== 0 ){
            return ele.tag[0].name
        }
        else{
            return ''
        }
    }
    const update_list_detail = (e)=>{
        e.preventDefault()

        let update = async ()=>{
            try{
                const formdata  = new FormData()
                // formdata.append("image_detail",image.current.files[0])


                let res = await API.patch(endpoints['tour_detail'](tourdetailId),formdata,{
                    headers : {
                        'Authorization' : `Bearer ${cookie.load('access_token')}`
                    }
                })
                console.log(res.data)
                closeModal_add()
                setChange(change+1)
            }catch(err){
                console.error(err)
            }
        }
        update()
    }
    let cmt_src = ''
    let bk_src = ''
    if(user.length != 0 ){
        cmt_src = <>
         <div className="col-md-12 row">
            <div className="col-md-2">
                <div className="ava_wrapper">
                    <img src={`http://127.0.0.1:8000${user.avatar}`} className="my_avatar" alt="" style={{width : '100%'}}/>
                </div>
            </div>
            <div className="col-md-6">
                <form onSubmit={add_cmt} className="form_cmt">
                    <textarea className="p-3"type="text" cols={30} rows={2} value={cmt_content} onChange={(e)=> setCmt_content(e.target.value)} />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        <div className="col-md-12 py-4">
            <h4>Please give us your rating</h4>
            <form onSubmit={rating_action} className="form_rating py-3">
                <Rating
                    name="text-feedback"
                    value={rating}
                    onChange={(e) => setRating(e.target.value) }
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <input type="submit" name="" value="Send"/>
            </form>
        </div>
        </>
        bk_src =  <div className="table_item item_booking">
        <a href={`/tour_detail/${tourdetailId}/booking/`}>
            <span>
                booking now
            </span>
        </a>
    </div>
    }


    $('#header-top').css('background-color','black')
    if (tour_detail.length !==0) {

return(
<>
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
        <h3 className="">Information's Tour</h3>
        <Form onSubmit={update_list_detail} className="form_register">
            
            <div className="label_">
                <label>Image</label>
            </div>
            {/* <div className="input_">
                <Form.Control type="file" ref={image} />
            </div> */}
            <Button variant="primary" type="submit">
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

<div className="entry_header py-5">
    <div className="container">
        <div className="entry_title">
            <div className="entry_blog" style={{backgroundImage : `url(${blog})`}}>
                <a href="/blog" className="src_blog"></a>
            </div>
            <div className="entry_name">
                <h1>{tour_detail.name}</h1>
                <h5>never ending footers</h5>
            </div>
            <div className="entry_blog" style={{backgroundImage : `url(${about})`}}>
                <a href="/contact" className="src_blog"></a>
            </div>
        </div>
        <div className="entry_br" style={{backgroundImage : `url(${tour_detail.image})`}}>
        </div>
    </div>
</div>

<div className="body_tour">
    <div className="container">
        <div className="row">
            <div className="col-md-9">
                <div className="about_tour" id="about">
                    <h4 className="name_tour_detail">{tour_detail.name}</h4>
                    <h2 style={{fontSize : '25px'}}>WHAT CAN I EXPECT FROM {tour_detail.name}?</h2>
                    <p className="content_tour">{tour_detail.content}</p>
                    <div className="thing_to_do">
                        <h4 style={{fontSize : '20px'}}>Things to do in {tour_detail.name}</h4>
                        <div className="row">
                            <div className="col-md-4">
                                <ul className="list_to_do">
                                    <li>
                                        <div className="dot_wrapper">
                                            <span className="dot_"></span>
                                        </div>
                                        <div className="things_content">
                                            <span>Take a photos</span>
                                        </div>
                                       </li>
                                    <li>
                                        <div className="dot_wrapper">
                                            <span className="dot_"></span>
                                        </div>
                                        <div className="things_content">
                                            <span> Proin gravida nibh</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dot_wrapper">
                                            <span className="dot_"></span>
                                        </div>
                                        <div className="things_content">
                                            <span> Proin gravida nibh</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-4">
                                <ul className="list_to_do">
                                    <li>        
                                        <div className="dot_wrapper">
                                            <span className="dot_"></span>
                                        </div>
                                        <div className="things_content">
                                            <span>Take a photos</span>
                                        </div>
                                       </li>
                                    <li>
                                        <div className="dot_wrapper">
                                            <span className="dot_"></span>
                                        </div>
                                        <div className="things_content">
                                            <span> Proin gravida nibh</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dot_wrapper">
                                            <span className="dot_"></span>
                                        </div>
                                        <div className="things_content">
                                            <span>Sollicitudin, lorem quis auctor</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-4">
                                <ul className="list_to_do">
                                <li>
                                        <div className="dot_wrapper">
                                            <span className="dot_"></span>
                                        </div>
                                        <div className="things_content">
                                            <span>Take a photos</span>
                                        </div>
                                       </li>
                                    <li>
                                        <div className="dot_wrapper">
                                            <span className="dot_"></span>
                                        </div>
                                        <div className="things_content">
                                            <span> Proin gravida nibh</span>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="dot_wrapper">
                                            <span className="dot_"></span>
                                        </div>
                                        <div className="things_content">
                                            <span> Proin gravida nibh</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="img_wrapper">
                        {/* <div className="img_detail" style={{backgroundImage : `url(${tour_detail.img_detail[0].image})`}}>
                            <span>
                                {tour_detail.img_detail[0].name}
                                ABC
                            </span>
                        </div>
                        <div className="img_detail" style={{backgroundImage : `url(${tour_detail.img_detail[1].image})`}}>
                            <span>
                                {tour_detail.img_detail[0].name}
                                ABC
                            </span>
                        </div> */}
                    </div>
                </div>
                <div className="cost" id="cost">
                    <h4>TYPICAL COSTS WHEN TRAVELLING</h4>
                    <div className="typical_cost">
                        <span>Accommodation </span>
                        <span>– Quo at mollis tritani molestie, munere vivendum sit ei, nec congue bonorum an. In quidam iriure alienum nam, in scripta probatus usu. Aperiam tractatos ex his, ex usu facete accumsan, duo platonem efficiantur intellegebat ut. Accusata scripserit persequeris pri eu, accusam argumentum disputationi an his. Nulla erant urbanitas sed ne, mei velit laudem id, nonumy eligendi pri ei. Eu mel everti ocurreret, nemore quodsi referrentur ius ad.</span>
                    </div>
                    <div className="typical_cost">
                        <span>Food </span>
                        <span>– Quo at mollis tritani molestie, munere vivendum sit ei, nec congue bonorum an. In quidam iriure alienum nam, in scripta probatus usu. Aperiam tractatos ex his, ex usu facete accumsan, duo platonem efficiantur intellegebat ut.</span>
                    </div>
                    <div className="typical_cost">
                        <span>Food </span>
                        <span>– Quo at mollis tritani molestie, munere vivendum sit ei, nec congue bonorum an. In quidam iriure alienum nam, in scripta probatus usu. Aperiam tractatos ex his, ex usu facete accumsan, duo platonem efficiantur intellegebat ut.</span>
                    </div>
                    <div className="col-md-12" style={{backgroundImage :`url(${tour_detail.image})` , height : '600px'
                     ,backgroundPosition : 'center',backgroundSize : 'cover' }}>
                    </div>
                    <div className="typical_cost">
                        <span>Food </span>
                        <span>– Quo at mollis tritani molestie, munere vivendum sit ei, nec congue bonorum an. In quidam iriure alienum nam, in scripta probatus usu. Aperiam tractatos ex his, ex usu facete accumsan, duo platonem efficiantur intellegebat ut.</span>
                    </div>
                </div>
                <div className="tips" id="tips">
                    <h4>MONEY SAVING TIPS</h4>
                    <div className="img_wrapper">
                        <div className="tips_left">
                            <div className="tips_content">
                                <div className="cell_top">
                                    <span className="stt">1.</span>
                                </div>
                                <div className="things_content">
                                    <span> Proin gravida nibh</span>
                                    <span> - Accusata vulputate pri an, mel no vivendo deleniti, aliquid probatus elaboraret ut quo. Veniam facete intellegebat et mei, cetero luptatum definiebas at nec. Nisl viris.</span>
                                </div>
                            </div>
                            <div className="tips_content">
                                <div className="cell_top">
                                    <span className="stt">1.</span>
                                </div>
                                <div className="things_content">
                                    <span>Proin gravida nibh</span>
                                    <span> - Accusata vulputate pri an, mel no vivendo deleniti, aliquid probatus elaboraret ut quo. Veniam facete intellegebat et mei, cetero luptatum definiebas at nec. Nisl viris.</span>
                                </div>
                            </div>
                        </div>  
                        <div className="tips_right">
                            <div className="tips_content">
                                <div className="cell_top">
                                    <span className="stt">1.</span>
                                </div>
                                <div className="things_content">
                                    <span>Proin gravida nibh</span>
                                    <span> - Accusata vulputate pri an, mel no vivendo deleniti, aliquid probatus elaboraret ut quo. Veniam facete intellegebat et mei, cetero luptatum definiebas at nec. Nisl viris.</span>  
                                </div>
                            </div>
                            <div className="tips_content">
                                <div className="cell_top">
                                    <span className="stt">1.</span>
                                </div>
                                <div className="things_content">
                                    <span>Proin gravida nibh</span>
                                    <span> - Accusata vulputate pri an, mel no vivendo deleniti, aliquid probatus elaboraret ut quo. Veniam facete intellegebat et mei, cetero luptatum definiebas at nec. Nisl viris.</span>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="calender" id="calender">
                    <h4>WHAT CAN I EXPECT FROM {tour_detail.name}?</h4>
                    <p className="content_calender">Lorem ipsum proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris in erat justo. Nullam ac urna eu felis dapibus condimentum sit amet a augue consequat elis. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt.
                    </p>
                    <div className="grid_img_calender">
                        <div className="col-md-12" style={{backgroundImage :`url(${tour_detail.image})` , width : '100%',height:'200px'
                        ,backgroundPosition : 'center',backgroundSize : 'cover' }}>
                            <span>ABC</span>
                        </div>
                        <div className="col-md-12" style={{backgroundImage :`url(${tour_detail.image})` , width : '100%',height:'200px'
                        ,backgroundPosition : 'center',backgroundSize : 'cover' }}>
                            <span>ACB</span>
                        </div>
                        <div className="col-md-12" style={{backgroundImage :`url(${tour_detail.image})` , width : '100%',height:'200px'
                        ,backgroundPosition : 'center',backgroundSize : 'cover' }}>
                            <span>BAC</span>
                        </div>
                    </div>
                    <p className="content_calender">Lorem ipsum proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt auctor a ornare odio. Sed non mauris vitae erat consequat auctor eu in elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris in erat justo. Nullam ac urna eu felis dapibus condimentum sit amet a augue consequat elis. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit. Nam nec tellus a odio tincidunt.
                    </p>
                    <div className="extra_info">
                        <div className="tag_info">
                            <span class="material-icons-outlined">
                            local_offer
                            </span>
                            <span>
                                {/* {} */}
                                <a href={`/search/?tag=${return_null(tour_detail)}`}>{return_null(tour_detail)}</a>
                            </span>
                            <span className="icon_cmt_extra"><i class="far fa-comment-alt"></i>{list_cmt.length}</span>
                        </div>
                    </div>
                </div>
                
                <div className="cmt_and_rate" id="cmt_and_rate">
                    
                    <div className="row">
                        <div className="col-md-12">
                            <h4>All Rating</h4> 
                        </div>
                        <div className="col-md-9 py-5">
                            <div className="row">
                                <div className="col-md-4 text-center">

                                    <h1 className="rate_avg">{rating_total}</h1>
                                    <div className="react_wrapper">
                                        <Rating
                                            name="text-feedback"
                                            value={rating_total}
                                            readOnly
                                            precision={0.5}
                                            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                        />
                                    </div>
                                    <p className="digit_count">{tour_detail.rate[6].rate__count} Totals</p>
                                </div>
                                <div className="col-md-8">
                                    <div className="th_start">
                                        <div className="label_start">
                                            <div className="d-flex align-items-center">
                                                <span>5</span>
                                            </div>
                                        </div>
                                        <LineProgressBar percent={tour_detail.rate[5].star_5 /  tour_detail.rate[6].rate__count * 100} 
                                        progressColor="linear-gradient(to right, #78abe9, #74dad8, #ec7cac)" />
                                    </div>
                                    <div className="th_start">
                                        <div className="label_start">
                                            <span>4</span>
                                        </div>
                                        <LineProgressBar percent={tour_detail.rate[4].star_4 /  tour_detail.rate[6].rate__count * 100}
                                        progressColor="linear-gradient(to right, #78abe9, #74dad8, #ec7cac)" />
                                        </div>
                                    <div className="th_start">
                                        <div className="label_start">
                                            <span>3</span>
                                        </div>
                                        <LineProgressBar percent={tour_detail.rate[3].star_3 /  tour_detail.rate[6].rate__count * 100}
                                                progressColor="linear-gradient(to right, #78abe9, #74dad8, #ec7cac)" />
                                    </div>
                                    <div className="th_start">
                                        <div className="label_start">
                                            <span>2</span>
                                        </div>
                                        <LineProgressBar percent={tour_detail.rate[2].star_2 /  tour_detail.rate[6].rate__count * 100} 
                                                progressColor="linear-gradient(to right, #78abe9, #74dad8, #ec7cac)" />
                                    </div>
                                    <div className="th_start">
                                        <div className="label_start">
                                            <span>1</span>
                                        </div>
                                        <LineProgressBar percent={tour_detail.rate[1].star_1 /  tour_detail.rate[6].rate__count * 100} 
                                                progressColor="linear-gradient(to right, #78abe9, #74dad8, #ec7cac)" />
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="col-md-12 py-5">
                            <h4>Post a comment</h4>
                        </div>
                        {cmt_src}
                        
                      
                        <div className="col-md-6 pt-5">
                            <h4>All Comment</h4>
                            <div className="list_cmt p-2">
                                {list_cmt.map((u,index)=>
                                <div className="nth_cmt py-3" key={index}>
                                    <div className="avatar_customer_wrapper">
                                        <img src={u.customer[2]} alt="" className="avatar_customer" style={{width:'100%'}}/>
                                    </div>
                                    <div className="content_cmt">
                                        <p>{u.content}</p>
                                        <div className="option_cmt">
                                            <span>Like</span>
                                            <span>Reply</span>
                                            <span>Delete</span>
                                            <span><Moment fromNow>{u.created_date}</Moment></span>
                                        </div>
                                    </div>
                                </div>
                                )}
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="col-md-3">
                <div className="table_of_content d-flex">
                    <div className="table_item">
                        <a href="#about">
                            <img src="https://backpacktraveler.qodeinteractive.com/wp-content/uploads/2018/08/destination-custom-icon-1.png" alt="cmm" />

                            <span>
                                Things to see
                            </span>
                        </a>
                    </div>
                    <div className="table_item">
                        <a href="#cost">
                            <img src="https://backpacktraveler.qodeinteractive.com/wp-content/uploads/2018/08/destination-custom-icon-2.png" alt="cmm" />

                            <span>
                                typical costs
                            </span>
                        </a>
                    </div>
                    <div className="table_item">
                        <a href="#tips">
                            <img src="https://backpacktraveler.qodeinteractive.com/wp-content/uploads/2018/08/destination-custom-icon-3.png" alt="cmm" />

                            <span>
                                budget tips
                            </span>
                        </a>
                    </div>
                    
                    <div className="table_item">
                        <a href="#calender">
                            <img src="https://backpacktraveler.qodeinteractive.com/wp-content/uploads/2018/08/destination-custom-icon-5-1.png" alt="cmm" />

                            <span>
                                Calender
                            </span>
                        </a>
                    </div>
                    <div className="table_item">
                        <a href="#cmt_and_rate">
                            <img src="https://backpacktraveler.qodeinteractive.com/wp-content/uploads/2018/08/destination-custom-icon-6-1.png" alt="cmm" />

                            <span>
                                Comment
                            </span>
                        </a>
                    </div>
                    {bk_src}
                </div>
            </div>
        </div>
    </div>
</div>



<Modal
isOpen={is_open_add}
onRequestClose={closeModal_add}
contentLabel="My dialog"
className="mymodal"
overlayClassName="myoverlay"
closeTimeoutMS={500}
ariaHideApp={false}
>

</Modal>


</>
        )
    }
    else{
        return(
            <>
            <h1>Đang Load</h1>
            </>
        )
    }
}

