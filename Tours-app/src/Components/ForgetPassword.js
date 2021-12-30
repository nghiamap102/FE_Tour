import React from "react";
import { useState ,useEffect,useRef} from "react";
import {Modal,Form,Button, Container} from 'react-bootstrap'
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import API, {  endpoints } from '../Configs/API'
import cookie from "react-cookies"

export default function ForgetPassword (){

    const [username,setUsername] = useState([])
    const [password,setPassword] = useState([])
    const [confirm,setConfirm] = useState([])
    const [phone,setPhone] = useState([])


    const history = useHistory()

    const forget_action =  (e)=>{
        e.preventDefault()
        let res_forget = async ()=>{
            try{
                const formdata = new FormData()
                formdata.append("username" , username)
                formdata.append("new_password" , password)
                formdata.append("confirm_password" , confirm)
                formdata.append("phone" , phone)
                let res = await API.post(endpoints['forgot_password'],formdata,{
                    headers:{
                        "Content-Type" : "multipart/form-data"
                    }
                })                
                toast.success('Change Password Success', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,})
                console.log(res.data)
            }catch(er){
                console.error(er)
                toast('Failed', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
        }
        if (password===confirm && password!== null){
            res_forget()
        }else{
            toast('Failed', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }
    return(            
<>
<ToastContainer/>
<div className="py-5">
    <div className="container py-5">
        <Form onSubmit={forget_action} className="form_register">
        <div className="form_group">
            <label for="username">Username</label>
            <input type="text" value={username} onChange={(event)=>setUsername(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="username">phone</label>
            <input type="text" value={phone} onChange={(event)=>setPhone(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="username">password</label>
            <input type="text" value={password} onChange={(event)=>setPassword(event.target.value)} />
        </div>
        <div className="form_group">
            <label for="username">confirm</label>
            <input type="text" value={confirm} onChange={(event)=>setConfirm(event.target.value)} />
        </div>
       
        <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>
    </div>
</div>



</>
    )
}



