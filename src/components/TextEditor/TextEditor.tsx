import { useRef, useEffect } from 'react';
import { Icon } from '../Icon';
import type { FormatType } from '../../data/artifactData';

interface TextEditorProps {
  content: string;
  format: FormatType;
  onChange: (content: string) => void;
}

export function TextEditor({ content, format, onChange }: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isUserEditingRef = useRef(false);

  // Initialize content when component mounts or when content changes externally (not from user input)
  useEffect(() => {
    if (editorRef.current && !isUserEditingRef.current) {
      const currentText = editorRef.current.innerText;
      if (currentText !== content) {
        editorRef.current.innerText = content;
      }
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      isUserEditingRef.current = true;
      onChange(editorRef.current.innerText);
      // Reset the flag after a brief delay to allow external updates
      setTimeout(() => {
        isUserEditingRef.current = false;
      }, 100);
    }
  };

  const handleFocus = () => {
    isUserEditingRef.current = true;
  };

  const handleBlur = () => {
    isUserEditingRef.current = false;
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  return (
    <div
      className="flex-1 flex flex-col"
      style={{
        backgroundColor: 'var(--surface-neutral-white)',
      }}
    >
      {/* Formatting toolbar */}
      <div
        className="h-12 px-8 flex items-center gap-1 shrink-0"
        style={{
          borderBottom: '1px solid var(--border-neutral-weak)',
        }}
      >
        <button
          onClick={() => execCommand('bold')}
          className="h-8 w-8 rounded flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] transition-colors"
          style={{ color: 'var(--text-neutral-strong)' }}
          title="Bold"
        >
          <Icon name="bold" size={14} />
        </button>
        <button
          onClick={() => execCommand('italic')}
          className="h-8 w-8 rounded flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] transition-colors"
          style={{ color: 'var(--text-neutral-strong)' }}
          title="Italic"
        >
          <Icon name="italic" size={14} />
        </button>
        <button
          onClick={() => execCommand('underline')}
          className="h-8 w-8 rounded flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] transition-colors"
          style={{ color: 'var(--text-neutral-strong)' }}
          title="Underline"
        >
          <Icon name="underline" size={14} />
        </button>

        <div
          className="w-px h-6 mx-2"
          style={{ backgroundColor: 'var(--border-neutral-weak)' }}
        />

        <button
          onClick={() => execCommand('formatBlock', '<h1>')}
          className="h-8 px-2 rounded flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] transition-colors text-[13px] font-medium"
          style={{ color: 'var(--text-neutral-strong)' }}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="h-8 px-2 rounded flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] transition-colors text-[13px] font-medium"
          style={{ color: 'var(--text-neutral-strong)' }}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="h-8 px-2 rounded flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] transition-colors text-[13px] font-medium"
          style={{ color: 'var(--text-neutral-strong)' }}
          title="Heading 3"
        >
          H3
        </button>
        <button
          onClick={() => execCommand('formatBlock', '<p>')}
          className="h-8 px-2 rounded flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] transition-colors text-[13px] font-medium"
          style={{ color: 'var(--text-neutral-strong)' }}
          title="Paragraph"
        >
          P
        </button>

        <div
          className="w-px h-6 mx-2"
          style={{ backgroundColor: 'var(--border-neutral-weak)' }}
        />

        <button
          onClick={() => execCommand('insertUnorderedList')}
          className="h-8 w-8 rounded flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] transition-colors"
          style={{ color: 'var(--text-neutral-strong)' }}
          title="Bullet List"
        >
          <Icon name="list-ul" size={14} />
        </button>
        <button
          onClick={() => execCommand('insertOrderedList')}
          className="h-8 w-8 rounded flex items-center justify-center hover:bg-[var(--surface-neutral-x-weak)] transition-colors"
          style={{ color: 'var(--text-neutral-strong)' }}
          title="Numbered List"
        >
          <Icon name="list-ol" size={14} />
        </button>
      </div>

      {/* Editable content area */}
      <div className="flex-1 overflow-auto px-8 py-6">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="min-h-full outline-none text-editor-content"
          style={{
            color: 'var(--text-neutral-strong)',
            fontSize: '15px',
            lineHeight: '1.6',
            fontFamily: 'Inter, system-ui, sans-serif',
            whiteSpace: 'pre-wrap',
          }}
        />
      </div>
    </div>
  );
}

export default TextEditor;
