// ✅ userService.ts - 使用者資料管理
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebaseConfig'

export const getUserInfo = async () => {
  const auth = getAuth()
  const currentUser = auth.currentUser
  if (!currentUser) return null

  const docRef = doc(db, 'users', currentUser.uid)
  const docSnap = await getDoc(docRef)
  return docSnap.exists() ? docSnap.data() : null
}

export const readUserAccessToken = async (uid: string): Promise<string | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid))
    return docSnap.exists() ? docSnap.data().accessToken : null
  } catch (error) {
    console.error('讀取 accessToken 錯誤:', error)
    return null
  }
}
