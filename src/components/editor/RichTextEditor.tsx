"use client";

import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor as BaseEditor,
  Autosave,
  Plugin,
  Essentials,
  Paragraph,
  LinkImage,
  Link,
  ImageBlock,
  ImageToolbar,
  BlockQuote,
  Bold,
  ImageUpload,
  AutoImage,
  Table,
  TableToolbar,
  Heading,
  ImageTextAlternative,
  ImageCaption,
  ImageStyle,
  Indent,
  IndentBlock,
  ImageInline,
  Italic,
  List,
  TodoList,
  Underline,
  ImageUtils,
  ImageEditing,
  Fullscreen,
  Autoformat,
  TextTransformation,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Highlight,
  Alignment,
  ButtonView,
  BalloonToolbar,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

import MediaModal from "../globals/MediaModal";

import {
  Modal,
  Row,
  Col,
  Card,
  Image as AntImage,
  Typography,
  Spin,
  Button,
  message,
} from "antd";
const { Text } = Typography;

import type { HeadingOption } from "@ckeditor/ckeditor5-heading";
import type { LinkDecoratorManualDefinition } from "@ckeditor/ckeditor5-link";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}

interface Media {
  id: number;
  url: string;
  alt?: string;
  original_name: string;
  type: string;
}

// ======= Custom Plugin =======
class CustomImagePlugin extends Plugin {
  init() {
    const editor = this.editor;
    const imageIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2 2h16v16H2V2zm2 2v12h12V4H4zm3 3l2.5 3L13 7l3 4H5l2-3z"/></svg>`;

    editor.ui.componentFactory.add("customImage", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Insert Image",
        icon: imageIcon,
        tooltip: true,
      });

      button.on("execute", () => {
        editor.fire("openMediaModal");
      });

      return button;
    });
  }
}
// ======= End Custom Plugin =======

// ======= ClassicEditor =======
const LICENSE_KEY = "GPL";

export class ClassicEditor extends BaseEditor {}
ClassicEditor.builtinPlugins = [
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Link,
  LinkImage,
  ImageBlock,
  ImageInline,
  ImageCaption,
  ImageTextAlternative,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  ImageUtils,
  ImageEditing,
  AutoImage,
  Table,
  TableToolbar,
  BlockQuote,
  List,
  TodoList,
  Heading,
  FontFamily,
  FontSize,
  FontColor,
  FontBackgroundColor,
  Highlight,
  Alignment,
  Indent,
  IndentBlock,
  Fullscreen,
  Autoformat,
  TextTransformation,
  BalloonToolbar,
  Autosave,
  CustomImagePlugin,
];
// ========================================

export default function RichTextEditor({
  value,
  onChange,
  minHeight = 400,
}: RichTextEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);

  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  const headingOptions: HeadingOption[] = [
    { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
    {
      model: "heading1",
      view: "h1",
      title: "Heading 1",
      class: "ck-heading_heading1",
    },
    {
      model: "heading2",
      view: "h2",
      title: "Heading 2",
      class: "ck-heading_heading2",
    },
    {
      model: "heading3",
      view: "h3",
      title: "Heading 3",
      class: "ck-heading_heading3",
    },
    {
      model: "heading4",
      view: "h4",
      title: "Heading 4",
      class: "ck-heading_heading4",
    },
    {
      model: "heading5",
      view: "h5",
      title: "Heading 5",
      class: "ck-heading_heading5",
    },
    {
      model: "heading6",
      view: "h6",
      title: "Heading 6",
      class: "ck-heading_heading6",
    },
  ];

  const linkDecorators: Record<string, LinkDecoratorManualDefinition> = {
    toggleDownloadable: {
      mode: "manual",
      label: "Downloadable",
      attributes: { download: "file" },
    },
  };

  useEffect(() => {
    if (editorContainerRef.current) {
      editorContainerRef.current.classList.add(
        "editor-container",
        "editor-container_classic-editor",
        "editor-container_include-block-toolbar",
        "editor-container_include-fullscreen"
      );
    }
  }, []);

  const insertImageToEditor = (item: Media) => {
    const editor = editorRef.current;
    if (!editor) return;
  
    editor.model.change((writer: any) => {
      // Gunakan imageBlock untuk block image (default)
      const imageElement = writer.createElement('imageBlock', {
        src: process.env.NEXT_PUBLIC_API_BASE + item.url,
        alt: item.alt || ''
      });
  
      // Insert image di posisi selection saat ini
      editor.model.insertContent(
        imageElement,
        editor.model.document.selection
      );
  
      // Optional: pindahkan selection ke setelah image
      writer.setSelection(imageElement, 'after');
    });
  };
  

  return (
    <div ref={editorContainerRef}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onReady={(editor) => {
          editorRef.current = editor;

          editor.on("openMediaModal", () => setMediaModalOpen(true));
        }}
        onChange={(_, editor) => onChange(editor.getData())}
        config={{
          toolbar: {
            items: [
              "undo",
              "redo",
              "|",
              "fullscreen",
              "|",
              "heading",
              "|",
              "fontSize",
              "fontFamily",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "bold",
              "italic",
              "underline",
              "highlight",
              "|",
              "link",
              "insertTable",
              "blockQuote",
              "|",
              "alignment",
              "|",
              "customImage",
              "|",
              "bulletedList",
              "numberedList",
              "todoList",
              "outdent",
              "indent",
            ],
            shouldNotGroupWhenFull: true,
          },
          heading: { options: headingOptions },
          fontFamily: { supportAllValues: true },
          fontSize: {
            options: [10, 12, 14, "default", 18, 20, 22],
            supportAllValues: true,
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
            decorators: linkDecorators,
          },
          placeholder: "Type or paste your content here!",
          licenseKey: LICENSE_KEY,
        }}
      />

      {/* Media Modal */}
      <MediaModal
        open={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={insertImageToEditor}
      />

      <style jsx>{`
        .ck-editor__editable {
          min-height: ${minHeight}px;
        }
      `}</style>
    </div>
  );
}
