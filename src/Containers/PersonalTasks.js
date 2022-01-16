import { Layout, Breadcrumb, Button, Avatar, Typography } from 'antd';
import TaskCard from '../Components/TaskCard';
import styled from 'styled-components'



const PersonalTasks = ({ongoingTaskInfo,doneTaskInfo,relaxTaskInfo}) => {

    const { Content } = Layout;

    const Tasks = styled.div`
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    `
    // Typology default setting
    const { Title } = Typography;


    return(
        <div className="site-layout-background" style={{ minHeight: 360 }}>
        <Title level={3}>今日尚未完成</Title>
        <Tasks>
        {ongoingTaskInfo.map(
            task => {
                return(
                    <TaskCard uid={task.uid} icon={task.icon} name={task.name} isClosed={false} isQuit={false}/>
                )
            }
        )}
        </Tasks>
        <Title level={3}>今日已完成</Title>
        <Tasks>
        {doneTaskInfo.map(
            task => {
                return(
                    <TaskCard uid={task.uid} icon={task.icon} name={task.name}/>
                )
            }
        )}
        </Tasks>
        <Title level={3}>今日休息中</Title>
        <Tasks>
        {relaxTaskInfo.map(
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

export default PersonalTasks