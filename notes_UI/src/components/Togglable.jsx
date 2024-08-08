import { forwardRef, useImperativeHandle, useState } from "react"
import StdButton from "./StdButton"
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ buttonText, children }, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : 'block' }
  const showWhenVisible = { display: visible ? 'block' : 'none' }

  useImperativeHandle(ref, () => {
    return {toggleVisibility}
  })

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <StdButton text={buttonText}  onClick={toggleVisibility}/>
      </div>

      <div style={showWhenVisible} className="togglableContent relative">
        <div className="inline absolute right-0 -top-2">
          <StdButton text="close" onClick={toggleVisibility} className="font-bold"/>
        </div>
        {children}
      </div>
    </div>
  )
})

Togglable.propTypes = {
  buttonText: PropTypes.string.isRequired
}

export default Togglable