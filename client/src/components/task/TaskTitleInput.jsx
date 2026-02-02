const TaskTitleInput = ({ value, onChange }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Task title"
    required
    style={{ width: "100%", padding: "14px", borderRadius: "12px" }}
  />
);

export default TaskTitleInput;
