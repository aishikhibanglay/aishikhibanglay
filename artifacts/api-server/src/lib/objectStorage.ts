import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export class ObjectNotFoundError extends Error {
  constructor() {
    super("Object not found");
    this.name = "ObjectNotFoundError";
    Object.setPrototypeOf(this, ObjectNotFoundError.prototype);
  }
}

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  return createClient(url, key);
}

export class ObjectStorageService {
  async uploadFile(
    buffer: Buffer,
    contentType: string,
    originalName: string
  ): Promise<string> {
    const supabase = getSupabaseClient();
    const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("uploads")
      .upload(path, buffer, { contentType, upsert: false });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage.from("uploads").getPublicUrl(path);
    return data.publicUrl;
  }
}
