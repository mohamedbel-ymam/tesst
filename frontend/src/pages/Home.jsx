import React from 'react'
import { useUserContext } from '../context/StudentContext'

export default function Home() {
  const { user } = useUserContext()

  return (
    <div>
      <p className="text-xl font-semibold">
        Welcome, {user?.firstname ? `${user.firstname} ${user.lastname}` : 'Guest'}
      </p>
      <h1 className="text-3xl">Hi Home</h1>
    </div>
  )
}
