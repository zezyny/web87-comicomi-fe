import React, { useEffect, useState } from 'react'
import logo2 from '../../assets/logo2.png'
import logo1 from '../../assets/logo1.png'
import { Layout, Menu, Button, theme, Image, Breadcrumb, Dropdown, Flex, Typography } from "antd";
import {
    DashboardOutlined,
    UserOutlined,
    BookOutlined,
    DollarOutlined,
    CommentOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ProfileOutlined,
    LogoutOutlined,
    CaretDownOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import userApi from '../../api/userApi';
import { useCookies } from 'react-cookie';
import axios from 'axios';
const { Sider, Header, Content } = Layout;
import { permissionControl } from '../../security/permissionController';

const DashboardLayout = () => {
    let navigate = useNavigate()
    const [cookies] = useCookies(['accessToken', 'userRole', 'userId', 'refreshToken']);
    const [currentUser, setCurrentUser] = useState(null)

    const fetchCurrentUser = async (id) => {
        try {
            const response = await userApi.getUser(id)

            if (response.data.role != "admin" && response.data.role != "creator") {
                navigate('/login');
            }
            console.log("Access token extracted: ", cookies.accessToken)
            const permissionAccess = await permissionControl.checkAllowAdminOrCreator(cookies.accessToken)
            if (!permissionAccess) {
                permissionControl.kick(navigate)
            }
            setCurrentUser(response.data)
        } catch (e) {
            // alert("There's error when trying to perform authentication for you.")
            permissionControl.kick(navigate)
        }

    }

    useEffect(() => {
        fetchCurrentUser(cookies.userId);

    }, [cookies.userId]);

    const [collapsed, setCollapsed] = useState(false);
    const menuItems = [
        { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
        { key: "/dashboard/users", label: "Users", icon: <UserOutlined />, disabled: currentUser?.role.toLowerCase() === 'admin' ? false : true },
        { key: "/dashboard/stories", label: "Stories", icon: <BookOutlined /> },
        { key: "/dashboard/revenue", label: "Revenue", icon: <DollarOutlined /> },
        {
            key: "/dashboard/community",
            label: "Community",
            icon: <CommentOutlined />,
        },
    ];
    const items = [
        {
            key: 'menuLabel',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: <ProfileOutlined />
        },
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />
        }
    ]
    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    height: '100vh',
                    position: 'sticky',
                    overflow: 'auto',
                    insetInlineStart: 0,
                    top: 0,
                    bottom: 0,
                    scrollbarWidth: 'thin',
                    scrollbarGutter: 'stable',
                }}
                theme='light'
            >
                <img src={collapsed ? logo2 : logo1} style={{ width: '100%', padding: '20px', marginBottom: '70px', transition: 'opacity 1s ease-in-out' }} />
                <Menu items={menuItems} mode='inline' onClick={({ key }) => navigate(key)} />
            </Sider>
            <Layout>
                <Header
                    style={{
                        backgroundColor: '#445489',
                        paddingRight: '20px',
                        paddingLeft: 0,
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                        width: '100%'
                    }}
                >
                    <Flex justify='space-between' align='center'>
                        <Flex align='center'>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                    color: '#fff',
                                    borderRadius: '50%'
                                }}
                            />
                        </Flex>
                        <Dropdown menu={{ items, }} >
                            <Flex align='center' gap={10}>
                                <img src={currentUser?.avatar} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                                <Flex vertical >
                                    <Typography.Text strong style={{ color: '#fff' }}>{currentUser?.userName}</Typography.Text>
                                    <Typography.Text style={{ color: '#fff' }}>{currentUser?.role.charAt(0).toUpperCase() + currentUser?.role.slice(1)}</Typography.Text>
                                </Flex>

                                <Typography.Text style={{ color: '#fff' }}><CaretDownOutlined /></Typography.Text>
                            </Flex>
                        </Dropdown>
                    </Flex>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflowX: "hidden",
                        overflowY: "auto",
                        height: '80%',
                        width: '90%',
                        margin: 'auto',
                        marginTop: '20px'
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}

export default DashboardLayout