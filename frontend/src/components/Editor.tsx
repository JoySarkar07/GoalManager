/**
 * External dependencies
*/
import React,{ useEffect, useState } from 'react'

/**
 * Internal dependencies
 */
import PlusButton from './PlusButton'
import type { EditorData } from './ViewPort'
import { deleteWork, updateWork } from '../services/apiServices'
import EditIcon from "../assets/edit.svg"
import DeleteIcon from "../assets/delete.svg"
import type { UpdateWorkType } from './Types'
import { showToast } from '../services/notificationServices'

// Props for Editor
type EditorProps = {
    data: EditorData;
    parentGoalId: string;
    setWorkData: React.Dispatch<React.SetStateAction<any>>
}

const Editor:React.FC<EditorProps> = ({
    data,
    parentGoalId,
    setWorkData
}) => {
    const [openDescription, setOpenDescription] = useState<boolean>(false);
    const [forEdit, setForEdit] = useState<boolean>(false);
    const [inputs, setInputs] = useState<UpdateWorkType>({
        title: "",
        description: "",
        completed: false
    })

    useEffect(() => {
        setInputs({
            title: data.title,
            description: data.description,
            completed: data.completed
        });
    }, [data])
    

    const openDescriptionTab = ():void => {
        setOpenDescription((prev) => !prev);
    }
    const openForEdit = ():void => {
        setForEdit((prev) => !prev);
        if(forEdit && isUpdate(data, inputs)){
            const {title, description} = inputs;
            handleUpdateWork({title, description});
        }
    }

    const handleUpdateWork = async (updatedData:UpdateWorkType)=>{
        const newUpdatedData = await updateWork(parentGoalId, data._id, {...updatedData});
        if(newUpdatedData && newUpdatedData?.status==='Ok'){
            setWorkData(newUpdatedData.data.works);
        }
        showToast(newUpdatedData.message, newUpdatedData.status);
    }

    const isUpdate = (previous:EditorData, newData: UpdateWorkType)=>{
        const { title, description, completed } = previous;
        return !(
            title === newData.title &&
            description === newData.description &&
            completed === newData.completed
        );
    }

    const handleDeleteWrok = async ()=>{
        if(confirm("Are you sure you want to delete this?")){
            const deletedData = await deleteWork(parentGoalId, data._id);
            if(deletedData && deletedData?.status==='Ok'){
                setWorkData(deletedData.data.works);
            }
            showToast(deletedData.message, deletedData.status);
        }
    }

    const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>):void => {
        const { name, value, type } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
        if(type==='checkbox'){
            handleUpdateWork({completed:(e.target as HTMLInputElement).checked})
        }
    }

    const getDueDate = (dueDate: string)=>{
        const dateObj = new Date(dueDate);

        // Format for Indian timezone (IST)
        const options: Intl.DateTimeFormatOptions = {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        };
        const time = dateObj.toLocaleTimeString('en-IN', options);

        // Format date parts
        const day = dateObj.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit' });
        const month = dateObj.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', month: '2-digit' });
        const year = dateObj.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric' });

        const formatted = `Date : ${day}/${month}/${year} Time : ${time}`;
        return formatted;
    }
  return (
    <>  
        <div className={`flex flex-col p-5 m-2 shadow-xl/30 rounded-xl h-[${openDescription?'80%':'20%'}] break-words`}>
            <div className='flex flex-col md:flex-row justify-between'>
                {forEdit 
                    ? <input type="text" name='title' value={inputs.title} onChange={handleInput}/>
                    :<h2 className='text-xl font-bold mb-4'>{data.title}</h2>
                }
                <div className='flex justify-start md:justify-center items-center gap-2'>
                    <span className={`${data.priority==='low'&& 'bg-green-300'} ${data.priority==='mid'&& 'bg-orange-300'} ${data.priority==='high'&& 'bg-red-500'} backdrop-blur-none px-2 rounded-2xl drop-shadow-xl/50`}>{data.priority}</span>
                    <PlusButton onPlusClick={openDescriptionTab} title={"Expand"}/>
                    <button className='h-7 w-7 bg-emerald-500 rounded-xl cursor-pointer drop-shadow-xl/50' onClick={ openForEdit } title='edit'><img src={ EditIcon } alt="edit logo" /></button>
                    <button className='h-7 w-7 bg-amber-600 rounded-xl cursor-pointer drop-shadow-xl/50' title='delete' onClick={ handleDeleteWrok }><img src={ DeleteIcon } alt="edit logo" /></button>
                    <div className="checkbox-wrapper-5">
                        <div className="check">
                            <input id={`completed-${data._id}`} type="checkbox" name='completed' checked={inputs.completed}  onChange={ handleInput }/>
                            <label htmlFor={`completed-${data._id}`}></label>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <p className='border-l-3 p-2 border-blue-500'>{ getDueDate(data.dueDate) }</p>
            </div>
            {openDescription && 
                (
                    forEdit 
                    ? <textarea className='text-lg mb-2 overflow-y-auto h-[80%]' name='description' value={inputs.description} onChange={handleInput}/>
                    : <pre className='text-lg mb-2 overflow-y-auto'>{"=>"}{data.description}</pre> 
                )
            }
        </div>
    </>
  )
}

export default Editor