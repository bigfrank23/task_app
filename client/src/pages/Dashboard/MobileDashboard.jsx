import { useState, useRef } from "react";
// import { 
//   AddCircle, 
//   AddCircleOutline, 
//   SwitchLeft, 
//   SwitchRight, 
//   EditNote, 
//   DeleteOutline,
//   CheckCircle,
//   RadioButtonUnchecked,
//   CalendarToday,
//   Image as ImageIcon
// } from '@mui/icons-material';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import ImageIcon from '@mui/icons-material/Image';
// import PhotoIcon from '@mui/icons-material/Photo';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import EmojiPicker from 'emoji-picker-react';
// import CircularProgress from "@mui/material/CircularProgress";

const MobileDashboard = () => {
  const headings = ["Task", "Status", "Deadline", "Action"];
  const initialTasks = [
    {
      id: 1,
      task: "Complete project documentation and prepare presentation slides for the upcoming client meeting",
      status: "pending",
      originalStatus: "pending",
      deadline: "2024-12-25",
      action: ["Edit", "Delete"],
    },
    {
      id: 2,
      task: "Review and approve team submissions before the end of day deadline",
      status: "late",
      originalStatus: "late",
      deadline: "2024-12-15",
      action: ["Edit", "Delete"],
    },
    {
      id: 3,
      task: "Update website design with new branding guidelines and color scheme",
      img: "/general/images/wp.jpg",
      status: "pending",
      originalStatus: "pending",
      deadline: "2024-12-28",
      action: ["Edit", "Delete"],
    },
    {
      id: 4,
      task: "Schedule team meeting to discuss Q1 goals and objectives",
      status: "pending",
      originalStatus: "pending",
      deadline: "2024-12-30",
      action: ["Edit", "Delete"],
    },
    {
      id: 5,
      task: "Research and implement new authentication system for the application",
      status: "completed",
      img: "/general/images/wp.jpg",
      originalStatus: "completed",
      deadline: "2024-12-10",
      action: ["Edit", "Delete"],
    },
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [richText, setRichText] = useState('');
  const [toggleQuill, setToggleQuill] = useState(false);
  const [plainText, setPlainText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef(null);

  const onEmojiClick = (emojiObject) => {
    const { emoji } = emojiObject;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = plainText.substring(0, start) + emoji + plainText.substring(end);

    setPlainText(newText);
    setShowPicker(false);
    textarea.focus();
    textarea.setSelectionRange(start + emoji.length, start + emoji.length);
  };

  const isQuillEmpty = (html) => {
    if (!html) return true;
    const text = html.replace(/<[^>]*>/g, "").replace(/\u00A0/g, "").trim();
    return text === "";
  };

  const handleToggleTask = (taskId) => {
    const newChecked = !checkedTasks[taskId];
    setCheckedTasks({ ...checkedTasks, [taskId]: newChecked });
    setTasks((prev) =>
      prev.map((item) =>
        item.id === taskId
          ? { ...item, status: newChecked ? "completed" : item.originalStatus }
          : item
      )
    );
  };

  const handleAddTask = (taskText) => {
    if (!taskText.trim()) return;
    const newItem = {
      id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      task: taskText.trim(),
      status: "pending",
      originalStatus: "pending",
      deadline: new Date().toISOString().split('T')[0],
      action: ["Edit", "Delete"],
    };
    setTasks([newItem, ...tasks]);
    setPlainText('');
    setRichText('');
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    const newChecked = { ...checkedTasks };
    delete newChecked[taskId];
    setCheckedTasks(newChecked);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'late': return '#ef4444';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };
const ReadMoreText = ({ children, limit = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Extract text content from children (handles both strings and React elements)
    const textContent = typeof children === 'string' 
      ? children 
      : children?.props?.children || '';
    
    const shouldTruncate = textContent.length > limit;
    const displayText = isExpanded ? textContent : textContent.substring(0, limit);
  // const ReadMoreText = ({ children, limit = 2 }) => {
  //   const [isExpanded, setIsExpanded] = useState(false);
  //   const lines = children?.split('\n') || [];
  //   const shouldTruncate = lines.length > limit;
  //   const displayText = isExpanded ? children : lines.slice(0, limit).join('\n');

    return (
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {displayText}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#535bf2',
              cursor: 'pointer',
              padding: '4px 0',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {isExpanded ? 'Show less' : 'Read more...'}
          </button>
        )}
      </div>
    );
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    late: tasks.filter(t => t.status === 'late').length,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{
            margin: '0 0 20px 0',
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800'
          }}>
            Task Dashboard
          </h1>
          
          {/* Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '15px',
            marginTop: '20px'
          }}>
            {[
              { label: 'Total', value: stats.total, color: '#667eea' },
              { label: 'Completed', value: stats.completed, color: '#10b981' },
              { label: 'Pending', value: stats.pending, color: '#f59e0b' },
              { label: 'Overdue', value: stats.late, color: '#ef4444' }
            ].map((stat) => (
              <div key={stat.label} style={{
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}25 100%)`,
                padding: '20px',
                borderRadius: '12px',
                border: `2px solid ${stat.color}30`,
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: '800',
                  color: stat.color,
                  marginBottom: '5px'
                }}>{stat.value}</div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Task */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AddCircleIcon style={{ color: '#667eea' }} />
              Add New Task
            </h2>
            <button
              onClick={() => setToggleQuill(!toggleQuill)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                transition: 'all 0.2s'
              }}
            >
              {toggleQuill ? <SwitchLeftIcon /> : <SwitchRightIcon />}
              {toggleQuill ? 'Plain Text' : 'Rich Text'}
            </button>
          </div>

          {toggleQuill ? (
            /* Plain Text Editor */
            <div>
              <textarea
                ref={textareaRef}
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                placeholder="Enter your task details..."
                style={{
                  width: '100%',
                  minHeight: '120px',
                  padding: '15px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '15px',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                position: 'relative'
              }}>
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  style={{
                    padding: '10px 20px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  😊
                </button>
                {showPicker && (
                  <div style={{
                    position: 'absolute',
                    bottom: '60px',
                    left: 0,
                    zIndex: 1000
                  }}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
                <button
                  onClick={() => handleAddTask(plainText)}
                  disabled={!plainText.trim()}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 30px',
                    background: plainText.trim() 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: plainText.trim() ? 'pointer' : 'not-allowed',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: plainText.trim() ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (plainText.trim()) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = plainText.trim() ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none';
                  }}
                >
                  Add Task
                  <AddCircleOutlineIcon />
                </button>
              </div>
            </div>
          ) : (
            /* Rich Text Editor */
            <div>
              <ReactQuill
                theme="snow"
                value={richText}
                onChange={setRichText}
                placeholder="Enter your task with rich formatting..."
                style={{
                  marginBottom: '15px',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    const text = richText.replace(/<[^>]*>/g, "").replace(/\u00A0/g, "").trim();
                    handleAddTask(text);
                  }}
                  disabled={isQuillEmpty(richText)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 30px',
                    background: !isQuillEmpty(richText)
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: !isQuillEmpty(richText) ? 'pointer' : 'not-allowed',
                    fontSize: '1rem',
                    fontWeight: '600',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: !isQuillEmpty(richText) ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isQuillEmpty(richText)) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = !isQuillEmpty(richText) ? '0 4px 15px rgba(102, 126, 234, 0.4)' : 'none';
                  }}
                >
                  Add Task
                  <AddCircleOutlineIcon />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tasks List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Desktop Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
            gap: '20px',
            padding: '15px 20px',
            background: '#f9fafb',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: '700',
            color: '#374151',
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          className="desktop-header">
            {headings.map((head) => (
              <div key={head}>{head}</div>
            ))}
          </div>

          {/* Tasks */}
          {tasks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#9ca3af'
            }}>
              <AddCircleOutlineIcon style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.3 }} />
              <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>No tasks yet</p>
              <p>Add your first task to get started!</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
                  gap: '20px',
                  padding: '20px',
                  background: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                  borderRadius: '12px',
                  marginBottom: '10px',
                  alignItems: 'center',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  border: '1px solid #e5e7eb'
                }}
                className="task-row"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Task Content */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '15px'
                }}
                className="task-content">
                  <input
                    type="checkbox"
                    checked={checkedTasks[task.id] || false}
                    onChange={() => handleToggleTask(task.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#667eea',
                      marginTop: '2px',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    {task.img && (
                      <img
                        src={task.img}
                        alt="Task"
                        style={{
                          width: '100%',
                          maxWidth: '200px',
                          height: 'auto',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          filter: task.status === 'completed' ? 'grayscale(100%) blur(1px)' : 'none',
                          opacity: task.status === 'completed' ? 0.5 : 1
                        }}
                        loading="lazy"
                      />
                    )}
                    <ReadMoreText>
                      <span style={{
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        opacity: task.status === 'completed' ? 0.6 : 1,
                        color: '#1f2937'
                      }}>
                        {task.task}
                      </span>
                    </ReadMoreText>
                  </div>
                </div>

                {/* Status */}
                <div className="task-status">
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: `${getStatusColor(task.status)}20`,
                    color: getStatusColor(task.status),
                    border: `2px solid ${getStatusColor(task.status)}40`
                  }}>
                    {task.status}
                  </span>
                </div>

                {/* Deadline */}
                <div className="task-deadline" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  <AddCircleIcon style={{ fontSize: '1rem' }} />
                  {task.deadline}
                </div>

                {/* Actions */}
                <div className="task-actions" style={{
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap'
                }}>
                  <button
                    disabled={task.status === 'completed'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 16px',
                      background: task.status !== 'completed' ? '#3b82f6' : '#e5e7eb',
                      color: task.status !== 'completed' ? 'white' : '#9ca3af',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: task.status !== 'completed' ? 'pointer' : 'not-allowed',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'transform 0.2s',
                      flex: 1,
                      minWidth: '80px',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (task.status !== 'completed') {
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <EditNoteIcon style={{ fontSize: '1.125rem' }} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 16px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'transform 0.2s',
                      flex: 1,
                      minWidth: '80px',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <DeleteOutlineIcon style={{ fontSize: '1.125rem' }} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-header {
            display: none !important;
          }
          
          .task-row {
            grid-template-columns: 1fr !important;
            gap: 15px !important;
          }
          
          .task-content {
            flex-direction: column !important;
          }
          
          .task-status::before {
            content: 'Status: ';
            font-weight: 600;
            color: #6b7280;
            margin-right: 8px;
          }
          
          .task-deadline::before {
            content: 'Deadline: ';
            font-weight: 600;
            color: #6b7280;
            margin-right: 8px;
          }
          
          .task-actions {
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            width: 100%;
          }
          
          .task-actions button {
            flex: 1 1 calc(50% - 5px);
          }
        }
        
        @media (max-width: 480px) {
          .task-actions {
            flex-direction: column;
          }
          
          .task-actions button {
            width: 100%;
          }
        }
        
        .ql-container {
          min-height: 150px;
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
        }
        
        .ql-toolbar {
          border-top-left-radius: 12px;
          border-top-right-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default MobileDashboard;