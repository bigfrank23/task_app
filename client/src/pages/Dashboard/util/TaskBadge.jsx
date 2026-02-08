const baseStyle = {
  fontSize: '0.7rem',
  padding: '2px 8px',
  borderRadius: '12px',
  fontWeight: '600',
  border: '1px solid',
  display: 'inline-block'
};

const TaskBadges = ({ task, user }) => {
  const createdByMe = task.createdBy?._id === user._id;
  const assignedToMe = task.assignedTo?._id === user._id;

  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
      {/* Created by badge */}
      <span
        style={{
          ...baseStyle,
          background: createdByMe ? '#eff6ff' : '#fff7ed',
          color: createdByMe ? '#1e40af' : '#9a3412',
          borderColor: createdByMe ? '#bfdbfe' : '#fed7aa'
        }}
      >
        Created by {createdByMe ? 'me' : task.createdBy?.displayName || 'Someone'}
      </span>
      {/* Assigned to badge */}
      <span
        style={{
          ...baseStyle,
          background: assignedToMe ? '#f0fdf4' : '#fdf2f8',
          color: assignedToMe ? '#15803d' : '#9d174d',
          borderColor: assignedToMe ? '#bbf7d0' : '#fbcfe8'
        }}
      >
        Assigned to {assignedToMe ? 'me' : task.assignedTo?.displayName || 'someone'}
      </span>
    </div>
  );
};

export default TaskBadges;
