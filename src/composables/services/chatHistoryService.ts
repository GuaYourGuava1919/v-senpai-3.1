// ✅ chatHistoryService.ts - RTDB 操作
import { getDatabase, ref as dbRef, get as dbGet, set as dbSet } from 'firebase/database'
import type { ChatPair } from './types'

export const fetchChatHistory = async (uid: string): Promise<ChatPair[]> => {
  try {
    const dbInstance = getDatabase()
    const chatHistoryRef = dbRef(dbInstance, `users/${uid}/chatHistory`)
    const snapshot = await dbGet(chatHistoryRef)
    return snapshot.exists() ? (snapshot.val() as ChatPair[]) : []
  } catch (error) {
    console.error('❌ 讀取 RTDB 發生錯誤:', error)
    return []
  }
}

export const saveChatHistoryToRTDB = async (uid: string, history: ChatPair[]) => {
  try {
    const dbInstance = getDatabase()
    const chatHistoryRef = dbRef(dbInstance, `users/${uid}/chatHistory`)
    await dbSet(chatHistoryRef, history.slice(-3))
    console.log('✅ 儲存至 RTDB 成功')
  } catch (error) {
    console.error('❌ 儲存至RTDB失敗:', error)
  }
}
