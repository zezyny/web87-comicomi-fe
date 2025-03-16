import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Image, Input, Popconfirm, Space, Table, Tag, message, Typography, Modal, Form, Select, InputNumber } from 'antd'
import { DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import chapterApi from './chapterapi';
import { useCookies } from 'react-cookie';

const { Title } = Typography;
const { Option } = Select;

const ChapterManagement = () => {
    const { storyId } = useParams();
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [chapterData, setChapterData] = useState({
        chapters: [],
        total: 0,
        pageSize: 10,
        page: 1,
    });
    const [storyTitle, setStoryTitle] = useState('');
    const navigate = useNavigate();
    const [cookies] = useCookies(['accessToken']);
    const accessToken = cookies.accessToken;
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [createForm] = Form.useForm();
    const [storyType, setStoryType] = useState('')
    const [storyDesc, setStoryDesc] = useState('')

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

    const fetchChapters = async (params = {}) => {
        if (!storyId) return;

        try {
            const response = await chapterApi.getChaptersByStoryId(storyId, params, accessToken);
            setChapterData({
                chapters: response.data,
                total: response.headers['x-total-count'] ? parseInt(response.headers['x-total-count'], 10) : 0,
                pageSize: chapterData.pageSize,
                page: params.page || 1,
            });
        } catch (error) {
            console.error("Error fetching chapters:", error);
            if (error.response && error.response.status === 404) {
                message.error("Story not found.");
                alert("Error fetching chapter")
                navigate('/dashboard/stories');
            } else {
                message.error("Failed to load chapters.");
            }
        }
    };

    const fetchStoryDetails = async () => {
        if (!storyId) return;

        try {
            const response = await chapterApi.getStoryDetail(storyId, accessToken);
            setStoryTitle(response.data.title);
            setStoryType(response.data.type)
            setStoryDesc(response.data.description)
            console.log(response.data.title, response.data.type)
        } catch (error) {
            console.error("Error fetching story details:", error);
            if (error.response && error.response.status === 404) {
                message.error("Story not found.");
                alert("Error story not found")
                navigate('/dashboard/stories');
            } else {
                message.error("Failed to load story details.");
            }
        }
    }

    useEffect(() => {
        if (storyId) {
            fetchChapters({ page: chapterData.page });
            fetchStoryDetails();
        }else{
            console.log("StoryId is not specified")
        }
    }, [storyId, chapterData.page, navigate, accessToken]);

    const handleDeleteChapter = async (chapterId) => {
        try {
            await chapterApi.deleteChapter(chapterId, accessToken);
            message.success("Chapter deleted successfully.");
            fetchChapters({ page: chapterData.page });
        } catch (error) {
            console.error("Error deleting chapter:", error);
            message.error("Failed to delete chapter.");
        }
    };

    const dataSource = chapterData.chapters.map((chapter, index) => {
        return {
            key: chapter._id,
            chapterTitle: chapter.chapterTitle,
            chapterNumber: chapter.chapterNumber,
            chargeType: chapter.chargeType,
            type: chapter.type,
            released: chapter.released ? 'Released' : 'Not Released',
            uploadAt: new Date(chapter.uploadAt).toLocaleDateString(),
            price: chapter.price,
            delete: <div>
                <Popconfirm
                    title={`Delete Chapter ${chapter.chapterTitle}`}
                    description="Are you sure to delete this chapter?"
                    onConfirm={() => handleDeleteChapter(chapter._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger style={{ fontSize: '16px' }}><DeleteOutlined /></Button>
                </Popconfirm>
            </div>
        }
    });

    const handleTableChange = (pagination, filters, sorter) => {
        fetchChapters({
            page: pagination.current,
            pageSize: pagination.pageSize,
            // ... handle filters and sorter if needed in the future
        });
        setChapterData(prevState => ({
            ...prevState,
            pageSize: pagination.pageSize,
            page: pagination.current,
        }));
    };

    const showCreateModal = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateCancel = () => {
        setIsCreateModalVisible(false);
        createForm.resetFields();
    };

    const handleCreateSubmit = async (values) => {
        try {
            await chapterApi.createChapter({ ...values, storyId: storyId, type: storyType}, accessToken);
            message.success("Chapter created successfully.");
            setIsCreateModalVisible(false);
            createForm.resetFields();
            fetchChapters({ page: 1 });
        } catch (error) {
            console.error("Error creating chapter:", error);
            if (error.response) {
                message.error(`Failed to create chapter. Status: ${error.response.status}, Detail: ${error.response.data?.message || 'No details'}`);
            } else {
                message.error("Failed to create chapter.");
            }
        }
    };

    const column = [
        {
            title: 'Title',
            dataIndex: 'chapterTitle',
            key: 'chapterTitle',
            ellipsis: true,
            width: 100,
            ...getColumnSearchProps('chapterTitle'),
            render: (text, record) => <Link to={`/editor/portal/${storyId}/chapter/${record.key}`}>{text}</Link>,
        },
        {
            title: 'Chapter No.',
            dataIndex: 'chapterNumber',
            key: 'chapterNumber',
            align: 'center',
            width: 40,
            sorter: (a, b) => a.chapterNumber - b.chapterNumber,
        },
        {
            title: 'Charge Type',
            dataIndex: 'chargeType',
            key: 'chargeType',
            align: 'center',
            width: 60,
            filters: [
                { text: 'Free', value: 'Free' },
                { text: 'Ads', value: 'Ads' },
                { text: 'Paid', value: 'Paid' },
            ],
            onFilter: (value, record) => record.chargeType.indexOf(value) === 0,
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            align: 'center',
            width: 50,
            filters: [
                { text: 'Comic', value: 'comic' },
                { text: 'Novel', value: 'novel' },
            ],
            onFilter: (value, record) => record.type.indexOf(value) === 0,
        },
        {
            title: 'Released',
            dataIndex: 'released',
            key: 'released',
            align: 'center',
            width: 60,
        },
        {
            title: 'Upload Date',
            dataIndex: 'uploadAt',
            key: 'uploadAt',
            align: 'center',
            width: 80,
            sorter: (a, b) => new Date(a.uploadAt) - new Date(b.uploadAt),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
            width: 50,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Action',
            dataIndex: 'delete',
            key: 'delete',
            align: 'center',
            width: 50,
        }
    ];

    return (
        <div>
            <Space style={{ justifyContent: 'space-between', display: 'flex', width: '100%', marginBottom: 16 }}>
                <div>
                    <Title level={2}>{storyTitle!='' ? `${storyTitle} - Chapters` : "Chapter Management"}</Title>
                </div>
                <div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>
                        Add Chapter
                    </Button>
                </div>
            </Space>
            <Space style={{ justifyContent: 'space-between', display: 'flex', width: '100%', marginBottom: 16 }}>
            <pre style={{textWrap:"wrap", fontFamily:"Arial"}}>{storyDesc?(storyDesc):"Loading description..."}</pre>            
            </Space>

            <Table
                dataSource={dataSource}
                columns={column}
                pagination={{
                    position: ['bottomCenter'],
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} chapters`,
                    total: chapterData.total,
                    pageSize: chapterData.pageSize,
                    current: chapterData.page,
                    onChange: (page, pageSize) => {
                        setChapterData(prevState => ({ ...prevState, page: page, pageSize: pageSize }));
                    },
                }}
                onChange={handleTableChange}
            >
            </Table>

            <Modal
                title="Create New Chapter"
                visible={isCreateModalVisible}
                onCancel={handleCreateCancel}
                footer={null}
            >
                <Form
                    form={createForm}
                    layout="vertical"
                    onFinish={handleCreateSubmit}
                    initialValues={{ chargeType: 'Free', type: 'comic' }}
                >
                    <Form.Item
                        name="chapterTitle"
                        label="Chapter Title"
                        rules={[{ required: true, message: 'Please input chapter title!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="chargeType"
                        label="Charge Type"
                        rules={[{ required: true, message: 'Please select charge type!' }]}
                    >
                        <Select>
                            <Option value="Free">Free</Option>
                            <Option value="Ads">Ads</Option>
                            <Option value="Paid">Paid</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ type: 'number', min: 0, message: 'Price must be a non-negative number' }]}
                    >
                        <InputNumber style={{ width: '100%' }} placeholder="Optional price" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Create Chapter
                        </Button>
                        <Button style={{ marginInlineStart: 8 }} onClick={handleCreateCancel}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default ChapterManagement;