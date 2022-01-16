// import styled from 'styled-components'
// import {Avatar,Typography, Space} from 'antd'

import { Progress, Typography } from 'antd';
import styled from 'styled-components';

const { Text } = Typography;

// display:"flex", flexDirection: 'column', justifyContent:"center", margin: '24px', alignItems:"center"
const StatsInfoCard = ({achieveTotalCount, expectedTotalCount}) => {


    const CardOutline = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    height: 100px;
    width: 500px;
    margin-bottom: 2%;
    border: 20px white solid;

    
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 17px;
 `

    return(
        <>
        <CardOutline>
            <Text>本周打卡總次數:&ensp;{achieveTotalCount}</Text>
            <Text>預計應打卡總次數:&ensp;{expectedTotalCount}</Text>
            <Progress percent={achieveTotalCount / expectedTotalCount * 100} showInfo={false} />
        </CardOutline>
        </>
    )
}

export default StatsInfoCard;