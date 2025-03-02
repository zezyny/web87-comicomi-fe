import React, { useEffect, useRef, useState } from 'react'

import userApi from '../../api/userApi.js'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Image, Input, Popconfirm, Space, Table, Tag } from 'antd'
import { DeleteFilled, DeleteOutlined, DeleteTwoTone, DollarOutlined, DollarTwoTone, SearchOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";

const UserManagement = () => {
    // const [searchParams, setSearchParams] = useSearchParams()
    // const keyword = searchParams.get('keyword') ?? ''
    // const page = searchParams.get("page") ?? 1;
    // const pageSize = searchParams.get("pageSize") ?? 10;
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const [userData, setUserData] = useState({
        users: [],
        total: 0
    })

    const navigate = useNavigate()

    // const changePage = (page, pageSize) => {
    //     setSearchParams({
    //         keyword,
    //         page,
    //         pageSize
    //     })
    // }

    const fetchUsers = async () => {
        const response = await userApi.getAllUsers()
        const newUserData = {
            users: response.data.map((user) => ({
                ...user,
            }))
        }
        setUserData(newUserData)
    }

    useEffect(() => {
        fetchUsers()
    }, [])
    console.log(userData);

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
                >
                    <Button danger style={{ fontSize: '16px' }}><DeleteOutlined /></Button>
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
            width: 30,
            ...getColumnSearchProps('name'),
            render: (text, record) => <Link to={`/dashboard/users/${record.key}/detail`}>{text}</Link>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            width: 50,
            ...getColumnSearchProps('email'),
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
            filters: [
                {
                    text: 'Admin',
                    value: 'Admin'
                },
                {
                    text: 'Member',
                    value: 'Member'
                },
                {
                    text: 'Creator',
                    value: 'Creator'
                }
            ],
            onFilter: (value, record) => record.role.indexOf(value) === 0
        },
        {
            title: 'Balance',
            dataIndex: 'wallet',
            key: 'wallet',
            align: 'center',
            width: 20,
            sorter: (a, b) => a.wallet - b.wallet
        },
        {
            title: 'Action',
            dataIndex: 'delete',
            key: 'delete',
            align: 'center',
            width: 20
        }
    ]
    return (
        <div>
            <h2>User Management</h2>
            <br />
            <Table
                dataSource={dataSource}
                columns={column}
                pagination={{
                    position: ['bottomCenter'],
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
                }}>

            </Table>
        </div>
    )
}

export default UserManagement