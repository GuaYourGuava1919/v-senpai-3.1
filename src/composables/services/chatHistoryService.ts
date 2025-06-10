// ✅ chatHistoryService.ts - RTDB 操作
// import { getDatabase, ref as dbRef, get as dbGet, set as dbSet } from 'firebase/database'
import { db } from '@/config/firebaseConfig'
import type { ChatPair } from './types'
import { getDocs, collection, query, orderBy } from 'firebase/firestore'

export const fetchChatHistory = async (uid: string): Promise<ChatPair[]> => {
  try {
    const chatHistoryRef = collection(db, `users/${uid}/conversation-0610`)
    const q = query(chatHistoryRef, orderBy('createdAt', 'desc')) // 排序
    const snapshot = await getDocs(q)

    const pairs: ChatPair[] = []
    snapshot.docs.slice(0, 3).forEach((doc) => {
      const data = doc.data()
      if (Array.isArray(data.messagePairs)) {
        data.messagePairs.forEach((pair: any) => {
          pairs.push({ user: pair.user, ai: pair.ai, metadata: pair.metadata })
        })
      }
      // console.log('rawdata', data)
    })

    console.log('✅ 讀取最新三筆資料成功:', pairs)
    return pairs
  } catch (error) {
    console.error('❌ 讀取最新三筆資料發生錯誤:', error)
    return []
  }
}

// export const saveChatHistoryToRTDB = async (uid: string, history: ChatPair[]) => {
//   try {
//     const dbInstance = getDatabase()
//     const chatHistoryRef = dbRef(dbInstance, `users/${uid}/chatHistory`)
//     await dbSet(chatHistoryRef, history.slice(-3))
//     console.log('✅ 儲存至 RTDB 成功')
//   } catch (error) {
//     console.error('❌ 儲存至RTDB失敗:', error)
//   }
// }
