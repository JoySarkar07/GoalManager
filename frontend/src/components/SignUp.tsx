/**
 * External dependencies
*/
import React, { useState } from 'react';

/**
 * Internal dependencies
*/
import Button from './Button';
import InputPanel from './InputPanel';
import { signup } from '../services/authServices';
import { showToast } from '../services/notificationServices';

// Props types for Signup
type SignUpProps = {
    setOpenPage : React.Dispatch<React.SetStateAction<string | null>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUp: React.FC<SignUpProps> = ({
    setOpenPage,
    setLoading
}) => {
    const fields = [{title:'Name', placeHolder:'Enter your name', type:'text'}, {title:'Email', placeHolder:'Enter your email', type:'email'}, {title:'Password', placeHolder:'Enter your password', type:'password'}, {title:'Confirm Password', placeHolder:'Enter your password again', type:'password'}];
    const [formData, setFormData] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
        emailNotification: true,
        webNotification:false,
    })
    const onFormSubmit = async ()=>{
        if(formData.name==="" || formData.email==="" || formData.password==="" || formData.confirmPassword===""){
            showToast("Some fields are empty", "Warning");
            return;
        }
        if(formData.password !== formData.confirmPassword){
            showToast("Password and confirm password must be same", "Error");
            return;
        }
        if( ! formData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            showToast("Invalid Email", "Warning");
            return;
        }
        setLoading(true);
        const data = await signup({name: formData.name, email: formData.email, password: formData.password, emailPreference: formData.emailNotification, pushPreference: formData.webNotification});
        if(data && data.status==='Ok'){
            onFormReset();
            setOpenPage(null);
        }
        showToast(data.message, data.status);
        setLoading(false);
    }

    const onCancel = ()=>{
        setOpenPage(null);
    }

    const onFormReset = ()=>{
        setFormData(
            {
                name:"",
                email:"",
                password:"",
                confirmPassword:"",
                emailNotification: true,
                webNotification:false,
            }
        )
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, title?: string) => {
        const { type, value, checked, id } = e.target;
        if (type === "checkbox") {
            if (id === "emailBox") {
                setFormData(prev => ({ ...prev, emailNotification: checked }));
            } else if (id === "webNotificationBox") {
                setFormData(prev => ({ ...prev, webNotification: checked }));
            }
        } else if (title) {
            setFormData(prev => ({
                ...prev,
                [title==='Confirm Password'?'confirmPassword':title.toLowerCase()]: value
            }));
        }
    }
  return (
      <InputPanel
        panelTitle='SignUp'
        onCancel={onCancel}
        inputFields={fields}
        handleInput={handleInput}
        formData={formData}
        children={
            <>
                <div className='m-1 p-2'>Notification Preferences</div>
                <div className='h-0.5 bg-green-400 w-[50%]'></div>
                <div className='flex my-2 gap-2'>
                    <div className="checkbox-wrapper-5 flex-1/2 flex items-center gap-5">
                        <p>Email Notification</p>
                        <div className="check">
                            <input id="emailBox" type="checkbox" name='emailBox' checked={formData.emailNotification} onChange={handleInput}/>
                            <label htmlFor="emailBox"></label>
                        </div>
                    </div>
                    <div className="checkbox-wrapper-5 flex-1/2 flex items-center gap-5">
                        <p>Web Notification</p>
                        <div className="check">
                            <input id="webNotificationBox" type="checkbox" name='webNotificationBox' checked={formData.webNotification}  onChange={handleInput}/>
                            <label htmlFor="webNotificationBox"></label>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center items-center gap-5'>
                    <Button title='SignUp' onClick={ onFormSubmit } bgClasses='text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'/>
                    <Button title='Reset' onClick={ onFormReset } bgClasses='text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'/>
                </div>
            </>
        }
    />
  )
}

export default SignUp