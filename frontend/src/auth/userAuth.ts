import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import type { User } from "../components/Types";


const decodeToken=()=>{
    const token = Cookies.get('authToken');
    if(!token) return null;
    try{
        return jwtDecode(token) as User;
    }
    catch(e){
        return null;
    }
}

export const removeToken = ()=>{
    const token = Cookies.get('authToken');
    if(!token) return null;
    Cookies.remove('authToken');
}

export const getToken = ()=>{
    const token = Cookies.get('authToken');
    if(!token) return null;
    return Cookies.get('authToken');
}

export const userAuth = ()=>{
    const user = decodeToken();
    return user;
}
