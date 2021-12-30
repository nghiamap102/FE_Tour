import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import'./CSS/index.css'
import'./CSS/resp.css'
import './Event/home'
import '../src/Event/bootstraps/slick/slick-theme.css'
import '../src/Event/bootstraps/slick/slick.css'
import '../src/flaticon/font/flaticon.css'
import mainReducer from './Reducers/RootReducer';
import 'react-toastify/dist/ReactToastify.css';

const store = createStore(mainReducer)


const render = () => ReactDOM.render( 
    <Provider store={store}>
        <App/>
       
    </Provider>,
    document.getElementById('root')
);
//   <DemoRedux value={store.getState()}
//         heloVi =  { ()=> store.dispatch({"type":"vi"}) } 
//         heloEn =  { ()=> store.dispatch({"type":"en"}) }  /> 
render()
store.subscribe(render)
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
