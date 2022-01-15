// 可以看有哪些介面的那個介面

// isMgr = 是不是群主
import { Table, Space, Tooltip, Button, Modal, Input, message, Divider, List, Typography  } from 'antd';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { isDate } from 'moment';
import { getParticipationDetail, getUserExist, getUserInfo, getParticipationAllMember, addNewMember, deleteUserParticipation } from '../axios';


const TaskMenber = ({taskId, userId, token, userName}) => {

    //default settings
    const { Search } = Input;
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const columns = [
        {
            title: '',
            key: 'isMgr',
            width: 50,
            dataIndex: 'isMgr',
            render: tag => tag === true ? <Tooltip placement="right" title="任務主人"><Icon icon="emojione:crown" color="black" height="20" /></Tooltip> : <></>,
          },
        {
          title: 'name',
          dataIndex: 'name',
          key: 'name',
        },
      ];
    const [openDelete, setOpenDelete] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    //要串的東西
    //任務成員
    const [member, setMember] = useState([]); 
    //當前用戶是否是管理員
    const [isMgr, setIsMgr] = useState(false);
    //如果有新增成員的話，要傳送的list
    const [addMemberList, setAddMemberList] = useState([]); //[{id: "wu", name:"巫"},{id: "chen",name:"陳沛妤"}]
    //陳沛妤: 這邊是按"刪除"之後要刪掉的清單的key
    const [state, setState] = useState({selectedRowKeys: [], });
    const { selectedRowKeys } = state;
    const [refresh, setRefresh] = useState(false);

    useEffect( async () => {
        const res = await getParticipationDetail({user_id: userId, task_id: taskId});
        setIsMgr(res.Is_Admin);
        var t = []
        var temp = new Object();
        temp.key = 1;
        temp.id = userId;
        temp.name = userName;
        temp.isMgr = res.Is_Admin;
        t[0] = temp;

        const mem = await getParticipationAllMember({task_id: taskId, token: token});
        for(var i = 0; i < mem.length; i++){
            if(mem[i].User_ID != userId){
                var te = new Object();
                te.key = i+1;
                te.id = mem[i].User_ID;
                const r = await getUserInfo({user_id: mem[i].User_ID})
                te.name = r.Name;
                const b = await getParticipationDetail({user_id: mem[i].User_ID, task_id: taskId});
                te.isMgr = b.Is_Admin;
                t[i] = te;
            }
        }
        setMember(t);
      }, [refresh]);

     //functions
      const onSelectChange = selectedRowKeys => {
        // console.log('selectedRowKeys changed: ', selectedRowKeys);
        setState({ selectedRowKeys });
      };
      

    const handleDelete = async () => {
        
        let deletedUserId = [];
        setOpenDelete(!openDelete);
        state.selectedRowKeys.map(
            memberKey => {
                // console.log(member.find(o => o.key === memberKey).id);
                // deletedUserId.push
                deletedUserId.push(member.find(o => o.key === memberKey).id);
            });
        console.log(deletedUserId);
        for(var i = 0; i < deletedUserId.length; i++){
            await deleteUserParticipation({task_id: taskId, user_id: deletedUserId[i], token: token});
        }
        setRefresh(!refresh);
    }

    const onSearch = async (value) => {
        setIsSearching(true);
        const res = await getUserExist({user_id: value, task_id: taskId});
        //看value(就是memberId)有沒有在資料庫裡面
        if(res.data){ 
            const response = await getUserInfo({user_id: value});
            var temp = new Object();
            temp.id = value;
            temp.name = response.Name;
            setAddMemberList([...addMemberList, temp] );
            setIsSearching(false);
        }
        else{
            message.error(res.message);
            setIsSearching(false);
        }
         
    };

    //table settings
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        ],
    };

    const handleSendAddMember = async () => {
        var t = [];
        // 把addMemberList裡面的東西加到小組成員清單裡面
        for(var i = 0; i < addMemberList.length; i++){
            var temp = new Object();
            temp.key = member.length+i+1;
            temp.id = addMemberList[i].id;
            temp.name = addMemberList[i].name;
            temp.isMgr = false;
            t[i] = temp;
            await addNewMember({task_id: taskId, user_id: addMemberList[i].id, token: token});
        }
        console.log(member);
        console.log(t);
        setMember([...member, ...t]);
        setShowAddMemberModal(false);
        setAddMemberList([]);
    }

    return(
        <>
            <Table columns={columns} rowSelection={openDelete && isMgr ? rowSelection : undefined}  dataSource={member} size='small' title={isMgr ? !openDelete ? () => <Button onClick={() => setOpenDelete(!openDelete)}>編輯</Button> : () => <Button type='primary' onClick={() => setShowAddMemberModal(true)}>新增成員</Button> : undefined} footer={openDelete ? () => (<><Button onClick={() => {setOpenDelete(!openDelete)}}>取消</Button><Button danger type='primary' onClick={() => handleDelete()}>刪除</Button></>) : undefined}/>
            <Modal title="新增成員" visible={showAddMemberModal} onCancel={() => setShowAddMemberModal(false)} onOk={() => handleSendAddMember()} >
            {/* <Text >寫下任何的想法都可以喔！</Text> */}
            <Search placeholder="input search text"  style={{ width: 200 }} onSearch={onSearch} loading={isSearching}  enterButton />
            <Divider ></Divider>
            <List
                bordered
                dataSource={addMemberList}
                renderItem={item => (
                    <List.Item>
                    <Typography.Text mark></Typography.Text> {item.name}
                    </List.Item>
                )}
                />
        </Modal>
        </>
        
    )
}

export default TaskMenber;




