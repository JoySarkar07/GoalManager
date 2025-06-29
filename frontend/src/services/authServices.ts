import { getToken } from "../auth/userAuth";
import { getApiLink } from "./apiServices";

type LoginDataType = {
    email: string;
    password: string;
}

type SignupDataType = {
    name: string,
    email: string,
    password: string,
    emailPreference: boolean,
    pushPreference: boolean,
}

export const login = async (data:LoginDataType): Promise<any>=>{
    try {
        const res = await fetch(getApiLink('user/login'), {
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ getToken() }`
            },
            body: JSON.stringify(data)
        });
        const user = await res.json();
        return user;
    } catch (e: any) {
        return e.message;
    }
}

export const signup = async (data:SignupDataType): Promise<any>=>{
    try {
        const res = await fetch(getApiLink('user/signup'), {
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const user = await res.json();
        return user;
    } catch (e: any) {
        return e.message;
    }
}