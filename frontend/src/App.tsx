/**
 * External dependencies
*/
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

/**
 * Internal dependencies
 */
import SideBar from "./components/SideBar";
import ViewPort from "./components/ViewPort";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Settings from "./components/Settings";
import { userAuth, removeToken } from "./auth/userAuth";
import { showToast, subscribeUser } from "./services/notificationServices";
import userIcon from "./assets/user.svg";
import hamIcon from "./assets/hammenu.svg";
import type { sideBarGoalType } from "./components/Types";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Loading from "./components/Loading";

const App:React.FC = () => {
  const [selectedgoal, setSelectedgoal] = useState<sideBarGoalType|null>(null);
  const [goalEdited, setGoalEdited] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openPage, setOpenPage] = useState<string | null>(null);
  const [openSideBar, setOpenSideBar] = useState<boolean>(false);
  const [loggedIn, setLoggedIn] = useState<boolean>(Cookies.get('authToken')?true:false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => {
          console.log('Service worker registered:', reg);
        })
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    const currentUser = userAuth();
    setUser(currentUser);
    if(currentUser?.notificationPreferences?.push){
      console.log("Start subscribtion");
      navigator.serviceWorker.ready.then(async (registration) => {
        console.log("ready");
        const existingSub = await registration.pushManager.getSubscription();
        console.log({existingSub});
        if ( ! existingSub ) {
          const publicKey = 'BD4JUSO9O0Y6fF0OpSWTmvY5QXkhHtfChX1Qs0o7iLAjtyCu9uuEWgGcQQ2iW4rpVEq5_5IrphuNLX4Qn42yqIw';
          subscribeUser(publicKey, currentUser?.id as string);
        }
      });
    }
  }, [loggedIn, Cookies.get('authToken')])
  

  const opnePage = (pageTitle: string)=>{
    setOpenMenu(false);
    if(pageTitle==='Logout'){
      setLoading(true);
      removeToken();
      setLoggedIn(false);
      setSelectedgoal(null);
      setUser(null);
      showToast('User logged out','Ok');
      setLoading(false);
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
    <>
    {
      loading && <Loading/>
    }
    <div className="h-screen w-screen bg-gray-600 text-white">
      <div className="bg-black text-white text-center p-5 flex">
        <div className="h-8 w-8 invert cursor-pointer md:hidden" onClick={ toggleViewPort }>
          <img src={ hamIcon } alt="hamIcon" />
        </div>
        <div className="flex-5/6 flex gap-2 justify-center items-center">
          <img src="/goal.svg" alt="goalLogo" className="h-7 w-7"/>
          <h3 className="text-3xl">Goal App</h3>
        </div>
        <div>
          <img className="h-10 w-10 bg-gray-400 p-2 rounded-4xl cursor-pointer" src={userIcon} alt="userIcon" onClick={ ()=>setOpenMenu( prev=>!prev ) }/>
          {loggedIn && <p className="absolute right-17 top-7 font-bold">{ user?.name.split(" ")[0] }</p>}
        </div>
        {
          openMenu && 
          <div className="absolute right-3 top-17 w-50 bg-black rounded-xl z-50">
            {
              [loggedIn?'Logout':'Login', !loggedIn && 'Signup', loggedIn && 'Settings'].filter(Boolean).map((item, ind)=>{
                return <div key={ind} className="border border-white p-2 m-1 rounded-xl cursor-pointer hover:bg-gray-700" onClick={()=>opnePage(item as string)}>{ item }</div>;
              })
            }
          </div>
        }
      </div>
      <div className="flex h-[89%] gap-2">
        <SideBar setSelectedgoal={ setSelectedgoal } loggedIn={ loggedIn } goalEdited={ goalEdited } openSideBar={ openSideBar } setLoading={ setLoading }/>
        <ViewPort selectedgoal={ selectedgoal } setGoalEdited={ setGoalEdited } setSelectedgoal={ setSelectedgoal } setLoading={ setLoading }/>
        {
          openPage==='Signup' && render(<SignUp setOpenPage={ setOpenPage } setLoading={ setLoading }/>)
        }
        {
          openPage==='Login' && render(<Login setOpenPage={ setOpenPage } setLoggedIn={ setLoggedIn } setLoading={ setLoading }/>)
        }
        {
          openPage==='Settings' && render(<Settings setOpenPage={ setOpenPage } user={ user } setLoading={ setLoading }/>)
        }
      </div>
      <ToastContainer/>
    </div>
    </>
  )
}

export default App