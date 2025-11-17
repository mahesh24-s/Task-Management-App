'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import { Loader2, Plus, RefreshCcw, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskFormDialog } from "@/components/tasks/task-form-dialog"
import { TaskStatusBadge } from "@/components/tasks/task-status-badge"
import { useAuth } from "@/providers/auth-provider"
import type { PaginatedResponse, Task, TaskFilters } from "@/types"

const initialMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
}

const statusOptions = [
  { label: "All statuses", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
]

const limitOptions = [5, 10, 20]

export default function DashboardPage() {
  const { authorizedFetch } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [meta, setMeta] = useState(initialMeta)
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    limit: 10,
    status: "ALL",
    search: "",
  })
  const [searchInput, setSearchInput] = useState("")
  const [isFetching, setIsFetching] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const loadTasks = useCallback(async () => {
    try {
      setIsFetching(true)
      const params = new URLSearchParams({
        page: String(filters.page),
        limit: String(filters.limit),
      })

      if (filters.status !== "ALL") {
        params.append("status", filters.status)
      }
      if (filters.search.trim()) {
        params.append("search", filters.search.trim())
      }

      const response = await authorizedFetch(`/api/tasks?${params.toString()}`)
      const data = (await response.json()) as PaginatedResponse<Task[]>

      if (!response.ok) {
        throw new Error(data && "message" in data ? (data as { message: string }).message : "Unable to load tasks")
      }

      setTasks(data.data)
      setMeta(data.meta)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load tasks"
      toast.error(message)
    } finally {
      setIsFetching(false)
    }
  }, [authorizedFetch, filters])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        search: searchInput,
      }))
    }, 400)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  const refetch = () => {
    setFilters((prev) => ({ ...prev }))
  }

  const normalizePayload = (values: { title: string; description?: string; status: Task["status"] }) => ({
    title: values.title.trim(),
    description: values.description?.trim() ? values.description.trim() : null,
    status: values.status,
  })

  const handleCreate = async (values: { title: string; description?: string; status: Task["status"] }) => {
    const response = await authorizedFetch("/api/tasks", {
      method: "POST",
      body: JSON.stringify(normalizePayload(values)),
    })
    const payload = await response.json()

    if (!response.ok) {
      const message = payload?.message ?? "Failed to create task"
      toast.error(message)
      throw new Error(message)
    }

    toast.success("Task created")
    refetch()
  }

  const handleUpdate = async (values: { title: string; description?: string; status: Task["status"] }) => {
    if (!editingTask) return
    const response = await authorizedFetch(`/api/tasks/${editingTask.id}`, {
      method: "PATCH",
      body: JSON.stringify(normalizePayload(values)),
    })
    const payload = await response.json()

    if (!response.ok) {
      const message = payload?.message ?? "Failed to update task"
      toast.error(message)
      throw new Error(message)
    }

    toast.success("Task updated")
    setEditingTask(null)
    setIsEditOpen(false)
    refetch()
  }

  const handleDelete = async (taskId: string) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return

    const response = await authorizedFetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const payload = await response.json()
      toast.error(payload?.message ?? "Failed to delete task")
      return
    }

    toast.success("Task deleted")
    refetch()
  }

  const handleToggle = async (taskId: string) => {
    const response = await authorizedFetch(`/api/tasks/${taskId}/toggle`, {
      method: "POST",
    })
    if (!response.ok) {
      const payload = await response.json()
      toast.error(payload?.message ?? "Failed to toggle task")
      return
    }
    toast.success("Task status updated")
    refetch()
  }

  const summary = useMemo(() => {
    return {
      total: meta.total,
      completed: tasks.filter((task) => task.status === "COMPLETED").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
    }
  }, [meta.total, tasks])

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-2xl border border-dashed border-white/60 bg-white/60 px-3 py-2 shadow-inner">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search tasks by title..."
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value as TaskFilters["status"],
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="min-w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(filters.limit)}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  limit: Number(value),
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                {limitOptions.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    Show {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({ page: 1, limit: 10, status: "ALL", search: "" })
                setSearchInput("")
              }}
            >
              Clear filters
            </Button>
            <TaskFormDialog
              mode="create"
              open={isCreateOpen}
              onOpenChange={setIsCreateOpen}
              triggerLabel="Add task"
              onSubmit={handleCreate}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-none bg-gradient-to-br from-[#ffcf96] via-[#ffb47f] to-[#ff9552] text-[#3f2500] shadow-xl">
          <CardHeader>
            <CardDescription>Total tasks</CardDescription>
            <CardTitle className="text-3xl">{summary.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-none bg-gradient-to-br from-[#b3f3d0] via-[#7dd193] to-[#42b883] text-[#053421] shadow-xl">
          <CardHeader>
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-3xl">{summary.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-none bg-gradient-to-br from-[#ffe6f1] via-[#f8c7e0] to-[#dba0ff] text-[#381545] shadow-xl">
          <CardHeader>
            <CardDescription>In progress</CardDescription>
            <CardTitle className="text-3xl">{summary.inProgress}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-none bg-white/85 shadow-2xl backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Tasks</CardTitle>
            <CardDescription>
              Showing page {meta.page} of {meta.totalPages}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={refetch}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <p>No tasks match your filters yet.</p>
              <Button size="sm" onClick={() => setIsCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create your first task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/70 bg-card/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <TaskStatusBadge status={task.status} />
                    </div>
                    {task.description ? <p className="text-sm text-muted-foreground">{task.description}</p> : null}
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(task.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingTask(task)
                        setIsEditOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant={task.status === "COMPLETED" ? "secondary" : "default"}
                      size="sm"
                      onClick={() => handleToggle(task.id)}
                    >
                      {task.status === "COMPLETED" ? "Mark as pending" : "Mark as completed"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(task.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row">
            <p>
              Showing {tasks.length} of {meta.total} tasks
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={meta.page === 1}
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              >
                Previous
              </Button>
              <span>
                Page {meta.page} / {meta.totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setFilters((prev) => ({ ...prev, page: Math.min(prev.page + 1, meta.totalPages) }))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskFormDialog
        mode="edit"
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open)
          if (!open) {
            setEditingTask(null)
          }
        }}
        initialTask={editingTask ?? undefined}
        onSubmit={handleUpdate}
      />
    </section>
  )
}

