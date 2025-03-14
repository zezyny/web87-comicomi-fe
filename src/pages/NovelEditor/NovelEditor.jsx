import React, { useState, useCallback, useRef, useEffect } from 'react';
import { EditorContent, EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Header from '../../components/commons/header';
import ContextualToolbar from '../../components/editor/ContextualToolbar';
import "./NovelEditor.css";
import { FaBold, FaItalic, FaUnderline, FaCode, FaHeading, FaQuoteLeft, FaLink, FaImage, FaListUl, FaListOl } from 'react-icons/fa';
import {useNavigate, useParams } from 'react-router-dom'
import storyApi from '../../api/storyApi';
import chapterApi from '../dashboard/chapterapi';

const EditorToolBar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
        return null;
    }

    return (
        <div className="editor-toolbar">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                title="Bold"
            >
                <FaBold />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                // disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                title="Italic"
            >
                <FaItalic />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                // disabled={!editor.can().chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'is-active' : ''}
                title="Underline"
            >
                <FaUnderline />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                // disabled={!editor.can().chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'is-active' : ''}
                title="Code"
            >
                <FaCode />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                // disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                title="Heading 1"
            >
                <FaHeading />
                <span style={{ fontSize: '0.8em', marginLeft: '2px' }}>1</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                // disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                title="Heading 2"
            >
                <FaHeading />
                <span style={{ fontSize: '0.8em', marginLeft: '2px' }}>2</span>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                // disabled={!editor.can().chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
                title="Blockquote"
            >
                <FaQuoteLeft />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                // disabled={!editor.can().chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
                title="Bullet List"
            >
                <FaListUl />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                // disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
                title="Ordered List"
            >
                <FaListOl />
            </button>
            {/* <button onClick={() => {
                const url = prompt('Enter URL');
                if (url) {
                    editor.chain().focus().toggleLink({ href: url }).run();
                }
            }} title="Link">
                <FaLink />
            </button> */}
            <button onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async (event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (readerEvent) => {
                            const imageUrl = readerEvent.target?.result;
                            if (imageUrl) {
                                editor.chain().focus().setImage({ src: imageUrl }).run();
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            }} title="Image">
                <FaImage />
            </button>
        </div>
    );
}

function NovelEditor() {
    const [editor, setEditor] = useState(null);
    const [editorContentHTML, setEditorContentHTML] = useState('');
    const {chapterId} = useParams()

    const [storyData, setStoryData] = useState({})
    const [chapterData, setChapterData] = useState({})

    const loadMetadata = async () => {
        
        let _chapterData = await chapterApi.getChapterDetail(chapterId)
        console.log(_chapterData)
        let StoryData = await storyApi.getStory(_chapterData.data.storyId)
        console.log(StoryData)
        setStoryData(StoryData)
        setChapterData(_chapterData.data)
    } 
    
    useEffect(()=>{
        loadMetadata()
    },[])
    
    console.log(`Editing: ${chapterId}`)

    const extensions = [
        StarterKit,
        Link.configure({
            openOnClick: false,
            autolink: false,
        }),
        Image,
    ];

    const handleEditorUpdate = useCallback(({ editor }) => {
        setEditorContentHTML(editor.getHTML());
    }, []);

    const handleKeyDown = useCallback((view, event) => {
        if (!view.state.selection.empty) return false;
        if (event.key === 'Tab') {
            view.dispatch(view.state.tr.insertText('    '));
            return true;
        }
        return false;
    }, []);

    const getHeadings = useCallback(() => {
        if (!editor) return [];
        const headings = [];
        const doc = editor.view.dom;
        doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
            headings.push({
                id: heading.id || heading.textContent.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
                text: heading.textContent,
            });
        });
        return headings;
    }, [editor]);

    const handleInternalLink = useCallback(() => {
        const headings = getHeadings();
        if (!headings.length) {
            alert("No headings found in the document to link to.");
            return;
        }

        const selectedHeadingId = prompt(
            "Enter the ID of the heading to link to:\n" +
            headings.map(h => `${h.text} (ID: ${h.id})`).join('\n')
        );

        if (selectedHeadingId) {
            editor.chain().focus().toggleLink({ href: `#${selectedHeadingId}` }).run();
        }
    }, [editor, getHeadings]);

    const handleImageUpload = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const file = event.target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (readerEvent) => {
                    const imageUrl = readerEvent.target?.result;
                    if (imageUrl) {
                        editor.chain().focus().setImage({ src: imageUrl }).run();
                    }
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }, [editor]);

    return (

        <div className="NovelEditor">
            <Header pageTitle="Novel Editor (Basic)" />

            <ContextualToolbar editor={editor} />

            <div className="DisplayGrid">
                <div className="leftPanel">
                    <h3>AI Support (Not Available)</h3>
                    <textarea
                        placeholder="Enter prompt for AI assistance..."
                        style={{ width: '100%', height: '150px', marginBottom: '10px' }}
                    />
                    <button>Get AI Suggestions</button>
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={handleInternalLink}>Insert Internal Link</button>
                        <button onClick={handleImageUpload} style={{ marginTop: '10px' }}>Upload Image</button>
                    </div>
                </div>

                <div className="Editor">
                    <div className='ScrollAbleEditor'>
                        <EditorProvider
                            extensions={extensions}
                            onUpdate={handleEditorUpdate}
                            editorProps={{ handleKeyDown }}
                            onInit={({ editor }) => setEditor(editor)}
                            slotBefore={
                                <EditorToolBar />
                            }
                            
                        >

                        </EditorProvider>
                    </div>


                </div>
                <div className="rightPanel">
                    <h3>Metadata</h3>
                    <div className="novelStatusZone">
                        <p>Story name: {storyData.title?storyData.title:"Loading..."}</p>
                        <p>Chapter name: {chapterData.chapterTitle?chapterData.chapterTitle:"Loading..."}</p>
                        <p>Chapter index: {chapterData.chapterNumber?chapterData.chapterNumber:"Loading..."}</p>
                        <p>Created at: Processing...</p>
                        <p>Published: {chapterData.released ? "Yes": "No"}</p>
                        
                    </div>
                    <div className="button2grid">
                        <button>
                            Save
                        </button>
                        <button>
                            Publish
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default NovelEditor;