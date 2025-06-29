import { getToken } from "../auth/userAuth";
import type { UpdateDataType } from "../components/Types";


export const getApiLink = (endpoint:string)=>{
    const debug = true;
    const version = 'v1';
    if(debug){
        return `http://localhost:3000/api/${ version }/${ endpoint }`;
    }
    return ``;
}

export const deleteGoal = async (groupId: string): Promise<any> => {
    try {
        const res = await fetch(getApiLink(`goals/${groupId}`), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${ getToken() }`
            },
        });
        const updatedGoal = await res.json();
        return updatedGoal;
    } catch (e: any) {
        return e.message;
    }
}

export const updateGoal = async (groupId: string, data:any): Promise<any> => {
    try {
        const res = await fetch(getApiLink(`goals/${ groupId }`), {
            method: 'PATCH',
            headers:{ 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${ getToken() }`
            },
            body: JSON.stringify(data)
        });
        const updatedGoal = await res.json();
        return updatedGoal;
    } catch (e: any) {
        return e.message;
    }
}


export const getGoal = async (filters:any): Promise<any> => {
    let url = getApiLink('goals');
    if (filters) {
        const queryString = new URLSearchParams(filters).toString();
        url += `?${queryString}`;
    }
    try {
        const res = await fetch(url, {
            method:'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ getToken() }`
            },
        });
        const goals = await res.json();
        return goals;
    } catch (e: any) {
        return e.message;
    }
}

export const createGoal = async ( data:any ): Promise<any> => {
    try {
        const res = await fetch(getApiLink('goals'), {
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ getToken() }`
            },
            body: JSON.stringify(data)
        });
        const goals = await res.json();
        return goals;
    } catch (e: any) {
        return e.message;
    }
}

export const getWorks = async ( gaolId:string, filters:any ): Promise<any> => {
    let url = getApiLink(`goals/${ gaolId }/work`);
    if(filters){
        const queryString = new URLSearchParams( filters ).toString();
        url += `?${queryString}`;
    }
    try {
        const res = await fetch(url,{
            method:'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ getToken() }`
            },
        });
        const goals = await res.json();
        return goals;
    } catch (e: any) {
        return e.message;
    }
}


export const createWork = async ( goalId:string, data:any ): Promise<any> => {
    try {
        const res = await fetch(getApiLink(`goals/${ goalId }/work`), {
            method:'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ getToken() }`
            },
            body: JSON.stringify( data )
        });
        const createdWork = await res.json();
        return createdWork;
    } catch (e: any) {
        return e.message;
    }
}


export const updateWork = async (groupId: string, workId:string, data:any): Promise<any> => {
    try {
        const res = await fetch(getApiLink(`goals/${ groupId }/work/${ workId }`), {
            method: 'PATCH',
            headers:{ 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${ getToken() }`
            },
            body: JSON.stringify( data )
        });
        const updatedWork = await res.json();
        return updatedWork;
    } catch (e: any) {
        return e.message;
    }
}

export const deleteWork = async (groupId: string, workId:string): Promise<any> => {
    try {
        const res = await fetch(getApiLink(`goals/${ groupId }/work/${ workId }`), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${ getToken() }`
            },
        });
        const deletedWork = await res.json();
        return deletedWork;
    } catch (e: any) {
        return e.message;
    }
}

export const updateUser = async (updatedData: UpdateDataType): Promise<any>=>{
    try {
        const res = await fetch(getApiLink('user'), {
            method: 'PATCH',
            headers:{ 
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${ getToken() }`
            },
            body: JSON.stringify( updatedData )
        });
        const updatedUser = await res.json();
        return updatedUser;
    } catch (e: any) {
        return e.message;
    }
}