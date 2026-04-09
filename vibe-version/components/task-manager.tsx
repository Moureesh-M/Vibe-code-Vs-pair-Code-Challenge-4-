"use client"

import { useState } from "react"
import { Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type Task = {
  id: string
  title: string
  completed: boolean
}

type Filter = "all" | "active" | "completed"

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const addTask = () => {
    if (!newTask.trim()) return
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.trim(),
      completed: false,
    }
    setTasks((prev) => [task, ...prev])
    setNewTask("")
  }

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed
    if (filter === "completed") return task.completed
    return true
  })

  const activeCount = tasks.filter((t) => !t.completed).length
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="w-full max-w-lg mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tasks
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {activeCount} active · {completedCount} completed
        </p>
      </header>

      {/* Add Task Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addTask()
        }}
        className="flex gap-2 mb-6"
      >
        <Input
          type="text"
          placeholder="Add a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 bg-card border-border placeholder:text-muted-foreground"
        />
        <Button type="submit" size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add task</span>
        </Button>
      </form>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-card rounded-lg border border-border mb-4">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
              filter === f
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {filter === "all" && tasks.length === 0
              ? "No tasks yet. Add one above!"
              : filter === "active"
                ? "No active tasks"
                : "No completed tasks"}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg group hover:border-muted-foreground/30 transition-colors"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                  task.completed
                    ? "bg-accent border-accent"
                    : "border-muted-foreground/40 hover:border-accent"
                )}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed && (
                  <Check className="h-3 w-3 text-accent-foreground" />
                )}
              </button>
              <span
                className={cn(
                  "flex-1 text-sm transition-colors",
                  task.completed
                    ? "text-muted-foreground line-through"
                    : "text-foreground"
                )}
              >
                {task.title}
              </span>
              {task.completed && (
                <span className="text-xs text-accent font-medium">Done</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
