const BASE = "/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  // Auth
  login: (username: string, password: string) =>
    apiFetch<{ username: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => apiFetch<{ message: string }>("/admin/logout", { method: "POST" }),
  me: () => apiFetch<{ username: string }>("/admin/me"),

  // Public posts
  listPosts: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set("category", params.category);
    if (params?.search) q.set("search", params.search);
    const qs = q.toString();
    return apiFetch<Post[]>(`/posts${qs ? `?${qs}` : ""}`);
  },
  getPost: (id: number) => apiFetch<Post>(`/posts/${id}`),
  getPostBySlug: (slug: string) => apiFetch<Post>(`/posts/slug/${slug}`),

  // Admin posts
  adminListPosts: () => apiFetch<Post[]>("/admin/posts"),
  adminGetPost: (id: number) => apiFetch<Post>(`/admin/posts/${id}`),
  adminCreatePost: (data: CreatePostData) =>
    apiFetch<Post>("/admin/posts", { method: "POST", body: JSON.stringify(data) }),
  adminUpdatePost: (id: number, data: Partial<CreatePostData>) =>
    apiFetch<Post>(`/admin/posts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  adminDeletePost: (id: number) =>
    apiFetch<void>(`/admin/posts/${id}`, { method: "DELETE" }),

  // Storage
  requestUploadUrl: (name: string, size: number, contentType: string) =>
    apiFetch<{ uploadURL: string; objectPath: string }>("/storage/uploads/request-url", {
      method: "POST",
      body: JSON.stringify({ name, size, contentType }),
    }),
};

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string | null;
  status: "draft" | "published";
  readTime: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage?: string | null;
  status: "draft" | "published";
  readTime: number;
}
