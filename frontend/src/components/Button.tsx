/**
 * External dependencies
*/
import React from 'react'

// Props types for Button
type ButtonProps = {
    title: string,
    onClick: ()=>void;
    bgClasses: string
}

const Button: React.FC<ButtonProps> = ({
    title,
    onClick,
    bgClasses
}) => {
  return (
    <button onClick={ onClick } className={ `cursor-pointer ${ bgClasses }` }>
        { title }
    </button>
  )
}

export default Button