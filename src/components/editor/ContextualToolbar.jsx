import React, { useState, useEffect, useRef } from 'react';
import { FaBold, FaItalic, FaLink } from 'react-icons/fa';
import {useCurrentEditor} from '@tiptap/react'
import './ContextualToolbar.css';

const ContextualToolbar = () => {
    const { editor } = useCurrentEditor();
    const [position, setPosition] = useState(null);
    const toolbarRef = useRef(null);

    useEffect(() => {
        if (!editor) return;

        const handleSelectionChange = () => {
            if (editor.isDestroyed) return;
            console.log("handleSelectionChange called");
            const { state } = editor.view;
            const { from, to, empty } = state.selection;
            console.log("Selection:", { from, to, empty });

            if (empty || from === to) {
                setPosition(null);
                console.log("setPosition(null) - empty selection");
                return;
            }

            const startCoords = editor.view.coordsAtPos(from);
            const endCoords = editor.view.coordsAtPos(to);
            console.log("Coords:", { startCoords, endCoords });

            const toolbarHeight = toolbarRef.current?.offsetHeight || 0;
            const top = startCoords.top - toolbarHeight - 5;
            const left = (startCoords.left + endCoords.right) / 2;
            console.log("Position:", { top, left });

            setPosition({ top, left });
            console.log("setPosition({top, left}) - position set");
        };

        editor.on('selectionUpdate', handleSelectionChange);
        editor.on('blur', () => {
            setPosition(null);
            console.log("setPosition(null) - blur event");
        });

        return () => {
            editor.off('selectionUpdate', handleSelectionChange);
            editor.off('blur', () => setPosition(null));
        };
    }, [editor]);

    if (!editor || !position) {
        console.log("Toolbar not rendered - editor:", !!editor, "position:", position);
        return null;
    }

    return (
        <div
            ref={toolbarRef}
            className="contextual-toolbar"
            style={{
                top: `${position?.top}px`,
                left: `${position?.left}px`,
                transform: 'translateX(-50%)',
            }}
        >
            <button
                onClick={(e) => {e.preventDefault();editor.chain().focus().toggleBold().run(); console.log("bold updated from contextual toolbar.")}}
                className={editor.isActive('bold') ? 'is-active' : ''}
                title="Bold"
            >
                <FaBold />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
                title="Italic"
            >
                <FaItalic />
            </button>
            <button onClick={() => { alert('Link feature in contextual toolbar to be implemented'); }} title="Link">
                <FaLink />
            </button>
        </div>
    );
};

export default ContextualToolbar;