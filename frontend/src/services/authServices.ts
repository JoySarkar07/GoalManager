import { getToken } from "../auth/userAuth";


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
    const url = `http://localhost:3000/api/v1/user/login`;
    try {
        const res = await fetch(url, {
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
    const url = `http://localhost:3000/api/v1/user/signup`;
    try {
        const res = await fetch(url, {
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