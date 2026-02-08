import { useMemo } from "react";
import { CalendarIcon, ClockIcon } from "../../../utils/svgIcons";
import "./todayTasksSidebar.css";

const TodayTasksSidebar = ({ tasks }) => {
  const todayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks
      .filter(task => {
        const due = new Date(task.dueDate);
        due.setHours(0, 0, 0, 0);
        return due.getTime() === today.getTime();
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [tasks]);

  return (
    <aside className="today-sidebar">
      <div className="today-header">
        <CalendarIcon size={18} />
        <h3>Today</h3>
      </div>

      {todayTasks.length === 0 ? (
        <p className="no-task">No task for the day 🎉</p>
      ) : (
        <ul className="today-task-list">
          {todayTasks.map(task => (
            <li key={task._id} className="today-task-item">
              <div className="today-task-time">
                <ClockIcon size={12} />
                <span>
                  {new Date(task.dueDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              <div className="today-task-title">
                <span
                  dangerouslySetInnerHTML={{ __html: task.title }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default TodayTasksSidebar;
