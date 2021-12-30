/* eslint-disable no-unused-vars */
import React from "react";
import { useState ,useEffect,useRef} from "react";
import {Modal,Form,Button, Container, ToastContainer} from 'react-bootstrap'
import { useHistory } from "react-router";
import { toast } from "react-toastify";
import API, {  endpoints } from '../Configs/API'
import $ from 'jquery'



export default function Register (){

    const [username,setUsername] = useState([])
    const [password,setPassword] = useState([])
    const [confirm,setConfirm] = useState([])
    const [email,setEmail] = useState([])
    const [phone,setPhone] = useState([])
    const [address,setAddress] = useState([])
    const [first_name,setFirst_name] =useState([])
    const [last_name,setLast_name] =useState([])
    const [is_staff,setIs_staff] = useState([true])

    const avatar = useRef()
    const history = useHistory()

    const register =async (event)=>{
        event.preventDefault()
        if (password===confirm && password!== null){
            const formdata = new FormData()
            formdata.append("first_name" , first_name)
            formdata.append("last_name" , last_name)
            formdata.append("username" , username)
            formdata.append("password" , password)
            formdata.append("phone" , phone)
            formdata.append("is_staff" , is_staff)
            formdata.append("staff" , "1")
            formdata.append("avatar",avatar.current.files[0])
            try{
                let res = await API.post(endpoints['register'],formdata,{
                    headers:{
                        "Content-Type" : "multipart/form-data"
                    }
                })
                console.log(res.data)
                let res_staff = await API.post(endpoints['add_staff'],{
                    'user' : res.data.id,
                    'activeStaff' : false
                })
                console.log(res_staff.data)
                history.push("/login")
            }catch(er){
                console.error(er)
                toast.warning('Có lỗi rùi!', {
                    position: "top-bottom",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }else{
            document.getElementById('')
        }
    }

    window.onload = function(){
        $('.intro').hide()
        $('.footer-tour').hide()
    }

    return(            
<>
<ToastContainer/>
<div className="section_regist py-5">
    <div className="container py-5">
        <div className="register_container">
            <div className="register_wrapper">
                <div className="register_card">
                    <h3 class="text_register">Register Form</h3>   
                    <Form onSubmit={register} className="form_register">
                        <div className="name_gr">
                            <div className="form_group first_name">
                                <div className="label_">
                                    <label>
                                        First Name
                                    </label>
                                </div>
                               
                                <div className="input_">
                                    <input type="text" value={first_name} onChange={(event)=>setFirst_name(event.target.value)} />
                                </div>
                            </div>
                            <div className="form_group last_name">
                                <div className="label_">
                                    <label>
                                        Last Name
                                    </label>
                                </div>
                                <div className="input_">
                                    <input type="text" value={last_name} onChange={(event)=>setLast_name(event.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="form_group first_name">
                            <div className="label_">
                                <label>
                                    Username
                                </label>
                            </div>
                            <div className="input_">
                                <input type="text" value={username} onChange={(event)=>setUsername(event.target.value)} />
                            </div>
                        </div>
                        <div className="gr_password">
                            <div className="form_group first_name">
                                <div className="label_">
                                    <label>
                                        Password
                                    </label>
                                </div>
                                <div className="input_">
                                    <input type="password" value={password} onChange={(event)=>setPassword(event.target.value)} />
                                </div>
                            </div>
                            <div className="form_group first_name">
                                <div className="label_">
                                    <label>
                                        Confirm Password
                                    </label>
                                </div>
                                <div className="input_">
                                    <input type="password" value={confirm} onChange={(event)=>setConfirm(event.target.value)} />
                                </div>
                                {/* <p>Confirm password incorrect</p> */}
                            </div>
                        </div>
                        
                      
                        <Form.Group className="mb-3 ava_gr" controlId='Avatar'>
                            <div className="label_">
                                <label>Avatar</label>
                            </div>
                            <div className="input_">
                                <Form.Control type="file" ref={avatar} />
                            </div>
                        </Form.Group>                        
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    </div> 
</div>


</>
    )
}

// function RegistForm (props){
//     return (
// <>
//     <Form.Group controlId={props.id} className={props.className}>
//         <div className={props.}>

//         </div>
//         <Form.Label>{props.label}</Form.Label>
//         <Form.Control type={props.type} value={props.value} onChange={props.change}/>
//     </Form.Group>  
// </>
//     );
// }


// constructor(){
//     super()

//     this.user = {
//         'first_name' :'',
//         'last_name' : '',
//         'email' : '',
//         'username' : '' , 
//         'password' : '',
//         'confirm_password' : '',
//     }

//     this.avatar = React.createRef()

//     this.state = {
//         'user' : this.user, 
//     }
// }

// change = (field, e)=>{
//     this.user[field] = e.target.value;
//     this.setState({
//         'user' :this.user 
//     });
// }

// register = (event) => {
//     event.preventDefault()

//     if(this.state.user.password === this.state.user.confirm_password){
//         const formData = new  FormData()
//         for (let i in this.state.user ){
//             if( i !== 'confirm_password'){
//                 formData.append(i,this.state.user[i]); 
//             }
//         }
//         formData.append('avatar',this.avatar.current.files[0])
        
//         API.post(endpoints['users'],formData,{
//             headers:{
//                 'Content-Type' : 'multipart/form-data'
//             }
//         }).then((res)=>{
//             console.info(res);
//         }).catch(err => {
//             console.error(err)
//         })
//     }
// }
// change={this.change.bind(this,'email')}
