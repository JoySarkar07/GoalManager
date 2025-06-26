import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const decodeToken=()=>{
    const token = Cookies.get('authToken');
    if(!token) return null;
    try{
        return jwtDecode(token);
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
