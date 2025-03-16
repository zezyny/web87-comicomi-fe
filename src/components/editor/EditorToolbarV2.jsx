import React from 'react';
import { useCurrentEditor } from '@tiptap/react'; // Assuming you are using tiptap/react
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
} from 'react-icons/fa';

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

import "./EditorToolbarV2.css"

const EditorToolBar = () => {
    const { editor } = useCurrentEditor();

    if (!editor) {
        return null;
    }

    const currentFontFamily = editor.getAttributes('textStyle').fontFamily || '';

    const handleFontFamilyChange = (event) => {
        const fontFamily = event.target.value;
        editor.chain().focus().setFontFamily(fontFamily).run();
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

    const currentHeadingLevelValue = HEADING_LEVELS.find(h => editor.isActive('heading', { level: h.level }))?.value || 'paragraph';


    return (
        <div className="editor-toolbar">
            <select
                value={currentFontFamily}
                onChange={handleFontFamilyChange}
                title="Font Family"
            >
                {FONT_FAMILIES.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                ))}
            </select>

            <span className="toolbar-separator"></span>

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
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                title="Italic"
            >
                <FaItalic />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'is-active' : ''}
                title="Underline"
            >
                <FaUnderline />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrikethrough().run()}
                disabled={!editor.can().chain().focus().toggleStrikethrough().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
                title="Strikethrough"
            >
                <FaStrikethrough />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={editor.isActive('code') ? 'is-active' : ''}
                title="Code"
            >
                <FaCode />
            </button>
            <button
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                disabled={!editor.can().chain().focus().unsetAllMarks().run()}
                title="Clear Formatting"
            >
                <FaEraser />
            </button>

            <span className="toolbar-separator"></span>

            <select
                value={currentHeadingLevelValue}
                onChange={handleHeadingLevelChange}
                title="Heading Level"
            >
                {HEADING_LEVELS.map(levelOption => (
                    <option key={levelOption.value} value={levelOption.value}>{levelOption.label}</option>
                ))}
            </select>


            <span className="toolbar-separator"></span>

            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                disabled={!editor.can().chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'is-active' : ''}
                title="Blockquote"
            >
                <FaQuoteLeft />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
                title="Bullet List"
            >
                <FaListUl />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'is-active' : ''}
                title="Ordered List"
            >
                <FaListOl />
            </button>

            <span className="toolbar-separator"></span>

            <button onClick={() => {
                const currentLink = editor.getAttributes('link').href;
                const url = prompt('Enter URL', currentLink || '');
                if (url !== null) {
                    editor.chain().focus().toggleLink({ href: url }).run();
                }
            }}
                disabled={!editor.can().chain().focus().toggleLink().run()}
                className={editor.isActive('link') ? 'is-active' : ''}
                title="Link"
            >
                <FaLink />
            </button>

            <span className="toolbar-separator"></span>

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
            }}
                disabled={!editor.can().chain().focus().setImage({ src: null }).run()}
                title="Image"
            >
                <FaImage />
            </button>

            <span className="toolbar-separator"></span>

            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                title="Undo"
            >
                <FaUndo />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                title="Redo"
            >
                <FaRedo />
            </button>


        </div>
    );
}

export default EditorToolBar;