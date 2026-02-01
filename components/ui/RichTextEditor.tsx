import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';
import clsx from 'clsx';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const buttons = [
        {
            icon: <Bold size={16} />,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
        },
        {
            icon: <Italic size={16} />,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
        },
        {
            icon: <List size={16} />,
            title: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
        },
        {
            icon: <ListOrdered size={16} />,
            title: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
        },
    ];

    return (
        <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
            {buttons.map((btn, index) => (
                <button
                    key={index}
                    onClick={(e) => { e.preventDefault(); btn.action(); }}
                    className={clsx(
                        "p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors",
                        btn.isActive ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm" : "text-gray-600 dark:text-gray-400"
                    )}
                    title={btn.title}
                >
                    {btn.icon}
                </button>
            ))}
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().undo().run(); }}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
                <Undo size={16} />
            </button>
            <button
                onClick={(e) => { e.preventDefault(); editor.chain().focus().redo().run(); }}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            >
                <Redo size={16} />
            </button>
        </div>
    );
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, className }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm dark:prose-invert max-w-none p-3 min-h-[150px] focus:outline-none'
            }
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Sync content if value changes externally (and editor content is different)
    React.useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    return (
        <div className={clsx("border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all", className)}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
};
