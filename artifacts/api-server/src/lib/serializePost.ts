import type { Post } from "@workspace/db";

export function serializePost(post: Post) {
  return {
    ...post,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

export function serializePosts(posts: Post[]) {
  return posts.map(serializePost);
}
