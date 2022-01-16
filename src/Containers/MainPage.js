import { Layout, Button, Avatar, Typography, Tooltip } from 'antd';
import { Link } from 'react-router-dom'
import SideBar from '../Components/SideBar';
import PersonalTasks from './PersonalTasks';
import PersonalStats from './PersonalStats';
import { getUserInfo, getTodayOngoing, getTodayFinish, getgetTodayDayoff,getTaskDetail } from '../axios';

import { useState, useEffect } from 'react';

import {
    FileAddOutlined
  } from '@ant-design/icons';

import styled from 'styled-components'
import UserInfo from './UserInfo';







const MainPage = ({setToken, setValid, userId, token}) => {

    var name, avatar, email;
    const [userAvatar, setUserAvatar] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setEmail] = useState("");

    const { Content } = Layout;
    // 資料串接所需資訊
    // FE: 記得設定任務名稱字數上限
    const [ongoingTaskInfo, setOngoingTaskInfo] = useState([]);
    const [doneTaskInfo, setDoneTaskInfo] = useState([]);
    const [relaxTaskInfo, setRelaxTaskInfo] = useState([]);

    // set current page
    const [page, setPage] = useState(1);
    // 1: PersonalTasks, 2: PersonalStats

    useEffect( async () => {
        const response = await getUserInfo({user_id: userId});
        setUserAvatar(response.Avatar);
        setUserName(response.Name);
        setEmail(response.Email);

        const response_1 = await getTodayOngoing({user_id: userId, token: token});
        const response_2 = await getTodayFinish({user_id: userId, token: token});
        const response_3 = await getgetTodayDayoff({user_id: userId, token: token});

        var str = [];
        var str_2 = [];
        var str_3 = [];
        for(var i = 0; i < response_1.length; i++){
            const res = await getTaskDetail({task_id: response_1[i], token: token});
            var temp = new Object();
            temp.uid = response_1[i];
            temp.icon = res.Icon;
            temp.name = res.Title;
            // setOngoingTaskInfo([...ongoingTaskInfo, temp]);
            str[i] = temp;
        }
        for(var i = 0; i < response_2.length; i++){
            const res = await getTaskDetail({task_id: response_2[i], token: token});
            var temp = new Object();
            temp.uid = response_2[i];
            temp.icon = res.Icon;
            temp.name = res.Title;
            // setDoneTaskInfo([...doneTaskInfo, temp]);
            str_2[i] = temp;
        }
        for(var i = 0; i < response_3.length; i++){
            const res = await getTaskDetail({task_id: response_3[i], token: token});
            var temp = new Object();
            temp.uid = response_3[i];
            temp.icon = res.Icon;
            temp.name = res.Title;
            // setRelaxTaskInfo([...relaxTaskInfo, temp]);
            str_3[i] = temp;
        }

        setOngoingTaskInfo(str);
        setDoneTaskInfo(str_2);
        setRelaxTaskInfo(str_3);
      }, []);

      console.log(ongoingTaskInfo);

    const AddTask = styled.div`
        position: fixed;
        margin-left: 93vw;
        margin-top: 90vh;

        width: 50px;
        height: 50px;

        background: #FFFFFF;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 1000px;

        text-align: center;
        line-height: 50px; 
    `
    const [collapsed, setCollapsed] = useState(false);
    const [contentWidth, setContentWidth] = useState("20vw");


    return(
    <Layout style={{ minHeight: '100vh' }}>
        <SideBar setContentWidth={setContentWidth} collapsed={collapsed} setCollapsed={setCollapsed} place = "mainPage" userId = {userId} userName={userName} userAvatar={userAvatar} setValid={setValid}  setPage={setPage} setToken={setToken}/>
        <Layout className="site-layout" style={{ marginLeft: contentWidth, marginTop: "2vh" }}>
            {/* 以下麵包屑 FE待修正 */}
          <Content >
            {/* 以下是主要文件 */}
            {
                page === 1
                ? <PersonalTasks ongoingTaskInfo={ongoingTaskInfo} doneTaskInfo={doneTaskInfo} relaxTaskInfo={relaxTaskInfo} />
                :
                page === 2
                ?  <PersonalStats userId={userId}  token={token}/>
                : <UserInfo userId={userId} name={userName} email={userEmail} token={token}/>
            }
          </Content> 
        </Layout >
        {/* 加一個可以新增任務的固定按鈕，hover可以看到詳細資訊 */}
        
            <Tooltip title="新增任務">
                <AddTask>
                {/* <Button type="text">Text Button</Button> */}
                <Link to="/addTask">
                     <Button type="text" shape="circle" icon={<FileAddOutlined />} size="large" />
                </Link>
                </AddTask>
            </Tooltip>
        

    </Layout>
    )
}

export default MainPage;