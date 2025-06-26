import React, { useRef, useState } from 'react'
import PlusButton from './PlusButton'
import InputField from "./InputField";
import { createGoal } from '../services/apiServices';

type AddButtonGroupsProps = {
    setGoalChanged: React.Dispatch<React.SetStateAction<boolean>>;
    groupId?: string;
}


const AddButtonGroups: React.FC<AddButtonGroupsProps> = ({
    setGoalChanged,
    groupId
}) => {
    const [openInput, setOpenInput] = useState<boolean>(false);
    const inputTypeGroup = useRef(false);
    const parantGroupId = useRef(groupId || null);

    const toogleInputField = ():void=>{
        setOpenInput((prev)=>!prev);
    }

    const createGroup = ():void=>{
        inputTypeGroup.current = true;
        toogleInputField();
    }

    const creategoalName = ():void=>{
        inputTypeGroup.current = false;
        toogleInputField();
    }

    const inputSubmit = async (data:string)=>{
        const inputData = {
            title:data, 
            isGroup:inputTypeGroup.current, 
            ...( parantGroupId.current ? { parentGoalId: parantGroupId.current } : {}
        )};
        const goalData = await createGoal( inputData );
        if(goalData && goalData?.status==='Ok'){
            setGoalChanged(prev=>!prev);
        }
    }
  return (
    <>
        <div className="flex gap-2">
            <button className="h-7 w-7 flex justify-center items-center px-1 cursor-pointer bg-fuchsia-600 rounded-xl drop-shadow-xl/50" onClick={createGroup}>G</button>
            <PlusButton onPlusClick={creategoalName}/>
        </div>
        {openInput && <InputField setOpenInput={setOpenInput} onClick={inputSubmit}/>}
    </>
  )
}

export default AddButtonGroups