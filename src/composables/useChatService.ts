import { ref, type Ref } from 'vue'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { getDatabase, ref as dbRef, get as dbGet, set as dbSet } from 'firebase/database'
import { auth, db } from '@/config/firebaseConfig'

interface ChatMessage {
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

export function useChatService(
  messages: Ref<ChatMessage[]>,
  input: Ref<string>,
  isThinking: Ref<boolean>,
) {
  const accessToken = ref('')
  const messagePairs = ref<ChatPair[]>([])

  const handleSuggestedQuestion = (question: string) => {
    input.value = question
    sendMessage()
  }

  const fetchChatHistory = async (uid: string): Promise<ChatPair[]> => {
    try {
      const dbInstance = getDatabase()
      const chatHistoryRef = dbRef(dbInstance, `users/${uid}/chatHistory`)
      const snapshot = await dbGet(chatHistoryRef)

      if (snapshot.exists()) {
        const data = snapshot.val() as ChatPair[]
        console.log('✅ 讀取RTDB前三組對話:', data)
        return Array.isArray(data) ? data : []
      } else {
        console.warn('⚠️ RTDB前三組對話不存在')
        return []
      }
    } catch (error) {
      console.error('❌ 讀取 RTDB 發生錯誤:', error)
      return []
    }
  }

  const saveChatHistoryToRTDB = async (uid: string, history: ChatPair[]) => {
    try {
      const dbInstance = getDatabase()
      const chatHistoryRef = dbRef(dbInstance, `users/${uid}/chatHistory`)
      await dbSet(chatHistoryRef, history.slice(-3))
      console.log('✅ 儲存至 RTDB 成功')
    } catch (error) {
      console.error('❌ 儲存至RTDB失敗:', error)
    }
  }

  const sendMessage = async () => {
    console.log('📨 觸發 sendMessage:', {
      text: input.value,
      token: accessToken.value,
      uid: auth.currentUser?.uid,
    })

    const userText = input.value.trim()
    const uid = auth.currentUser?.uid
    if (!userText || !accessToken.value || !uid) return

    const timestamp = new Date().toISOString()
    messages.value.push({ sender: 'user', text: userText, createdAt: timestamp })
    input.value = ''
    isThinking.value = true

    // const loadingMsg: ChatMessage = {
    //   sender: 'ai',
    //   text: '⏳ AI 正在思考...',
    //   createdAt: timestamp,
    // }
    // messages.value.push(loadingMsg)
    console.log('✅ 使用者訊息:', userText)
    try {
      const history = await fetchChatHistory(uid)

      const response = await fetch(`http://localhost:5000/api/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history,
          accessToken: accessToken.value,
        }),
      })

      if (!response.ok) throw new Error(`HTTP 錯誤！狀態碼: ${response.status}`)

      const data = await response.json()
      const aiText = data.reply[0]
      const metadata = data.reply[1]

      messages.value[messages.value.length - 1] = {
        sender: 'ai',
        text: aiText,
        createdAt: new Date().toISOString(),
      }

      messagePairs.value.push({ user: userText, ai: aiText, metadata })
      await saveConversation(messagePairs.value)
      await saveChatHistoryToRTDB(uid, [...history, ...messagePairs.value])
      messagePairs.value = []
    } catch (err: any) {
      console.error('❌API打失敗:', err)
      messages.value[messages.value.length - 1] = {
        sender: 'ai',
        text: '⚠️ 系統錯誤，請稍後再試\n' + (err?.message ?? ''),
        createdAt: new Date().toISOString(),
      }
    } finally {
      isThinking.value = false
    }
  }

  const saveConversation = async (pairs: ChatPair[]) => {
    const uid = auth.currentUser?.uid
    if (!uid) return
    try {
      await addDoc(collection(db, `/users/${uid}/conversation-1`), {
        messagePairs: pairs,
        createdAt: serverTimestamp(),
      })
    } catch (e) {
      console.error('❌對話儲存失敗', e)
    }
  }

  const readUserData = async (uid: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid))
      if (docSnap.exists()) accessToken.value = docSnap.data().accessToken
    } catch (error) {
      console.error('使用者資料s讀取失敗:', error)
    }
  }

  const watchFirestoreMessages = (uid: string) => {
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

      if (messages.value.length === 0) {
        messages.value.push({
          sender: 'ai',
          text:
            '👋 嗨～我是你的學長姊模擬助理 V-Senpai！\n' +
            '我整理了歷屆學長姊在「系統分析與設計」課程中的經驗與建議，\n' +
            '不管是選題、合作、技術、還是報告準備，你都可以問我唷～\n' +
            '如果不知道從哪裡開始，也可以點選下方的引導問題來試試看 👇',
          createdAt: new Date().toISOString(),
          metadata: '這是開場訊息',
          docid: 'init-msg',
        })
      }

      messages.value.push(...loadedMessages)
    })
  }

  const fetchChatHistoryFromFirestore = async (uid: string): Promise<ChatPair[]> => {
    try {
      const convoRef = collection(db, `users/${uid}/conversation-1`)
      const q = query(convoRef, orderBy('createdAt', 'asc'))

      const snapshot = await getDocs(q)
      const pairs: ChatPair[] = []

      for (const doc of snapshot.docs) {
        const data = doc.data()
        // console.log('讀取 Firestore 資料:', data)
        if (Array.isArray(data.messagePairs)) {
          data.messagePairs.forEach((pair: any) => {
            const { user, ai, metadata } = pair
            pairs.push({ user, ai, metadata })
          })
        }
      }
      // console.log('✅ 讀取 Firestore 成功:', pairs)
      return pairs
    } catch (e) {
      console.error('❌ Firestore 讀取失敗:', e)
      return []
    }
  }
  return {
    accessToken,
    sendMessage,
    handleSuggestedQuestion,
    readUserData,
    watchFirestoreMessages,
    fetchChatHistory, // ⬅️ 加上這一行
    fetchChatHistoryFromFirestore,
  }
}
