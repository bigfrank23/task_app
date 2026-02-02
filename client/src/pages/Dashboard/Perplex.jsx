import Form from "../../components/form/Form";
import SignUpForm from "../../components/form/SignUpForm";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EmojiPicker from 'emoji-picker-react';
import { useState, useRef } from "react";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import ReadMoreText from "../../components/readMoreText/ReadMoreText";
import Footer from "../../components/footer/Footer";
import SideBar from "../../components/sideBar/sideBar";
import Header from "../../components/header/Header";
import ProgressiveBar from "../../components/progressiveBar/ProgressivBar";

const PerplexDashboard = () => {
  const headings = ["Task", "Status", "Deadline", "Action"];
  const details = [
    {
      id: 1,
      task: "lorem ipsum dolor sit amet consectetur adipisicing elit . Maiores, sed!",
      status: "pending",
      originalStatus: "pending",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
    {
      id: 2,
      task: "lorem ipsum dolor sit amet consectetur adipisicing elit . Maiores, sed!",
      status: "late",
      originalStatus: "late",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
    {
      id: 3,
      task: "lorem ipsum dolor sit amet consectetur adipisicing elit . Maiores, sed!",
      img: "https://picsum.photos/300/300?grayscale",
      status: "pending",
      originalStatus: "pending",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
    {
      id: 4,
      task: "lorem ipsum dolor sit amet consectetur adipisicing elit . Maiores, sed!",
      status: "pending",
      originalStatus: "pending",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
    {
      id: 5,
      task: "lorem ipsum dolor sit amet consectetur adipisicing elit . Maiores, sed!",
      status: "completed",
      img: "https://picsum.photos/id/237/200/300",
      originalStatus: "completed",
      deadline: "12-12-2024",
      action: ["Edit", "Delete"],
    },
  ];

  const [tasks, setTasks] = useState(details);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [value, setValue] = useState('');
  const [toggleQuill, setToggleQuill] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [text, setText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const textareaRef = useRef(null);

  const onEmojiClick = (emojiObject) => {
    const { emoji } = emojiObject;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.substring(0, start) + emoji + text.substring(end);
    setText(newText);
    setShowPicker(false);
    textarea.focus();
    textarea.setSelectionRange(start + emoji.length, start + emoji.length);
  };

  const isQuillEmpty = (html) => {
    if (!html) return true;
    const textContent = html.replace(/<[^>]*>/g, "").replace(/\u00A0/g, "").trim();
    return textContent === "";
  };

  return (
    <>
      <div 
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          color: "#333",
          overflowX: "hidden"
        }}
      >
        <div 
          style={{
            display: "flex",
            minHeight: "100vh",
            maxWidth: "100vw",
            overflow: "hidden"
          }}
        >
          <SideBar />
          <div 
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              backgroundColor: "#f8fafc",
              marginLeft: { xs: 0, md: "280px" } // Responsive sidebar
            }}
          >
            <Header />
            <div 
              style={{
                flex: 1,
                padding: "2rem",
                paddingBottom: "1rem",
                overflowY: "auto",
                "@media (max-width: 768px)": {
                  padding: "1rem"
                }
              }}
            >
              {/* Task Table Header */}
              <div 
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "1.5rem 2rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0,0, 0.1), 0 2px 4px -1px rgba(0, 0,0, 0.06)",
                  marginBottom: "2rem",
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr 1fr",
                  gap: "1rem",
                  "@media (max-width: 768px)": {
                    gridTemplateColumns: "2fr 1fr 1fr",
                    gap: "0.5rem",
                    padding: "1rem"
                  }
                }}
              >
                {headings.map((head, index) => (
                  <h3 
                    key={head}
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#64748b",
                      textAlign: index === 0 ? "left" : "center",
                      "@media (max-width: 768px)": {
                        fontSize: "0.875rem"
                      }
                    }}
                  >
                    {head}
                  </h3>
                ))}
              </div>

              {/* Task Rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    style={{
                      background: "white",
                      borderRadius: "16px",
                      padding: "1.5rem 2rem",
                      boxShadow: "0 1px 3px 0 rgba(0, 0,0, 0.1), 0 1px 2px 0 rgba(0, 0,0, 0.06)",
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr 1fr",
                      gap: "1rem",
                      alignItems: "center",
                      transition: "all 0.2s ease-in-out",
                      "@media (max-width: 768px)": {
                        gridTemplateColumns: "2fr 1fr 1fr",
                        padding: "1rem",
                        gap: "0.75rem"
                      },
                      "@media (hover: hover)": {
                        ":hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 25px -3px rgba(0, 0,0, 0.1)"
                        }
                      }
                    }}
                  >
                    {/* Checkbox + Task Content */}
                    <label 
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        cursor: "pointer",
                        margin: 0,
                        userSelect: "none"
                      }}
                    >
                      <div 
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "2px solid #e2e8f0",
                          borderRadius: "6px",
                          position: "relative",
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                          backgroundColor: checkedTasks[task.id] ? "#10b981" : "white",
                          ...(checkedTasks[task.id] && {
                            backgroundImage: "url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")",
                            backgroundSize: "12px",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                          })
                        }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
                        {task.img && (
                          <img
                            src={task.img}
                            alt={task.task?.substring(0, 50) || 'task image'}
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              opacity: task.status === "completed" ? 0.5 : 1,
                              filter: task.status === "completed" ? "grayscale(1)" : "none"
                            }}
                            loading="lazy"
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <ReadMoreText 
                            limit={2} 
                            style={{
                              fontSize: "0.95rem",
                              lineHeight: "1.5",
                              color: task.status === "completed" ? "#94a3b8" : "#1e293b",
                              fontWeight: task.status === "completed" ? 400 : 500,
                              opacity: task.status === "completed" ? 0.7 : 1
                            }}
                          >
                            {task.task}
                          </ReadMoreText>
                        </div>
                      </div>
                    </label>

                    {/* Status */}
                    <div style={{ textAlign: "center" }}>
                      <span
                        style={{
                          padding: "0.375rem 1rem",
                          borderRadius: "20px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          textTransform: "capitalize",
                          ...(task.status === "completed" && {
                            backgroundColor: "#dcfce7",
                            color: "#166534"
                          }),
                          ...(task.status === "late" && {
                            backgroundColor: "#fef2f2",
                            color: "#dc2626"
                          }),
                          ...(task.status === "pending" && {
                            backgroundColor: "#fef3c7",
                            color: "#d97706"
                          })
                        }}
                      >
                        {task.status}
                      </span>
                    </div>

                    {/* Deadline */}
                    <div style={{ 
                      textAlign: "center", 
                      fontSize: "0.9rem", 
                      color: "#64748b",
                      fontWeight: 500
                    }}>
                      {task.deadline}
                    </div>

                    {/* Actions */}
                    <div style={{ 
                      display: "flex", 
                      gap: "0.5rem", 
                      justifyContent: "flex-end",
                      "@media (max-width: 768px)": {
                        flexDirection: "column",
                        gap: "0.25rem"
                      }
                    }}>
                      <button 
                        disabled={task.status === "completed"}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          padding: "0.5rem 1rem",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          cursor: task.status === "completed" ? "not-allowed" : "pointer",
                          transition: "all 0.2s ease",
                          backgroundColor: task.status === "completed" ? "#f1f5f9" : "#3b82f6",
                          color: task.status === "completed" ? "#94a3b8" : "white",
                          opacity: task.status === "completed" ? 0.5 : 1,
                          ":hover": {
                            backgroundColor: task.status === "completed" ? "#f1f5f9" : "#2563eb",
                            transform: "translateY(-1px)"
                          }
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        Edit
                        <EditNoteIcon style={{ fontSize: "16px", width: "16px" }} />
                      </button>
                      <button 
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.375rem",
                          padding: "0.5rem 1rem",
                          border: "none",
                          borderRadius: "10px",
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          backgroundColor: "#ef4444",
                          color: "white",
                          ":hover": {
                            backgroundColor: "#dc2626",
                            transform: "translateY(-1px)"
                          }
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        Delete
                        <DeleteOutlineIcon style={{ fontSize: "16px", width: "16px" }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Task Section */}
              <div 
                style={{
                  marginTop: "2rem",
                  background: "white",
                  borderRadius: "20px",
                  padding: "2.5rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0,0, 0.1), 0 10px 10px -5px rgba(0, 0,0, 0.04)",
                  "@media (max-width: 768px)": {
                    padding: "2rem 1.5rem"
                  }
                }}
              >
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "1.5rem", 
                  marginBottom: "2rem",
                  "@media (max-width: 480px)": {
                    flexDirection: "column",
                    gap: "1rem"
                  }
                }}>
                  <div 
                    onClick={() => setToggleQuill(!toggleQuill)}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      color: "white",
                      ":hover": {
                        transform: "scale(1.05) rotate(180deg)"
                      }
                    }}
                  >
                    {toggleQuill ? 
                      <SwitchRightIcon style={{ fontSize: "24px" }} /> : 
                      <SwitchLeftIcon style={{ fontSize: "24px" }} />
                    }
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <AddCircleIcon
                      style={{
                        fontSize: "48px",
                        color: "#6366f1",
                        cursor: "pointer"
                      }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ 
                    margin: 0, 
                    fontSize: "1.5rem", 
                    fontWeight: 700, 
                    color: "#1e293b",
                    "@media (max-width: 480px)": {
                      fontSize: "1.25rem"
                    }
                  }}>
                    Add New Task
                  </h3>
                </div>

                {/* Textarea Input */}
                <div style={toggleQuill ? { 
                  width: "100%",
                  maxWidth: "600px",
                  margin: "0 auto"
                } : { display: "none" }}>
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your task description..."
                    style={{
                      width: "100%",
                      minHeight: "120px",
                      padding: "1.25rem",
                      border: "2px solid #e2e8f0",
                      borderRadius: "16px",
                      fontSize: "1rem",
                      fontFamily: "inherit",
                      resize: "vertical",
                      transition: "all 0.2s ease",
                      backgroundColor: "white",
                      outline: "none",
                      ":focus": {
                        borderColor: "#3b82f6",
                        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
                      },
                      "@media (max-width: 480px)": {
                        padding: "1rem"
                      }
                    }}
                  />
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginTop: "1rem",
                    "@media (max-width: 480px)": {
                      flexDirection: "column",
                      gap: "1rem",
                      alignItems: "stretch"
                    }
                  }}>
                    <button 
                      onClick={() => setShowPicker(!showPicker)}
                      style={{
                        width: "44px",
                        height: "44px",
                        border: "none",
                        borderRadius: "12px",
                        background: "#f8fafc",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        fontSize: "20px",
                        ":hover": {
                          background: "#e2e8f0"
                        }
                      }}
                    >
                      😊
                    </button>
                    {showPicker && (
                      <div style={{
                        position: "absolute",
                        zIndex: 1000,
                        marginTop: "10px",
                        "@media (max-width: 480px)": {
                          position: "relative",
                          marginTop: "0"
                        }
                      }}>
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    )}
                    <button
                      disabled={text.trim() === ""}
                      onClick={() => {
                        const trimmed = text.trim();
                        if (!trimmed) return;
                        const newItem = {
                          id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                          task: trimmed,
                          status: "pending",
                          originalStatus: "pending",
                          deadline: "",
                          action: ["Edit", "Delete"],
                        };
                        setTasks(prev => [newItem, ...prev]);
                        setText("");
                      }}
                      style={{
                        padding: "0.75rem 2rem",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        cursor: text.trim() === "" ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        opacity: text.trim() === "" ? 0.5 : 1,
                        ":hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)"
                        },
                        "@media (max-width: 480px)": {
                          width: "100%",
                          justifyContent: "center"
                        }
                      }}
                    >
                      Add Task
                      <AddCircleOutlineIcon style={{ fontSize: "20px" }} />
                    </button>
                  </div>
                </div>

                {/* Quill Editor */}
                <div style={toggleQuill ? { display: "none" } : { 
                  width: "100%", 
                  maxWidth: "800px", 
                  margin: "0 auto",
                  display: "flex", 
                  flexDirection: "column", 
                  height: "100%" 
                }}>
                  <ReactQuill 
                    theme="snow" 
                    value={value} 
                    onChange={setValue}
                    style={{
                      minHeight: "200px",
                      ".ql-container": {
                        borderRadius: "12px"
                      }
                    }}
                  />
                  <div style={{ marginTop: "1rem", textAlign: "center" }}>
                    <button
                      disabled={isQuillEmpty(value)}
                      onClick={() => {
                        const textContent = value.replace(/<[^>]*>/g, "").replace(/\u00A0/g, "").trim();
                        if (!textContent) return;
                        const newItem = {
                          id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                          task: textContent,
                          status: "pending",
                          originalStatus: "pending",
                          deadline: "",
                          action: ["Edit", "Delete"],
                        };
                        setTasks(prev => [newItem, ...prev]);
                        setValue('');
                      }}
                      style={{
                        padding: "0.75rem 2rem",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "1rem",
                        fontWeight: 600,
                        cursor: isQuillEmpty(value) ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        opacity: isQuillEmpty(value) ? 0.5 : 1,
                        ":hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)"
                        }
                      }}
                    >
                      Add Task
                      <AddCircleOutlineIcon style={{ fontSize: "20px", marginLeft: "0.5rem" }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default PerplexDashboard;
