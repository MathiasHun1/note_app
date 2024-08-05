
const Message = ({ errorMsg, successMsg }) => {

  if (errorMsg) {
    return (
      <p className="py-1 bg-red-400 text-center">{errorMsg}</p>
    )
  } else if (successMsg) {
    return (
      <p className="py-1 bg-lime-400 text-center">{successMsg}</p>
    )
  } else return null
}

export default Message