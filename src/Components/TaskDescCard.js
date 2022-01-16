

import styled from 'styled-components';
import { Layout, Typography } from 'antd';
import { Icon } from '@iconify/react';


const TaskDescCard = ({done, desc}) => {
    // <Icon icon="twemoji:sad-but-relieved-face" color="black" height="50" />

    const CardOutline = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    height: 100px;
    width: 90%;
    margin: 2%;
    border: 20px white solid;

    
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 17px;
 `  
    const { Text } = Typography;
    return(
        <>
        <CardOutline>
            {
                done
                ?
                <>
                    <Text>{desc}</Text>
                </>
                :
                <>
                <Icon icon="twemoji:sad-but-relieved-face" color="black" height="50" />
                <Text>未完成打卡QAQ</Text>
                </>

            }
        </CardOutline>
        </>        
    )
}

export default TaskDescCard;

