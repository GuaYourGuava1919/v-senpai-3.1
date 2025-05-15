import { ref } from 'vue'
import { collection, query, orderBy, getDoc, getDocs, doc } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'

type ChatMessage = {
  sender: string
  text: string
  createdAt: string
  metadata?: string
  docid?: string
  feedback?: string
}

const defaultGreetingMessage: ChatMessage = {
  sender: 'ai',
  text:
    '👋 嗨～我是你的學長姊模擬助理 V-Senpai！\n' +
    '我整理了歷屆學長姊在「系統分析與設計」課程中的經驗與建議，\n' +
    '不管是選題、合作、技術、還是報告準備，你都可以問我唷～\n' +
    '如果不知道從哪裡開始，也可以點選下方的引導問題來試試看 👇',
  createdAt: '0000-00-00 00:00:00',
  metadata: '這是開場訊息',
  docid: 'init-msg',
}

export function useChatHistory() {
  const messages = ref<ChatMessage[]>([])
  const accessToken = ref('')
  const errorMessage = ref('')

  const readUserData = async (uid: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid))
      accessToken.value = docSnap.exists() ? (docSnap.data().accessToken as string) : ''
    } catch (error) {
      console.error('❌ Failed to read user data:', error)
      errorMessage.value = '讀取使用者資料時發生錯誤'
    }
  }

  function formatTimestamp(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0')
    const yyyy = date.getFullYear()
    const MM = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const HH = pad(date.getHours())
    const mm = pad(date.getMinutes())
    const ss = pad(date.getSeconds())
    return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
  }

  const loadChatHistory = async (uid: string) => {
    try {
      const ref = collection(db, `/users/${uid}/conversation-1`)
      const q = query(ref)
      const querySnapshot = await getDocs(q)

      const chatHistory: ChatMessage[] = []
      querySnapshot.docs.forEach((docSnap) => {
        const data = docSnap.data()
        const createdAt =
          typeof data.createdAt === 'string'
            ? data.createdAt
            : data.createdAt?.toDate?.()
              ? formatTimestamp(data.createdAt.toDate())
              : formatTimestamp(new Date())

        const messageArray = data.messagePairs || []

        messageArray.forEach((pair: any) => {
          if (pair.user) {
            chatHistory.push({
              sender: 'user',
              text: pair.user,
              createdAt,
              metadata: pair.metadata || '',
              docid: docSnap.id,
            })
          }

          if (pair.ai) {
            chatHistory.push({
              sender: 'ai',
              text: pair.ai,
              createdAt,
              metadata: pair.metadata || '',
              docid: docSnap.id,
            })
          }
        })
      })

      messages.value = [defaultGreetingMessage, ...chatHistory]
      console.log('✅ Chat history loaded:', messages.value)
    } catch (error) {
      console.error('❌ Failed to load chat history:', error)
      errorMessage.value = '無法載入聊天記錄'
    }
  }

  return {
    messages,
    accessToken,
    errorMessage,
    readUserData,
    loadChatHistory,
  }
}
