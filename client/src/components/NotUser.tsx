import Link from 'next/link'
import React from 'react'

const NotUser = () => {
  return (
    <div>
        
        <Link href={"/login"}>login</Link>
        <Link href={"/register"}>register</Link>
         <a href="http://localhost:5000/auth/google">
        Login with Google
      </a>

    </div>
  )
}

export default NotUser