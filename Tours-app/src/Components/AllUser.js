import { createRef, useEffect, useRef, useState } from "react"
import cookie from "react-cookies"
import { useSelector } from "react-redux"
import { useHistory } from "react-router"
import API, { endpoints } from "../Configs/API"
import Modal from "react-modal";
import { Button, Form, Image } from "react-bootstrap"
import $ from 'jquery'
import { toast, ToastContainer } from "react-toastify"


export default function AllUser(){
    
    const user = useSelector(state => state.user.user)
    const [ID,setID] =useState([])

    const [listuser,setListuser] = useState([])
    const [change , setChange] = useState(1)
    const history = useHistory()
    const [modal_update, setModal_update] = useState(false);
    const [modal_add, setModal_add] = useState(false);

    const [username,setUsername] = useState(null)
    const [password,setPassword] = useState(null)
    const [confirm,setConfirm] = useState(null)
    const [email,setEmail] = useState(null)
    const [phone,setPhone] = useState(null)
    const [address,setAddress] = useState(null)
    const [first_name,setFirst_name] =useState(null)
    const [last_name,setLast_name] =useState(null)
    const [birthdate,setBirthDate] =useState(null)

    const [active_staff, setActive_staff]  = useState(true)
    const avatar = useRef()
    const [img_avatar,setImg_avatar] = useState([])
    // const [img,setImg] = useState([])


    useEffect(()=>{
        const list_user = async ()=>{
            try{
    
                let res = await API.get(endpoints['register'],{
                    headers : {
                        'Authorization' : `Bearer ${cookie.load('access_token')}`
                    }
                },[])
                
                setListuser(res.data.results)
            }catch(er){
                console.error(er)
            }
        }
       
        list_user()
    },[change])

    let openMOdal  = ()=>{
        setModal_update(true)
    }

    let closeModal  = ()=>{
        setModal_update(false)
        setFirst_name(null)            
        setLast_name(null)
        setUsername(null)
        setPassword(null)
        setAddress(null)
        setEmail(null)
        setPhone(null)
        setBirthDate(null)
        setImg_avatar(null)
    }
    let openMOdal_add  = ()=>{
        setModal_add(true)
    }

    let closeModal_add  = ()=>{
        setModal_add(false)
        setFirst_name(null)            
        setLast_name(null)
        setUsername(null)
        setPassword(null)
        setAddress(null)
        setEmail(null)
        setPhone(null)
        setBirthDate(null)
        setImg_avatar(null)
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
    const repair_user =(e)=>{
        var a = $(e.target).closest('tr').children('td').first().attr('id')
        getUser(a)
        openMOdal()
    }
    const del_user =(e)=>{
        var a = $(e.target).closest('tr').children('td').first().attr('id')
        try{
            del_action(a)
        }catch(er){
            console.err(er)
            fail_notice()
        }
    }

    const getUser = async (userID)=>{
        try{
            let res = await API.get(endpoints['get_user_by_id'](userID),{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            },[])
            setFirst_name(res.data.first_name)            
            setLast_name(res.data.last_name)
            setUsername(res.data.username)
            setPassword(res.data.password)
            setAddress(res.data.address)
            setEmail(res.data.email)
            setPhone(res.data.phone)
            setBirthDate(res.data.birthdate)
            setID(res.data.id)
            if(res.data.staff != null){
                setActive_staff(true)
            }else{
                setActive_staff(false)
            }
            if(res.data.avatar_url != null){
                setImg_avatar(res.data.avatar_url)
            }else{
                setImg_avatar(res.data.avatar)
            }
            // var filename = res.data.avatar.split('/').pop()
            // setImg(res.data.avatar.current.files)
        }
        catch(err){
            console.error(err)
            fail_notice()
        }
       
    }   

    const del_action = async (userID)=>{
        try{
            let res = await API.delete(endpoints['get_user_by_id'](userID),{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            },[])
            setListuser(listuser)
            setChange(change+1)
            success_notice()
        }catch(er){
            console.err(er)
            fail_notice()
        }
    }
   
    const update_user = async (event)=>{
        event.preventDefault()

        try{
            const formdata = new FormData()
            formdata.append("username" , username)
            formdata.append("password" , password)
            formdata.append("first_name" , first_name)
            formdata.append("last_name" , last_name)
            formdata.append("phone" , phone)
            formdata.append("email" , email)
            formdata.append("address" , address)
            formdata.append("birthdate" , birthdate)
            formdata.append("id" , ID)
            // formdata.append("avatar" , avatar.current.files[0])

            let res = await API.patch(endpoints['get_user_by_id'](ID),formdata,{
                headers : {
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            },[])
            let res_staff = await API.patch(endpoints['update_staff'](ID),{
                'activeStaff' : active_staff,
            })
            setChange(change+1)
            success_notice()
            closeModal()
        }catch(er){
            console.error(er)
           fail_notice()
        }
      

    }
   
    const add_user = async (event)=>{
        event.preventDefault()

        const formdata = new FormData()
        formdata.append("username" , username)
        formdata.append("password" , password)
        formdata.append("first_name" , first_name)
        formdata.append("last_name" , last_name)
        formdata.append("phone" , phone)
        formdata.append("email" , email)
        formdata.append("address" , address)
        formdata.append("birthdate" , birthdate)
        formdata.append("is_staff" , true)
        formdata.append("staff" , "1")
        formdata.append("avatar" , avatar.current.files[0])
        
        try{
            let res = await API.post(endpoints['register'],formdata,{
                headers:{
                    "Content-Type" : "multipart/form-data"
                }
            })
            let res_staff = await API.post(endpoints['add_staff'],{
                'activeStaff' : active_staff,
                'user' : res.data.id
            })
            console.log(res_staff.data)
            setChange(change+1)
            success_notice()
            closeModal_add()
        }catch(er){
            console.error(er)
            fail_notice()
        }
    }
  

    if(user!== null && user !== undefined){

        return(
<>
<ToastContainer />

<div className="table_user py-5">
    <div className="container py-5">
        <table className="">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Position</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {listuser.map((u,index) => 
                    <tr key={index} >
                        <td id={u.id}>{u.id}</td>
                        <td>{u.username}</td>
                        <td>{u.first_name}</td>
                        <td>{u.last_name}</td>
                        <td>{u.user_type}</td>
                        <td>
                            <div className="d-block">
                                <div className="d-block">
                                    <div id="icon_repair" className="d-inline-block p-1" onClick={repair_user}>
                                        <span class="material-icons-outlined">
                                            settings
                                        </span>
                                    </div>
                                    <div id="icon_del" className="d-inline-block p-1" onClick={del_user}>
                                        <span class="material-icons-outlined">
                                            delete_outline
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
        <button type="button" onClick={openMOdal_add}>
            Add_user
        </button>
    </div>
</div>
{/* -------------------modal_update------------------------ */}
<Modal
isOpen={modal_update}
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
<div className="modal_wrapper" style={{padding : '15px' , width : '500px'}} >
    <div className="form_wrapper">
        <h3 className="">Information's User</h3>
        <Form onSubmit={update_user} className="form_add" >
            <div className="form_group">
                <label for="username">Username</label>
                <input type="text" value={username} onChange={(event)=>setUsername(event.target.value)} />
            </div>
            <div className="form_group">
                <label for="username">Password</label>
                <input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} />
            </div>
            <div className="form_group">
                <label for="username">First Name</label>
                <input type="text" value={first_name} onChange={(event)=>setFirst_name(event.target.value)} />
            </div>
            <div className="form_group">
                <label for="username">Last Name</label>
                <input type="text" value={last_name} onChange={(event)=>setLast_name(event.target.value)} />
            </div>
            <div className="form_group">
                <label for="username">Phone</label>
                <input type="phone" value={phone} onChange={(event)=>setPhone(event.target.value)} />
            </div>
            <div className="form_group">
                <label for="username">Email</label>
                <input type="email" value={email} onChange={(event)=>setEmail(event.target.value)} />
            </div>
            <div className="form_group">
                <label for="username">Address</label>
                <input type="text" value={address} onChange={(event)=>setAddress(event.target.value)} />
            </div>
            <div className="form_group">
                <label for="birthdate">birthdate</label>
                <input type="date" id="username"  value={birthdate} min='1899-01-01' max='2021-12-30' onChange={(event)=>setBirthDate(event.target.value)}/>
            </div>
            <div className="form_group">
                <label for="birthdate">active_staff</label>
                <input type="checkbox" id="active_staff"  value={active_staff} min='1899-01-01' max='2021-12-30' onChange={(event)=>setActive_staff(event.target.value)}/>
            </div>
            {/* <div className="form_group">
                <label for="username">Img</label>
                <Form.Control type="file" ref = {img_avatar} />
            </div> */}
            <div className="form_group">
                <label for="">Avatar</label>
                <div className="ava_wrapper_cmt">
                    <Image src = {img_avatar} height={60} width={120}/>
                </div>
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
{/* -------------------modal_add------------------------ */}

<Modal
isOpen={modal_add}
onRequestClose={closeModal_add}
contentLabel="My dialog"
className="mymodal"
overlayClassName="myoverlay"
closeTimeoutMS={500}
ariaHideApp={false}>
    <Form onSubmit={add_user} className="form_add">
        <h3>Add User</h3>
        <div className="form_group">
            <label for="username">Username</label>
            <input type="text" value={username} onChange={(event)=>setUsername(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="username">Password</label>
            <input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="username">First Name</label>
            <input type="text" value={first_name} onChange={(event)=>setFirst_name(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="username">Last Name</label>
            <input type="text" value={last_name} onChange={(event)=>setLast_name(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="username">Phone</label>
            <input type="phone" value={phone} onChange={(event)=>setPhone(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="username">Email</label>
            <input type="email" value={email} onChange={(event)=>setEmail(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="username">Address</label>
            <input type="text" value={address} onChange={(event)=>setAddress(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="birthdate">birthdate</label>
            <input type="date" id="username"  value={birthdate} min='1899-01-01' max='2021-12-30' onChange={(event)=>setBirthDate(event.target.value)}/>
        </div>
        <div className="form_group">
            <label for="birthdate">active_staff</label>
            <input type="checkbox" id="active_staff"  value={active_staff} min='1899-01-01' max='2021-12-30' onChange={(event)=>setActive_staff(event.target.value)}/>
        </div>
        <div className="form_group">
            <label for="">Avatar</label>
            <div className="ava_wrapper_cmt">
                <Form.Control type="file" ref={avatar}/>
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
</Modal>

</>

        )
    } 
    else
        return(
<>
    <h1>404</h1>
</>
    )
}

