import InputField from "./InputField"
import StdButton from "./StdButton"

const RegisterForm = ({ handleRegister, handleUsernameChange, name, handleNameChange, username, handlePassChange, password, handleConfirmPassChange, confirmPass }) => {
  return (
    <>
      <form 
      onSubmit={handleRegister} 
      className="px-8 py-4 bg-emerald-600 w-fit flex flex-col gap-2 shadow-lg">

        <InputField type="text" text="Full Name" placeholder="Kovács Jakab" onChange={handleNameChange} value={name}/>

        <InputField type="text" text="Username" placeholder="repabela21" onChange={handleUsernameChange} value={username}/>

        <InputField type="password" text="Password" placeholder="password123" onChange={handlePassChange} value={password}/>

        <InputField type="password" text="Confirm Password" placeholder="password123" onChange={handleConfirmPassChange} value={confirmPass}/>

        <div className="flex flex-col items-center gap-2">
          <StdButton type="submit" text="Register" className="p-2 w-32"/>
        </div>
      </form>
    </>
  )
}

export default RegisterForm