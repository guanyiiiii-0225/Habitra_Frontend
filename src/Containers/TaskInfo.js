// 可以看任務詳細資訊的那個介面
//巫芊瑩：這邊還沒有把資訊好好擺上去，記得補充

/*
avatar 
任務簡介
任務規則

關閉任務
刪除任務
 */

import styled from "styled-components";
import { useState, useEffect } from "react";
import { Typography, Button, message, Descriptions } from "antd";
import moment from "moment";
import { getTask, getParticipationDetail, closeTask, deleteTask, quitParticipation } from '../axios';
import { useNavigate } from "react-router-dom";
const TaskInfo = ({taskId, token, userId}) => {

    //default settings
    const {Title, Text} = Typography;
    const navigate = useNavigate();
    const DangerZone = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 98%;
    margin-top: 2%;
    border: 1px red solid;
    padding: 1%;

    
    background: transparent;
    border-radius: 5px;
    `

    //陳沛妤
    //判斷是否是管理者，決定是否要顯示danger zone

    // 刪除的時候要加上一個double confirm 的 box
    const [isClosed, setIsClosed] = useState(true);
    const [isManager, setIsManager] = useState(false);
    const [isQuit, setIsQuit] = useState(false);
    //任務資訊
    const [taskAvatar, setTaskAvatar] = useState('');
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    
    // 打卡次數
    const [threshold, setThreshold] = useState(0);
    // 需要計算的日期[INT]
    const [workDay, setWorkDay] = useState([1,1,1,1,1,1,1]); //因原本前端的格式和串接有點不一樣，重新設的變數 //巫：沒顯示
    // 懲罰一天的扣錢數量
    const [punish, setPunish] = useState(0);
    // 是否需要上傳文字
    const [need_daily_desc, setNeed_daily_desc] = useState(false);
    // 打卡區間
    const [start_hour, setStart_hour] = useState("00:00");
    const [end_hour, setEnd_hour] = useState("23:59");
    const [taskOpenDate, setTaskOpentDate] = useState("2021-11-11");
    const [taskCloseDate, setTaskCloseDate] = useState("2021-11-15");
    // const [taskQuitDate, setTaskQuitDate] = useState("2021-11-22");
    const handleCloseTask = async () => {
        const res = await closeTask({task_id: taskId, token: token});
        console.log(res);
        // message.success('成功打卡！');
        message.success("成功關閉任務");
        navigate("/");
    };

    const handleDeleteTask = async () => {
        const res = await deleteTask({task_id: taskId, token: token});
        console.log(res);
        message.success("成功刪除任務");
        navigate("/");
        // message.success('成功打卡！');
    };
    const handleQuitTask = async () => {
        const res = await quitParticipation({user_id: userId, task_id: taskId, token: token});
        console.log(res);
        message.success("成功退出任務");
        navigate("/");
    }

    useEffect( async () => {
        const res = await getTask({task_id: taskId, token: token});
        console.log(res);
        setTaskName(res.Title);
        setTaskAvatar(res.Icon);
        setTaskDescription(res.Description);
        setThreshold(res.Threshold);
        setPunish(res.Punish);
        setNeed_daily_desc(res.Need_Daily_Desc);
        setStart_hour(res.Start_Hour);
        setEnd_hour(res.End_Hour);
        setTaskOpentDate(res.Create_Time.toString().split("T")[0]);
        if(res.Close_Time!= null) setTaskCloseDate(res.Close_Time.toString().split("T")[0]);
        setWorkDay(res.Working_Day);
        setIsClosed(res.Is_Closed);

        const res_2 = await getParticipationDetail({user_id: userId, task_id: taskId});
        setIsManager(res_2.Is_Admin);
        setIsQuit(res_2.Is_Quit);
      }, []);
    return(
        <div style={{marginBottom: "1vh"}}> 
            <Title level={3}>任務簡介</Title>
            <Text>{taskDescription}</Text>
            <Title level={3}>任務規則</Title>
            <Descriptions
            bordered
            size="middle"
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}

            >
            <Descriptions.Item label="任務開始時間">{taskOpenDate}</Descriptions.Item>
            {
                isClosed 
                ?
                <Descriptions.Item label="任務結束時間">{taskCloseDate}</Descriptions.Item>
                :
                <></>
            }
            <Descriptions.Item label="需打卡次數">{threshold}</Descriptions.Item>
            <Descriptions.Item label="懲罰機制（罰金）">${punish}</Descriptions.Item>
            <Descriptions.Item label="是否需上傳文字">{need_daily_desc?"是":"否"}</Descriptions.Item>
            <Descriptions.Item label="可打卡時段">{start_hour} ~ {end_hour}</Descriptions.Item>
            </Descriptions>
            <br />
            {
                isManager
                ?
                isClosed
                ?
                <DangerZone>
                    <Title level={4} style={{color:"red"}}>刪除任務</Title>
                    <Button type="primary" size="small" onClick={handleDeleteTask} danger>刪除任務</Button>
                </DangerZone> 
                :
                <>
                <DangerZone>
                    <Title level={4} style={{color:"red"}}>關閉任務</Title>
                    <Button type="primary" size="small" onClick={handleCloseTask} danger>關閉任務</Button>
                </DangerZone>     
                <DangerZone>
                    <Title level={4} style={{color:"red"}}>刪除任務</Title>
                    <Button type="primary" size="small" onClick={handleDeleteTask} danger>刪除任務</Button>
                </DangerZone> 
                </>  
                :
                !isClosed && !isQuit
                ?
                <DangerZone>
                    <Title level={4} style={{color:"red"}}>退出任務</Title>
                    <Button type="primary" size="small" onClick={handleQuitTask} danger>退出任務</Button>
                </DangerZone> //巫：回主頁面 要判斷他是不是isquit
                :
                <></>
            }

        </div>
        
    )
}

export default TaskInfo;