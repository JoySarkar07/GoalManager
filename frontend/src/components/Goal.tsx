import React from 'react'
import type { sideBarGoalType } from './Types'
type goalProps = {
    goalData: sideBarGoalType;
    setSelectedgoal: React.Dispatch<React.SetStateAction<sideBarGoalType | null>>;
}
const Goal:React.FC<goalProps> = ({ goalData, setSelectedgoal }) => {
    const changeViewPort = ():void=>{
        setSelectedgoal( goalData );
    }
    return (
        <div className='flex justify-between items-center m-1 p-1 rounded-xl cursor-pointer bg-green-600 inset-shadow-sm inset-shadow-green-700' onClick={changeViewPort}>
            <p>{ goalData.title }</p>
        </div>
    )
}

export default Goal