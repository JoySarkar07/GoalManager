import React, { useState } from 'react'
import InputPanel from './InputPanel';
import Button from './Button';
import Cookies from 'js-cookie';

type LoginProps = {
    setOpenPage : React.Dispatch<React.SetStateAction<string | null>>,
    setLoggedIn : React.Dispatch<React.SetStateAction<boolean>>,
}

const Login: React.FC<LoginProps> = ({
    setOpenPage,
    setLoggedIn
}) => {
    const fields = [{title:'Email', placeHolder:'Enter your email', type:'email'}, {title:'Password', placeHolder:'Enter your password', type:'password'}];
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    })
    const onFormSubmit = ()=>{
        if(formData.email==="" || formData.password===""){
            console.log("Email or password is empty");
            return;
        }
        if(!formData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            console.log("Invalid Email");
            return;
        }
        const url = 'http://localhost:3000/api/v1/user/login'
        fetch(url,{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email:formData.email, password:formData.password})
        })
        .then(res=>{
            return res.json();
        })
        .then(loginData=>{
            if(loginData && loginData.status==='Ok'){
                Cookies.set('authToken',loginData.data.token,{ expires: 7 });
                setLoggedIn(true);
                onCancel();
            }
            else{
                console.log(loginData.message);
            }
        })
    }

    const onCancel = ()=>{
        setOpenPage(null);
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, title?: string) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            [(title as string).toLowerCase()]: value
        }));
    }
  return (
    <InputPanel
        panelTitle='Login'
        inputFields={fields}
        onCancel={onCancel}
        handleInput={handleInput}
        formData={formData}
        children={
            <>
                <div className='text-center'>
                    <Button title='Login' onClick={onFormSubmit} bgClasses='text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'/>
                </div>
            </>
        }
    />
  )
}

export default Login