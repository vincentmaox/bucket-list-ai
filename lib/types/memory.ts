export type MemoryType = "photo" | "text";

export type Memory = {
  id: string;
  wishId?: string;
  type: MemoryType;
  mediaUrl?: string;
  text?: string;
  caption?: string;
  capturedAt: string;
  location?: string;
};
