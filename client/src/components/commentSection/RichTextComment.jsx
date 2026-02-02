// components/commentSection/RichTextComment.jsx
import { useState, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { AttachmentIcon, ClearIcon } from '../../utils/svgIcons';

const RichTextComment = ({ onSubmit, placeholder = "Add a comment...", submitLabel = "Comment" }) => {
  const [value, setValue] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [useRichText, setUseRichText] = useState(false);
  const fileInputRef = useRef(null);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // const handleSubmit = () => {
  //   const text = useRichText ? value : value.replace(/<[^>]*>/g, '');
  //   if (!text.trim() && attachments.length === 0) return;
    
  //   onSubmit(value, attachments);
  //   setValue('');
  //   setAttachments([]);
  // };
 const handleSubmit = () => {
    console.log('🚀 RichTextComment submitting:', { 
      value, 
      trimmed: value.trim(), 
      attachmentsCount: attachments.length,
      useRichText 
    });

    // ✅ Check if there's content
    if (!value.trim() && attachments.length === 0) {
      console.log('❌ Nothing to submit');
      return;
    }

    // ✅ Always pass the value as-is (rich text or plain text)
    onSubmit(value, attachments);

    // Clear form
    setValue('');
    setAttachments([]);
  };

  return (
    <div style={{ marginBottom: '15px', position: 'sticky', top: '-16px', background: '#fff', zIndex: 1 }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={useRichText}
            onChange={(e) => setUseRichText(e.target.checked)}
          />
          Rich Text Editor
        </label>
      </div>

      {useRichText ? (
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          modules={modules}
          placeholder={placeholder}
          style={{ marginBottom: '10px' }}
        />
      ) : (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            marginBottom: '10px',
            fontFamily: 'inherit'
          }}
        />
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          {attachments.map((file, index) => (
            <div key={index} style={{ position: 'relative' }}>
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                />
              ) : file.type.startsWith('video/') ? (
                <video
                  src={URL.createObjectURL(file)}
                  style={{ width: 60, height: 60, borderRadius: 8 }}
                />
              ) : (
                <div style={{
                  width: 60,
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#f3f4f6',
                  borderRadius: 8,
                  fontSize: '10px'
                }}>
                  📄 {file.name.slice(0, 8)}
                </div>
              )}
              <div
                onClick={() => removeAttachment(index)}
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  // background: 'red',
                  // color: 'white',
                  borderRadius: '50%',
                  width: 18,
                  height: 18,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ClearIcon size={17} color='red'/>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cs-tool"
            style={{cursor:'pointer'}}
          >
          <AttachmentIcon size={19} />
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
        <button
          className="cs-btn"
          disabled={!value.trim() && attachments.length === 0}
          onClick={handleSubmit}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default RichTextComment;