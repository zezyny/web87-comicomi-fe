import React from 'react';
import { FaBold, FaItalic, FaUnderline, FaCode, FaHeading, FaQuoteLeft, FaLink, FaImage, FaListUl, FaListOl } from 'react-icons/fa'; // Added list icons
import './Toolbar.css';

const Toolbar = ({ editor }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="editor-toolbar">
            <button
                onClick={() => editor.chain.focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
                title="Bold" // Added title for accessibility
            >
                <FaBold />
            </button>
            <button
                onClick={() => editor.chain.focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                title="Italic" // Added title for accessibility
            >
                <FaItalic />
            </button>
            <button
                onClick={() => editor.chain.focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? 'is-active' : ''}
                title="Underline" // Added title for accessibility
            >
                <FaUnderline />
            </button>
            <button
                onClick={() => editor.chain.focus().toggleCode().run()}
                className={editor.isActive('code') ? 'is-active' : ''}
                title="Code" // Added title for accessibility
            >
                <FaCode />
            </button>
            <button onClick={() => editor.chain.focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''} title="Heading 1">
                <FaHeading level={1}/>
                <span style={{ fontSize: '0.8em', marginLeft: '2px' }}>1</span>
            </button>
            <button onClick={() => editor.chain.focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''} title="Heading 2">
                <FaHeading level={2}/>
                <span style={{ fontSize: '0.8em', marginLeft: '2px' }}>2</span>
            </button>
            <button onClick={() => editor.chain.focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''} title="Blockquote">
                <FaQuoteLeft />
            </button>
            <button onClick={() => editor.chain.focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''} title="Bullet List">
                <FaListUl /> {/* Bullet List Icon */}
            </button>
            <button onClick={() => editor.chain.focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''} title="Ordered List">
                <FaListOl /> {/* Ordered List Icon */}
            </button>
            <button onClick={() => { /* Implement Link functionality here, maybe a modal */ alert('Link feature to be implemented'); }} title="Link">
                <FaLink />
            </button>
            <button onClick={() => { /* Implement Image Upload functionality here */ alert('Image Upload feature to be implemented here'); }} title="Image">
                <FaImage />
            </button>
            {/* Add more buttons for other formatting options */}
        </div>
    );
};

export default Toolbar;