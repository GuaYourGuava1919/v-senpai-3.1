// ✅ types.ts - 放共同使用的型別
export interface ChatMessage {
  sender: string
  text: string
  createdAt: string
  metadata?: string
  docid?: string
  feedback?: string
}

export interface ChatPair {
  user: string
  ai: string
  metadata: string
}
