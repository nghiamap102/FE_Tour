import { useEffect, useState  } from 'react';
import { Doughnut, Bar,Line } from 'react-chartjs-2';
import cookie  from 'react-cookies'
import API, { endpoints } from '../Configs/API';
import $ from 'jquery'
import '../CSS/Static.css'


export default function ChartJS (){

    const [list_booking , setList_booking] = useState([])

    const [static_day , setStatic_day] = useState([])
    const [static_month , setStatic_month] = useState([])
    const [static_year ,setStatic_year] = useState([])
    const [change,setChange] = useState(1)

    const [values1 , setValues1] = useState([])
    const [values2 , setValues2] = useState([])
    const [values3 , setValues3] = useState([])
    const [values4 , setValues4] = useState([])
    const [values5 , setValues5] = useState([])
    const [values6 , setValues6] = useState([])
    const [values7 , setValues7] = useState([])
    const [values8 , setValues8] = useState([])
    const [values9 , setValues9] = useState([])
    const [values10 , setValues10] = useState([])
    const [values11, setValues11] = useState([])
    const [values12 , setValues12] = useState([])

    const [quy1,setQuy1] = useState([])
    const [quy2,setQuy2] = useState([])
    const [quy3,setQuy3] = useState([])
    const [quy4,setQuy4] = useState([])

    const [all_view , setAll_view] = useState([])

    const [count , setCount ]  = useState(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async ()=>{
        try{
            let res_list_booking = await API.get(endpoints['all_booking'])
            setList_booking(res_list_booking.data.results)
            var date = new Date()

            const formdata = new FormData()
            formdata.append('date',`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`)
            let res  = await API.post(endpoints['static'],formdata)
            setStatic_day(res.data)
            for (let i = 1 ; i <= 12  ; i ++){
                get_static_month(date.getFullYear(),i) 
            }
            get_static_year(date.getFullYear())
            for (let i = 1 ; i <= 4  ; i ++){
                get_static_precious(date.getFullYear(),i)
            }
          
            let res_all_view = await API.get(endpoints['get_all_view'])
            setAll_view(res_all_view.data.results)

            let res_count = await API.get(endpoints['tour_detail_all'])
            setCount(res_count.data.results)

            console.log(res_count.data.results)
        }catch(err){
            console.log(err)
        }
        
    },[change])


    const get_static_year =  async (date) =>{
        let res = await API.post(endpoints['static'],{
            "date":date
        },{
            headers : {
                'Authorization' : `Bearer ${cookie.load('access_token')}`
            }
        },[])
        setStatic_year(res.data)
    }
    const get_static_month =  async (year,month) =>{
        var month_change = ''
        if (month < 10){
            month_change  = `${0}${month}`
        }else{
            month_change = month
        }
        let res = await API.post(endpoints['static'],{
            "date":`${year}-${month_change}`
        },{
            headers : {
                'Authorization' : `Bearer ${cookie.load('access_token')}`
            }
        },[])
        switch(month){
            case 1 : 
                setValues1(res.data)
                break;
            case 2 : 
                setValues2(res.data)
                break;
            case 3 : 
                setValues3(res.data)
                break;
            case 4 : 
                setValues4(res.data)
                break;
            case 5 : 
                setValues5(res.data)
                break;
            case 6 : 
                setValues6(res.data)
                break;
            case 7 : 
                setValues7(res.data)
                break;
            case 8 : 
                setValues8(res.data)
                break;
            case 9 : 
                setValues9(res.data)
                break;
            case 10 : 
                setValues10(res.data)
                break;
            case 11 : 
                setValues11(res.data)
                break;
            case 12 : 
                setValues12(res.data)
                break;
            default :
                break;
        }
    }
    
    const get_static_precious =  async (year,quy) =>{
        var date1 = 0 
        var date2 = 0 
        var date3=0
        switch(quy){
            case 1:
                date1 = `${0}${1}`
                date2 = `${0}${3}`
                date3 = 31
                break;
            case 2:
                date1 = `${0}${4}`
                date2 = `${0}${6}`
                date3 = 30
                break;
            case 3:
                date1 = `${0}${7}`
                date2 = `${0}${9}`
                date3 = 30
                break;
            case 4:
                date1 = 10
                date2 = 12
                date3 = 31
                break;
            default:
                break;
        }
        let res = await API.post(endpoints['static_quy'],{
            "date": `${year}-${date1}-1`,
            "date2": `${year}-${date2}-${date3}`
        },{
            headers : {
                'Authorization' : `Bearer ${cookie.load('access_token')}`
            }
        },[])
        switch(quy){
            case 1 : 
                setQuy1(res.data)
                break;
            case 2 : 
                setQuy2(res.data)
                break;
            case 3 : 
                setQuy3(res.data)
                break;
            case 4 : 
                setQuy4(res.data)
                break; 
            default:
                break;
        }      
    }
    let arr_map = (arr) =>{
        if (arr.length == 0 )
            return 0

        var a = 0 
        var values = arr.map((x,index) => x.total)
        for ( let  i = 0 ; i < values.length ; i ++){
            a += values[i]
        }
        return a
    }
    function currencyFormat (num) {
        return  num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    }

    let change_select_year = (event)=>{
        try {
            var value = event.target.options[event.target.selectedIndex].getAttribute("value")
            get_static_year(value)
            for (let i = 1 ; i <= 12  ; i ++){
                get_static_month(value,i) 
            }
            for (let i = 1 ; i <= 4  ; i ++){
                get_static_precious(value,i)
            }
        }catch(err){
            console.error(err)
        }
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


if (list_booking.length !== 0){
    $('#header-top').css('background' ,'black')

    var arr = []
    
    var year  = new Date().getFullYear()
    
    var income_day = 0 
    var income_year = 0 
    var count_customer_day = 0
    var count_customer_year = 0

    for ( let i = year - 9  ; i <= year ; i++ )
        arr.push(i)
    if (static_day.length !==0 ){
        for (let i = 0 ; i < static_day.length ; i++){
            income_day += static_day[i].total 
            count_customer_day += static_day[i].adult +  static_day[i].children
        }
    }
    if (static_year.length !== 0 ){
        for (let i = 0 ; i < static_year.length ; i++){
            income_year += static_year[i].total 
            count_customer_year += static_year[i].adult +  static_year[i].children
        }
    }

    let all_view_fct = (all_view)=>{
        var a = 0 
        for(let i = 0 ; i < all_view.length ; i++){
            a += all_view[i].views 
        }
        return a
    }
    
    
    return(
<>
<div className="chart_section py-5">
    <div className="container  py-5">
       
        <div className='row'>
            <div class="col-md-12 header_">
                <div class="title_">
                    <h4 class="page_title">Static Board</h4>
                </div>
                <div className='select_list'>
                    <select onChange={change_select_year} >
                        {arr.map((u,index)=>
                        <option value={u} key={index} selected>{u}</option>
                        )}
                    </select>
                </div>
            </div>
            <div className='digit_static row'>
                <div className='col-md-3'>
                    <div className='wrapper_'>
                        <div className='label_'>
                            <span>TODAY REVENUE</span>
                            <h3>{currencyFormat(income_day)} <span>VND</span></h3>
                        </div>
                        <div className='compare_'>
                            <span class="material-icons-outlined">
                            show_chart
                            </span>
                            <p>+ 10%</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='wrapper_'>
                        <div className='label_'>
                            <span>TICKET SOLD</span>
                            <h3>{static_day.length}</h3>
                        </div>
                        <div className='compare_'>
                            <span class="material-icons-outlined">
                            show_chart
                            </span>
                            <p>+ 10%</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='wrapper_'>
                        <div className='label_'>
                            <span>CUSTOMER</span>
                            <h3>{count_customer_day}</h3>
                        </div>
                        <div className='compare_'>
                            <span class="material-icons-outlined">
                            show_chart
                            </span>
                            <p>+ 10%</p>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='wrapper_'>
                        <div className='label_'>
                            <span>VISITOR</span>
                            <h3>0</h3>
                        </div>
                        <div className='compare_'>
                            <span class="material-icons-outlined">
                            show_chart
                            </span>
                            <p>+ 10%</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='section_overview py-4 row'>
                <div className='col-md-3 col-sm-6'>
                    <div className='wrapper_'>
                        <div className='heading_'>
                            <div className='heading_title'>
                                <h5>
                                    Year's overview
                                </h5>
                            </div>
                            <div className='btn_ btn_year'>
                                <span class="material-icons-outlined">
                                more_vert
                                </span>
                            </div>
                          
                        </div>
                        <div className='body_'>
                            <div className='visitor_'>
                                <div className='count_total'>
                                    <h4>{count_customer_year}</h4>
                                    <span>Total Customers</span>
                                </div>
                                <div className='icon_'>
                                    <span class="material-icons-outlined">
                                    people
                                    </span>
                                </div>
                            </div>
                            <div className='visitor_'>
                                <div className='count_total'>
                                    <h4>{currencyFormat(income_year)}</h4>
                                    <span>Total revenue</span>
                                </div>
                                <div className='icon_'>
                                    <span class="material-icons-outlined">
                                    paid
                                    </span>
                                </div>
                            </div>
                            <div className='visitor_'>
                                <div className='count_total'>
                                    <h4>{all_view_fct(all_view)}</h4>
                                    <span>Total Visitors</span>
                                </div>
                                <div className='icon_'>
                                    <span class="material-icons-outlined">
                                    paid
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>                  
                </div>
                <div className='col-md-6 col-sm-12'>
                    <div className='main_static wrapper_'>
                        <div className='heading_'>
                            <div className='heading_title'>
                                <h5>
                                    Year's Revenue
                                </h5>
                            </div>
                            <div className='btn_ btn_year'>
                                <span class="material-icons-outlined">
                                more_vert
                                </span>
                            </div>
                        </div>                 
                        <div className='body_'>
                            <Line className='chartjs p-2'
                                data={{
                                    labels: [
                                      "January","February","March","April","May","June","July","August","September",
                                      "October","November","December"
                                    ],
                                    datasets: [
                                      {
                                        label: "Income (VND)",
                                        // backgroundColor: [
                                        //   "rgb(67, 211, 158)"
                                        // ],
                                        data: [arr_map(values1),arr_map(values2),arr_map(values3),arr_map(values4),arr_map(values5)
                                                ,arr_map(values6),arr_map(values7),arr_map(values8),arr_map(values9),arr_map(values10),arr_map(values11),
                                                arr_map(values12)],
                                                
                                        fill: false,
                                        borderColor: "rgb(67, 211, 158)",
                                        cubicInterpolationMode: 'monotone',
                                        tension: 0.4
                                      }
                                    ],
                                    options: {
                                        responsive: true,
                                       
                                        interaction: {
                                        intersect: false,
                                        },
                                        scales: {
                                        x: {
                                            display: true,
                                            title: {
                                            display: true
                                            }
                                        },
                                        y: {
                                            display: true,
                                            title: {
                                            display: true,
                                            text: 'Value'
                                            },
                                            suggestedMin: -10,
                                            suggestedMax: 200
                                        }
                                        }
                                    },
                                  }}
                                  
                                />
                        </div>
                    </div>
                </div>
                                  
                <div className='col-md-3'>
                    <div className='wrapper_'>
                        <div className='heading_'>
                            <div className='heading_title'>
                                <h5>
                                    Precious's overview
                                </h5>
                            </div>
                            <div className='btn_ btn_year'>
                                <span class="material-icons-outlined">
                                more_vert
                                </span>
                            </div>
                        </div>  
                        <div className='main_chart body_'>
                            <Bar className='chartjs p-2' style={{height : '700px'}}
                            data={{
                                labels: [
                                    "1st","2nd",'3rd','4th'
                                ],
                                datasets: [
                                    {
                                    label: "Income (VND)",
                                    backgroundColor: [
                                      "rgb(67, 211, 158)"
                                    ],
                                    data: [arr_map(quy1),arr_map(quy2),arr_map(quy3),arr_map(quy4)],
                                   
                                    }
                                ],
                                
                                }}
                                
                            />
                        </div>
                    </div>
                </div>
            </div>  
            <div className='recent_ticket row'>
                <div className='col-md-12'>
                    <div className='wrapper_'>
                        <div className='heading_'>
                            <div className='heading_title'>
                                <h5>
                                    Recent Booking
                                </h5>
                            </div>
                            <div className='btn_ btn_year'>
                                <span class="material-icons-outlined">
                                more_vert
                                </span>
                            </div>
                        </div> 
                        <div className='body_'>
                            <table className="">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Tour Name</th>
                                        <th>Username</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {list_booking.map((u,index) => 
                                    <tr key={index} >
                                        <td id={u.id}>{u.id}</td>
                                        <td>{u.tour_name}</td>
                                        <td>{u.customer[1]}</td>
                                        <td>{u.customer[4]}</td>
                                        <td>{currencyFormat(u.total)} VND</td>
                                        {cat_status(u.status2)}
                                    </tr>
                                )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
             
            </div>
        </div>
     
    </div>
</div>

</>
        )
    }   
    else{
        return(
<>
<h1>Tháng này hog có doanh thu đâu mà coi</h1>
</>
        )
    }
}
function count (obj){
    var b  = 0

    return obj.total
}

// export default class Home extends React.Component {


//     constructor() {
//         super()

//         this.state = {
//             'tours': [],
//             'count': 0,
//             'user': []
//         }
//     }

//     componentDidMount() {
//         this.loadTours();
//         this.loadUser();
//     }

//     componentDidUpdate() {
//         this.loadTours(this.props.location.search)
//     }

//     loadTours = (page = "?page=1") => {
//         API.get(`${endpoints['tours']}${page}`).then(res => {
//             this.setState({
//                 'tours': res.data.results,
//                 'count': res.data.count
//             })
//         })
//     }

//     loadUser = () =>{
//         var a =  API.get(endpoints['current-user'],{
//             headers:{
//                 'Authorization': `Bearer ${cookies.load('access_token')}`
//             }
//         }).then(res=>{
//             console.log(res.data.is_superuser)
//             if(res.data.is_superuser){
//                 this.loadTours()
//             }
//         })
//     }

//     render() {

//         if (!window.location.hash) {
//             window.location = window.location + '#home';
//             window.location.reload();
//         }

       

//         return ( <>
   
//    </>
//         )
//     }
// }
