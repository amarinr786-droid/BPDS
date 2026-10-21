"use client";
import { useState, useRef, ChangeEvent, KeyboardEvent, CSSProperties } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Aprender JSX", completed: false },
    { id: 2, text: "Crear una función en JavaScript", completed: true },
  ]);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const nextId = useRef<number>(3);

  const handleNewTaskKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const text = newTaskText.trim();
    if (text === "") return;

    setTasks((prev) => [
      ...prev,
      { id: nextId.current, text, completed: false },
    ]);
    nextId.current += 1;
    setNewTaskText("");
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = (id: number) => {
    const text = editingText.trim();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: text === "" ? t.text : text } : t
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setEditingId(null);
      setEditingText("");
    }
  };

  const toggleCompleted = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    setDeletedTasks((prev) => [taskToDelete, ...prev]);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const restoreTask = (id: number) => {
    const taskToRestore = deletedTasks.find((t) => t.id === id);
    if (!taskToRestore) return;

    setTasks((prev) => [...prev, taskToRestore]);
    setDeletedTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearTrash = () => {
    setDeletedTasks([]);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div style={styles.page}>
      <style>{globalCss}</style>
      <div style={styles.card}>
        <h1 style={styles.title}>Mi lista de tareas</h1>
        <p style={styles.subtitle}>
          Escribe lo que debes hacer hoy y presiona Enter.
        </p>

        <input
          type="text"
          className="neon-input"
          placeholder="Ejemplo: Estudiar JavaScript"
          value={newTaskText}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTaskText(e.target.value)}
          onKeyDown={handleNewTaskKeyDown}
          style={styles.input}
        />
        <div style={styles.statsBar}>
          <span style={styles.statsText}>
            Total de tareas: {tasks.length}
          </span>
          <span style={styles.statsTextAccent}>{completedCount} completadas</span>
        </div>

        {tasks.length === 0 && (
          <p style={styles.emptyState}>No tienes tareas todavía.</p>
        )}

        {tasks.map((task) => (
          <div key={task.id} style={styles.taskRow}>
            <button
              onClick={() => toggleCompleted(task.id)}
              aria-label={
                task.completed ? "Marcar como pendiente" : "Marcar como completada"
              }
              className="neon-btn"
              style={{
                ...styles.checkbox,
                background: task.completed ? "#b6ff3b" : "transparent",
                borderColor: task.completed ? "#b6ff3b" : "#22f0ff",
                boxShadow: task.completed
                  ? "0 0 12px rgba(182, 255, 59, 0.9), 0 0 24px rgba(182, 255, 59, 0.4)"
                  : "0 0 8px rgba(34, 240, 255, 0.6), inset 0 0 6px rgba(34, 240, 255, 0.3)",
              }}
            />

            {editingId === task.id ? (
              <input
                autoFocus
                type="text"
                className="neon-input"
                value={editingText}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEditingText(e.target.value)}
                onBlur={() => saveEdit(task.id)}
                onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                style={styles.editInput}
              />
            ) : (
              <span
                onClick={() => startEditing(task)}
                title="Haz clic para editar"
                style={{
                  ...styles.taskText,
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#8f95c2" : "#f1f3ff",
                }}
              >
                {task.text}
              </span>
            )}

            <button
              onClick={() => deleteTask(task.id)}
              className="neon-btn"
              style={styles.deleteButton}
            >
              Eliminar
            </button>
          </div>
        ))}

        {deletedTasks.length > 0 && (
          <div style={styles.trashContainer}>
            <div style={styles.trashHeader}>
              <h2 style={styles.trashTitle}>🗑️ Papelera ({deletedTasks.length})</h2>
              <button
                onClick={clearTrash}
                className="neon-btn"
                style={styles.clearTrashButton}
              >
                Vaciar papelera
              </button>
            </div>
            {deletedTasks.map((task) => (
              <div key={task.id} style={styles.trashRow}>
                <span style={styles.trashText}>{task.text}</span>
                <button
                  onClick={() => restoreTask(task.id)}
                  className="neon-btn"
                  style={styles.restoreButton}
                >
                  Restaurar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.neon-input::placeholder { color: #8f95c2; }
.neon-input:focus {
  border-color: #22f0ff !important;
  box-shadow: 0 0 0 1px #22f0ff, 0 0 18px rgba(34, 240, 255, 0.55) !important;
}
.neon-btn { transition: transform 0.15s ease, filter 0.15s ease; }
.neon-btn:hover { transform: translateY(-1px); filter: brightness(1.25); }
.neon-btn:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .neon-btn { transition: none; }
  .neon-btn:hover { transform: none; }
}
`;

const styles: { [key: string]: CSSProperties } = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 15% 10%, rgba(255, 43, 214, 0.22) 0%, transparent 40%), radial-gradient(circle at 85% 90%, rgba(34, 240, 255, 0.20) 0%, transparent 42%), #07060f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "48px 20px",
    fontFamily:
      "'Space Grotesk', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  card: {
    background: "rgba(14, 12, 30, 0.92)",
    borderRadius: 24,
    padding: "40px 36px 28px",
    width: "100%",
    maxWidth: 520,
    border: "1px solid rgba(34, 240, 255, 0.55)",
    boxShadow:
      "0 0 0 1px rgba(255, 43, 214, 0.25), 0 0 30px rgba(34, 240, 255, 0.28), 0 0 80px rgba(255, 43, 214, 0.18)",
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    color: "#ffffff",
    margin: "0 0 8px",
    letterSpacing: "-0.02em",
    textShadow:
      "0 0 8px rgba(34, 240, 255, 0.85), 0 0 22px rgba(34, 240, 255, 0.45), 0 0 40px rgba(255, 43, 214, 0.35)",
  },
  subtitle: {
    color: "#b9bfe6",
    fontSize: 15,
    margin: "0 0 22px",
    lineHeight: 1.5,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "16px 18px",
    borderRadius: 14,
    border: "1px solid rgba(34, 240, 255, 0.45)",
    fontSize: 15,
    color: "#f1f3ff",
    outline: "none",
    marginBottom: 20,
    background: "#0a0818",
    fontFamily: "inherit",
  },
  statsBar: {
    display: "flex",
    justifyContent: "space-between",
    background: "rgba(255, 43, 214, 0.08)",
    borderRadius: 12,
    padding: "12px 18px",
    marginBottom: 16,
    border: "1px solid rgba(255, 43, 214, 0.45)",
    boxShadow: "0 0 14px rgba(255, 43, 214, 0.2)",
  },
  statsText: {
    fontWeight: 700,
    color: "#e6e9ff",
    fontSize: 13,
  },
  statsTextAccent: {
    fontWeight: 700,
    color: "#b6ff3b",
    fontSize: 13,
    textShadow: "0 0 8px rgba(182, 255, 59, 0.6)",
  },
  emptyState: {
    color: "#b9bfe6",
    fontSize: 14,
    textAlign: "center",
    padding: "24px 0",
    fontWeight: 500,
  },
  taskRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    background: "#120f26",
    border: "1px solid rgba(139, 92, 246, 0.55)",
    borderRadius: 14,
    padding: "14px 16px",
    marginBottom: 10,
    boxShadow: "0 0 12px rgba(139, 92, 246, 0.18)",
  },
  checkbox: {
    width: 22,
    height: 22,
    minWidth: 22,
    borderRadius: "50%",
    border: "2px solid #22f0ff",
    cursor: "pointer",
    padding: 0,
  },
  taskText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
  },
  editInput: {
    flex: 1,
    fontSize: 15,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #22f0ff",
    outline: "none",
    color: "#f1f3ff",
    background: "#0a0818",
    fontFamily: "inherit",
  },
  deleteButton: {
    background: "transparent",
    color: "#ff5c8a",
    border: "1px solid #ff5c8a",
    borderRadius: 10,
    padding: "8px 14px",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(255, 92, 138, 0.45)",
    fontFamily: "inherit",
  },
  trashContainer: {
    marginTop: 32,
    borderTop: "2px dashed rgba(34, 240, 255, 0.4)",
    paddingTop: 20,
  },
  trashHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  trashTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#e6e9ff",
    margin: 0,
  },
  clearTrashButton: {
    background: "transparent",
    color: "#b9bfe6",
    border: "none",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "underline",
    fontFamily: "inherit",
  },
  trashRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#0f0c20",
    border: "1px solid rgba(143, 149, 194, 0.4)",
    borderRadius: 12,
    padding: "10px 14px",
    marginBottom: 8,
  },
  trashText: {
    color: "#a5aad0",
    fontSize: 14,
    textDecoration: "line-through",
  },
  restoreButton: {
    background: "transparent",
    color: "#22f0ff",
    border: "1px solid #22f0ff",
    borderRadius: 8,
    padding: "6px 12px",
    fontWeight: 700,
    fontSize: 11,
    cursor: "pointer",
    boxShadow: "0 0 10px rgba(34, 240, 255, 0.45)",
    fontFamily: "inherit",
  },
};