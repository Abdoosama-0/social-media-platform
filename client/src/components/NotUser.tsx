import Link from 'next/link'
import React from 'react'

const NotUser = () => {
  return (
    <div>
        
        <Link href={"/login"}>login</Link>
        <Link href={"/register"}>register</Link>
    </div>
  )
}

export default NotUser