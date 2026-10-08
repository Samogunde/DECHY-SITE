/**
 * The DECHY data layer: one small key-value interface with three backends. Records (inquiries,
 * support requests, conversations, contacts, activity) are JSON documents under prefixed keys.
 *
 *   netlify-blobs  production on Netlify (Netlify Blobs, strong consistency); chosen automatically
 *                  when the Netlify runtime provides a blobs context
 *   file           local development and browser tests: JSON files under DATA_DIR (default .data/)
 *   memory         unit tests and ephemeral previews
 *   none           storage disabled; anything that needs it reports "unavailable"
 *
 * Choose explicitly with DATA_STORE. Server-only: never import this from a client component.
 */
import fs from "node:fs/promises";
import path from "node:path";

export type StoreKind = "netlify-blobs" | "file" | "memory" | "none";

export interface Store {
  readonly kind: StoreKind;
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  /** Keys that start with the prefix. */
  list(prefix: string): Promise<string[]>;
}

const SAFE_KEY = /^[a-z0-9][a-z0-9/_.-]{0,200}$/i;
function checkKey(key: string) {
  if (!SAFE_KEY.test(key) || key.includes("..")) throw new Error("Invalid store key");
}

export class MemoryStore implements Store {
  readonly kind = "memory" as const;
  private data = new Map<string, string>();
  async get<T>(key: string) {
    checkKey(key);
    const v = this.data.get(key);
    return v === undefined ? null : (JSON.parse(v) as T);
  }
  async set<T>(key: string, value: T) {
    checkKey(key);
    this.data.set(key, JSON.stringify(value));
  }
  async delete(key: string) {
    this.data.delete(key);
  }
  async list(prefix: string) {
    return [...this.data.keys()].filter((k) => k.startsWith(prefix)).sort();
  }
}

export class FileStore implements Store {
  readonly kind = "file" as const;
  constructor(private dir: string) {}
  private file(key: string) {
    checkKey(key);
    // Each key is one file; "/" in a key becomes a folder.
    return path.join(this.dir, ...key.split("/")) + ".json";
  }
  async get<T>(key: string) {
    try {
      return JSON.parse(await fs.readFile(this.file(key), "utf8")) as T;
    } catch {
      return null;
    }
  }
  async set<T>(key: string, value: T) {
    const f = this.file(key);
    await fs.mkdir(path.dirname(f), { recursive: true });
    const tmp = `${f}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value), "utf8");
    await fs.rename(tmp, f);
  }
  async delete(key: string) {
    await fs.rm(this.file(key), { force: true });
  }
  async list(prefix: string) {
    const out: string[] = [];
    const walk = async (dir: string, rel: string) => {
      let entries: import("node:fs").Dirent[];
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch {
        return;
      }
      for (const e of entries) {
        const r = rel ? `${rel}/${e.name}` : e.name;
        if (e.isDirectory()) await walk(path.join(dir, e.name), r);
        else if (e.name.endsWith(".json")) out.push(r.slice(0, -5));
      }
    };
    await walk(this.dir, "");
    return out.filter((k) => k.startsWith(prefix)).sort();
  }
}

export class BlobsStore implements Store {
  readonly kind = "netlify-blobs" as const;
  private store: Promise<import("@netlify/blobs").Store>;
  constructor(name: string) {
    this.store = import("@netlify/blobs").then((m) => m.getStore({ name, consistency: "strong" }));
  }
  async get<T>(key: string) {
    checkKey(key);
    const v = await (await this.store).get(key, { type: "json" });
    return (v ?? null) as T | null;
  }
  async set<T>(key: string, value: T) {
    checkKey(key);
    await (await this.store).setJSON(key, value);
  }
  async delete(key: string) {
    checkKey(key);
    await (await this.store).delete(key);
  }
  async list(prefix: string) {
    const { blobs } = await (await this.store).list({ prefix });
    return blobs.map((b) => b.key).sort();
  }
}

class NoStore implements Store {
  readonly kind = "none" as const;
  async get<T>(): Promise<T | null> {
    throw new StoreUnavailable();
  }
  async set(): Promise<void> {
    throw new StoreUnavailable();
  }
  async delete(): Promise<void> {
    throw new StoreUnavailable();
  }
  async list(): Promise<string[]> {
    throw new StoreUnavailable();
  }
}

export class StoreUnavailable extends Error {
  constructor() {
    super("Storage is not configured");
  }
}

type Env = Record<string, string | undefined>;

export function storeKind(env: Env = process.env): StoreKind {
  const explicit = env.DATA_STORE?.trim().toLowerCase();
  if (
    explicit === "netlify-blobs" ||
    explicit === "file" ||
    explicit === "memory" ||
    explicit === "none"
  )
    return explicit;
  if (env.NETLIFY_BLOBS_CONTEXT) return "netlify-blobs";
  return "file";
}

let cached: { key: string; store: Store } | null = null;
let injected: Store | null = null;

/** The configured store (one instance per process). */
export function getStore(env: Env = process.env): Store {
  if (injected) return injected;
  const kind = storeKind(env);
  const key = `${kind}:${env.DATA_DIR ?? ""}`;
  if (cached?.key === key) return cached.store;
  const store: Store =
    kind === "netlify-blobs"
      ? new BlobsStore(env.DATA_STORE_NAME?.trim() || "dechy-admin")
      : kind === "file"
        ? // The local data folder is never part of the server bundle (and is unused on Netlify).
          new FileStore(path.resolve(/*turbopackIgnore: true*/ env.DATA_DIR?.trim() || ".data"))
        : kind === "memory"
          ? new MemoryStore()
          : new NoStore();
  cached = { key, store };
  return store;
}

/** For tests: replace the process store (pass null to go back to configuration). */
export function setStore(store: Store | null) {
  injected = store;
}
