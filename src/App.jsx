import { useState } from 'react'
import './App.css'
import Converssion from './compoments/Converssion'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Converssion />
      </div>
    </>
  )
}

export default App