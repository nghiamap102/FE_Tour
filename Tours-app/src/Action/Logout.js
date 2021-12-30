

export default function LogoutUser(payload){
    return{
        "type": "USER_LOGOUT",
        "payload" : payload 
    }
}