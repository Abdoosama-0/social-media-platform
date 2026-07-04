import React from 'react'
import Posts from './Posts'
import Search from './Search'

const Main = () => {
  return (
    <div>
      <Search/>
      <p>posts:</p>
      <Posts/>
    </div>
  )
}

export default Main