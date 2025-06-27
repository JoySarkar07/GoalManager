import React from 'react';
import crossIcon from "../assets/cross.svg";

type Inputs = {
    title: string,
    placeHolder: string,
    type: string,
}
type InputPanelProps = {
    panelTitle: string,
    onCancel: ()=>void,
    inputFields: Inputs[],
    handleInput: (e: React.ChangeEvent<HTMLInputElement>, title?: string)=>void,
    formData: Record<string,any>,
    children?: React.ReactNode
}

const InputPanel: React.FC<InputPanelProps> = ({
    panelTitle,
    onCancel,
    inputFields,
    handleInput,
    formData,
    children
}) => {
  return (
    <div className='w-full md:w-[80%] xl:w-[50%] bg-black rounded-2xl shadow-xl/30 p-3 m-2'>
        <div className='flex'>
            <p className='flex-4/5 text-center mb-2 text-3xl'>{ panelTitle }</p>
            <button className='cursor-pointer p-1 border border-blue-600 rounded-4xl hover:bg-blue-300' onClick={ onCancel }><img src={crossIcon} alt="crossIcon" className='h-10 w-10'/></button>
        </div>
        <div className='h-0.5 bg-green-400 w-[50%] m-auto mr-50'></div>
        {
            inputFields.map((item, ind)=>{
                return (
                    <div key={ ind } className='flex m-1 p-2 justify-center items-center'>
                        <label htmlFor={ item.title.split(" ").join("").toLowerCase() } className='flex-1/4'>{ item.title }<span className='text-red-500'>*</span></label>
                        <input type={ item.type } name={ item.title.split(" ").join("").toLowerCase() } id={ item.title.split(" ").join("").toLowerCase() } placeholder={ item.placeHolder } className='flex-3/4 p-2 text-md rounded-2xl bg-gray-600' onChange={ (e)=>handleInput(e, item.title) } value={ formData[ item.title.split(" ")[0].toLowerCase() + ( item.title.split(" ")[1] || '' ) ] }/>
                    </div>
                );
            })
        }
        {
            children
        }
    </div>
  )
}

export default InputPanel