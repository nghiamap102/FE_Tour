import {  useEffect, useState } from "react"
import { Form ,Button} from "react-bootstrap"
import cookie from "react-cookies"
import { useParams } from "react-router"
import API, { endpoints } from "../Configs/API"
import Modal from 'react-modal'
import { useHistory } from "react-router";
import '../CSS/Booking.css'
import $ from 'jquery'
import { toast, ToastContainer } from "react-toastify"



export default function Booking (){

    const [detail , setDetail] = useState([])
    const [adult ,setAdult] = useState(1)
    const [child , setChild] = useState(0)
    const [room ,setRoom] = useState(0)
    const [point ,setPoint] = useState(0)

    const [address,setAddress] = useState(null)

    const [is_open , setIs_open] = useState(false)

    const [status,setStatus] = useState("p")

    const {tourdetailId} = useParams()
    const [user,setUser]=useState([])


    const history = useHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( async()=>{
        try {
            let res =await API.get(endpoints['tour_detail_by_id'](tourdetailId))
            setDetail(res.data)
            let res_user = await API.get(endpoints['current_user'],{
                headers :{
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                } 
            })
            setUser(res_user.data)
            setAddress(res_user.data.address)

        }catch(err){
            console.error(err)
        }
    },[])

    let openMOdal = ()=>{
        setIs_open(true)
        
    }
    let closeMOdal = ()=>{
        setIs_open(false)
    }

    const add_booking = async(event) =>{
        event.preventDefault()
        try {
            let res = await API.post(endpoints['add_booking'](tourdetailId),{
                'adult' : adult,
                'children' : child,
                'room' : room,
                'pointUsed' : point, 
                'total' : detail.price_room*room+detail.price_tour*50/100*child+detail.price_tour*adult -  point *100
            },{
                headers :{
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            success_notice()
            setTimeout(() => {
                openMOdal()
            }, 1000);
        }catch(err){
            console.error(err)
           fail_notice()
        }
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
    let update_info_user = (e)=>{
        e.preventDefault()
        try{
            let update =  async (userID) =>{
                const formdata = new FormData()
                formdata.append('id', userID)
                formdata.append('address', address)
                let res = await API.patch(endpoints['get_user_by_id'](userID),formdata)
                console.log(res.data)
            }
            update(user.id)
            toast.success('success!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            $('.address_').attr('disabled','true');
            $('.btn_add').attr('disabled','true');
            $('.address_').css('border' ,'none')

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

    let update_booking =async (e)=>{
        e.preventDefault()
        try {
            let res = await API.post(endpoints['update_booking'](tourdetailId),{
                'mail_to' : user.email
            },{
                headers: {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            success_notice()
            closeMOdal()
            setTimeout(() => {
                history.push('/account_detail')
            }, 2000);
        }catch(err){
            console.error(err)
           fail_notice()
        }
    }

    const enable_input =()=>{
        $('.address_').removeAttr('disabled');
        $('.address_').css('border' ,'1px solid orange')
        $('.btn_add').removeAttr('disabled')
    }
    $('.address_').focus(function(){
        $('.address_').css('border' ,'none')
    })

    $('.address_').blur(function(){
        $('.address_').css('border' ,'1px solid orange')
    })

  
    function currencyFormat (num) {
        return  num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    }

 

    $('#switch').on('click' , function(){
        if($('#checkpoint').is(":checked") ){
            setPoint(user.point)
        }else{
            setPoint(0)
        }
    })

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
                            Tours List <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                        </li>
                        <li>
                            {detail.name}'s Booking
                        </li>
                    </ul>
                </div>
                <h1 className="h1">Tours List</h1>
            </div>
        </div>
    </div>
</div>


<Modal
isOpen={is_open}
onRequestClose={closeMOdal}
contentLabel="My dialog"
className="mymodal"
overlayClassName="myoverlay"
closeTimeoutMS={500}
ariaHideApp={false}
>
<div className="close_btn_wrapper" onClick={closeMOdal}>
    <div className="close_btn">
        <span class="material-icons-outlined">
            highlight_off
        </span>
    </div>    
</div>

<div className="modal_wrapper">
    <div className="form_wrapper">
        <h3 className="">Information's User</h3>
        <Form onSubmit={update_booking}>
            <button type="submit">
                Bạn có mún thanh toán hog
            </button>    
        </Form>
    </div>
</div>
</Modal>

<ToastContainer/>

<div className="container py-5">
    <div className="row py-5">
        <div className="col-md-6 col-sm-12">
            <form className="form_update_info" onSubmit={update_info_user}>
                <div className="header_">
                    <h3 className="header">User's Information</h3>
                </div>
                <div className="body_">
                    <div className="form-group gr_infor">
                        <span>Name:</span>
                        <input type="text" value={`${user.first_name} ${user.last_name}`} className="form-control" disabled/>
                    </div>
                    <div className="form-group gr_infor">
                        <span>Phone:</span>
                        <input type="text" value={`${user.phone}`} className="form-control" disabled/>
                    </div>
                    <div className="form-group gr_infor">
                        <span>Address:</span>
                        <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} className="form-control address_" disabled/>
                        <button type="button" className="btn_enable btn" onClick={enable_input}>
                            <span class="material-icons-outlined">
                            drive_file_rename_outline
                            </span>
                        </button>
                    </div>
                   
                </div>
                <div className="footer_">
                    <Button variant="primary" type="submit" className="btn_add" disabled>
                        <div className="save_btn d-flex">
                            <span class="material-icons-outlined">
                                save
                            </span>Save
                        </div>
                    </Button>
                </div>
            </form>
           
        </div>
        <div className="col-md-6 col-sm-12">
            <form className="form_update_info" onSubmit={add_booking}>
                <div className="header_">
                    <h3 className="header">Booking's Information</h3>
                </div>
                <div className="body_">
                    <div className="form-group gr_infor">
                        <span>Adult</span>
                        <input type="number" min="1" max="40" value={adult} onChange={(e)=>setAdult(e.target.value)} className="form-control" />
                    </div>
                    <div className="form-group gr_infor">
                        <span>Children</span>
                        <input type="number" min="0" max="40" value={child} onChange={(e)=>setChild(e.target.value)} className="form-control" />
                    </div>
                    <div className="form-group gr_infor">
                        <span>Room</span>
                        <input type="number"min="0" max="40" value={room} onChange={(e)=>setRoom(e.target.value)} className="form-control" />
                        
                    </div>
                    
                </div>
                <div className="price_section">
                    <div className="col-md-6">
                        <div className="price_">
                            <div className="form-group">
                                <span className="name_">Price Room:</span>
                                <span className="digit_">{currencyFormat(room*detail.price_room)}</span>
                            </div>
                            <div className="form-group">
                                <span className="name_">Price Children:</span>
                                <span className="digit_"> {currencyFormat(child* (detail.price_tour*50/100))}</span>
                            </div>
                            <div className="form-group">
                                <span className="name_">Price Adult:</span>
                                <span className="digit_">{currencyFormat(adult * detail.price_tour)}</span>
                            </div>
                            <div className="form-group">
                                <span className="name_">Point:<span className="digit_ pl-2" id="point">{user.point}</span></span>
                                <span>
                                    {/* <label for="checkpoint" style={{height :'36px', width :'36px' ,backgroundColor:'blue'}}>
                                        <i class="fas fa-circle " id="circle"></i>
                                    </label>
                                    <input type="checkbox" id="checkpoint"/> */}
                                    <label class="switch" id="switch" style={{marginBottom : '0px' , verticalAlign : "middle"}}>
                                        <input type="checkbox" id="checkpoint" />
                                        <span class="slider round"></span>
                                    </label>

                                </span>
                            </div>
                            <div className="form-group">
                                <span className="name_">Total:</span>
                                <span className="digit_" id="total">{currencyFormat(detail.price_room*room+detail.price_tour*50/100*child+detail.price_tour*adult - (point * 100))}</span>
                                {/* <span>VND</span> */}
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div className="footer_">
                    <Button variant="primary" type="submit" className="btn_add">
                        Booking
                    </Button>
                </div>
            </form>
           
        </div>
    </div>
</div>
</>
    )
}
