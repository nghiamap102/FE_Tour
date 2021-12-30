import React, { useEffect, useState } from "react";
import {  Form, Nav ,Button, Image} from "react-bootstrap";
import API, { endpoints } from "../Configs/API";
import cookie from 'react-cookies'
import { useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router";
import login_form from '../image/login-img.jpg'
import img_login from '../image/Floating.svg'
import logo_2021 from '../image/happy_2021.svg'
import LoginUser from "../Action/Creator";
import { toast, ToastContainer } from "react-toastify";
import $ from 'jquery'
import {GoogleLogin,GoogleLogout} from "react-google-login";
import { refreshTokenSetup } from "./RefreshToken";




export default function Login(){

    const [username , setUsername] = useState(null);
    const [password , setPassword] = useState(null);

    const [remember,setRemember] = useState(false);
    const dispatch = useDispatch(); 
    const history = useHistory()

    const [flat , setFlat] = useState(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async ()=>{
        // let user = await API.get(endpoints['current_user'],{
        //     headers:{
        //         'Authorization': `Bearer ${cookie.load('access_token')}`
        //     }
        // })
    })

    const login = async (event) => {       
        event.preventDefault()
        try{
            let info = await API.get(endpoints['oauth2-info'])
            let res = await API.post(endpoints['login'],{
              'client_id' : info.data.client_id,
              'client_secret' : info.data.client_secret,
              'username' : username,
              'password' : password,
              'grant_type' :'password'
            })
            cookie.save('access_token', res.data.access_token)
            let user = await API.get(endpoints['current_user'],{
              headers:{
                  'Authorization': `Bearer ${cookie.load('access_token')}`
              }
            })
        
            cookie.save('user',user.data)
            dispatch(LoginUser(user.data))
            console.log(user.data)
            history.push("/")
          }catch(err){
            console.error(err)
            toast.warn('Hình Như sai pass òi', {
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
   
    window.onload = function(){
        $('.intro').hide()
        $('.footer-tour').hide()
        $('#header-top').hide()
    }
    const onSuccess = (res) =>{

        cookie.save('email',res.profileObj.email)
        cookie.save('googleId',res.profileObj.googleId)


        const login = async (abc) => {       
            let info = await API.get(endpoints['oauth2-info'])
            let res = await API.post(endpoints['login'],{
                'client_id' : info.data.client_id,
                'client_secret' : info.data.client_secret,
                'username' :  abc.profileObj.email,
                'password' : abc.profileObj.googleId,
                'grant_type' :'password'
            })
            cookie.save('access_token',res.data.access_token)

            let user = await API.get(endpoints['current_user'],{
            headers:{
                'Authorization': `Bearer ${cookie.load('access_token')}`
            }
            })
   
            cookie.save('user',user.data)
            dispatch(LoginUser(user.data))
            history.push("/")
        }
        
        let register = async()=>{
            const formdata = new FormData()
            formdata.append("first_name" , res.profileObj.name)
            formdata.append("email" , res.profileObj.email)
            formdata.append("username" , res.profileObj.email)
            formdata.append("phone" , '123456')
            formdata.append("password" , res.profileObj.googleId)
            formdata.append("staff" , '1')
            formdata.append("is_staff" , true)
            formdata.append("avatar_url" , res.profileObj.imageUrl)
            
            try{
                let res = await API.post(endpoints['register'],formdata,{
                    headers:{
                        "Content-Type" : "multipart/form-data"
                    }
                })
                let res_staff = await API.post(endpoints['add_staff'],{
                    'user' : res.data.id,
                    'activeStaff' : false
                })
                console.log(res_staff.data)
                history.push("/account_detail")
            }catch(er){
                console.error(er)
                
            }
            login(res)
        }

        let check_exist = async(a) =>{
            try{
                let res = await API.post(endpoints['check_exist'],{
                    'username' : a.profileObj.email
                })
                if (res.data.length !== 0 ){
                    setFlat(true)
                }
            }catch(er){
                console.log(er)
                register()
            }
           
        }

        check_exist(res)

        if(flat){
            login(res)
        }else{
            register()
        }

    }

    const onFailure = (res) =>{
        console.log('đăng nhập thất bại')
    }
    const onLogoutSuccess = ()=>{
        console.log('thành coong')
        cookie.remove('email')
        cookie.remove('googleId')
    }
 
    return (
        <>
<ToastContainer/>

<div className="br_login py-5">
    <div className="img-login">
        <Image src={img_login} alt=""/>
    </div>
    <div className="container py-5"> 
        <div className="login">
            <div className="img-inner">
                <img src={login_form} alt=""/>
            </div>
            <div className="overlay"></div>
            <div className="form-login">
                <h1 className="text-center">Login Here</h1>
                <div className="logo img-inner">
                    <img src={logo_2021} alt=""/>
                </div>
                <Form onSubmit = {login} className="form form_login">
                    <LoginForm id="username" label="Username" type="text" holder="Your Username"
                        field={username} change={e => setUsername(e.target.value)} />
                    <LoginForm id="password" label="Password" type="password" holder="Your Password"
                        field={password} change={e => setPassword(e.target.value)} /> 
                    <div className="remember d-flex">
                        <Form.Control type="checkbox" id="remember-box" checked={remember} onChange={(e) => setRemember(e.target.value)} /> 
                        <Form.Label for="remember-box">Remember Password</Form.Label>
                    </div>  
                    <Button className="" type="submit">Login</Button>          
                </Form>
                <div className="login_other">
                    <div className="icon_login">
                        <GoogleLogin
                        clientId="926735501662-dg63o8sqtp0ultpraica9uk1gt791o93.apps.googleusercontent.com"
                        buttonText="Sign in With Google"
                        // render={renderProps => (
                        //     <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
                        //      This is my custom Google buttons
                        //     </button>
                        //    )}
                        onSuccess={onSuccess}        
                        onFailure={onFailure}
                        cookiePolicy={'single_host_origin'}
                        style={{outline:'none',border : 'none'}}
                        isSignedIn= {true}
                        />

                    </div>
                    <div className="icon_login">
                        <GoogleLogout 
                        clientId="926735501662-dg63o8sqtp0ultpraica9uk1gt791o93.apps.googleusercontent.com"
                        buttonText="Logout  Google"
                        onLogoutSuccess={onLogoutSuccess}
                        onFailure={onFailure}
                        render={renderProps => (
                            <a type="button" onClick={renderProps.onClick}  disabled={renderProps.disabled}>
                             This is my custom Google buttons
                            </a>
                           )}
                        />
                    </div>      
                    
                    {/* <div className="icon_login">        
                        <GoogleLogin
                        clientId="926735501662-dg63o8sqtp0ultpraica9uk1gt791o93.apps.googleusercontent.com"
                        // render={renderProps =>{
                        //     <button onClick={renderProps.onClick} disabled={renderProps.disabled}>
                        //         this is my custom
                        //     </button>
                        // }}
                        buttonText="Login"
                        onSuccess={onSuccess}        
                        onFailure={onFailure}
                        cookiePolicy={'single_host_origin'}
                        // style={{marginTop : '100px'}}
                        isSignedIn= {true}
                        />
                    </div> */}
                  
                </div>
                <div className="register d-flex">
                    <p>Do you have account ?</p>
                    <Nav.Link href="/register">Register</Nav.Link>
                    <Nav.Link href="/forget-password">Forget Password</Nav.Link>

                </div>

            </div>   
        </div>
    </div>
</div>
<div className=" py-5">
   
</div>
        </>
    );
}

class LoginForm extends React.Component{
    render() {
        return (
<>
    <Form.Group className="form-group" controlId={this.props.id}>
    <Form.Label>{this.props.label}</Form.Label>
    <Form.Control type={this.props.type} value={this.props.field}
        onChange={this.props.change} placeholder={this.props.holder} />
    </Form.Group>  
</>
        );
    }
}