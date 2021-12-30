import React, { useEffect, useRef, useState } from "react";
import API, { AuthAPI, endpoints } from "../Configs/API";
import { useLocation,useHistory } from "react-router";
import $ from 'jquery'; 
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";
import cookie from "react-cookies"
import { Pagination } from '@mui/material';
import '../CSS/Blog.css'
import { useParams } from "react-router"
import { Slide } from 'react-slideshow-image';
import "react-slideshow-image/dist/styles.css"
import Slideshow from "./Test";
import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Moment from "react-moment";
import { Button, Form, Image } from "react-bootstrap";
import { useSelector } from "react-redux";

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
        }
    }
};


export default function BlogDetail (){

    const [blog_by_id, setBlog_by_id ] = useState([])
    const [list_blog, setList_blog ] = useState([])
    const {blogID} = useParams()

    const [change,setChange] = useState(1)
    const [user,setUser] = useState([])
    const [tag,setTag] = useState([])
    const [cmt_content , setCmt_content] = useState([])
    const [list_cmt_blog , setList_cmt_blog] = useState([])

    const [is_open,setIs_open] = useState(false)

    const image1 = useRef()
    const image2 = useRef()
    const image3 = useRef()
    const image4 = useRef()

    const user_selector = useSelector(state => state.user.user)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( async()=>{
        let res_blog = await API.get(endpoints['get_blog_by_id'](blogID)) 
        setBlog_by_id(res_blog.data)
        if (user_selector !== null && user_selector !== undefined){
            let res_user = await API.get(endpoints['current_user'],{
                headers:{
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            setUser(res_user.data)
        }
       
        let res_tag  = await API.get(endpoints['get_tag_blog']) 
        setTag(res_tag.data.results)

        let res_list_blog = await API.get(endpoints['get_blog_all'])
        setList_blog(res_list_blog.data.results)

        let res_list_cmt_blog = await API.get(endpoints['get_blog_by_id_get_cmt'](blogID))
        setList_cmt_blog(res_list_cmt_blog.data)
    },[change])


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
    let add_cmt = async(event)=>{
        event.preventDefault()
        try{
            let res_cmt = await API.post(endpoints['add_cmt_blog'](blogID),{
                'content': cmt_content
            },{
                headers:{
                    'Authorization': `Bearer ${cookie.load('access_token')}`
                }
            })
            setChange(change+1)
            $('.tks_box').css('opacity','1')
            $('.tks_box').css('z-index','1')
           console.log(res_cmt)
        }catch(er){
            console.error(er)
            fail_notice()
            
        }
      
    }

    let add_img_detail = async(e)=>{
        e.preventDefault()  
        const formdata = new FormData()
        formdata.append("img_detail",image1.current.files[0])
     

        let res = await API.post(endpoints['get_blog_by_id_add_img_detail'](blogID),formdata,{
            headers:{
                'Authorization' : `Bearer ${cookie.load('access_token')}`
            }
        })
        setChange(change+1)
        console.log(res.data)
    }


   
    $('#text_cmt').focus(function(){
        $('#pl_hd').hide()
    })
    $('#text_cmt').blur(function(){
        $('#pl_hd').show()
    })
   
    let openMOdal  = ()=>{
        setIs_open(true)
       
    }
    let closeModal  = ()=>{
        setIs_open(false)
    }

    if(blog_by_id.length !== 0 && list_blog.length!==0){
        if (user.length !==0){
            
        }   

return(
<>
<ToastContainer/>
<div class="banner">
    <div class="title_wrapper">
        <h3 class="title_blog">{blog_by_id.name}</h3>
    </div>
</div>
<div className="blog_body py-5" >
    <div className="container py-5">
        <div className="grid">
            <div className="left">
                <div className="left_wrapper">
                    <div className="img_main_blog" style={{backgroundImage : `url(${blog_by_id.image})`,backgroundPosition :'center',backgroundSize:'cover'}}>

                    </div>
                    <div className="content_">
                        <p className="text_nor">{blog_by_id.content}</p>
                    </div>
                    <div className="img_detail_wrapper">
                        <div className="slide_container">
                            <Slideshow
                            input={blog_by_id.img_detail}
                            ratio={`3:2`}
                            mode={`automatic`}
                            timeout={`3000`}
                            />
                            <div className="" onClick={openMOdal}>
                                <span class="material-icons-outlined">
                                add_circle_outline
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="right"  style={{position : 'sticky' , top : '0'}}>
                <div className="cat_wrapper wrapper_">
                    <div className="cat_">
                        <div className="header_extra">
                            <h3 className="cat_name_blog">Categories</h3>
                        </div>
                        <div className="body_extra">
                            <ul className="list_tag">
                                {tag.map((u,index) => <li value={u.id} key={index}>
                                     <a href={`/blog/?tag=${u.name}`}>{u.name} {}</a></li>)}
                            </ul>
                        </div>
                        
                    </div>
                </div>
                <div className="cmt_extra">
                    <form className="form_cmt_extra" onSubmit={add_cmt}>
                        <h4>Leave Your Comment</h4>
                        <input type="text" placeholder="Enter Your Comment" value={cmt_content} 
                        onChange={(e)=> setCmt_content(e.target.value)} />
                        <input type="submit" className="send_" value="send" ></input>
                    </form>
                    <div className="tks_box" style={{opacity : '0',zIndex : '-1'}} >
                        <p>Cảm ơn bạn</p>
                    </div>
                </div>
                <div className="cat_wrapper wrapper_">
                    <div className="related_post">
                        <div className="header_extra">
                            <h3 className="title_related">Related Post</h3>
                        </div>
                        <div className="body_extra">
                            <OwlCarousel className='owl-theme' loop margin={10} nav {...options}>
                                 {list_blog.map((u,index) =><Items key={index} tour = {u}/>)} 
                            </OwlCarousel>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    </div>
  
</div>



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
        <Form onSubmit={add_img_detail} className="form_register">
            
            <div className="label_">
                <label>Image1</label>
            </div>
            <div className="input_">
                <Form.Control type="file" ref={image1} />
            </div>
           
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

</>
    )
}else{
return(
<>
<h1>Dang Load</h1>
</>)
    }
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
        <a href={path} className="card-item card_blog" style= {{background : `url(${props.tour.image})`,backgroundPosition : "center"
         ,backgroundSize : "cover"}}>
        </a>
        <div className="name_blog_related">
            <span className="">{props.tour.name}</span>
        </div>
    </div>
</div>
</>
    )
}
