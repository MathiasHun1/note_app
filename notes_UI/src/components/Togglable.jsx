import { useState } from "react"
import StdButton from "./StdButton"

const Togglable = ({ buttonText, children }) => {
  const [visible, setVisible] = useState(false)

  const visibleByDef = visible ? 'hidden' : 'visible'
  const hiddenByDef = visible ? 'visible' : 'hidden'

  const toggleVisibilitiy = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <StdButton text={`${visible ? "Cancel" : buttonText}`}  onClick={toggleVisibilitiy}/>

      <div className={hiddenByDef}>
        {children}
      </div>
    </div>
  )
}

export default Togglable