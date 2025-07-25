/**
 * External dependencies
*/
import React, { useState } from 'react'

// Props Types for inputField
type InputFieldProps = {
    setOpenInput: React.Dispatch<React.SetStateAction<boolean>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    onClick: (inputData:string)=>void;
}

const InputField: React.FC<InputFieldProps> = ({
  setOpenInput,
  setLoading,
  onClick
}) => {
  const [inputData, setInputData] = useState< string >( '' );
  const handelInput = ( e: React.ChangeEvent< HTMLInputElement > )=>{
    setInputData( e.target.value );
  }
  const submitData = ():void=>{
    setLoading(true);
    setOpenInput(( prev )=> ! prev );
    onClick( inputData );
    setLoading(false);
  }
  return (
    <div className='absolute z-10 top-7 -left-2 m-1 p-2 flex gap-1 bg-gray-500 rounded-2xl'>
      <input type="text" name="goalName" id="goalName" className='border-b-2 border-b-green-500 border-l-transparent border-r-transparent border-t-transparent focus:outline-none focus:ring-0 focus:border-b-green-500 p-2' value={inputData} onChange={ handelInput }/>
      <button className='bg-green-400 inset-shadow-sm inset-shadow-indigo-500 px-2 py-1 rounded-2xl cursor-pointer' onClick={ submitData }>add</button>
    </div>
  )
}

export default InputField