import InputField from "./InputField"
import StdButton from "./StdButton"

const LoginForm = ({ handleLogin, handleUsernameChange, username, handlePassChange, password }) => {
  return (
    <>
      <form 
      onSubmit={handleLogin} 
      className="px-8 py-4 bg-emerald-600 w-fit flex flex-col gap-2 shadow-lg">

        <InputField type="text" text="User" placeholder="repabela21" onChange={handleUsernameChange} value={username}/>

        <InputField type="password" text="Password" placeholder="password123" onChange={handlePassChange} value={password}/>

        <div className="flex flex-col items-center gap-2">
          <StdButton type="submit" text="Login" className="p-2 w-32"/>
          <StdButton type="button" text="Register" className="p-2 w-32"/>
        </div>
      </form>
    </>

  )
}

export default LoginForm