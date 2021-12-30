import './App.css';
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import { Container } from 'react-bootstrap';
import Header from './Layouts/Header';
import Login from './Components/Login';
import Departure from './Components/Departure';

import Home from './Layouts/Home';
import Footer from './Layouts/Footer';
import TourDetail from './Components/TourDetail';
import sun from '../src/image/sun.svg'
import moon from '../src/image/night-mode.svg'
import Booking from './Components/Booking';
import AccountDetail from './Components/AccountDetail';
import Contact from './Components/Contact';
import Register from './Components/RegisterUser';
import AllUser from './Components/AllUser';
import { useDispatch, useSelector, useStore } from "react-redux";
import Page404 from './Layouts/404page';
import Blog from './Components/Blog';
import ForgetPassword from './Components/ForgetPassword';
import BlogDetail from './Components/BlogDetail';
import ListTour from './Components/ListTourByID';
import ChartJS from './Components/Static';
import Search from './Components/Search';
import Destination from './Components/Destination';

export default function App(){

    const user = useSelector(state => state.user.user)
    
    let adminPath =  <>
    </>
    let path = ''
  
  if (user !== null && user !== undefined){
    if(user.is_superuser){
      adminPath = <>
        <Route exact path = "/list_user"component = { AllUser }/> 
        <Route exact path = "/static" component= {ChartJS} />
      </>
    }
     
    path =  <Route exact path = "/account_detail"component = { AccountDetail }/> 
  }else{
    adminPath = <>
      <Route exact path = "/list_user"component = { Page404 }/> 
      <Route exact path = "/static"component = { Page404 }/> 
    </>
    path =  <Route exact path = "/account_detail"component = { Page404 }/> 
  }

    return(
      <>
  <BrowserRouter>
    <div id="header-top" class="heading-top">
      <Container>
          <Header/>
      </Container>
      <input type="checkbox" id="theme" className="theme"/>
      <label for="theme" className="theme-wrapper">
          <img class="sun" id="sun" src={sun} alt=""/>
          <img class="moon" id="moon" src={moon} alt=""/>
      </label>
    </div>
  
    <Switch>            
      <Route exact path = "/"component = { Home }/>           
      <Route exact path = "/departure"component = { Departure }/> 
      <Route exact path = "/destination" component = { Destination }/>  
      <Route exact path="/departure/:tourID/" component = {ListTour}/>
      <Route exact path="/listour/" component = {ListTour}/>
      <Route exact path="/tour_detail/:tourdetailId/" component = {TourDetail}/>
      <Route exact path="/tour_detail/:tourdetailId/booking/"  component= {Booking}/>
      <Route exact path = "/contact"component = { Contact }/> 
      <Route exact path = "/blog"component = { Blog }/> 
      <Route exact path = "/blog/:blogID/"component = { BlogDetail }/> 
      <Route exact path = "/register"component = { Register }/> 
      <Route exact path = "/login" component= {Login} />
      <Route exact path = "/forget-password" component= {ForgetPassword} />
      <Route exact path = "/search" component= {Search} />
      {path}
      {/* <Route  path = "*" component= {Page404} /> */}
      {adminPath}

    </Switch>
    <Footer/>
  </BrowserRouter>
      </>
    )
}

// const store = useStore()
    // const auth = store.getState()

    // let user = auth
    // if(cookies.load('user')!= null)
    //   user = cookies.load('user')
    //   console.log(user.data)