// export const reducer = (state = null, action) => {
//     if (action.type === 'login')
//         return action.payload

//     return state
//         // switch (action.type) {
//         //     case 'vi':
//         //         return 'xinchao'
//         //     case 'en':
//         //         return 'abc'
//         //     default:
//         //         return state
//         // }
// }
import cookie from "react-cookies"


const initState = {
    'user':cookie.load("user"),
}


const userReducer = (state=initState,action ) =>{
    switch(action.type){

        case "USER_LOGIN":
            return{
                ...state,
                'user' : action.payload
            }
        case "USER_LOGOUT":
            return{
                ...state,
                'user' : null
            }
        default :
            return state
    }

}
export default userReducer