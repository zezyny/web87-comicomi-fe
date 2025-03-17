import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Button, Table, Modal, Form, Input, Select, message, Spin, Result, Upload } from 'antd';
import { IoIosAddCircleOutline } from "react-icons/io";
import { TfiPencil, TfiTrash } from "react-icons/tfi";
import { useNavigate } from 'react-router-dom';
import { FaUpload } from 'react-icons/fa';

import '../../components/commons/header.css' // Updated CSS import
import './StoryManager.css' // Updated CSS import

const API_BASE_URL = 'http://localhost:8080/api/v2/stories';
const AUTH_API_BASE_URL = 'http://localhost:8080/auth';



const StoriesManager = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [cookies, setCookie] = useCookies(['accessToken', 'userRole', 'userId', 'refreshToken']);
    const userRole = cookies.userRole;
    const userId = cookies.userId;
    const [searchInput, setSearchInput] = useState('');
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const [testModalVisible, setTestModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [deleteObjectId, setDeleteObjectId] = useState('')
    const [deleteObjectName, setDeleteObjectName] = useState('')
    const [bannerUploadImageFile, setBannerUploadImageFile] = useState(null)

    useEffect(() => {
        loadStories();
    }, [searchInput]);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.error("Authentication error (401/403), redirecting to login:", error);
                    message.error("Session expired. Please login again.");
                    navigate('/login');
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [navigate]); // Removed removeCookie from dependencies - per request

    const loadStories = async () => {
        setLoading(true);
        try {
            let url = API_BASE_URL;
            if (userRole === 'creator') {
                url = `${API_BASE_URL}/creator/${userId}`;
            }

            const response = await axios.get(url, {
                params: { search: searchInput }
            });

            setStories(response.data.stories);
            setLoading(false);
        } catch (error) {
            console.error("Error loading stories:", error);
            setLoading(false);
            message.error("Failed to load stories.");
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
            const res = await axios.post(API_BASE_URL, values, {
                headers: { Authorization: `Bearer ${cookies.accessToken}` }
            });
            message.success("Story created successfully!");
            setIsCreateModalVisible(false);
            //Here is additional banner upload logic.
            //Pending request: Refactor.
            console.log(res)
            if (bannerUploadImageFile != null) {
                const bannerUploadForm = new FormData()
                bannerUploadForm.append("banner", bannerUploadImageFile)
                bannerUploadForm.append("storyId", res.data.story._id)
                console.log(bannerUploadForm)
                await axios.post(API_BASE_URL + "/upload/banner", bannerUploadForm, {
                    headers: { Authorization: `Bearer ${cookies.accessToken}` }
                })
            } else {
                alert("There's an error when upload your Banner. Try to upload it again later.")
            }

            form.resetFields();
            loadStories();
        } catch (error) {
            console.error("Error creating story:", error);
            message.error("Failed to create story.");
        } finally {
            setLoading(false);
        }


    };

    const handleDeleteStory = async (storyId) => {
        console.log("handleDeleteStory called for storyId:", storyId);
        try {
            console.log("Attempting DELETE request for storyId:", storyId);
            const response = await axios.delete(`${API_BASE_URL}/${storyId}`, {
                headers: { Authorization: `Bearer ${cookies.accessToken}` }
            });
            console.log("DELETE request successful. Response:", response);
            message.success("Story deleted successfully!");
            setStories(currentStories => currentStories.filter(story => story._id !== storyId));
            if (tableRef.current) {
                tableRef.current.scrollTo({ top: 0 });
            }
        } catch (error) {
            console.error("Error in handleDeleteStory:", error);
            if (error.response) {
                console.error("Error Response Status:", error.response.status);
                console.error("Error Response Data:", error.response.data);
            } else {
                console.error("Error Details (No Response):", error);
            }
            message.error("Failed to delete story.");
            loadStories();
        }
    };

    const confirmDeleteStoryOK = () => {
        setConfirmModalVisible(false)
        handleDeleteStory(deleteObjectId);
    }

    const confirmDeleteStoryCancel = () => {
        setConfirmModalVisible(false)
        setDeleteObjectId('')
        setDeleteObjectName('')
    }


    const confirmDeleteStory = (storyId, title) => {
        console.log("confirmDeleteStory called for storyId:", storyId);
        setDeleteObjectId(storyId)
        setDeleteObjectName(title)
        setConfirmModalVisible(true)
        // Modal.confirm({
        //     title: 'Are you sure you want to delete this story?',
        //     content: 'This action cannot be undone.',
        //     onOk: () => handleDeleteStory(storyId),
        // });
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
                    <Button icon={<TfiPencil />} type="link" onClick={() => { navigate(`/dashboard/stories/${record._id}/detail`) }} disabled={userRole !== 'admin' && userRole !== 'creator'}>Edit</Button>
                    <Button
                        icon={<TfiTrash />}
                        type="link"
                        danger
                        onClick={() => {
                            console.log("Delete button clicked for storyId:", record._id, 'Record:', record);
                            confirmDeleteStory(record._id, record.title);
                        }}
                        disabled={userRole !== 'admin' && userRole !== 'creator'}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const isAuthorized = userRole === 'admin' || userRole === 'creator';

    const showTestModal = () => {
        setTestModalVisible(true);
    };
    const handleTestModalCancel = () => {
        setTestModalVisible(false);
    };

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
                            {/* <Button onClick={showTestModal} style={{ marginTop: 20, marginInlineStart: 16 }}>Show Test Modal</Button> */}
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
                                    pagination={{ pageSize: 10 }}
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
                                    label="Upload banner"
                                    required={true}
                                >
                                    <Upload
                                        accept='.jpg, .jpeg, .png, .heic'
                                        // action=
                                        beforeUpload={(e) => {
                                            // e.preventDefault()
                                            console.log(e)
                                            setBannerUploadImageFile(e)
                                            return false
                                        }}
                                    >
                                        <Button>
                                            <FaUpload></FaUpload>
                                        </Button>
                                    </Upload>
                                </Form.Item>
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
                                    rules={[{ required: true, message: 'Please select or input genres!' }]}
                                >
                                    <Select
                                        mode="tags"
                                        placeholder="Select or type genres"
                                        tokenSeparators={[' ']} 
                                    >
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
                                    <Button type="primary" htmlType="submit" loading={loading} disabled={!isAuthorized} >
                                        Create Story
                                    </Button>
                                    <Button htmlType="button" onClick={handleCancelCreateModal} style={{ marginInlineStart: 8 }} disabled={loading}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Modal>


                        <Modal
                            title={"Are you sure to delete " + deleteObjectName + "?"}
                            visible={confirmModalVisible}
                            onCancel={handleTestModalCancel}
                            footer={[
                                <Button key="back" onClick={confirmDeleteStoryCancel}>
                                    Cancel
                                </Button>,
                                <Button key="submit" type="primary" onClick={confirmDeleteStoryOK} style={{ backgroundColor: "#FF0000" }}>
                                    Delete
                                </Button>,
                            ]}
                        >
                        </Modal>

                        <Modal
                            title="Test Modal"
                            visible={testModalVisible}
                            onCancel={handleTestModalCancel}
                            footer={[
                                <Button key="back" onClick={handleTestModalCancel}>
                                    Return
                                </Button>,
                                <Button key="submit" type="primary" onClick={handleTestModalCancel}>
                                    Submit
                                </Button>,
                            ]}
                        >
                            <p>This is a test modal to check if Ant Design Modals are rendering.</p>
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