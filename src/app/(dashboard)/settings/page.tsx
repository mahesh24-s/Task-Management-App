'use client'

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/providers/auth-provider"
import type { AuthUser } from "@/types"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  avatarUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type ProfileValues = z.infer<typeof profileSchema>

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordValues = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const { authorizedFetch, updateUserProfile, user } = useAuth()
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      avatarUrl: user?.avatarUrl ?? "",
    },
  })

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authorizedFetch("/api/auth/me")
        const data = (await response.json()) as AuthUser

        if (!response.ok) {
          throw new Error((data as unknown as { message?: string }).message ?? "Unable to load profile")
        }

        profileForm.reset({
          name: data.name,
          avatarUrl: data.avatarUrl ?? "",
        })

        updateUserProfile(data)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to load profile"
        toast.error(message)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    void loadProfile()
  }, [authorizedFetch, profileForm, updateUserProfile])

  const onSubmitProfile = async (values: ProfileValues) => {
    try {
      const payload = {
        ...values,
        avatarUrl: values.avatarUrl || undefined,
      }

      const response = await authorizedFetch("/api/auth/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as AuthUser | { message?: string }

      if (!response.ok) {
        throw new Error("message" in data && data.message ? data.message : "Unable to update profile")
      }

      updateUserProfile(data as AuthUser)
      toast.success("Profile updated")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update profile"
      toast.error(message)
    }
  }

  const onSubmitPassword = async (values: PasswordValues) => {
    try {
      const response = await authorizedFetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { message?: string }
        throw new Error(data.message ?? "Unable to change password")
      }

      toast.success("Password updated successfully")
      passwordForm.reset()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to change password"
      toast.error(message)
    }
  }

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage how you appear in the workspace and keep your account secure.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr,1.4fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your display name, avatar, and personal details.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProfile ? (
              <div className="flex min-h-[160px] items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="How your name appears in the app" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={profileForm.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile picture URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/avatar.png" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                      {profileForm.formState.isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving
                        </span>
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Change your password to keep your account protected.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" autoComplete="current-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" autoComplete="new-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm new password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" autoComplete="new-password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit" variant="outline" disabled={passwordForm.formState.isSubmitting}>
                    {passwordForm.formState.isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating
                      </span>
                    ) : (
                      "Update password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


