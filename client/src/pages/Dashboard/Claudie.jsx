import { useState, useRef } from "react";

const ClaudieDashboard = () => {
  const headings = ["Task", "Status", "Deadline", "Action"];
  const details = [
    {
      id: 1,
      task: "Complete project documentation and submit to team lead for review",
      status: "pending",
      originalStatus: "pending",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
    {
      id: 2,
      task: "Review pull requests and provide feedback to junior developers",
      status: "late",
      originalStatus: "late",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
    {
      id: 3,
      task: "Update dashboard UI with modern design patterns and responsive layout",
      img: "https://picsum.photos/300/300?grayscale",
      status: "pending",
      originalStatus: "pending",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
    {
      id: 4,
      task: "Prepare presentation for stakeholder meeting next week",
      status: "pending",
      originalStatus: "pending",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
    {
      id: 5,
      task: "Fix critical bugs in production environment and deploy patch",
      status: "completed",
      img: "https://picsum.photos/id/237/200/300",
      originalStatus: "completed",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
  ];

  const [tasks, setTasks] = useState(details);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState({});
  const textareaRef = useRef(null);

  const emojis = ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖', '👋', '🤝', '🙏', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁', '👅', '👄', '💋', '🩸'];

  const onEmojiClick = (emoji) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    setText(newText);
    setShowEmojiPicker(false);
    textarea.focus();
    textarea.setSelectionRange(start + emoji.length, start + emoji.length);
  };

  const toggleReadMore = (taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const truncateText = (text, limit) => {
    const words = text.split(' ');
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(' ') + '...';
  };

  // Icon Components
  const AddIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="16"/>
      <line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );

  const EditIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );

  const DeleteIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  );

  const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );

  // Styles
  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    headerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logo: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#535bf2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ffffff',
      fontWeight: '600',
      fontSize: '14px',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '32px 24px',
    },
    welcomeMessage: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '16px',
      color: '#64748b',
      marginBottom: '32px',
    },
    contentBox: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      padding: '24px',
      marginBottom: '24px',
    },
    contentBoxHeader: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
      gap: '16px',
      padding: '16px 20px',
      backgroundColor: '#f1f5f9',
      borderRadius: '12px',
      marginBottom: '16px',
    },
    headerCell: {
      margin: 0,
      fontSize: '13px',
      fontWeight: '600',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    taskRow: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
      gap: '16px',
      alignItems: 'center',
      padding: '20px',
      marginBottom: '12px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
    },
    taskLabel: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      cursor: 'pointer',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      border: '2px solid #cbd5e1',
      borderRadius: '6px',
      cursor: 'pointer',
      flexShrink: 0,
      marginTop: '4px',
      transition: 'all 0.2s ease',
      appearance: 'none',
      position: 'relative',
    },
    checkboxChecked: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
    },
    taskContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flex: 1,
    },
    taskImg: {
      width: '60px',
      height: '60px',
      objectFit: 'cover',
      borderRadius: '8px',
      border: '2px solid #e2e8f0',
    },
    taskImgBlur: {
      filter: 'grayscale(100%) opacity(0.5)',
    },
    taskText: {
      color: '#334155',
      fontSize: '14px',
      lineHeight: '1.6',
      margin: 0,
    },
    taskTextCompleted: {
      textDecoration: 'line-through',
      color: '#94a3b8',
      opacity: 0.7,
    },
    readMoreBtn: {
      background: 'none',
      border: 'none',
      color: '#535bf2',
      cursor: 'pointer',
      fontSize: '13px',
      padding: '4px 0',
      fontWeight: '500',
    },
    statusBadge: {
      padding: '6px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      textAlign: 'center',
      textTransform: 'capitalize',
      display: 'inline-block',
    },
    statusCompleted: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
    },
    statusLate: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    },
    statusPending: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    },
    deadline: {
      margin: 0,
      color: '#64748b',
      fontSize: '14px',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    button: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s ease',
    },
    editButton: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    },
    editButtonDisabled: {
      backgroundColor: '#f1f5f9',
      color: '#cbd5e1',
      cursor: 'not-allowed',
    },
    deleteButton: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
    },
    addNewTask: {
      marginTop: '32px',
      padding: '24px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '2px dashed #cbd5e1',
    },
    addTaskHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    addTaskTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1e293b',
      margin: '16px 0',
    },
    textarea: {
      width: '100%',
      minHeight: '100px',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      fontFamily: 'inherit',
      resize: 'vertical',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      boxSizing: 'border-box',
    },
    textareaActions: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '12px',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
    },
    emojiButton: {
      padding: '8px 16px',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '18px',
      transition: 'all 0.2s ease',
    },
    emojiPicker: {
      position: 'absolute',
      bottom: '100%',
      left: 0,
      zIndex: 1000,
      marginBottom: '8px',
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gap: '8px',
      maxWidth: '320px',
    },
    emojiItem: {
      fontSize: '24px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '6px',
      transition: 'background-color 0.2s',
      textAlign: 'center',
    },
    addButton: {
      backgroundColor: '#535bf2',
      color: '#ffffff',
      padding: '10px 24px',
      fontWeight: '600',
    },
    addButtonDisabled: {
      backgroundColor: '#cbd5e1',
      cursor: 'not-allowed',
    },
    footer: {
      backgroundColor: '#1e293b',
      color: '#ffffff',
      padding: '32px 24px',
      marginTop: '64px',
    },
    footerContent: {
      maxWidth: '1400px',
      margin: '0 auto',
      textAlign: 'center',
    },
    footerText: {
      margin: '8px 0',
      fontSize: '14px',
      color: '#94a3b8',
    },
  };

  // Media queries via JS
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  if (isMobile) {
    styles.contentBoxHeader = { display: 'none' };
    styles.taskRow = {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '16px',
      alignItems: 'stretch',
      marginBottom: '12px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
    };
    styles.actionButtons = {
      ...styles.actionButtons,
      width: '100%',
      justifyContent: 'flex-end',
    };
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <MenuIcon />
            TaskMaster
          </div>
          <div style={styles.userInfo}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>Welcome back!</span>
            <div style={styles.avatar}>JD</div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div style={styles.container}>
        <h1 style={styles.welcomeMessage}>My Tasks</h1>
        <p style={styles.subtitle}>Manage your daily tasks efficiently</p>

        <div style={styles.contentBox}>
          {/* Table Header */}
          <div style={styles.contentBoxHeader}>
            {!isMobile && headings.map((head) => (
              <h3 key={head} style={styles.headerCell}>{head}</h3>
            ))}
          </div>

          {/* Task Rows */}
          <div>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={styles.taskRow}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <label style={styles.taskLabel}>
                  <input
                    type="checkbox"
                    style={{
                      ...styles.checkbox,
                      ...(checkedTasks[task.id] ? styles.checkboxChecked : {}),
                    }}
                    checked={checkedTasks[task.id] || false}
                    onChange={() => {
                      const newChecked = !checkedTasks[task.id];
                      setCheckedTasks({
                        ...checkedTasks,
                        [task.id]: newChecked,
                      });
                      setTasks((prev) =>
                        prev.map((item) =>
                          item.id === task.id
                            ? {
                                ...item,
                                status: newChecked ? "completed" : item.originalStatus,
                              }
                            : item
                        )
                      );
                    }}
                  />
                  <div style={styles.taskContent}>
                    {task.img && (
                      <img
                        src={task.img}
                        alt="task"
                        style={{
                          ...styles.taskImg,
                          ...(task.status === "completed" ? styles.taskImgBlur : {}),
                        }}
                        loading="lazy"
                      />
                    )}
                    <div>
                      <p style={{
                        ...styles.taskText,
                        ...(task.status === "completed" ? styles.taskTextCompleted : {}),
                      }}>
                        {expandedTasks[task.id] ? task.task : truncateText(task.task, 10)}
                      </p>
                      {task.task.split(' ').length > 10 && (
                        <button
                          style={styles.readMoreBtn}
                          onClick={() => toggleReadMore(task.id)}
                        >
                          {expandedTasks[task.id] ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                  </div>
                </label>
                <div>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(task.status === "completed" ? styles.statusCompleted :
                          task.status === "late" ? styles.statusLate : styles.statusPending),
                    }}
                  >
                    {task.status}
                  </span>
                </div>
                <div>
                  <p style={styles.deadline}>{task.deadline}</p>
                </div>
                <div style={styles.actionButtons}>
                  <button
                    style={{
                      ...styles.button,
                      ...(task.status !== "completed" ? styles.editButton : styles.editButtonDisabled),
                    }}
                    disabled={task.status === "completed"}
                    onMouseEnter={(e) => {
                      if (task.status !== "completed") {
                        e.currentTarget.style.backgroundColor = '#bfdbfe';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (task.status !== "completed") {
                        e.currentTarget.style.backgroundColor = '#dbeafe';
                      }
                    }}
                  >
                    Edit
                    <EditIcon />
                  </button>
                  <button
                    style={{
                      ...styles.button,
                      ...styles.deleteButton,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                  >
                    Delete
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Task */}
          <div style={styles.addNewTask}>
            <div style={styles.addTaskHeader}>
              <div style={{ fontSize: '40px', color: '#535bf2', cursor: 'pointer' }}>
                +
              </div>
            </div>
            <p style={styles.addTaskTitle}>Add New Task</p>
            <div>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your task description..."
                style={styles.textarea}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#535bf2';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              />
              <div style={styles.textareaActions}>
                <div style={{ position: 'relative' }}>
                  <button
                    style={styles.emojiButton}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#535bf2';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    😊
                  </button>
                  {showEmojiPicker && (
                    <div style={styles.emojiPicker}>
                      {emojis.map((emoji, idx) => (
                        <div
                          key={idx}
                          style={styles.emojiItem}
                          onClick={() => onEmojiClick(emoji)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f1f5f9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          {emoji}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  style={{
                    ...styles.button,
                    ...(text.trim() === "" ? { ...styles.addButton, ...styles.addButtonDisabled } : styles.addButton),
                  }}
                  type="button"
                  disabled={text.trim() === ""}
                  onClick={() => {
                    const trimmed = text.trim();
                    if (!trimmed) return;
                    const newItem = {
                      id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
                      task: trimmed,
                      status: "pending",
                      originalStatus: "pending",
                      deadline: new Date().toLocaleDateString(),
                      action: ["Edit", "Delete"],
                    };
                    setTasks((prev) => [newItem, ...prev]);
                    setText("");
                  }}
                  onMouseEnter={(e) => {
                    if (text.trim() !== "") {
                      e.currentTarget.style.backgroundColor = '#4338ca';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (text.trim() !== "") {
                      e.currentTarget.style.backgroundColor = '#535bf2';
                    }
                  }}
                >
                  Add Task
                  <AddIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>© 2026 TaskMaster. All rights reserved.</p>
          <p style={styles.footerText}>Built with modern design principles</p>
        </div>
      </footer>
    </div>
  );
};

export default ClaudieDashboard;