export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<TData> = {
  data: TData;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  country?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
};

export type TaskFilters = {
  page: number;
  limit: number;
  status: TaskStatus | "ALL";
  search: string;
};

export type TaskPayload = {
  title: string;
  description?: string | null;
  status?: TaskStatus;
};

