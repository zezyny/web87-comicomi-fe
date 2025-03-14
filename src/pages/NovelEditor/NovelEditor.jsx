import React, { useState, useCallback, useRef, useEffect } from 'react';
import { EditorContent, EditorProvider, useCurrentEditor, Mark } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Header from '../../components/commons/header';
import ContextualToolbar from '../../components/editor/ContextualToolbar';
import "./NovelEditor.css";
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaCode,
    FaHeading,
    FaQuoteLeft,
    FaListUl,
    FaListOl,
    FaLink,
    FaImage,
    FaUndo,
    FaRedo,
    FaStrikethrough,
    FaParagraph,
    FaAlignLeft,
    FaAlignCenter,
    FaAlignRight,
    FaAlignJustify,
    FaEraser,
    FaMinus,
    FaPlus
} from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import storyApi from '../../api/storyApi';
import chapterApi from '../dashboard/chapterapi';
import { permissionControl } from '../../security/permissionController';
import { useCookies } from 'react-cookie';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import { Extension } from '@tiptap/react';

export const FontSize = TextStyle.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fontSize: {
                default: null,
                parseHTML: (element) => element.style.fontSize.replace('px', ''),
                renderHTML: (attributes) => {
                    if (!attributes['fontSize']) {
                        return {};
                    }
                    return {
                        style: `font-size: ${attributes['fontSize']}px`
                    };
                }
            }
        };
    },

    addCommands() {
        return {
            ...this.parent?.(),
            setFontSize:
                (fontSize) =>
                ({ commands }) => {
                    return commands.setMark(this.name, { fontSize: fontSize });
                },
            unsetFontSize:
                () =>
                ({ chain }) => {
                    return chain()
                        .setMark(this.name, { fontSize: null })
                        .removeEmptyTextStyle()
                        .run();
                }
        };
    }
});
const EditorToolBar = () => {
    const FONT_FAMILIES = [
        { value: '', label: 'Default Font' },
        { value: 'Arial, sans-serif', label: 'Arial' },
        { value: '"Times New Roman", serif', label: 'Times New Roman' },
        { value: '"Courier New", monospace', label: 'Courier New' },
        { value: 'Georgia, serif', label: 'Georgia' },
        { value: 'Verdana, sans-serif', label: 'Verdana' },
    ];

    const HEADING_LEVELS = [
        { value: 'paragraph', label: 'Paragraph', level: null },
        { value: 'heading1', label: 'Heading 1', level: 1 },
        { value: 'heading2', label: 'Heading 2', level: 2 },
        { value: 'heading3', label: 'Heading 3', level: 3 },
        { value: 'heading4', label: 'Heading 4', level: 4 },
        { value: 'heading5', label: 'Heading 5', level: 5 },
        { value: 'heading6', label: 'Heading 6', level: 6 },
    ];

    const { editor } = useCurrentEditor();
    const [fontSizeInput, setFontSizeInput] = useState('18');

    useEffect(() => {
        if (editor) {
            const currentFontSize = editor.getAttributes('fontSizeMark').fontSize || '';
            setFontSizeInput(currentFontSize ? currentFontSize.replace('px', '') : '');
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    const handleFontFamilyChange = (event) => {
        const fontFamily = event.target.value;
        if (fontFamily) {
            editor.chain().focus().setFontFamily(fontFamily).run();
        } else {
            editor.chain().focus().unsetFontFamily().run();
        }
    };


    const handleHeadingLevelChange = (event) => {
        const levelValue = event.target.value;
        if (levelValue === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        } else {
            const level = HEADING_LEVELS.find(h => h.value === levelValue)?.level;
            if (level) {
                editor.chain().focus().toggleHeading({ level }).run();
            }
        }
    };

    const handleFontSizeIncrease = () => {
        const currentSize = parseInt(fontSizeInput, 10) || 16;
        const newSize = currentSize + 2;
        setFontSizeInput(String(newSize));
        editor.chain().focus().setFontSize(`${newSize}`).run();
    };

    const handleFontSizeDecrease = () => {
        const currentSize = parseInt(fontSizeInput, 10) || 16;
        const newSize = Math.max(8, currentSize - 2);
        setFontSizeInput(String(newSize));
        editor.chain().focus().setFontSize(`${newSize}`).run();
    };

    const handleFontSizeInputChange = (event) => {
        const inputValue = event.target.value;
        setFontSizeInput(inputValue);
        const sizeValue = parseInt(inputValue, 10);
        if (!isNaN(sizeValue) && sizeValue > 0) {
            editor.chain().focus().setFontSizeMark(`${sizeValue}px`).run();
        } else if (inputValue === '') {
            editor.chain().focus().unsetFontSizeMark().run();
        }
    };


    const currentFontFamily = editor.getAttributes('fontFamily').fontFamily || '';
    const currentHeadingLevelValue = HEADING_LEVELS.find(h => editor.isActive('heading', { level: h.level }))?.value || 'paragraph';


    return (
        <div className="editor-toolbar">
            <select value={currentFontFamily || ''} onChange={handleFontFamilyChange} title="Font Family">
                {FONT_FAMILIES.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                ))}
            </select>

            <span className="toolbar-separator"></span>

            <div className="font-size-controls">
                <button onClick={handleFontSizeDecrease} title="Decrease Font Size">
                    <FaMinus />
                </button>
                <input
                    type="number"
                    className="font-size-input"
                    value={Number(fontSizeInput)}
                    onChange={handleFontSizeInputChange}
                    title="Font Size in pixels"
                    placeholder="Size"
                />
                <button onClick={handleFontSizeIncrease} title="Increase Font Size">
                    <FaPlus />
                </button>
            </div>

            <span className="toolbar-separator"></span>

            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().toggleBold()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                title="Bold"
            >
                <FaBold />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().toggleItalic()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                title="Italic"
            >
                <FaItalic />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().toggleStrike()}
                className={editor.isActive('strike') ? 'is-active' : ''}
                title="Strikethrough"
            >
                <FaStrikethrough />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().toggleCode()}
                className={editor.isActive('code') ? 'is-active' : ''}
                title="Code"
            >
                <FaCode />
            </button>
            <button
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                disabled={!editor.can().unsetAllMarks()}
                title="Clear Formatting"
            >
                <FaEraser />
            </button>

            <span className="toolbar-separator"></span>

            <select value={currentHeadingLevelValue} onChange={handleHeadingLevelChange} title="Heading Level">
                {HEADING_LEVELS.map(levelOption => (
                    <option key={levelOption.value} value={levelOption.value}>{levelOption.label}</option>
                ))}
            </select>

            <span className="toolbar-separator"></span>

            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().toggleBulletList()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
                title="Bullet List"
            >
                <FaListUl />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={!editor.can().toggleOrderedList()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
                title="Ordered List"
            >
                <FaListOl />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                disabled={!editor.can().toggleBlockquote()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
                title="Blockquote"
            >
                <FaQuoteLeft />
            </button>

            <span className="toolbar-separator"></span>

            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                title="Align Left"
            >
                <FaAlignLeft />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                title="Align Center"
            >
                <FaAlignCenter />
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                title="Align Right"
            >
                <FaAlignRight />
            </button>
            <button>
                <FaAlignJustify
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
                    title="Justify"
                />
            </button>

            <span className="toolbar-separator"></span>

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                title="Undo"
            >
                <FaUndo />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                title="Redo"
            >
                <FaRedo />
            </button>
        </div>
    );
};


function NovelEditor() {
    const [editor, setEditor] = useState(null);
    const [editorContentHTML, setEditorContentHTML] = useState(null);
    const { chapterId } = useParams();
    const [storyData, setStoryData] = useState({});
    const [chapterData, setChapterData] = useState({});
    const [cookies] = useCookies(['accessToken']);
    const [needSave, setNeedSave] = useState(false);
    const [saveText, setSavedText] = useState('Save');
    const [publishText, setPublishText] = useState('Publish');
    const navigate = useNavigate();


    const loadMetadata = useCallback(async () => {
        try {
            const _chapterData = await chapterApi.getChapterDetail(chapterId);
            console.log(_chapterData);
            const storyData = await storyApi.getStory(_chapterData.data.storyId);
            console.log(storyData);
            setStoryData(storyData);
            setChapterData(_chapterData.data);
        } catch (error) {
            console.error("Error loading metadata:", error);
        }
    }, [chapterId]);

    const loadEditorContent = useCallback(async () => {
        try {
            const currentContent = await chapterApi.loadPrivateContent(chapterId, cookies.accessToken);
            if (currentContent.status === 200) {
                setEditorContentHTML(currentContent.data.content);
            } else {
                console.log("No content to load or error loading content.");
                setEditorContentHTML('');
            }
        } catch (error) {
            console.error("Error loading editor content:", error);
            setEditorContentHTML('');
        }
    }, [chapterId, cookies.accessToken]);

    const auth = useCallback(async () => {
        try {
            const isPermissionValid = await permissionControl.checkAcessToEditStory(cookies.accessToken, chapterId);
            if (!isPermissionValid) {
                console.log("Permission error.");
                alert("Permission error.");
                permissionControl.kick(navigate);
            } else {
                console.log("Permission to access is confirmed.");
            }
        } catch (error) {
            console.error("Authentication error:", error);
            alert("Authentication error.");
            permissionControl.kick(navigate);
        }
    }, [chapterId, cookies.accessToken, navigate]);

    useEffect(() => {
        auth();
        loadMetadata();
        loadEditorContent();
    }, [auth, loadMetadata, loadEditorContent]);


    const extensions = [
        StarterKit,
        Link.configure({
            openOnClick: false,
            autolink: false,
        }),
        Image,
        FontFamily,
        TextStyle,
        FontSize,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
    ];

    const handleEditorUpdate = useCallback(({ editor }) => {
        setEditorContentHTML(editor.getHTML());
        if (!editor) {
            setEditor(editor);
        }
        console.log("Updated content");
        setNeedSave(true);
    }, [setEditor, setEditorContentHTML, setNeedSave]);

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

    const save = useCallback(async () => {
        setSavedText('Saving...');
        setNeedSave(false);
        try {
            if (editorContentHTML != null) {
                const response = await chapterApi.saveChapterNovel(chapterId, editorContentHTML, cookies.accessToken);
                if (response.status !== 200) {
                    setSavedText('Error!');
                } else {
                    setSavedText('Saved!');
                }
            }

        } catch (error) {
            console.error("Error saving chapter:", error);
            setSavedText('Error!');
        } finally {
            setTimeout(() => { setSavedText('Save'); }, 3000);
            await loadMetadata();
        }
    }, [chapterId, editor, cookies.accessToken, loadMetadata, setSavedText, setNeedSave, editorContentHTML]);

    const publish = useCallback(async () => {
        if (needSave) {
            const _save = window.confirm("Changes not saved, do you want to save it first?");
            if (_save) {
                await save();
            }
        }
        setPublishText('Publishing...');
        try {
            const response = await chapterApi.publishChapter(chapterId, cookies.accessToken);
            if (response.status !== 200) {
                setPublishText('Error!');
            } else {
                setPublishText('Published!');
            }
        } catch (error) {
            console.error("Error publishing chapter:", error);
            setPublishText('Error!');
        } finally {
            setTimeout(() => { setPublishText('Publish'); }, 3000);
            await loadMetadata();
        }
    }, [chapterId, cookies.accessToken, loadMetadata, needSave, save, setPublishText]);


    return (
        <div className="NovelEditor">
            <Header pageTitle="Novel Editor (Basic)" />
            <ContextualToolbar />
            <div className="DisplayGrid">
                <div className="leftPanel">
                    <h3>AI Support (Deprecated)</h3>
                    <textarea
                        placeholder="Enter prompt for AI assistance..."
                        style={{ width: '100%', height: '150px', marginBottom: '10px' }}
                    />
                    <button>Get AI Suggestions</button>
                </div>

                <div className="Editor">
                    <div className='ScrollAbleEditor'>
                        {
                            editorContentHTML != null && (
                                <EditorProvider
                                    extensions={extensions}
                                    onUpdate={handleEditorUpdate}
                                    editorProps={{ handleKeyDown }}
                                    onInit={({ editor: instance }) => { setEditor(instance); console.log("Loaded editor") }}
                                    slotBefore={
                                        <EditorToolBar />
                                    }
                                    content={editorContentHTML}
                                >
                                    <EditorContent className="ProseMirror-content" />
                                </EditorProvider>
                            )
                        }

                    </div>
                </div>
                <div className="rightPanel">
                    <h3>Metadata</h3>
                    <div className="novelStatusZone">
                        <p>Story name: {storyData.title ? storyData.title : "Loading..."}</p>
                        <p>Chapter name: {chapterData.chapterTitle ? chapterData.chapterTitle : "Loading..."}</p>
                        <p>Chapter index: {chapterData.chapterNumber ? chapterData.chapterNumber : "Loading..."}</p>
                        <p>Created at: {chapterData.createdAt ? new Date(chapterData.createdAt).toLocaleString() : "Loading..."}</p>
                        <p>Published: {chapterData.released ? "Yes" : "No"}</p>
                    </div>
                    <div className="button2grid">
                        <button onClick={save} disabled={!needSave}>
                            {saveText}
                        </button>
                        <button onClick={publish}>
                            {publishText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NovelEditor;