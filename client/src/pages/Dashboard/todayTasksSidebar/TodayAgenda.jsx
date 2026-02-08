import { useMemo } from "react";
import { CalendarIcon, ClockIcon } from "../../../utils/svgIcons";
import "./todayAgenda.css";

const TodayAgenda = ({ tasks = [] }) => {
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

  const scrollToTask = (taskId) => {
    const el = document.getElementById(`task-${taskId}`);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    // subtle highlight
    el.classList.add("task-highlight");
    setTimeout(() => el.classList.remove("task-highlight"), 1500);
  };

  return (
    <aside className="today-agenda">
      <div className="today-agenda-header">
        Today
      </div>

      {todayTasks.length === 0 ? (
        <div className="today-agenda-empty">
          No task for the day
        </div>
      ) : (
        <ul className="today-agenda-list">
          {todayTasks.map(task => (
            <li
              key={task._id}
              className="today-agenda-item"
              onClick={() => scrollToTask(task._id)}
            >
              <span className="agenda-time">
                <ClockIcon size={12} />
                {new Date(task.dueDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              <span
                className="agenda-title"
                dangerouslySetInnerHTML={{ __html: task.title }}
              />
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default TodayAgenda;
