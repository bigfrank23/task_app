const TaskDescriptionEditor = ({ toggleQuill, value, onChange }) => {
  return toggleQuill ? (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Task description"
    />
  ) : (
    <ReactQuill value={value} onChange={onChange} />
  );
};

export default TaskDescriptionEditor;
