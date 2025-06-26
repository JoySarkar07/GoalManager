import React, { useEffect, useRef, useState } from 'react'
import Editor from './Editor';
import { userAuth } from '../auth/userAuth';
import PlusButton from './PlusButton';
import Button from './Button';
import EditIcon from "../assets/edit.svg"
import DeleteIcon from "../assets/delete.svg"
import { createWork, deleteGoal, getWorks, updateGoal } from "../services/apiServices";

export type EditorData = {
  // Define the structure according to what Editor expects, for example:
  title: string;
  description: string;
  completed: boolean;
  dueDate : string;
  priority : 'low' | 'mid' | 'high';
  _id : string;
};

type WorkInputKey = 'title' | 'dueDate' | 'emailTime' | 'webTime' | 'priority';

type ViewPortProps = {
  selectedgoal?: any; 
  setGoalEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

type FilterType = {
  title?: string;
  completed?: string;
  priority?: 'high' | 'mid' | 'low',
  dueDate?: string,
}

const ViewPort:React.FC<ViewPortProps> = ({
  selectedgoal,
  setGoalEdited
}) => {
  const [workData, setWorkData] = useState([]);
  const [openBox, setOpenBox] = useState<boolean>(false);
  const [goalTitleBox, setGoalTitleBox] = useState<boolean>(false);
  const user = useRef<any>(userAuth());
  const [goalInput, setGoalInput] = useState<string>(selectedgoal?.title || "");
  const [filters, setFilters] = useState<FilterType>({});
  const [workInputs, setWorkInputs] = useState<Record<WorkInputKey, string>>({
    title:"",
    dueDate:"",
    emailTime:"",
    webTime:"",
    priority:"",
  })

  const fetchWorks = async ()=>{
    const worksData = await getWorks( selectedgoal?._id, filters );
    if(worksData && worksData?.status==='Ok'){
      setWorkData(worksData.data);
    }
  }

  useEffect(() => {
    if(!selectedgoal) return;
    console.log({filters});
    setGoalInput(selectedgoal.title);
    fetchWorks();
  },[selectedgoal, filters])

  const addWork = async ()=>{
    const inputData = {...workInputs};
    const createdWork = await createWork( selectedgoal?._id, inputData );
    if(createdWork && createdWork?.status==='Ok'){
      setWorkData(createdWork.data.works);
      setWorkInputs({
        title:"",
        dueDate:"",
        emailTime:"",
        webTime:"",
        priority:"",
      });
      setOpenBox(false);
    }
  }

  const handleChange=(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> )=>{
    const { id, value, type } = e.target;
    if(type==='number' && (Number(value)<0 || Number(value)>48)){
      return;
    }
    setWorkInputs(prev=>({
      ...prev,
      [id]:value,
    }));
  }

  const openWorkInputBox = ()=>{
    if(!selectedgoal){
      console.log("First select a goal");
      return;
    }
    setOpenBox((prev=>!prev));
  }

  const goalTitleEdit = async ()=>{
    setGoalTitleBox(prev=>!prev);
    if(goalTitleBox && (goalInput !== selectedgoal.title)){
      const updatedGoal = await updateGoal(selectedgoal._id, {title: goalInput});
      if(updatedGoal && updatedGoal?.status==='Ok'){
        selectedgoal.title = goalInput;
        setGoalEdited(prev=>!prev);
      }
    }
  }

  const handleDeleteGoal = async ()=>{
    const data = await deleteGoal(selectedgoal._id);
    if(data?.status === 'Ok'){
      setGoalEdited(prev=>!prev);
      selectedgoal = null;
      setWorkData([]);
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> )=>{
    const { type, id, value } = e.target;
    if (type === 'text') {
      setFilters(prev => ({
        ...prev,
        ['title']: value
      }));
    } else if (id === 'statusInp') {
      setFilters(prev => ({
        ...prev,
        ['completed']: value
      }));
    }
    else if(id === 'priorityInp'){
      setFilters(prev => ({
        ...prev,
        ['priority']: value as FilterType["priority"]
      }));
    }
    else{
      setFilters(prev => ({
        ...prev,
        ['dueDate']: value 
      }));
    }
  }
  
  return (
    <>
      <div className='flex-4/5 body-style'>
        <p className='text-center border-b-2 border-b-emerald-300 pb-2 mb-2'>View Port</p>
        <div className='p-5 m-2 shadow-xl/30 rounded-xl font-extralight flex justify-between'>
          <div className='text-2xl '>
            <span className='border mr-1'></span>
            <span className='border mr-2'></span>
            {selectedgoal===null ? "Select a goal to edit" : ( goalTitleBox?<input type="text" name="goalTitle" id="goalTitle" className='bg-gray-800 rounded-2xl p-1' value={ goalInput } onChange={(e)=>{setGoalInput(e.target.value)}}/>:selectedgoal.title )}
          </div>
          <div className='relative text-xl flex gap-2'>
            <button className='h-7 w-7 bg-emerald-500 rounded-xl cursor-pointer drop-shadow-xl/50' title='edit' onClick={ goalTitleEdit }><img src={ EditIcon } alt="edit logo" /></button>
            <button className='h-7 w-7 bg-amber-600 rounded-xl cursor-pointer drop-shadow-xl/50' title='delete' onClick={ handleDeleteGoal } ><img src={ DeleteIcon } alt="edit logo" /></button>
            <PlusButton onPlusClick={ openWorkInputBox } title='Add Work'/>
            <div
              className={`w-[300px] z-10 max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow-sm sm:p-4 md:p-4 dark:bg-gray-800 dark:border-gray-700 shadow-xl/30 absolute top-10 right-0 transition-transform duration-300 ease-in-out
                ${openBox ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                
                {
                  [{title:"Title", type:"text", id:"title", helperText:"Reading books"}, {title:"Due Date", type:"datetime-local", id:"dueDate", helperText:"07-12-2025"}, {title:"Remainder Time for email", type:"number", id:"emailTime", helperText:"0.5 (means 30 min)"}, {title:"Remainder Time for WebNotification", type:"number", id:"webTime", helperText:"2 (means 2 hour)"}]
                  .map((inputs, ind)=>{
                    return (
                      <div className="m-2" key={ind}>
                          <label htmlFor={inputs.id} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{inputs.title}</label>
                          <input
                            type={inputs.type}
                            id={inputs.id}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder={inputs.helperText}
                            value={workInputs[inputs.id as WorkInputKey]}
                            {...(inputs.type === "number" ? { min: 0, max: 48 } : {})}
                            {...(inputs.type === "datetime-local" ? { min: new Date().toISOString().slice(0, 16) } : {})}
                            onChange={handleChange}
                            {...(
                              (inputs.id === 'emailTime' && !user?.current?.notificationPreferences?.email) ||
                              (inputs.id === 'webTime' && !user?.current?.notificationPreferences?.push)
                                ? { disabled: true }
                                : {}
                            )}
                          />
                      </div>
                    );
                  })
                }
                <div className='m-2'>
                  <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select an option</label>
                  <select id="priority" value={ workInputs.priority } onChange={ handleChange } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="" >Priority</option>
                    <option value="high">High</option>
                    <option value="mid">Mid</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              <div className='text-center'>
                <Button title='Add' onClick={addWork} bgClasses='text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 shadow-xl/30'/>
              </div>
            </div>
          </div>
        </div>
        <div className='p-5 m-2 shadow-xl/30 rounded-xl font-extralight md:flex gap-2 justify-between items-center'>
          <input type="text" id="searchwork" value={filters?.title || ''} onChange={ handleFilterChange } className="flex-1/12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="search" />
          <div className='flex-2/12'>
            <select id="statusInp" value={ filters?.completed || ''} onChange={ handleFilterChange } className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="">Choose Status</option>
              <option value="true">Completed</option>
              <option value="false">Not Completed</option>
            </select>
          </div>
          <div className='flex-2/12'>
            <select id="priorityInp" value={ filters?.priority || ''} onChange={ handleFilterChange } className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              <option value="">Choose Priority</option>
              <option value="high">High</option>
              <option value="mid">Mid</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
              </svg>
            </div>
            <input id="default-datepicker" type='datetime-local' value={ filters?.dueDate || '' } onChange={ handleFilterChange } className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date" />
          </div>
        </div>
        <div className='p-5 m-2 shadow-xl/30 rounded-xl h-[80%] overflow-y-auto'>
            {
              workData.length===0 && <p>No works to show</p>
            }
            {workData.length!==0 && workData?.map((item: EditorData, ind: number) => {
              return <Editor key={ind} data={item} parentGoalId={ selectedgoal?._id } setWorkData={ setWorkData }/>
            })}
        </div>
      </div>
    </>
  )
}

export default ViewPort