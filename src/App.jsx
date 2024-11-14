import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Tamagotchi } from './components/tamagotchi'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-gray-100 min-h-screen flex justify-center items-center'>
      <Tamagotchi />
    </div>
  )
}

export default App
