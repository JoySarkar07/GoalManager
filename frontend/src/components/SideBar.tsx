import React from 'react'
import Goal from "./Goal";
import Groups from "./Groups";
import type { sideBarGoalType } from "./Types";
import AddButtonGroups from "./AddButtonGroups";
import { useState, useEffect } from "react";
import { getGoal } from '../services/apiServices';

type SideBarProps = {
  setSelectedgoal: React.Dispatch<React.SetStateAction<sideBarGoalType | null>>;
  goalEdited: boolean;
  loggedIn : boolean;
  openSideBar: boolean;
}

type FilterType = {
  title?: string;
  isGroup?: boolean | string;
}

const SideBar:React.FC<SideBarProps> = ({
  setSelectedgoal,
  goalEdited,
  loggedIn,
  openSideBar,
}) => {
  const [goals, setGoals] = useState<sideBarGoalType[]>([]);
  const [goalChanged, setGoalChanged] = useState(false);
  const [filters, setFilters] = useState<FilterType>({});

  const fetchGoals = async (filters:any) => {
    const goalsData = await getGoal(filters);
    if(goalsData && goalsData.status==='Ok'){
      setGoals(goalsData.data);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    const { type , id, value } = e.target;
    if(type==='text'){
      setFilters(prev=>({
        ...prev,
        ['title'] : value
      }))
    }
    if(id==='goalType'){
      setFilters(prev=>({
        ...prev,
        ['isGroup'] : value==='groups'?true:(value==='single'?false:'')
      }))
    }
  }

  useEffect(() => {
    if( ! loggedIn){
      setGoals([]);
      return;
    };
    fetchGoals( filters );
  }, [goalChanged, goalEdited, filters, loggedIn])
  
  return (
    <div className={`${ openSideBar?'absolute z-10 bg-gray-700 h-[87%]':'hidden' } md:block flex-1/5 body-style p-1`}>
        <p className='text-center border-b-2 border-b-emerald-300 pb-2 mb-2'>Explorar</p>
        <div>
          <div>
            <div className='relative flex gap-2 m-1'>
              <AddButtonGroups setGoalChanged={ setGoalChanged }/>
              <div className='w-full'>
                <input type="text" name="search" id="search" value={ filters?.title || '' } onChange={ handleFilterChange } placeholder='search' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-4xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'/>
              </div>
            </div>
            <div>
              <select 
              id="goalType" 
              value={
                filters?.isGroup === true
                ? 'groups'
                : filters?.isGroup === false
                ? 'single'
                : ''
              } 
              onChange={ handleFilterChange } 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="">Choose a Filter</option>
                <option value="groups">Groups</option>
                <option value="single">Single</option>
              </select>
            </div>
          </div>
            <div className="mt-3">
              {
                goals.length>0 && goals.map((goal, ind)=>{
                  return goal.isGroup?<Groups key={ ind } setSelectedgoal={ setSelectedgoal } goalData={ goal } goals={ goal.subGoals } setGoalChanged={ setGoalChanged }/>:<Goal key={ ind } setSelectedgoal={ setSelectedgoal } goalData={ goal }/>;
                })
              }
              {
                goals.length===0 && <p className='text-center'>No Data for display</p>
              }
            </div>
        </div>
    </div>
  )
}

export default SideBar