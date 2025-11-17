'use client'

import { ReactNode, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, ListTodo, Loader2, LogOut, Settings, UserCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-col justify-between overflow-y-auto border-r border-border/60 bg-card/80 px-4 py-6 text-sm shadow-sm md:flex">
        <div className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">TaskFlow</p>
            <h1 className="text-xl font-semibold">Workspace</h1>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <UserCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="max-w-[11rem] truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="px-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Navigation</p>
            <Button variant="ghost" className="flex w-full items-center justify-start gap-2" asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
            <Button variant="ghost" className="flex w-full items-center justify-start gap-2" asChild>
              <Link href="/dashboard">
                <ListTodo className="h-4 w-4" />
                <span>Tasks</span>
              </Link>
            </Button>
            <Button variant="ghost" className="flex w-full items-center justify-start gap-2" asChild>
              {/* Placeholder route for future settings page */}
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </Button>
          </nav>
        </div>

        <div className="border-t border-border/60 pt-4">
          <Button
            variant="outline"
            className="flex w-full items-center justify-between gap-2 text-destructive"
            onClick={() => logout()}
          >
            <span>Logout</span>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">{children}</main>
    </div>
  )
}

