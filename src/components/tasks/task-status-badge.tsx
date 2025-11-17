'use client'

import { Badge } from "@/components/ui/badge"
import type { TaskStatus } from "@/types"

const statusConfig: Record<TaskStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  PENDING: { label: "Pending", variant: "secondary" },
  IN_PROGRESS: { label: "In Progress", variant: "default" },
  COMPLETED: { label: "Completed", variant: "outline" },
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className="capitalize">
      {config.label}
    </Badge>
  )
}

