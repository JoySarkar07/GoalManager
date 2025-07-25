/**
 * External dependencies
*/
import React,{useState} from 'react'

/**
 * Internal dependencies
*/
import Goal from './Goal'
import AddButtonGroups from './AddButtonGroups';
import { deleteGoal, updateGoal } from '../services/apiServices';
import EditIcon from "../assets/edit.svg"
import DeleteIcon from "../assets/delete.svg"
import type { sideBarGoalType } from './Types';
import { showToast } from '../services/notificationServices';

// Props for Groups
type GroupsProps = {
    goals?: sideBarGoalType[];
    goalData: sideBarGoalType;
    setSelectedgoal: React.Dispatch< React.SetStateAction< sideBarGoalType | null > >;
    setGoalChanged: React.Dispatch< React.SetStateAction< boolean > >;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Groups:React.FC< GroupsProps > = ({
    goals, 
    goalData, 
    setSelectedgoal,
    setGoalChanged,
    setLoading
}) => {
    const [showgoals, setShowgoals] = useState< boolean >( false );
    const [openEdit, setOpenEdit] = useState< boolean >( false );
    const [goalInput, setGoalInput] = useState< string >( goalData?.title || "" );
    const toggolegoals = ()=>{
        setShowgoals(( prev )=> ! prev );
    }

    const openGroupEdit = async ()=>{
        setOpenEdit( prev => ! prev );
        if(openEdit && goalData.title !== goalInput){
            const updatedGoal = await updateGoal( goalData._id, { title: goalInput } );
            if( updatedGoal && updatedGoal.status==='Ok' ){
                goalData.title = goalInput;
            }
            showToast(updatedGoal.message, updatedGoal.status);
        }
    }

    const handleDeleteGoal = async ()=>{
        if(confirm("Are you sure you want to delete this? Once deleted, it can’t be recovered.")){
            const data = await deleteGoal(goalData._id);
            if(data?.status === 'Ok'){
                setGoalChanged(prev=>!prev);
            }
            showToast(data.message, data.status);
        }
    }

  return (
    <div>
        <div className='bg-green-900 p-1 m-1 rounded-xl flex justify-between'>{ openEdit ? <input type="text" name="goalTitle" id="goalTitle" className='bg-gray-800 rounded-2xl p-1' value={ goalInput } onChange={(e)=>{setGoalInput(e.target.value)}}/> : goalInput }
            <div className='flex gap-2'>
                <button className='h-5 w-5 bg-emerald-500 rounded-xl cursor-pointer drop-shadow-xl/50' title='edit' onClick={ openGroupEdit } ><img src={ EditIcon } alt="edit logo" /></button>
                <button className='h-5 w-5 bg-amber-600 rounded-xl cursor-pointer drop-shadow-xl/50' title='delete' onClick={ handleDeleteGoal } ><img src={ DeleteIcon } alt="edit logo" /></button>
                <span className='cursor-pointer' onClick={ toggolegoals }>{showgoals?'🔽':'🔼'}</span>
            </div>
        </div>
        <div className='ml-4 relative'>
            {showgoals && <AddButtonGroups setGoalChanged={ setGoalChanged } groupId={ goalData._id } setLoading={ setLoading }/>}
            {
                showgoals && goals?.map((goal, ind)=>{
                    return goal.isGroup?<Groups key={ind} setSelectedgoal={ setSelectedgoal } goalData={goal} goals={goal.subGoals} setGoalChanged={ setGoalChanged } setLoading={ setLoading }/>:<Goal key={ind} setSelectedgoal={setSelectedgoal} goalData={goal}/>;
                })
            }
        </div>
    </div>
  )
}

export default Groups