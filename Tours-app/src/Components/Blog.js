import { useEffect, useRef, useState } from "react"
import { Col, Image,Form, Button } from "react-bootstrap"
import API, { endpoints } from "../Configs/API"
import { useLocation } from "react-router";
import $ from 'jquery'; 
import { toast, ToastContainer } from "react-toastify";
import Modal from "react-modal";
import cookie from "react-cookies"
import { useSelector } from "react-redux";
import '../CSS/Blog.css'
import '@mui/material'
import OwlCarousel from 'react-owl-carousel'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

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

export default function Blog (){
    
    const [list_blog,setList_blog] = useState([])    

    const [content,setContent] = useState([])    
    const [active,setActive] = useState(true)    
    const [decription,setdecription] = useState([])    
    const [name,setName] = useState(null)    
    const [ID, setID] = useState(null)
    const [tag,setTag] = useState([])
    const [tag_add,setTag_add] = useState([])
    
    const location =  useLocation()
    const image = useRef()

    const [type_like , setType_like] = useState(0)
    const [like_count,setLike_count] = useState()
    
    const [tour_detail,setTourt_detail] =useState([])

    const [change,setChange] = useState(0)
    const [is_open , setIs_open] = useState(false)
    const [is_open_add , setIs_open_add] = useState(false)

    const [tag_selected , setTtag_selected] = useState([])
    const [user,setUser] = useState([])

    const user_selector = useSelector(state=> state.user.user)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        try{
            let res_listblog = await API.get(`${endpoints['get_blog_all']}${location.search}`)
            setList_blog(res_listblog.data.results)
           
            // console.log(res_listblog.data.results[0].like[0])

            let restour_detail = await API.get(`${endpoints['tour_detail_all']}`,[])
            setTourt_detail(restour_detail.data.results)

            let res_tag = await API.get(endpoints['get_tag_blog'])
            setTag(res_tag.data.results)

            if(user_selector !== null && user_selector !== undefined){
                let res_user = await API.get(endpoints['current_user'],{
                    headers :{
                        'Authorization' : `Bearer ${cookie.load('access_token')}`
                    } 
                })
                setUser(res_user.data)
            }

        }
        catch(er){
            console.error(er)
        }
       
    },[change,location.search]);
  
    
    let openMOdal  = (e)=>{
        setIs_open(true)
        var a = $(e.target).closest('.img_main_blog').attr('id')
        get_blog_by_id_selected(a)
    }
    const get_blog_by_id_selected = (blogID)=>{
        let get_tour = async () =>{
            let res = await API.get(endpoints['get_blog_by_id'](blogID),{
                headers : { 
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            console.log(res.data)
            setName(res.data.name)
            setActive(res.data.active)
            setdecription(res.data.decription)
            setID(res.data.id)
            setTag_add(res.data.tag[0].name)
        }
        get_tour()
    }

    let update_blog =(e) =>{
        e.preventDefault()

        let update = async()=>{
            try{
                const formdata  = new FormData()
                formdata.append("name",name)
                formdata.append("decription",decription)
                formdata.append("image",image.current.files[0])
                formdata.append("active",active)
                formdata.append("id" , ID)

    
                let res = await API.patch(endpoints['get_blog_by_id'](ID),formdata,{
                    headers : {
                        'Authorization' : `Bearer ${cookie.load('access_token')}`
                    }
                },[])
                console.log(res.data)
                closeModal()
                add_tag(res.data.id)
                setChange(change+1)
                success_notice()
            }catch(err){
                fail_notice()
                console.error(err)
            }
        }
        update()

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
    }
    let closeModal  = ()=>{
        setIs_open(false)
        setName(null)
        setActive(true)
        setContent([])
        setdecription([])
        setID(null)
    }

    let openMOdal_add  = ()=>{
        setIs_open_add(true)
        setName(null)
        setActive(true)
        setContent([])
        setdecription([])
        setID(null)
    }
    const add_blog = (e)=>{
        e.preventDefault()
        let add = async ()=>{
            if (tag_add.length !== 0 ){
                try{
                    const formdata  = new FormData()
                    formdata.append("name",name)
                    formdata.append("decription",decription)
                    formdata.append("image",image.current.files[0])
                    formdata.append("active",active)
    
                    let res = await API.post(endpoints['get_blog_all'],formdata,{
                        headers : {
                            'Authorization' : `Bearer ${cookie.load('access_token')}`
                        }
                    })
                    console.log(res.data)
                    setChange(change+1)
                    closeModal_add()
                    add_tag(res.data.id)
                    toast.success('Add success!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }catch(er){
                    console.error(er)
                    toast.warning('Có lỗi gòi!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
               
            }else{
                toast.warning('Có lỗi gòi!', {
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
        add()
    }
    let add_tag =async (blogID)=>{
            let res = await API.post(endpoints['get_blog_by_id_update_tag'](blogID),{
                "tag" : tag_add
            },{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            console.log(res.data)
    }
    let get_value = (event)=>{
        var a = (event.target.options[event.target.selectedIndex].getAttribute("value"))
        setTag_add(a)
    }
    let closeModal_add  = ()=>{
        setIs_open_add(false)
        setContent([])
        setName([])
        setdecription([])
    }

    

    let like = async (e)=>{
        if (user_selector !== null && user_selector !== undefined){
            var a = $(e.target).closest('.bottom_content').attr('id')
            let res = await API.post(endpoints['add_like'](a),{
                "type" : 0
            },{
                headers: {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            console.log(res.data)
            setChange(change+1)
        }else{
            alert('Chưa Đăng nhập má ôi')
        }
    }

    let heart = async (e)=>{
        if (user_selector !== null && user_selector !== undefined){
            var b = $(e.target).closest('.bottom_content').attr('id')
       
            let res = await API.post(endpoints['add_like'](b),{
                "type" : 1
            },{
                headers: {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            setChange(change+1)
        }else{
            alert('Chưa Đăng nhập má ôi')
        }
    }
    let haha = async (e)=>{
        if (user_selector !== null && user_selector !== undefined){
            var b = $(e.target).closest('.bottom_content').attr('id')
            let res = await API.post(endpoints['add_like'](b),{
                "type" : 2
            },{
                headers: {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            setChange(change+1)
        }else{
            alert('Chưa Đăng nhập má ôi')
        }
       

    }
    let sad = async (e)=>{
        if (user_selector !== null && user_selector !== undefined){
            var b = $(e.target).closest('.bottom_content').attr('id')
            let res = await API.post(endpoints['add_like'](b),{
                "type" : 3
            },{
                headers: {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            setChange(change+1)
        }else{
            alert('Chưa Đăng nhập má ôi')
        }
        
    }
    let angry = async (e)=>{
        if (user_selector !== null && user_selector !== undefined){
            var b = $(e.target).closest('.bottom_content').attr('id')
            let res = await API.post(endpoints['add_like'](b),{
                "type" : 4
            },{
                headers: {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            setChange(change+1)
        }else{
            alert('Chưa Đăng nhập má ôi')
        }
    }



    if (tag_add !== '' && tag_add !== null && tag_add.length !== 0 ){
        $("#tag_add option").each(function(){

            if ($(this).attr('value') == tag_add){
                $(this).attr("selected","selected");
            }
        })
    }
   
    let get_blog_to_del =(e) =>{
        var a =  $(e.target).closest('.img_main_blog').attr('id')
        console.log(a)
        del_blog(a)
    }

    const del_blog = async(blogID)=>{
        try{
            let res =await API.delete(endpoints['get_blog_by_id'](blogID),{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            },[])
           
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
            console.log(res.data)
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
    let sort_date= (date)=>{
        date = date.slice(0,10)
        return date
    }

   

    let default_icon = (userID,creatorID,type,click)=>{
        let icon = <span class="material-icons-outlined" onClick={click}>
        thumb_up
        </span>
        for ( let  i = 0 ; i< creatorID.length ; i ++){
            if (userID == creatorID[i]){
                switch(type[i]){
                    case 0:
                        icon = <span class="material-icons-outlined span0">
                        thumb_up
                        </span>
                        break;
                    case 1:
                        icon = <span class="material-icons-outlined span1">
                        favorite
                        </span>

                        break;
                    case 2:
                        icon =  <span class="material-icons-outlined span2">
                        sentiment_satisfied
                        </span>

                        break;
                    case 3:
                        icon = <span class="material-icons-outlined span3">
                        sentiment_dissatisfied
                        </span>

                        break;
                    case 4:
                        icon = <span class="material-icons-outlined span4">
                        sentiment_very_dissatisfied
                        </span>

                        break;
                    default:
                        icon = <span class="material-icons-outlined" >
                        thumb_up
                        </span>
                        break;
                }
            }
        }
        return icon
        
    }

   

    let map_like = (creator)=>{
        var a = []
        for(let i = 0 ; i < creator.length ; i ++){
            a.push(creator[i].creator) 
        }
        return a
    }

    let map_type = (type)=>{
        var a = []
        for(let i = 0 ; i < type.length ; i ++){
            a.push(type[i].type) 
        }
        return a
    }

    let btn_add = ''
    let del_info = ''
    if(list_blog.length !== 0){
        var arr_icon = document.querySelectorAll('.icon_rate')
        var arr_option = document.querySelectorAll('.option_')
        if (user.length !== 0  ){
            btn_add =<div className="abc" onClick={openMOdal_add}>
            <button className="btn btn-primary">add</button>
        </div>

            del_info = <>
                {info_btn(openMOdal)}
                {del_btn(get_blog_to_del)}
            </>

            if( arr_icon.length!== 0 && arr_option.length!==0){
                for (let i = 0; i < arr_icon.length; i++) {
                    $(arr_icon[i]).mouseover(function () {
                        $(arr_option[i]).css("opacity","1")
                        $(document).mousemove(function(){
                            if( isHovered('.icon_rate') || isHovered('.option_')  ){
                                $(arr_option[i]).css("opacity","1")
                            } else{
                                $(arr_option[i]).css("opacity","0")        
                            }
                        });
                    });
                    $(arr_option[i]).mouseleave(function () { 
                        $(arr_option[i]).css("opacity","0")
                    }); 
                }
                function isHovered(selector) {
                    return $(selector+":hover").length > 0
                }
            }
        }


        $('.btn_wrapper_option').hide()
        $('.img_main_blog .overlay-bl').hide()
        var a = document.querySelectorAll('.img_main_blog')
        var b = document.querySelectorAll('.btn_wrapper_option')
        var c = document.querySelectorAll('.img_main_blog .overlay-bl')
        
        for(let i = 0 ; i< a.length ; i ++){
            $(a[i]).mousemove(function(){
                $(b[i]).show()  
                $(c[i]).show()  
            })
            $(a[i]).mouseleave(function(){
                $(b[i]).hide()  
                $(c[i]).hide()  
            })
        }

    
    return(
<>
<ToastContainer />

<div class="src-title-layout bg-img">
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

{btn_add}

<div className="blog_body py-5">
    <div className="container py-5">
        <div className="grid">
            <div className="left">
                <div className="left_wrapper">
                    {list_blog.map(  (u,index) => {
                        return(
                        <div className="post_obj">
                            
                            <div className="img_main_blog" id={u.id}  key={index}  style={{backgroundImage : `url(${u.image})`,backgroundPosition :'center',backgroundSize:'cover'}}>
                                <div className="overlay-bl">
                                </div>
                                <a href={`/blog/${u.id}`} className="src_blog">
                                </a>
                                <div className="btn_wrapper_option">
                                   {del_info}
                                </div>
                            </div>
                        
                            <div className="bottom_content" id={u.id}>
                                <div className="infor_">
                                    <h3><a href={`/blog/${u.id}`}>{u.name}</a></h3>
                                    <div className="created_date">
                                        <div className="created_date_">
                                            <div className="icon_clock_">
                                                <span class="material-icons-outlined icon_clock">
                                                schedule
                                                </span>
                                            </div>
                                        
                                            <span>{sort_date(u.created_date)}</span>
                                        </div>  
                                        <div className="tag">
                                            <div className="icon_tag">
                                                <span class="material-icons-outlined icon_tag_">
                                                local_offer
                                                </span>
                                            </div>
                                            <span>{u.tag[0].name}</span>

                                        </div>
                                    </div>
                                    <p>{u.decription}</p>
                                    <div className="rate_and_cmt">
                                        <div className="rate_action">
                                            <div className="icon_rate">
                                                {default_icon(user.id,map_like(u.like),map_type(u.like),like)}
                                                <div className="option_">
                                                    <label className="icon_option" for={`${u.id}_0`} onClick={like} >
                                                        <span class="material-icons-outlined">
                                                        thumb_up
                                                        </span>
                                                        <input type="radio" className="check_like"  name="check_like" onChange={(e) =>{
                                                            $(e.target).closest('.option_').prev('span').remove()
                                                            $(e.target).closest('.option_').next('span').remove()
                                                            $(e.target).closest('.icon_rate').append("<span class='material-icons-outlined span0'>thumb_up</span>")
                                                        } } id={`${u.id}_0`} />
                                                    </label>
                                                    <label className="icon_option" for={`${u.id}_1`} onClick={heart}>
                                                        <span class="material-icons-outlined">
                                                        favorite
                                                        </span>
                                                        <input type="radio" className="check_like"  name="check_like" onChange={(e) =>{
                                                            $(e.target).closest('.option_').prev('span').remove()
                                                            $(e.target).closest('.option_').next('span').remove()
                                                            $(e.target).closest('.icon_rate').append("<span class='material-icons-outlined span1'>favorite</span>")
                                                        } } id={`${u.id}_1`} />                                               
                                                    </label>
                                                    <label className="icon_option" for={`${u.id}_2`} onClick={haha}>
                                                        <span class="material-icons-outlined">
                                                        sentiment_satisfied
                                                        </span>
                                                        <input type="radio" className="check_like"  name="check_like" onChange={(e) =>{
                                                            $(e.target).closest('.option_').prev('span').remove()
                                                            $(e.target).closest('.option_').next('span').remove()
                                                            $(e.target).closest('.icon_rate').append("<span class='material-icons-outlined span2'>sentiment_satisfied</span>")
                                                        } } id={`${u.id}_2`} />                                                
                                                    </label>
                                                    <label className="icon_option" for={`${u.id}_3`} onClick={sad}>
                                                        <span class="material-icons-outlined">
                                                        sentiment_dissatisfied
                                                        </span>
                                                        <input type="radio" className="check_like"  name="check_like" onChange={(e) =>{
                                                            $(e.target).closest('.option_').prev('span').remove()
                                                            $(e.target).closest('.option_').next('span').remove()
                                                            $(e.target).closest('.icon_rate').append("<span class='material-icons-outlined span3'>sentiment_dissatisfied</span>")
                                                        } } id={`${u.id}_3`} />                                               
                                                    </label>
                                                    <label className="icon_option" for={`${u.id}_4`} onClick={angry}>
                                                        <span class="material-icons-outlined">
                                                        sentiment_very_dissatisfied
                                                        </span>
                                                        <input type="radio" className="check_like"  name="check_like" onChange={(e) =>{
                                                            $(e.target).closest('.option_').prev('span').remove()
                                                            $(e.target).closest('.option_').next('span').remove()
                                                            $(e.target).closest('.icon_rate').append("<span class='material-icons-outlined span4'>sentiment_very_dissatisfied</span>")
                                                        } } id={`${u.id}_4`} />                                                
                                                    </label>
                                                </div>
                                            </div>
                                            <span className="digit_count">{u.count_like.type__count}</span>
                                        </div>
                                        <div className="cmt_action">
                                            <div className="icon_cmt">
                                                <span class="material-icons-outlined">
                                                chat
                                                </span>
                                            </div>
                                            <span className="digit_count">{u.cmt_blog.content__count}</span>
                                        </div>
                                    </div>
                                   
                                </div>
                            </div>
                        </div>
                            )
                        }
                    )}
                    
                   
                </div>
            </div>
            <div className="right">
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




{/* ----------------------------modal_add-------------------- */}

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
        <Form onSubmit={add_blog} className="form_add">
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
                    <label for="username">Description</label>
                </div>
                <div className="input_wrapper">
                    <input type="text" id="content_add" value={decription} onChange={(event)=>setdecription(event.target.value)} />
                </div>
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Tags</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_value} id="tag_add" style={{marginRight : '15px'}}>
                        <option value="" key=""></option>
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
{/* -------------------------------modal_info------------------------------------ */}
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
        <h3 className="">Add Departure</h3>
        <Form onSubmit={update_blog} className="form_add">
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
                    <label for="username">Description</label>
                </div>
                <div className="input_wrapper">
                    <input type="text" id="content_add" value={decription} onChange={(event)=>setdecription(event.target.value)} />
                </div>
            </div>
            <div className="form_group" id="tag_gr">
                <div className="label_wrapper">
                    <label for="tag_add">Tags</label>
                </div>
                <div className="input_wrapper">
                    <select  onChange={get_value} id="tag_add" style={{marginRight : '15px'}}>
                        <option value="" key=""></option>
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
</>
        )
    }else{
        return(
<>
            <h1>TUTU đang load mấy má</h1>
</>
        )
    }
}

// function BlogMap(props){

//     return(
// <>
// <div  key={props.index} id={props.blog.id} className="col-md-4 card_blog js_blog" style={{backgroundImage : `url(${props.blog.image})`}}>
//     <div className="overlay_blog"></div>
//     <a href="/" className="src_absolute">

//     </a>
//     <div className="content_inner">
//         <div className="tag_name"> 
//             <div>{props.tag.name}</div>
//         </div>
//         <div className="name_blog_second">
//             <a href={`/blog/`} className="">{props.blog.name}</a>
//         </div>
//         <div className="created_date">Date: {props.sort_date(props.blog.created_date)}</div>
//     </div>
//     <div className="option_wrapper">
//         <div className="overlay-bl">
//         </div>
//         <a href={`/blog/${props.blog.id}`} className="src_detail">
//         </a>
//         <div className="btn_wrapper_option">
//             {props.info_btn}
//             {props.del_btn}
//         </div>
//     </div>
// </div>

// </>

//     )
// }

function Items(props){
 
   
    return(
<>
<div class="item">
    <div class="card-tour-remaining">
        <a href={`/blog/${props.tour.id}`} className="card-item card_blog" style= {{background : `url(${props.tour.image})`,backgroundPosition : "center"
         ,backgroundSize : "cover",backgroundRepeat : 'no-repeat'}}>
        </a>
        <div className="name_blog_related">
            <span className="">{props.tour.name}</span>
        </div>
    </div>
</div>
</>
    )
}