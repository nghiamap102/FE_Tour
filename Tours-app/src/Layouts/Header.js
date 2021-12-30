import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector, useStore } from "react-redux";
import cookies from "react-cookies";
import LogoutUser from "../Action/Logout";
import { useHistory } from "react-router";
import API, { endpoints } from "../Configs/API";
import '../CSS/Header.css'
import { GoogleLogout } from "react-google-login";
import cookie from "react-cookies";
import unknow from '../image/ava_unknown.jpg'


export default function Header(){



    const dispatch = useDispatch()
    const history = useHistory()
    const [bac , setbac] = useState([])
    const [trung , settrung] = useState([])
    const [nam , setnam] = useState([])
    const [tay , settay] = useState([])

    const [blog_tag,setBlog_tag] = useState([])

    const user_selector = useSelector(state => state.user.user)
    const [user,setUser] = useState([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( async()=>{
    
        let res = await API.get(`${endpoints['tour_total_all']}?tag=north`)
        setbac(res.data.results)
        //check length giới hạn 5 des trong header

        // if(res.data.results.length >= 6){

        // }
        let res1 = await API.get(`${endpoints['tour_total_all']}?tag=mid`)
        settrung(res1.data.results)
        let res2 = await API.get(`${endpoints['tour_total_all']}?tag=south`)
        setnam(res2.data.results)
        let res3 = await API.get(`${endpoints['tour_total_all']}?tag=west`)
        settay(res3.data.results)

        let res_tag_blog = await API.get(endpoints['get_tag_blog'])
        setBlog_tag(res_tag_blog.data.results)
        if (user_selector !== undefined && user_selector !== null){
            let res_user = await API.get(endpoints['current_user'],{
                headers :{
                    'Authorization' : `Bearer ${cookie.load('access_token')}`
                }
            })
            setUser(res_user.data)
        }
        
    },[user_selector])
    
    const logout =(event)=>{
        event.preventDefault()
        cookies.remove('access_token')
        cookies.remove('user')
        dispatch(LogoutUser())
        history.push("/")
        window.location.reload()
    }
    const logout_gg =()=>{
        cookies.remove('access_token')
        cookies.remove('user')
        dispatch(LogoutUser())
        history.push("/")
        window.location.reload()
        
    }
    const onLogoutSuccess =()=>{
        console.log('thành coong')
        cookie.remove('email')
        cookie.remove('googleId')
        logout_gg()
    }

    const onFailure = ()=>{
        console.log('fail')
    }
    let name = `${user.username}`

    let logout_path = <div className="logout_path" onClick={logout}>
                        <span>Logout</span>
                        </div>

    let src_img = `${unknow}`
    let dropdown = <a href="/login" className="src_login">Login</a>


    if (user.length !==0 && user.username !== null){
        if (user.avatar !== null  ){
            src_img = `http://127.0.0.1:8000${user.avatar}`
        }else if(user.avatar_url !==null){
            src_img = `${user.avatar_url}`
        }
        else{
            src_img = `${unknow}`
        }

        if (user.is_superuser){
            dropdown = 
            <NavDropdown title={name} id="" className="">
                <div className="dropdown_wrapper">
                    <div className="">
                        <span><a href="/account_detail">Account</a></span>
                    </div>
                    <div className="">
                        <span><a href="/list_user">User manage</a></span>
                    </div>
                    <div className="">
                        <span><a href="/static">Static</a></span>
                    </div>
                    {logout_path}
                </div>
            </NavDropdown> 
          
        }else if(user.username.indexOf('@') !==-1){
            name = `${user.first_name}`
            dropdown = 
            <NavDropdown title={name} id="" className="">
                <div className="dropdown_wrapper">
                    <div className="">
                        <span><a href="/account_detail">Account</a></span>
                    </div>
                    <GoogleLogout 
                    clientId="926735501662-dg63o8sqtp0ultpraica9uk1gt791o93.apps.googleusercontent.com"
                    buttonText="Logout  Google"
                    onLogoutSuccess={onLogoutSuccess}
                    onFailure={onFailure}
                    render={renderProps => (
                    <div onClick={renderProps.onClick} className="logout_gg" disabled={renderProps.disabled}>
                        Logout
                    </div>
                    )}
                    />
                </div>
            </NavDropdown> 
        }
        else{
            dropdown = 
            <NavDropdown title={name} id="" className="">
                <div className="dropdown_wrapper">
                    <div className="">
                        <span><a href="/account_detail">Account</a></span>
                    </div>
                    {logout_path}
                </div>
            </NavDropdown> 
        }
    }   

    let path = <>
    <div className="account_path">
        <div className="path_wrapper">
            <div className="img_header">
                <a href="/login"><img src={src_img} alt="unknow" /></a>
            </div>
            <div className="name_user">
                {dropdown}
            </div>
        </div>
    </div>
    </>
    return(
<>
<Navbar expand="lg">
    <Navbar.Brand href="/">Stormy <span className="text-logo">Travel</span> </Navbar.Brand>
    <Navbar.Toggle/>
    <Navbar.Collapse>
        <Nav className="ml-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <NavDropdown title="Tour" id="tour_dropdown" className="tour_dropdown">
                <div className="row_wrapper">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="title_domain">
                                <a href="/departure/?tag=north">North Side</a>
                            </div>
                            <div className="list_wrapper">
                                <ul className="list_conscious"> 
                                    {bac.map((u,key) => getTour(u))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="title_domain">
                                <a href="/departure/?tag=mid">Mid Side</a>
                            </div>
                            <div className="list_wrapper">
                                <ul className="list_conscious"> 
                                    {trung.map((u,key) => getTour(u))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="title_domain">
                                <a href="/departure/?tag=south">South Side</a>
                            </div>
                            <div className="list_wrapper">
                                <ul className="list_conscious"> 
                                    {nam.map((u,key) => getTour(u))}
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="title_domain">
                                <a href="/departure/?tag=west">West Side</a>
                            </div>
                            <div className="list_wrapper">
                                <ul className="list_conscious"> 
                                    {tay.map((u,key) => getTour(u))}
                                </ul>
                            </div>
                        </div>  
                    </div>
                </div>
            </NavDropdown>            
            
                
            <Nav.Link href="/blog">Blog</Nav.Link>
            <Nav.Link href="/contact">Contact</Nav.Link>
            <Nav.Link href=""></Nav.Link>
            {path}
        </Nav>
    </Navbar.Collapse>
</Navbar>
</>
    )
}

function getTour(props){
    let path = ''
    path = `/departure/${props.id}/`

    return(
<>
    <li><a href={path}>{props.name}</a></li>
</>
    )
}
