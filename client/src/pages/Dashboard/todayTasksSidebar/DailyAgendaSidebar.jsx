import { useMemo, useState } from "react";
import { CalendarIcon, ClockIcon } from "../../../utils/svgIcons";
import "./dailyAgendaSidebar.css";

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getPriorityClass = (priority) => {
  if (priority === "high") return "priority-high";
  if (priority === "low") return "priority-low";
  return "priority-medium";
};

const Section = ({ title, count, open, onToggle, children }) => (
  <div className="agenda-section">
    <div className="agenda-section-header" onClick={onToggle}>
      <span>{title}</span>
      <span className="agenda-count">{count}</span>
    </div>
    {open && <div className="agenda-section-body">{children}</div>}
  </div>
);

const TaskItem = ({ task }) => (
  <div className={`agenda-task ${getPriorityClass(task.priority)}`}>
    <div className="agenda-time">
      <ClockIcon size={12} />
      {new Date(task.dueDate).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
    <div
      className="agenda-title"
      dangerouslySetInnerHTML={{ __html: task.title }}
    />
  </div>
);

const DailyAgendaSidebar = ({ tasks = [] }) => {
  const now = new Date();
  now.setSeconds(0, 0);

  const { today, overdue, upcoming } = useMemo(() => {
    const t = [];
    const o = [];
    const u = [];

    tasks.forEach(task => {
      const due = new Date(task.dueDate);
      if (due < now && !isSameDay(due, now)) o.push(task);
      else if (isSameDay(due, now)) t.push(task);
      else u.push(task);
    });

    const sortByTime = (a, b) => new Date(a.dueDate) - new Date(b.dueDate);

    return {
      today: t.sort(sortByTime),
      overdue: o.sort(sortByTime),
      upcoming: u.sort(sortByTime).slice(0, 5),
    };
  }, [tasks]);

  const [open, setOpen] = useState({
    today: true,
    overdue: true,
    upcoming: true,
  });

  return (
    <aside className="daily-agenda">
      <div className="agenda-header">
        <CalendarIcon size={18} />
        <h3>Daily Agenda</h3>
      </div>

      <Section
        title="Today"
        count={today.length}
        open={open.today}
        onToggle={() => setOpen(s => ({ ...s, today: !s.today }))}
      >
        {today.length === 0
          ? <p className="agenda-empty">No task for the day 🎉</p>
          : today.map(task => <TaskItem key={task._id} task={task} />)}
      </Section>

      {/* <Section
        title="Overdue"
        count={overdue.length}
        open={open.overdue}
        onToggle={() => setOpen(s => ({ ...s, overdue: !s.overdue }))}
      >
        {overdue.length === 0
          ? <p className="agenda-empty">Nothing overdue 👌</p>
          : overdue.map(task => <TaskItem key={task._id} task={task} />)}
      </Section> */}

      <Section
        title="Upcoming"
        count={upcoming.length}
        open={open.upcoming}
        onToggle={() => setOpen(s => ({ ...s, upcoming: !s.upcoming }))}
      >
        {upcoming.length === 0
          ? <p className="agenda-empty">No upcoming tasks</p>
          : upcoming.map(task => <TaskItem key={task._id} task={task} />)}
      </Section>
    </aside>
  );
};

export default DailyAgendaSidebar;
