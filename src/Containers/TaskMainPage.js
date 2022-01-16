/*

選項：
1: 我要成為日文王：taskInfo
2: 任務簡述：taskDescription
3: 成員清單：taskMember
4: 任務統計：taskStats
 */
import styled from 'styled-components'
import SideBar from '../Components/SideBar';
import { Tag, Layout, Modal, Button, Avatar, Typography, Tooltip, Input, message, Divider } from 'antd';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
    CheckSquareOutlined
  } from '@ant-design/icons';

import TaskView from './TaskView';
import TaskInfo from './TaskInfo';
import TaskMenber from './TaskMember';
import TaskStats from './TaskStats';
import UserInfo from './UserInfo';
import { getUserInfo, addRecord, getTaskDetail, getTask, getParticipationDetail } from '../axios';
import { Icon } from '@iconify/react';


const TaskMainPage = ({setToken, setValid, userId, token}) => {

    // default settings
    const { TextArea } = Input;
    const {Title, Text} = Typography;
    const { Content } = Layout;
    let {taskId} = useParams();
    // console.log(taskID);
    const [page, setPage] = useState(1);
    const currentHour = moment();
    // moment(currentTime).isAfter(moment.utc().hour(0).minute(0))

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
    

    //打卡顯示controller
    const [isModalVisible, setIsModalVisible] = useState(false);

    
    
    // 資料串接 @陳沛妤
    const [userName,setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [closed, setClosed] = useState(false); //透過這個判斷要不要顯示打卡按鈕
    const [typedDesc, setTypedDesc] = useState('');
    const [startHour, setStartHour] = useState(moment("00:00", 'hh:mm')); //陳沛妤: 接的時候記得換成moment格式QQ
    const [endHour, setEndHour] = useState(moment("23:59", 'hh:mm'));
    const [manager, setManager] = useState('');
    const [isQuit, setIsQuit] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskAvatar, setTaskAvatar] = useState('');
    
    // console.log("startHour = ", startHour)
    // console.log("endHour = ", endHour)
    // console.log("currentHour = ", currentHour);

    const textOnChange = e => {
      setTypedDesc(e.target.value);
    };

    const showModal = () => {
      setIsModalVisible(true);
    };

  // 陳沛妤：這邊要送出打卡資料　｜　巫芊瑩：成功的話要有msg, 等接好後記得加
    const handleOk = async () => {
        setIsModalVisible(false);
        const res = await addRecord({user_id: userId, task_id: taskId, daily_desc: typedDesc, token: token});
        console.log(res);
        message.success('成功打卡！');
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // const [timeIsValid, setTimeIsValid] = useState(moment(currentHour).isAfter(startHour) && moment(currentHour).isBefore(endHour) ? false : true);

    useEffect( async () => {
      const response = await getUserInfo({user_id: userId});
      setUserAvatar(response.Avatar);
      setUserName(response.Name);
      setUserEmail(response.Email)

      const res = await getTaskDetail({task_id: taskId, token: token});
      setStartHour(moment(res.Start_Hour,"hh:mm"));
      setEndHour(moment(res.End_Hour,"hh:mm")); //巫：沒有擋成功
      setTaskName(res.Title);
      setTaskAvatar(res.Icon);

      const res_2 = await getTask({task_id: taskId, token: token});
      setClosed(res_2.Is_Closed);

      const res_3 = await getParticipationDetail({user_id: userId, task_id: taskId});
      setManager(res_3.Is_Admin);
      setIsQuit(res_3.Is_Quit);
    }, []);
    

    const [collapsed, setCollapsed] = useState(false);
    const [contentWidth, setContentWidth] = useState("20vw");

    return(
        <Layout style={{ minHeight: '100vh' }}>
        <SideBar place = "taskMainPage" setContentWidth={setContentWidth} collapsed={collapsed} setCollapsed={setCollapsed} userId = {userId} userName={userName} userAvatar={userAvatar} setValid={setValid}  setPage={setPage} setToken={setToken}/>
        <Layout className="site-layout" style={{ marginLeft: contentWidth, marginTop: "2vh", transition: 'marginLeft 1s ease-in' }}>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{position: "fixed", display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
              <Avatar shape="square" size={120} src={taskAvatar}  />
              {
                manager
                ?
                <Tag color="#ffa940" icon={<Icon icon="icon-park-outline:crown-three" color="#fff7e6" height="10" />}> 管理者</Tag>
                :
                <br/>
              }
              <Title level={2}>{taskName}</Title>
              <Divider></Divider>
            </div>
            <div style={{marginTop: "33vh"}}>
            {
                  page === 1
                  ?
                    <TaskView taskId={taskId} token={token} userId={userId}/>
                  :
                  page === 2
                  ?
                    <TaskInfo taskId={taskId} token={token} userId={userId}/>
                  :
                  page === 3
                  ?
                  <TaskMenber taskId={taskId} userId={userId} token={token} userName={userName}/>
                  :
                  page === 4
                  ?
                  <TaskStats taskId={taskId} token={token} userId={userId}/>
                  :
                  <UserInfo userId={userId} name={userName} email={userEmail} token={token}/>
              }
            </div>
              {/* <p>This is task main page!</p> */}
          </Content>
        </Layout>
        {closed
        ?<></>
        :
        <Tooltip title={moment(currentHour).isAfter(startHour) && moment(currentHour).isBefore(endHour) ?   isQuit || closed ? "不可打卡" : "我要打卡" : "已超過可打卡時段QQ"}>
            <AddTask>
                <Button type="text" shape="circle" icon={<CheckSquareOutlined />} size="large" onClick={showModal} disabled={moment(currentHour).isAfter(startHour) && moment(currentHour).isBefore(endHour) ? false : isQuit || closed ? false : true}/>
            </AddTask>
        </Tooltip>
        }   
        <Modal title="我要打卡" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Text >寫下任何的想法都可以喔！</Text>
            <TextArea showCount maxLength={100} onChange={textOnChange} />
        </Modal>

    </Layout>
    ) 
}

export default TaskMainPage;