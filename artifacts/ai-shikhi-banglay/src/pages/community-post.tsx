import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute, Link } from "wouter";
import {
  ChevronUp, MessageSquare, Share2, ArrowLeft, Loader2,
  Megaphone, CheckCircle2, AlertTriangle, Trash2, CornerDownRight,
} from "lucide-react";
import { useCommunityAuth, communityHeaders } from "@/lib/useCommunityAuth";

interface Post {
  id: number;
  title: string;
  body: string;
  authorName: string;
  isAdminPost: boolean;
  voteCount: number;
  commentCount: number;
  createdAt: string;
  hasVoted?: boolean;
}

interface Comment {
  id: number;
  postId: number;
  authorId: number | null;
  authorName: string;
  body: string;
  parentId: number | null;
  isAdminComment: boolean;
  status: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "এইমাত্র";
  if (mins < 60) return `${mins} মিনিট আগে`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ঘণ্টা আগে`;
  return `${Math.floor(hrs / 24)} দিন আগে`;
}

const VIDEO_EXTENSIONS = /\.(mp4|mov|avi|mkv|webm|flv|wmv|m4v)$/i;
const VIDEO_DOMAINS = /(youtube\.com|youtu\.be|vimeo\.com|dailymotion\.com)/i;
function hasVideoContent(text: string): boolean {
  return VIDEO_EXTENSIONS.test(text) || VIDEO_DOMAINS.test(text);
}

// ─── Comment Form ──────────────────────────────────────────────────────────────
function CommentForm({
  postId, parentId, onCreated, onCancel,
}: {
  postId: number; parentId?: number; onCreated: (c: Comment) => void; onCancel?: () => void;
}) {
  const { member } = useCommunityAuth();
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoWarn, setVideoWarn] = useState(false);

  if (!member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasVideoContent(body)) { setVideoWarn(true); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: "POST",
        headers: communityHeaders(),
        body: JSON.stringify({ body, parentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onCreated(data);
      setBody("");
      if (onCancel) onCancel();
    } catch (err: any) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      {videoWarn && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2.5 flex gap-2 items-start">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">ভিডিও লিংক দেওয়া যাবে না। সরিয়ে ফেলুন।</p>
        </div>
      )}
      <textarea
        value={body}
        onChange={(e) => { setBody(e.target.value); setVideoWarn(hasVideoContent(e.target.value)); }}
        placeholder={parentId ? "উত্তর লিখুন..." : "মন্তব্য লিখুন..."}
        rows={3}
        className="w-full px-3 py-2 bg-muted/40 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 resize-none"
        required
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={loading || videoWarn}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium disabled:opacity-60">
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          {parentId ? "উত্তর দিন" : "মন্তব্য করুন"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">বাতিল</button>
        )}
      </div>
    </form>
  );
}

// ─── Comment Item ──────────────────────────────────────────────────────────────
function CommentItem({
  comment, postId, allComments, onReplyCreated, onDelete,
}: {
  comment: Comment; postId: number; allComments: Comment[];
  onReplyCreated: (c: Comment) => void; onDelete: (id: number) => void;
}) {
  const { member } = useCommunityAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const replies = allComments.filter((c) => c.parentId === comment.id && c.status === "active");
  const canDelete = member && (member.id === comment.authorId || member.isModerator);

  const handleDelete = async () => {
    if (!confirm("এই মন্তব্য মুছবেন?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/community/comments/${comment.id}`, { method: "DELETE", headers: communityHeaders() });
      onDelete(comment.id);
    } finally { setDeleting(false); }
  };

  if (comment.parentId !== null) return null;

  return (
    <div className="border-b border-border/50 last:border-0 pb-4 last:pb-0">
      <div className={`rounded-xl p-3 ${comment.isAdminComment ? "bg-primary/5 border border-primary/20" : "bg-muted/20"}`}>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${comment.isAdminComment ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
              {comment.authorName[0]?.toUpperCase()}
            </div>
            <span className={`text-xs font-medium ${comment.isAdminComment ? "text-primary" : "text-foreground"}`}>
              {comment.authorName}
              {comment.isAdminComment && " (Admin)"}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
          </div>
          {canDelete && (
            <button onClick={handleDelete} disabled={deleting} className="text-muted-foreground hover:text-red-400 transition-colors">
              {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        <p className="text-sm text-foreground leading-relaxed">{comment.body}</p>
        {member && (
          <button onClick={() => setShowReplyForm(!showReplyForm)}
            className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            <CornerDownRight className="w-3 h-3" /> উত্তর দিন
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="ml-6 mt-2">
          <CommentForm postId={postId} parentId={comment.id} onCreated={onReplyCreated} onCancel={() => setShowReplyForm(false)} />
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-6 mt-2 flex flex-col gap-2">
          {replies.map((reply) => (
            <div key={reply.id} className={`rounded-lg p-3 ${reply.isAdminComment ? "bg-primary/5 border border-primary/20" : "bg-muted/10 border border-border/40"}`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <CornerDownRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground">{reply.authorName}{reply.isAdminComment && " (Admin)"}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(reply.createdAt)}</span>
                </div>
                {member && (member.id === reply.authorId || member.isModerator) && (
                  <button onClick={async () => {
                    await fetch(`/api/community/comments/${reply.id}`, { method: "DELETE", headers: communityHeaders() });
                    onDelete(reply.id);
                  }} className="text-muted-foreground hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                )}
              </div>
              <p className="text-sm text-foreground">{reply.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function CommunityPostPage() {
  const [, params] = useRoute("/community/post/:id");
  const id = parseInt(params?.id ?? "0");
  const { member } = useCommunityAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("community_token") || "";
    fetch(`/api/community/posts/${id}`, { headers: { "x-community-token": token } })
      .then((r) => r.json())
      .then((d) => {
        setPost(d.post);
        setComments(d.comments || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleVote = async () => {
    if (!member || voting || !post) return;
    setVoting(true);
    try {
      const res = await fetch(`/api/community/posts/${post.id}/vote`, { method: "POST", headers: communityHeaders() });
      if (res.ok) {
        const d = await res.json();
        setPost((p) => p ? { ...p, voteCount: p.voteCount + (d.voted ? 1 : -1), hasVoted: d.voted } : p);
      }
    } finally { setVoting(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCommentCreated = (c: Comment) => setComments((prev) => [...prev, c]);
  const handleCommentDelete = (cid: number) => setComments((prev) => prev.filter((c) => c.id !== cid));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">পোস্ট পাওয়া যায়নি।</p>
      <Link href="/community"><button className="text-primary text-sm">← Community তে ফিরে যান</button></Link>
    </div>
  );

  const topLevelComments = comments.filter((c) => c.parentId === null && c.status === "active");

  return (
    <div className="min-h-screen py-10 md:py-14">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/community">
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Community
          </button>
        </Link>

        {/* Post */}
        <div className={`bg-card border rounded-2xl p-5 mb-6 ${post.isAdminPost ? "border-primary/40" : "border-border"}`}>
          {post.isAdminPost && (
            <div className="flex items-center gap-1.5 text-primary text-xs font-medium mb-3">
              <Megaphone className="w-3.5 h-3.5" /> Admin ঘোষণা
            </div>
          )}
          <h1 className="text-xl md:text-2xl font-bold mb-3 leading-snug">{post.title}</h1>
          <p className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed mb-4">{post.body}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border/50 pt-3">
            <span className="font-medium text-foreground/70">{post.authorName}</span>
            <span>•</span>
            <span>{timeAgo(post.createdAt)}</span>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <button onClick={handleVote} disabled={!member || voting}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-all ${post.hasVoted ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted"} disabled:opacity-50`}>
              {voting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronUp className="w-4 h-4" />}
              {post.voteCount} ভোট
            </button>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground px-3 py-1.5">
              <MessageSquare className="w-4 h-4" /> {post.commentCount}
            </div>
            <button onClick={handleShare} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-all ml-auto">
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              {copied ? "কপি হয়েছে!" : "শেয়ার করুন"}
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-base mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            মন্তব্য ({topLevelComments.length})
          </h2>

          {member ? (
            <div className="mb-6">
              <CommentForm postId={id} onCreated={handleCommentCreated} />
            </div>
          ) : (
            <div className="bg-muted/30 rounded-xl p-3 mb-5 text-center">
              <p className="text-sm text-muted-foreground">মন্তব্য করতে <Link href="/community"><span className="text-primary cursor-pointer">Community তে লগইন</span></Link> করুন।</p>
            </div>
          )}

          {topLevelComments.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">এখনো কোনো মন্তব্য নেই। প্রথমে মন্তব্য করুন!</p>
          ) : (
            <div className="flex flex-col gap-4">
              {topLevelComments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} postId={id} allComments={comments}
                  onReplyCreated={handleCommentCreated} onDelete={handleCommentDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
