import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCookies, Cookies } from 'react-cookie';
import { Button, Table, Modal, Form, Input, Select, message, Spin, Result } from 'antd';
import { IoIosAddCircleOutline } from "react-icons/io";
import { TfiPencil, TfiTrash } from "react-icons/tfi";
import { useNavigate } from 'react-router-dom';

import '../../components/commons/header.css'
import './StoryManager.css'

const API_BASE_URL = 'http://localhost:8080/api/v2/stories'; // Adjust if needed
const AUTH_API_BASE_URL = 'http://localhost:8080/auth'; // Auth endpoints

const StoriesManager = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'refreshToken', 'userRole', 'userId']); 
    const userRole = cookies.userRole;
    const userId = cookies.userId;
    const [searchInput, setSearchInput] = useState('');
    const tableRef = useRef(null);
    const navigate = useNavigate(); 


    useEffect(() => {
        loadStories();
    }, [searchInput]);


    // Axios Response Interceptor for Immediate Logout on 401/403
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response, // Pass thr successful responses
            error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.error("Authentication error (401/403), redirecting to login:", error);
                    removeCookie('accessToken'); // Clear cookies
                    removeCookie('refreshToken');
                    removeCookie('userRole');
                    removeCookie('userId');
                    message.error("Session expired. Please login again.");
                    navigate('/login'); // Redirect to login page
                }
                return Promise.reject(error); // Reject all errors
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor); // Eject interceptor on component unmount
        };
    }, [removeCookie, navigate]); // Dependencies for useEffect


    const loadStories = async () => {
        setLoading(true);
        try {
            let url = API_BASE_URL;
            if (userRole === 'creator') {
                url = `${API_BASE_URL}/creator/${userId}`;
            }

            const response = await axios.get(url, { // Axios will automatically use the interceptor
                params: { search: searchInput }
            });

            setStories(response.data.stories);
            setLoading(false);
        } catch (error) {
            console.error("Error loading stories:", error); 
            setLoading(false);
            if (error.response && (error.response.status !== 401 && error.response.status !== 403)) {
                message.error("Failed to load stories."); 
            }
        }
    };

    const showCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const handleCancelCreateModal = () => {
        setIsCreateModalVisible(false);
        form.resetFields();
    };

    const handleCreateStory = async (values) => {
        setLoading(true); 
        try {
            await axios.post(API_BASE_URL, values, { 
                headers: { Authorization: `Bearer ${cookies.accessToken}` }
            });
            message.success("Story created successfully!");
            setIsCreateModalVisible(false);
            form.resetFields();
            loadStories(); // Reload stories after creation
        } catch (error) {
            console.error("Error creating story:", error); 
            message.error("Failed to create story.");
        } finally {
            setLoading(false); // Set loading to false after creation attempt (success or fail)
        }
    };


    const handleDeleteStory = async (storyId) => {
        try {
            await axios.delete(`${API_BASE_URL}/${storyId}`, { 
                headers: { Authorization: `Bearer ${cookies.accessToken}` }
            });
            message.success("Story deleted successfully!");
            setStories(currentStories => currentStories.filter(story => story._id !== storyId));
            if (tableRef.current) {
                tableRef.current.scrollTo({ top: 0 }); 
            }
        } catch (error) {
            console.error("Error deleting story:", error);
            message.error("Failed to delete story.");
            loadStories(); // Fallback to full reload on error
        }
    };


    const confirmDeleteStory = (storyId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this story?',
            content: 'This action cannot be undone.',
            onOk: () => handleDeleteStory(storyId),
        });
    };


    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: 'id',
            render: (text) => <span style={{ wordBreak: 'break-all' }}>{text}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button icon={<TfiPencil />} type="link" onClick={() => { /* TODO: Implement Edit */ }} disabled={userRole !== 'admin' && userRole !== 'creator'}>Edit</Button>
                    <Button icon={<TfiTrash />} type="link" danger onClick={() => confirmDeleteStory(record._id)} disabled={userRole !== 'admin' && userRole !== 'creator'}>Delete</Button>
                </>
            ),
        },
    ];

    const isAuthorized = userRole === 'admin' || userRole === 'creator';

    return (
        <>
            <div className="header">
                <h1>Content Manager Dashboard</h1>
            </div>
            <div className="welcome">
                <h2>
                    Welcome! {isAuthorized ? 'Manage your stories here.' : 'Story Management Access Restricted.'}
                </h2>
            </div>
            <div className="content">
                {isAuthorized ? (
                    <>
                        <div className="tools">
                            <Button type="primary" icon={<IoIosAddCircleOutline />} size="large" onClick={showCreateModal} loading={loading} disabled={loading}>
                                Add New Story
                            </Button>
                            <Input.Search
                                placeholder="Search stories"
                                onSearch={(value) => setSearchInput(value)}
                                onChange={(e) => setSearchInput(e.target.value)}
                                style={{ width: 300, marginInlineStart: 16 }}
                            />
                        </div>
                        <div className="table">
                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '50px' }}>
                                    <Spin size="large" tip="Loading Stories..." />
                                </div>
                            ) : (
                                <Table
                                    columns={columns}
                                    dataSource={stories}
                                    rowKey="_id"
                                    ref={tableRef}
                                    pagination={{ pageSize: 50 }} 
                                />
                            )}
                        </div>

                        <Modal
                            title="Create New Story (for development only)"
                            visible={isCreateModalVisible}
                            onCancel={handleCancelCreateModal}
                            footer={null}
                        >
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={handleCreateStory}
                            >
                                <Form.Item
                                    name="title"
                                    label="Title"
                                    rules={[{ required: true, message: 'Please input the story title!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    name="type"
                                    label="Type"
                                    rules={[{ required: true, message: 'Please select the story type!' }]}
                                >
                                    <Select placeholder="Select a type">
                                        <Select.Option value="comic">Comic</Select.Option>
                                        <Select.Option value="novel">Novel</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="genre"
                                    label="Genre"
                                    rules={[{ required: true, message: 'Please select genres!' }]}
                                >
                                    <Select mode="multiple" placeholder="Select genres">
                                        {/* Mot load tu server */}
                                        <Select.Option value="comedy">Comedy</Select.Option>
                                        <Select.Option value="drama">Drama</Select.Option>
                                        <Select.Option value="fantasy">Fantasy</Select.Option>
                                        <Select.Option value="horror">Horror</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="status"
                                    label="Status"
                                    rules={[{ required: true, message: 'Please select the story status!' }]}
                                >
                                    <Select placeholder="Select status">
                                        <Select.Option value="ongoing">Ongoing</Select.Option>
                                        <Select.Option value="completed">Completed</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Description"
                                    rules={[{ required: true, message: 'Please input the story description!' }]}
                                >
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={loading} disabled={!isAuthorized}>
                                        Create Story
                                    </Button>
                                    <Button htmlType="button" onClick={handleCancelCreateModal} style={{ marginInlineStart: 8 }} disabled={loading}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </>
                ) : (
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                    />
                )}
            </div>
        </>
    );
};

export default StoriesManager;