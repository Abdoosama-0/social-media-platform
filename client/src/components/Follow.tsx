import React from 'react'

const Follow = ({isFollowing}:any) => {

  return (
    <div>{isFollowing ? 'Unfollow' : 'Follow'}</div>
  )
}

export default Follow