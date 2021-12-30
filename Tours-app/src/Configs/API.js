import axios from 'axios';
import cookies from 'react-cookies';

export let endpoints = {
    "tour_total_all" : "/departure/",
    "tour_total_update_tag" : (tourID) => `/departure/${tourID}/update_tag/`,    
    "tour_total_add_tag" : (tourID) => `/departure/${tourID}/add_tag/`,
    "tour_total_by_id" : (tourID) => `/departure/${tourID}/`,

    "list_tour_detail" : (tourID) => `/departure/${tourID}/list_detail/`,
    "add_tour_detail" : (tourID) => `/departure/${tourID}/add_tour_detail/`,
    "tour_detail_by_id": (tourdetailId) => `/tour_detail/${tourdetailId}/`,
    "tour_detail_by_id_update_transport": (tourdetailId) => `/tour_detail/${tourdetailId}/update_transport/`,
    "tour_detail_by_id_update_departure": (tourdetailId) => `/tour_detail/${tourdetailId}/update_departure`,
    "tour_detail_by_id_updaet_destination": (tourdetailId) => `/tour_detail/${tourdetailId}/update_destination`,

    'all_cmt_tour' : '/cmt_tour/',
    'all_cmt_blog' : '/cmt_blog/',
    'get_tour_detail_get_cmt' : (tourdetailId) => `/tour_detail/${tourdetailId}/comment/`,
    "add_cmt": (tourdetailId) => `/tour_detail/${tourdetailId}/add_comment/`,

    "add_rating" : (cmtId) => `/tour_detail/${cmtId}/add_rating/`,
    "get_rating" : (cmtId) => `/tour_detail/${cmtId}/get_rating/`,

    "add_booking" : (bookingid) =>`/tour_detail/${bookingid}/add_booking/`,
    "get_booking_detail_by_user" : `/user/booking_detail/`,
    "update_booking" : (tourdetailId) =>`/tour_detail/${tourdetailId}/update_booking/`,
    
    'all_booking' : '/booking/',

    'static' : '/booking/static/',
    'static_quy' : '/booking/static_quy/',

   
    'get_user_by_id': (userID) =>`/user/${userID}/`,
    'update_info': '/user/update_info/',
    'check_exist': '/user/check_exist/',
    'forgot_password':'/user/forgot_password/',
    'uppdate_booking_user':'/user/update_booking/',
    'cancel_booking_user':'/user/cancel_booking/',

    'update_staff' : (userID) =>  `/staff/${userID}/`,
    'add_staff' : `/staff/`,


    'get_blog_by_id' : (blogID) => `/blog/${blogID}/` ,
    'get_blog_by_id_get_liked' : (blogID) => `/blog/${blogID}/get_like/` ,
    'get_blog_by_id_get_cmt' : (blogID) => `/blog/${blogID}/comment/` ,
    'get_blog_by_id_add_img_detail' : (blogID) => `/blog/${blogID}/add_img_detail/` ,
    'get_blog_by_id_update_tag' : (blogID) => `/blog/${blogID}/update_tag/` ,
    'add_like': (blogID) => `/blog/${blogID}/like/`,
    'add_cmt_blog': (blogID) => `/blog/${blogID}/add_comment/`,


    "destination_all" : '/destination/' ,

    'current_user': '/user/current_user/',
    'login': '/o/token/',
    "oauth2-info": '/oauth2-info/',
    "get_tag_blog" : "/tag_blog/",
    "get_tag_country" : "/tag_country/",
    "get_tag_tour_detail" : "/tag_tour_detail/",
    "tour_detail_all" : '/tour_detail/',
    'register': '/user/',
    'get_all_user': '/user/',
    'get_blog_all' : '/blog/' ,
    'get_transport' : '/transport/',
    'get_view' : '/view/get_view/',
    'inc_view' : '/view/inc_view/',
    'get_all_view' : '/view/',
}

export let AuthAPI = axios.create({
    baseURL: 'http://127.0.0.1:8000/',
    headers: {
        'Authorization': `Bearer ${cookies.load('access_token')}`
    }
})
export default axios.create({
    baseURL: 'http://127.0.0.1:8000/',
})