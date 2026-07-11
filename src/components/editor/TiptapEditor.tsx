// src/components/editor/TiptapEditor.tsx
// 功能：Tiptap 富文本编辑器组件 — 支持格式化、图片、链接、代码块、任务列表
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TiptapImage from '@tiptap/extension-image';
import TiptapLink from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code2,
  Link2,
  Image,
  Undo2,
  Redo2,
  Minus,
} from 'lucide-react';

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`rounded-[6px] p-1.5 transition-colors ${
        isActive
          ? 'bg-gray-300 text-text-primary'
          : 'text-text-secondary hover:bg-gray-200 hover:text-text-primary'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Toolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  const iconSize = 16;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const e = editor as any;

  return (
    <div className="flex flex-wrap gap-0.5 border-b border-border p-1">
      <ToolbarButton
        onClick={() => e.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={e.isActive('heading', { level: 1 })}
        title="H1"
      >
        <Heading1 size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => e.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={e.isActive('heading', { level: 2 })}
        title="H2"
      >
        <Heading2 size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => e.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={e.isActive('heading', { level: 3 })}
        title="H3"
      >
        <Heading3 size={iconSize} />
      </ToolbarButton>

      <div className="mx-1 w-px bg-border" />

      <ToolbarButton
        onClick={() => e.chain().focus().toggleBold().run()}
        isActive={e.isActive('bold')}
        title="Bold"
      >
        <Bold size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => e.chain().focus().toggleItalic().run()}
        isActive={e.isActive('italic')}
        title="Italic"
      >
        <Italic size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => e.chain().focus().toggleStrike().run()}
        isActive={e.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough size={iconSize} />
      </ToolbarButton>

      <div className="mx-1 w-px bg-border" />

      <ToolbarButton
        onClick={() => e.chain().focus().toggleBulletList().run()}
        isActive={e.isActive('bulletList')}
        title="Bullet List"
      >
        <List size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => e.chain().focus().toggleOrderedList().run()}
        isActive={e.isActive('orderedList')}
        title="Ordered List"
      >
        <ListOrdered size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => e.chain().focus().toggleTaskList().run()}
        isActive={e.isActive('taskList')}
        title="Task List"
      >
        <ListChecks size={iconSize} />
      </ToolbarButton>

      <div className="mx-1 w-px bg-border" />

      <ToolbarButton
        onClick={() => e.chain().focus().toggleBlockquote().run()}
        isActive={e.isActive('blockquote')}
        title="Blockquote"
      >
        <Quote size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => e.chain().focus().toggleCodeBlock().run()}
        isActive={e.isActive('codeBlock')}
        title="Code Block"
      >
        <Code2 size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => e.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus size={iconSize} />
      </ToolbarButton>

      <div className="mx-1 w-px bg-border" />

      <ToolbarButton
        onClick={() => {
          const url = window.prompt('Enter image URL:');
          if (url) {
            e.chain().focus().setImage({ src: url }).run();
          }
        }}
        title="Insert Image"
      >
        <Image size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => {
          const url = window.prompt('Enter link URL:');
          if (url) {
            e.chain().focus().setLink({ href: url }).run();
          }
        }}
        isActive={e.isActive('link')}
        title="Insert Link"
      >
        <Link2 size={iconSize} />
      </ToolbarButton>

      <div className="mx-1 w-px bg-border" />

      <ToolbarButton
        onClick={() => e.chain().focus().undo().run()}
        disabled={!e.can().undo()}
        title="Undo"
      >
        <Undo2 size={iconSize} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => e.chain().focus().redo().run()}
        disabled={!e.can().redo()}
        title="Redo"
      >
        <Redo2 size={iconSize} />
      </ToolbarButton>
    </div>
  );
}

export default function TiptapEditor({
  content = '',
  onChange,
  placeholder = '开始撰写文章内容...',
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }) as never,
      Placeholder.configure({ placeholder }),
      TiptapImage.configure({
        HTMLAttributes: { class: 'max-w-full rounded-[6px]' },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-[#0070f3] underline' },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[400px] p-4 focus:outline-none text-text-primary tiptap',
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const handler = (e: CustomEvent<{ html: string }>) => {
      if (e.detail.html !== editor.getHTML()) {
        editor.commands.setContent(e.detail.html);
      }
    };
    window.addEventListener('tiptap-set-content', handler as EventListener);
    return () => window.removeEventListener('tiptap-set-content', handler as EventListener);
  }, [editor]);

  return (
    <div className="rounded-[12px] border border-border bg-background overflow-hidden">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
