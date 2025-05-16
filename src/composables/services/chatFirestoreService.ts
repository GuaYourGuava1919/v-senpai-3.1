// ✅ chatFirestoreService.ts - Firestore 對話紀錄操作
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'
import type { ChatPair, ChatMessage } from './types'
import type { Ref } from 'vue'

export const saveConversationToFirestore = async (uid: string, pairs: ChatPair[]) => {
  try {
    await addDoc(collection(db, `/users/${uid}/conversation-1`), {
      messagePairs: pairs,
      createdAt: serverTimestamp(),
    })
  } catch (e) {
    console.error('❌對話儲存失敗', e)
  }
}

export const fetchChatHistoryFromFirestore = async (uid: string): Promise<ChatPair[]> => {
  try {
    const convoRef = collection(db, `users/${uid}/conversation-1`)
    const q = query(convoRef, orderBy('createdAt', 'asc'))
    const snapshot = await getDocs(q)
    const pairs: ChatPair[] = []

    for (const doc of snapshot.docs) {
      const data = doc.data()
      if (Array.isArray(data.messagePairs)) {
        data.messagePairs.forEach((pair: any) => {
          pairs.push({ user: pair.user, ai: pair.ai, metadata: pair.metadata })
        })
      }
    }
    return pairs
  } catch (e) {
    console.error('❌ Firestore 讀取失敗:', e)
    return []
  }
}

export const watchFirestoreMessages = (
  uid: string,
  messages: Ref<ChatMessage[]>,
  defaultMessage: ChatMessage,
) => {
  const convoRef = collection(db, `/users/${uid}/conversation-1`)
  const q = query(convoRef, orderBy('createdAt'))

  onSnapshot(q, (snapshot) => {
    const loadedMessages: ChatMessage[] = []
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as {
        messagePairs: ChatPair[]
        createdAt?: any
        feedback?: string
      }

      const timestamp =
        data.createdAt?.toDate?.()?.toLocaleString?.() ?? new Date().toLocaleString()

      data.messagePairs.forEach((pair) => {
        loadedMessages.push({
          docid: docSnap.id,
          sender: 'user',
          text: pair.user,
          createdAt: timestamp,
        })
        loadedMessages.push({
          docid: docSnap.id,
          sender: 'ai',
          text: pair.ai,
          createdAt: timestamp,
          metadata: pair.metadata,
          feedback: data.feedback ?? undefined,
        })
      })
    })

    if (messages.value.length === 0) messages.value.push(defaultMessage)
    messages.value.push(...loadedMessages)
  })
}
