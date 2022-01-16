import './App.css';
import {useState, useEffect} from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'antd/dist/antd.css';
import {Spin} from 'antd';

import { testToken } from './axios';

import LoginPage from './Containers/LoginPage';
import SignUpPage from './Containers/SignUpPage';
import PageNotFound from './Containers/PageNotFound';
import MainPage from './Containers/MainPage';
import AddTaskPage from './Containers/AddTaskPage';
// import UserInfo from './Containers/UserInfo';
import TaskMainPage from './Containers/TaskMainPage';

const LOCALSTORAGE_KEY = "token";
const LOCALSTORAGE_USERID = "userId";

function App() {
  const savedToken = localStorage.getItem(LOCALSTORAGE_KEY);
  const savedUser = localStorage.getItem(LOCALSTORAGE_USERID);
  
  const [isLogin, setIsLogin] = useState(false); //目的：檢測目前是否登入
  const[token, setToken] = useState(savedToken || "");  //目的：檢測當前用戶是否過期
  const[valid, setValid] = useState(false);  //
  const[userId, setUserId] = useState(savedUser || "");

  // 測試token
  useEffect( async () => {
    const response = await testToken({token: token});
    if(response === 'token success'){
      setValid(true);
      // setIsLogin(true);
      localStorage.setItem(LOCALSTORAGE_KEY, token);
      localStorage.setItem(LOCALSTORAGE_USERID, userId);
    }
  }, [token, userId]); 

  useEffect(() => {
    if(valid === false){
      setIsLogin(false);
      localStorage.removeItem(LOCALSTORAGE_KEY);
      localStorage.removeItem(LOCALSTORAGE_USERID);
    }
    else{
      setIsLogin(true);
    }
  }, [valid, isLogin])

  // const [showLoading, setShowLoading] = useState(true);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowLoading(false);
  //   }, 2000);
  // }, []);


  return (
    
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route path='/' element={isLogin ? <MainPage setToken={setToken} setValid={setValid} userId={userId} token={token}/> : <Navigate to="/login" />}></Route>
        {/* private route */}
        <Route path='/login' element={isLogin ? <Navigate to="/" /> : <LoginPage setValid={setValid} setIsLogin={setIsLogin} userId = {userId} setUserId={setUserId} setToken={setToken}/>}>
        </Route>
        <Route path='/signUp' element={isLogin ? <Navigate to="/" /> : <SignUpPage />}></Route>
        <Route path='*' element={<PageNotFound />}></Route>
        <Route path='/addTask' element={ isLogin ? <AddTaskPage token={token} userId={userId}/> : <Navigate to="/login" />}></Route>
        {/* 個人資訊頁面 */}
        {/* 統計資料頁面 */}
        <Route path='/task/:taskId' element={isLogin ? <TaskMainPage setToken={setToken} setValid={setValid} userId={userId} token={token}/> : <Navigate to="/login" />}></Route>
      </Routes>
      </BrowserRouter>
      
  );
}

export default App;
