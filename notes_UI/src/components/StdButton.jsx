const StdButton = ({ type='button', text, onClick, className }) => {
  return (
    <button type={type} onClick={onClick} className={`min-w-20 rounded-md bg-yellow-400 hover:bg-yellow-600 ${className}`}>
      {text}
    </button>
  )
}

export default StdButton