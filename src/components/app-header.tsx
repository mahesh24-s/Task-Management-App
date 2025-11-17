'use client'

import { LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/providers/auth-provider"

export function AppHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="flex flex-col gap-4 border-b border-border/60 bg-card/50 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">TaskFlow</p>
        <h1 className="text-2xl font-semibold">Task Dashboard</h1>
        <p className="text-muted-foreground">Track, filter, and update tasks in real-time.</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="justify-between gap-3 sm:min-w-[220px]">
            <span className="text-left">
              <span className="block text-xs text-muted-foreground">Signed in as</span>
              <span className="block font-medium">{user?.name}</span>
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => logout()} className="gap-2 text-destructive">
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}

