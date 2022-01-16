import styled from 'styled-components'
import {Avatar,Typography, Space, Tag} from 'antd'
import { useNavigate, Link } from "react-router-dom";
// import { useNavigate, Link } from "react-router-dom";


const { Text } = Typography;


// display:"flex", flexDirection: 'column', justifyContent:"center", margin: '24px', alignItems:"center"
const TaskCard = ({uid, icon, name, isClosed, isQuit}) => {
    let navigate = useNavigate();
     const Card = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100px;
        width: 100px;
        margin: 2%;
        
        background: #FFFFFF;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 17px;
     `
    
    

     return(
         <>
         {/* <Link to={`/task/${uid}`}> */}
            <Card style={{cursor: 'pointer'}} onClick={() => navigate('/task/'+uid )}>
            
                <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start"}}>
                {
                    isClosed
                    ?
                    <Tag color="#f50">已關閉</Tag>
                    :
                    <br/>
                }
                </div>
                <Avatar shape="square" size="large" src={icon} />
                <div style={{fontSize: 1}}>{name}</div>
            </Card>
        {/* </Link> */}

         </>

     )
}

export default TaskCard;