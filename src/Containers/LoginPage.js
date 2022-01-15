import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import React, {useState, useEffect} from 'react';
// import { Link,useHistory } from 'react-router-dom';
import { login } from '../axios';

const LoginPage = ({setValid, setIsLogin, setToken, userId, setUserId}) => {
    // let history = useHistory();
    
    const[password, setPassword] = useState("");

    
    const handleLogin = async () => {
        const response = await login({user_id: userId, password: password});
        console.log(response);
        setToken(response);
        setIsLogin(true);
        setValid(true);
    }
    
    return (
        <>
            <h1 className="login_title">Login</h1>
            <div className="login_page">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true,}}
                >
                    <Form.Item
                        name="userId"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your UserId!',
                        },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} value = {userId} placeholder="UserId" onChange={(e) => setUserId(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="wide-form-button" onClick={handleLogin}>
                            Login
                        </Button>
                        Don't have an Account?  <a href="/signUp">Sign Up</a>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default LoginPage