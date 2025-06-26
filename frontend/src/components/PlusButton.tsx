import React from 'react'
import Plus from "../assets/plus.svg"

type PlusButtonProps = {
    title?: string,
    onPlusClick: ()=>void
}

const PlusButton:React.FC<PlusButtonProps> = ({onPlusClick, title}) => {
    
    return (
        <>
            <button className="h-7 w-7 flex justify-center items-center px-1 bg-blue-500 rounded-xl cursor-pointer drop-shadow-xl/50" onClick={onPlusClick} title={title||"Add"}><img src={Plus} alt="plus logo" /></button>
        </>
    )
}

export default PlusButton