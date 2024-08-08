const InputField = ({ placeholder, text, type, onChange, value, id='' }) => {
  return (
    <div>
      <p>{text}</p>
      <input type={type} placeholder={placeholder} onChange={(e) => onChange(e)} className="p-1" value={value} />
    </div>
  )
}

export default InputField