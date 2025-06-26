import SideBar from "./components/SideBar"
import ViewPort from "./components/ViewPort"
import React, { useRef, useState } from "react"
import type { sideBarGoalType } from "./components/Types"
import userIcon from "./assets/user.svg"
import SignUp from "./components/SignUp"
import './App.css';
import Login from "./components/Login"
import { userAuth, removeToken } from "./auth/userAuth"
import hamIcon from "./assets/hammenu.svg"
import Cookies from "js-cookie"

const App:React.FC = () => {
  const [selectedgoal, setSelectedgoal] = useState<sideBarGoalType|null>(null);
  const [goalEdited, setGoalEdited] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openPage, setOpenPage] = useState<string | null>(null);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(Cookies.get('authToken')?true:false);
  const user = useRef<any>(userAuth());

  const opnePage = (pageTitle: string)=>{
    setOpenMenu(false);
    if(pageTitle==='Logout'){
      removeToken();
      setLoggedIn(false);
      user.current = null;
    }
    if(pageTitle==='Login'){
      setOpenPage('Login');
    }
    if(pageTitle==='Signup'){
      setOpenPage('Signup');
    }
    if(pageTitle==='Settings'){
      setOpenPage('Settings');
    }
  }

  const toggleViewPort = ()=>{
    setOpenSideBar(prev=>!prev);
  }

  const render = (element:React.ReactNode)=> {
    return (
      <div  className='absolute h-[89%] w-[100%] bg-white/30 backdrop-blur-none flex justify-center items-center'>
        { element }
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-600">
      <div className="bg-black text-white text-center p-5 flex">
        <div className="h-8 w-8 invert cursor-pointer md:hidden" onClick={ toggleViewPort }>
          <img src={ hamIcon } alt="hamIcon" />
        </div>
        <h3 className="flex-5/6 text-3xl">goal App</h3>
        <div>
          <img className="h-10 w-10 bg-gray-400 p-2 rounded-4xl cursor-pointer" src={userIcon} alt="userIcon" onClick={ ()=>setOpenMenu( prev=>!prev ) }/>
          {loggedIn && <p className="absolute right-17 top-7 font-bold">{user.current?.name.split(" ")[0]}</p>}
        </div>
        {
          openMenu && 
          <div className="absolute right-3 top-17 w-50 bg-black rounded-xl z-50">
            {
              [loggedIn?'Logout':'Login','Signup','Settings'].map((item, ind)=>{
                return <div key={ind} className="border border-white p-2 m-1 rounded-xl cursor-pointer hover:bg-gray-700" onClick={()=>opnePage(item)}>{ item }</div>;
              })
            }
          </div>
        }
      </div>
      <div className="flex h-[89%] gap-2">
        <SideBar setSelectedgoal={ setSelectedgoal } loggedIn={ loggedIn } goalEdited={ goalEdited } openSideBar={ openSideBar }/>
        <ViewPort selectedgoal={ selectedgoal } setGoalEdited={ setGoalEdited }/>
        {
          openPage==='Signup' && render(<SignUp setOpenPage={ setOpenPage }/>)
        }
        {
          openPage==='Login' && render(<Login setOpenPage={ setOpenPage } setLoggedIn={ setLoggedIn }/>)
        }
      </div>
    </div>
  )
}

export default App