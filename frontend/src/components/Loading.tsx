import React from 'react'

const Loading: React.FC = () => {
  return (
    <div className='absolute top-0 left-0 h-full w-full flex justify-center items-center bg-white/30 backdrop-blur-md z-20'>
        <div className="size-10 animate-bounce bg-black rounded-4xl p-2">
            <svg className='invert' width="24" height="24" xmlns="http://www.w3.org/2000/svg" >
                <path d="M11 21.883l-6.235-7.527-.765.644 7.521 9 7.479-9-.764-.645-6.236 7.529v-21.884h-1v21.883z"/>
            </svg>
        </div>
    </div>
  )
}

export default Loading