

/* 
1. 沒有編輯功能
個人資料
姓名
信箱
ID
個人任務
管理中任務
個人管理任務
參與中任務
*/
import {Typography, Divider, Descriptions} from 'antd';
import { useState, useEffect } from 'react';
import TaskCard from '../Components/TaskCard';
import styled from 'styled-components'
import { getAdmin, getNotAdmin, getTaskDetail, getTask, getParticipationDetail } from '../axios';
const { Title, Text, Link } = Typography;


const UserInfo = ({userId, name, email, token}) => {
    const Tasks = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    `

    const [managedTaskInfo, setManagedTaskInfo] = useState([]);
    const [TaskInfo, setTaskInfo] = useState([]);

    useEffect( async () => {
        const response_1 = await getAdmin({user_id: userId, token: token});
        const response_2 = await getNotAdmin({user_id: userId, token: token});
        
        var str = [];
        var str_2 = [];
        var str_3 = [];
        for(var i = 0; i < response_1.length; i++){
            const res = await getTaskDetail({task_id: response_1[i].Task_ID, token: token});
            var temp = new Object();
            temp.uid = response_1[i].Task_ID;
            temp.icon = res.Icon;
            temp.name = res.Title;
            const res_2 = await getTask({task_id: response_1[i].Task_ID, token: token});
            temp.isClosed = res_2.Is_Closed//巫
            str[i] = temp;
            // setManagedTaskInfo([...managedTaskInfo, temp]);
        }
        for(var i = 0; i < response_2.length; i++){
            const res = await getTaskDetail({task_id: response_2[i].Task_ID, token: token});
            var temp = new Object();
            temp.uid = response_2[i].Task_ID;
            temp.icon = res.Icon;
            temp.name = res.Title;
            const res_2 = await getTask({task_id: response_2[i].Task_ID, token: token});
            temp.isClosed = res_2.Is_Closed//巫
            const res_3 = await getParticipationDetail({user_id: userId, task_id: response_2[i].Task_ID});
            temp.isQuit = res_3.Is_Quit;  
            str_2[i] = temp;
            // setTaskInfo([...openTaskInfo, temp]);
        }
        setManagedTaskInfo(str);
        setTaskInfo(str_2);
      }, []);

    return(
        <div className="site-layout-background" style={{ minHeight: 360 }}>
        <Divider orientation="left">個人資料</Divider>
        {/* 我先擺上去 之後排版...... */}
        <Descriptions
            bordered
            size="middle"
            layout="vertical"
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}

            >
            <Descriptions.Item label="姓名">{name}</Descriptions.Item>
            <Descriptions.Item label="信箱">{email}</Descriptions.Item>
            <Descriptions.Item label="ID">{userId}</Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">管理中任務</Divider>
        <Tasks>
        {managedTaskInfo.map(
            task => {
                return(
                    <TaskCard uid={task.uid} icon={task.icon} name={task.name} isClosed={task.isClosed} isQuit={task.isQuit}/>
                )
            }
        )}
        </Tasks>
        <Divider orientation="left">參與中任務</Divider>
        <Tasks>
        {TaskInfo.map(
            task => {
                return(
                    <TaskCard uid={task.uid} icon={task.icon} name={task.name}/>
                )
            }
        )}
        </Tasks>
    </div>
    )
}

export default UserInfo