import React, { useEffect, useRef, useState } from 'react'

import userApi from '../../api/userApi.js'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Breadcrumb, Button, Image, Input, message, Pagination, Popconfirm, Result, Space, Table, Tag, Typography } from 'antd'
import { DeleteFilled, DeleteOutlined, DeleteTwoTone, DollarOutlined, DollarTwoTone, SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import { SearchUser } from '../../components/user/SearchUser.jsx';
import { useCookies } from 'react-cookie';

const UserManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const keyword = searchParams.get('keyword') ?? ''
    const page = searchParams.get("page") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 10;
    const [orderBy, setOrderBy] = useState(searchParams.get('orderBy') || 'createAt');
    const [orderDirection, setOrderDirection] = useState(searchParams.get('orderDirection') || 'desc');
    const [deleteCounter, setDeleteCounter] = useState(0);
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(false);
    const [cookies] = useCookies(['accessToken', 'userRole', 'userId', 'refreshToken']);
    const [userData, setUserData] = useState({
        users: [],
        total: 0
    })
    const navigate = useNavigate()
    const fetchCurrentUser = async (id) => {
        const response = await userApi.getUser(id)
        setCurrentUser(response.data)
    }

    useEffect(() => {
        fetchCurrentUser(cookies.userId);

    }, [cookies.userId]);
    const breadcrumbItems = [{
        title: 'Dashboard',
        href: '/dashboard/main'
    },
    {
        title: 'User Management'
    }
    ]
    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await userApi.getUsers({
                keyword,
                page,
                pageSize,
                orderBy,
                orderDirection,
            });

            const newUserData = {
                users: response.data.users.map((user) => ({
                    ...user,
                })),
                total: response.data.total,
            };

            setUserData(newUserData);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        console.log('abc123');

        fetchUsers()
        console.log(userData);
    }, [keyword, page, pageSize, deleteCounter, orderBy, orderDirection])

    const searchUsers = ({ keyword }) => {
        setSearchParams({
            keyword: keyword,
        });
    };

    const handleDeleteUser = async (id) => {
        setDeleteCounter(prev => prev + 1)
        await userApi.deleteUser(id)
        message.success('User deleted successfully')
    }
    const handleTableChange = (pagination, filter, sorter) => {
        let newPage = page
        let newPageSize = pageSize
        if (pagination) {
            // setSearchParams({
            //     page: pagination.current,
            //     pageSize: pagination.pageSize
            // });
            newPage = pagination.current
            newPageSize = pagination.pageSize
        }


        if (sorter) {
            const fieldMapping = {
                'name': 'userName',
                'email': 'email',
                'createdAt': 'createdAt'
            };

            const newOrderBy = fieldMapping[sorter.field] || 'createdAt';
            const newOrderDirection = sorter.order === 'ascend' ? 'asc' : 'desc';
            console.log(newOrderBy, orderBy);
            console.log(orderDirection, newOrderDirection);


            setOrderBy(newOrderBy);
            setOrderDirection(newOrderDirection);
            setSearchParams({
                keyword,
                page: newPage,
                pageSize: newPageSize,
                orderBy: newOrderBy,
                orderDirection: newOrderDirection,
            });
            console.log(searchParams);

        }
    };
    const dataSource = userData.users.map((user) => {
        return {
            key: user.id,
            name: user.userName,
            email: user.email,
            role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
            avatar: <Image src={user.avatar} width={50} height={50} style={{ borderRadius: '5px' }} />,
            wallet: <div><DollarTwoTone twoToneColor='#ffc107' /> {user.wallet}</div>,
            delete: <div>
                <Popconfirm
                    title={`Delete ${user.userName}`}
                    description="Are you sure to delete this user?"
                    okText="Yes"
                    cancelText="No"
                    onConfirm={() => handleDeleteUser(user.id)}
                >
                    <Button danger style={{ fontSize: '16px' }} ><DeleteOutlined /></Button>
                </Popconfirm>
            </div>
        }
    })

    const column = [
        {
            title: 'Avatar',
            dataIndex: 'avatar',
            key: 'avatar',
            align: 'center',
            width: 20
        },
        {
            title: 'Username',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            sorter: true,
            sortOrder: orderBy === 'userName' && (orderDirection === 'asc' ? 'ascend' : 'descend'),
            width: 30,
            render: (text, record) => <Link to={`/dashboard/users/${record.key}/detail`}>{text}</Link>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            sorter: true,
            sortOrder: orderBy === 'email' && (orderDirection === 'asc' ? 'ascend' : 'descend'),
            width: 50,
            render: (text) => <a href={`mailto:${text}`}>{text}</a>,
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            align: 'center',
            width: 20,
            render: (_, { role }) => {
                {
                    let color = ''
                    if (role.toLowerCase() === 'admin') {
                        color = 'volcano'
                    } else if (role.toLowerCase() === 'member') {
                        color = 'green'
                    } else color = 'purple'
                    return <Tag color={color} key={role}>
                        {role}
                    </Tag>
                }
            },

        },
        {
            title: 'Balance',
            dataIndex: 'wallet',
            key: 'wallet',
            align: 'center',
            width: 20,

        },
        {
            title: 'Action',
            dataIndex: 'delete',
            key: 'delete',
            align: 'center',
            width: 20
        }
    ]
    if (!currentUser) {
        return <div>Loading...</div>
    }
    if (currentUser.role.toLowerCase() !== 'admin') {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                    <Button type="primary" onClick={() => navigate('/dashboard/main')}>
                        Back to Dashboard
                    </Button>
                }
            />
        );
    }
    return (
        <div>
            <Breadcrumb items={breadcrumbItems} />
            <Typography.Title level={3}>User Management</Typography.Title>
            <br />
            <SearchUser searchUsers={searchUsers} />
            <Table
                loading={loading}
                dataSource={dataSource}
                columns={column}
                onChange={handleTableChange}
                style={{ marginTop: '20px' }}
                pagination={{
                    position: ['bottomCenter'],
                    total: userData.total,
                    pageSize: pageSize,
                    current: page,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
                }}
            >

            </Table>
        </div>
    )
}

export default UserManagement