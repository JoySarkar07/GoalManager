/**
 * External dependencies
*/
import React, { useState } from 'react';
import Cookies from 'js-cookie';

/**
 * Internal dependencies
*/
import InputPanel from './InputPanel'
import Button from './Button'
import { updateUser } from '../services/apiServices'
import type { UpdateDataType, User } from './Types'
import { showToast } from '../services/notificationServices';

// Props types for Settings
type SettingProps = {
    setOpenPage : React.Dispatch<React.SetStateAction<string | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    user: User,
}

const Settings: React.FC<SettingProps> = ({
    setOpenPage,
    setLoading,
    user
}) => {
    const fields = [{title:'Name', placeHolder:'Enter your name', type:'text'}, {title:'Email', placeHolder:'Enter your email', type:'email'}];
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        emailNotification: user.notificationPreferences?.email,
        webNotification: user.notificationPreferences?.push,
    })
    const onFormSubmit = async ()=>{
        if(formData.name==="" || formData.email==="" ){
            showToast("Some fields are empty", "Warning");
            return;
        }
        if( ! formData.email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)){
            showToast("Invalid Email", "Warning");
            return;
        }
        setLoading(true);
        let updatedData: UpdateDataType = {};
        if(formData.name !== user.name){
            updatedData.name = formData.name;
        }
        if(formData.email !== user.email){
            updatedData.email = formData.email;
        }
        if(formData.emailNotification !== user.notificationPreferences?.email){
            updatedData.emailNotification = formData.emailNotification;
        }
        if(formData.webNotification !== user.notificationPreferences?.push){
            updatedData.webNotification = formData.webNotification;
        }
        
        const updatedUser = await updateUser(updatedData);
        if(updatedUser && updatedUser.status==='Ok'){
            Cookies.set('authToken', updatedUser.token, { expires: 7 });
            setLoading(false);
            onCancel();
        }
        showToast(updatedUser.message, updatedUser.status);
    }

    const onCancel = ()=>{
        setOpenPage(null);
    }

    const onFormReset = ()=>{
        setFormData(
            {
                name: user.name,
                email: user.email,
                emailNotification: user.notificationPreferences?.email,
                webNotification: user.notificationPreferences?.push,
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
                [title.toLowerCase()]: value
            }));
        }
    }

  return (
    <InputPanel
        panelTitle='Settings'
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
                    <Button title='Update' onClick={ onFormSubmit } bgClasses='text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'/>
                    <Button title='Reset' onClick={ onFormReset } bgClasses='text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'/>
                </div>
            </>
        }
    />
  )
}

export default Settings