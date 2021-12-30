import { useEffect, useRef, useState } from "react"
import { Form, Image } from "react-bootstrap"
import cookie from "react-cookies"
// import { useSelector } from "react-redux"
import API, { endpoints } from "../Configs/API"
import $ from 'jquery'
import { toast, ToastContainer } from "react-toastify"
import Modal from 'react-modal'

export default function AccountDetail(){

    const [user,setUser] = useState(null)
    const [email,setEmail] = useState([])
    const [phone,setPhone] = useState([])
    const [address,setAddress] = useState([])
    const [last_name,setLast_name] =useState([])
    const [birthdate,setBirth_date] =useState([])
    const [is_staff,setIs_staff] = useState([true])

    const [booking_list_by_user,setBooking_list_by_user] = useState(null)
    const [change ,setChange] = useState(1)
    const avatar = useRef()

    const [is_open_confirm , setIs_open_confirm] = useState(false)
    const [is_open_update , setIs_open_update] = useState(false)


    const[id , setID] = useState(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async ()=>{

        let res = await API.get(endpoints['current_user'],{
            headers : {
                'Authorization' : `Bearer ${cookie.load('access_token')}`
            }
        })
        let resbooking = await API.get(endpoints['get_booking_detail_by_user'],{
            headers : {
                'Authorization' : `Bearer ${cookie.load('access_token')}`
            }
        })
        setBooking_list_by_user(resbooking.data)
        setUser(res.data)
        setLast_name(res.data.last_name)            
        setAddress(res.data.address)
        setEmail(res.data.email)
        setPhone(res.data.phone)
        setBirth_date(res.data.birthdate)
    },[change])
    
    const change_all =()=>{
        $('.form-control').removeAttr('disabled');
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
    const update_info = async (e)=>{
        e.preventDefault()
        const formdata = new FormData()
        formdata.append("last_name" , last_name)
        formdata.append("email" , email)
        formdata.append("phone" , phone)
        formdata.append("address" , address)
        formdata.append("is_staff" , true)
        formdata.append("birthdate" , birthdate)
        formdata.append("id" , user.id)
        // formdata.append("avatar" , avatar.current.files[0])
    
        try{
            let res = await API.patch(endpoints['get_user_by_id'](user.id),formdata,{
                headers:{
                    'Authorization': `Bearer ${cookie.load('access_token')}`
                }
            })
            success_notice()
            setUser(res.data)
            setChange(10)

        }catch(er){
            console.error(er)
            fail_notice()
        }
    }

    let openModal_confirm  = (e)=>{
        setID($(e.target).closest('tr').attr('id'))
        console.log($(e.target).closest('tr').attr('id'))
        setIs_open_confirm(true)
    }
    let closeModal_confirm  = ()=>{
        setIs_open_confirm(false)
        setID(0)
    }
    let openModal_update  = (e)=>{
        setID($(e.target).closest('tr').attr('id'))
        setIs_open_update(true)
    }
   
    let closeModal_update  = ()=>{
        setIs_open_update(false)
        setID(0)
    }

   
    let cancel_booking = async(e) =>{
        e.preventDefault()
        try{
            let res = await API.post(endpoints['cancel_booking_user'],{
                'tour_detail' : id
            },{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            success_notice()
            setChange(change+1)
            closeModal_confirm()
            console.log(res.data)
        }catch(err){
            console.error(err)
            fail_notice()
        }
    }

    let update_booking =async (e)=>{
        e.preventDefault()
        try {
            let res = await API.post(endpoints['uppdate_booking_user'],{
                'tour_detail' : id,
                'mail_to' : user.email
            },{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            console.log(res.data)
            success_notice()
            closeModal_update()
            setChange(change+1)
        }catch(err){
            fail_notice()
            console.error(err)
        }
    }
    if (user!==null && user!== undefined && booking_list_by_user !== null && booking_list_by_user !== undefined 
        && booking_list_by_user!== ''){
            $('#header-top').css('background' ,'black')
            var a =  document.querySelectorAll('.table_booking tr')
            for ( let i = 1 ; i < a.length ; i ++){
                $(a[i]).mouseover(function(){
                    $(a[i]).css('border' , '1px rgb(224, 224, 224) solid')
                })
                $(a[i]).mouseleave(function(){
                    $(a[i]).css('border' , '1px solid white')
                })
            }
    return(
<>
<ToastContainer/>

<div class="profile py-5 mt-3">
    <div class="container py-5">
        <div class="row accordion " id="accordion-wrapper">
            <div class="col-md-2 px-1 option-profile">
                <div class="header-profile">
                    <div class="img-box">
                        <a href="/account_detail" className="src_profile">
                            <img src={`http://127.0.0.1:8000${user.avatar}`} alt="avatar" class="img-profile"/>
                        </a>
                    </div>
                    
                    <div class="name">
                        <div class="name-wrapper">
                            <span>{user.last_name}</span>
                        </div>
                        <div class="icon">
                            <span class="material-icons-outlined">
                                edit
                            </span> Sửa Hồ Sơ
                        </div>
                    </div>
                </div>
                <div className="point">
                    <span>{user.point}</span>
                </div>
            </div>

            <div class="col-md-10 pl-5 content-profile">
                <div class="">
                    <div class="header">
                        <h5>My Account</h5>
                        <p>Profile management information for account security</p>
                    </div>
                    <div class="form-detail-wrapper">
                        <form class="row form-detail" onSubmit={update_info}>
                            <div class="col-md-8">
                                <div class="detail">
                                <div class="form-group">
                                        <div class="form-left">
                                            <label>Username</label>
                                        </div>
                                        <div class="form-right">
                                            <p class="username">{user.username}</p>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-left">
                                            <label>Name</label>
                                        </div>
                                        <div class="form-right">
                                            <input type="text"  class="form-control"value={last_name}
                                                onChange={(event)=>setLast_name(event.target.value)} disabled/>
                                        </div>
                                       
                                    </div>
                                    <div class="form-group">
                                        <div class="form-left">
                                            <label>Email</label>
                                        </div>
                                        <div class="form-right">
                                            <input type="text" class="form-control" value={email} 
                                            onChange={(e)=>setEmail(e.target.value)}disabled/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-left">
                                            <label>Your Phone</label>
                                        </div>
                                        <div class="form-right">
                                            <input type="text" class="form-control" value={phone}
                                            onChange={(e)=>setPhone(e.target.value)} disabled/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-left">
                                            <label>Address</label>
                                        </div>
                                        <div class="form-right">
                                            <input type="text" class="form-control" value={address} 
                                            onChange={(e)=>setAddress(e.target.value)}disabled/>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="form-left">
                                            <label>BirthDate</label>
                                        </div>
                                        <div class="form-right">
                                            <input type="date" class="form-control" value={birthdate}
                                            onChange={(e)=>setBirth_date(e.target.value)} disabled/>
                                        </div>
                                    </div>
                                    <div className="">
                                        <button class="btn btn-primary btn_save">Save</button>
                                        <span class="btn btn-primary btn_change"onClick={change_all}>Change</span>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="push_img">
                                    <label for="img_ava" className="label_img">
                                        <div class="upload_img">
                                            <img src={`http://127.0.0.1:8000${user.avatar}`} id="img-avatar" alt=""></img>
                                        </div>
                                        <span className="select_img">Select Image</span> 
                                    </label>
                                    <input type="file" id="img_ava" ref={avatar} />
                                    <p>Maximum capacity</p>
                                    <p>Format: .jpg .png</p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div className="table_user py-5">
    <div className="container py-5">
        <table className="table_booking" >
            <thead>
                <tr style={{ border : '1px solid white'}}>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Tour Name</th>
                    <th>Total</th>
                    <th>Booking Date</th>
                    <th>Booking status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {booking_list_by_user.map((u,index) => <Item obj={u} key={index} 
                openModal_confirm={openModal_confirm}  openModal_update={openModal_update} />)}
                
            </tbody>
           
        </table>
                                            
    </div>
</div>

<Modal
isOpen={is_open_confirm}
onRequestClose={closeModal_confirm}
contentLabel="My dialog"
className="mymodal"
overlayClassName="myoverlay"
closeTimeoutMS={500}
ariaHideApp={false}
>
<div className="close_btn_wrapper" onClick={closeModal_confirm}>
    <div className="close_btn">
        <span class="material-icons-outlined">
            highlight_off
        </span>
    </div>    
</div>
<div className="modal_wrapper" style={{padding : '15px' , width : '500px'}} >
    <div className="form_wrapper">
        <h4 className="">Do you want remove it?</h4>
        <form onSubmit={cancel_booking}>
            <button type="submit" className="btn btn-primary">Acept</button>
        </form>
    </div>
</div>
</Modal>

<Modal
isOpen={is_open_update}
onRequestClose={closeModal_update}
contentLabel="My dialog"
className="mymodal"
overlayClassName="myoverlay"
closeTimeoutMS={500}
ariaHideApp={false}
>
<div className="close_btn_wrapper" onClick={closeModal_update}>
    <div className="close_btn">
        <span class="material-icons-outlined">
            highlight_off
        </span>
    </div>    
</div>
<div className="modal_wrapper" style={{padding : '15px' , width : '500px'}} >
    <div className="form_wrapper">
        <h5 className="">Do you want to pay it?</h5>
       <Form onSubmit={update_booking}>
            <button  className="btn btn-primary">Acept</button>
       </Form>
    </div>
</div>
</Modal>
</>
        )
    }
    else{
        return(
            <>    <h1>404</h1>
            </>
        )
    }
}

function Item (props,key){

    var a = props.obj.created_date
    var index2 =""
    a =  a.replace(/[ZT]/g,' ')
    var from_index = a.indexOf(' ')
    for(let i = from_index; i <= a.length;i++){
        
        index2 += a.charAt(i);
       
    }
    
    var r = a.replace(index2,"")

    function currencyFormat (num) {
        return  num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    }

    let cat_status = (status)=>{
        if(status === "Booking accepted"){
            return (<>
                <td className='accept_'>
                    <span>Success</span>
                </td>
            </>)
        }  
        if(status === "Booking processing"){
            return (<>
                <td className='process_'><span>Processing</span></td>
            </>)
        }  
        if(status === "Booking canceled"){
            return (<>
                <td className='cancel_'><span>Canceled</span></td>
            </>)
        }   
       
    }

return(
<tr key={key} id={props.obj.tour_detail} className="id">
    <td >{props.obj.id}</td>
    <td>{`${props.obj.customer[3]} ${props.obj.customer[4]} `}</td>
    <td>{props.obj.tour_name}</td>
    <td>{currencyFormat(props.obj.total)}</td>
    <td>{r}</td>
    {cat_status(props.obj.status2)}
    <td>
        <div className="d-block">
            <div className="d-block">
                <div id="icon_repair" className="d-inline-block p-1" style={{verticalAlign :"text-bottom"}} onClick={props.openModal_update}>
                    <span class="">
                        <i class="fas fa-money-check-alt"></i>
                    </span>
                </div>
                <div id="icon_del" className="d-inline-block p-1" onClick={props.openModal_confirm}>
                    <span class="material-icons-outlined">
                        delete_outline
                    </span>
                </div>
            </div>
        </div>
    </td>
</tr>   


    )
}
