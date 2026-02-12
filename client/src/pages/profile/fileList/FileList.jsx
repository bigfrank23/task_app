// components/FileList/FileList.jsx
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './fileList.css';

const FileList = ({ files }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileExtension = (filename) => {
    return filename?.split('.').pop()?.toLowerCase() || 'file';
  };

  const getFileIcon = (filename) => {
    const ext = getFileExtension(filename);
    const iconMap = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      xls: '📊',
      xlsx: '📊',
      ppt: '📊',
      pptx: '📊',
      txt: '📃',
      zip: '🗜️',
      rar: '🗜️',
    };
    return iconMap[ext] || '📎';
  };

  return (
    <div className="file-list">
      {files.map((file, index) => (
        <div key={index} className="file-item">
          <div className="file-icon">
            <span style={{ fontSize: '2rem' }}>
              {getFileIcon(file.filename)}
            </span>
          </div>
          
          <div className="file-info">
            <div className="file-name">{file.filename}</div>
            <div className="file-meta">
              <span>{formatFileSize(file.size)}</span>
              <span>•</span>
              <span>{getFileExtension(file.filename).toUpperCase()}</span>
            </div>
          </div>

          <div className="file-actions">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="file-action-btn"
              title="View"
            >
              <VisibilityIcon style={{ fontSize: '18px' }} />
            </a>
            <a
              href={file.url}
              download={file.filename}
              className="file-action-btn"
              title="Download"
            >
              <DownloadIcon style={{ fontSize: '18px' }} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;