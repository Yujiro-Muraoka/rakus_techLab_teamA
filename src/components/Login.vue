<script setup>
import { inject, ref } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

/**
 * 親コンポーネントから provide されたグローバル変数を取得
 * → ここでは「ユーザー名」をアプリ全体で共有するために利用
 * 
 * 注意: この変数は他のコンポーネントでも使用されるため、
 * グローバルな状態として管理されています。
 * 例: チャット画面やメッセージ送信時に利用
 */
const userName = inject("userName")

/**
 * Vue Router を使用してページ遷移するためのオブジェクト
 * → router.push() でチャット画面に移動できる
 */
const router = useRouter()

/**
 * ソケット通信（Socket.IO）を管理するシングルトンを取得
 * → サーバーとのリアルタイム通信に使用
 */
const socket = socketManager.getInstance()

/**
 * ローカルコンポーネントでのみ使う変数
 * → ユーザーが入力した名前を保持（v-modelで双方向バインディング）
 */
const inputUserName = ref("")

/**
 * 「入室する」ボタンがクリックされたときの処理
 * 1. 入力チェック（未入力ならアラート）
 * 2. サーバーに「enter」イベントを送信
 * 3. グローバル状態の userName に入力値を格納
 * 4. チャット画面（/chat）へページ遷移
 */
const onEnter = () => {
  // 1. 入力チェック：空白なら処理中断
  if (!inputUserName.value.trim()) {
    alert("ユーザー名を入力してください")
    return
  }

  // 3. グローバル変数 userName に反映
  //    → チャット画面など他の画面でユーザー名を利用できる
  userName.value = inputUserName.value

  // 4. ルーターでチャット画面へ遷移
  router.push({ name: "home" })
}
</script>

<template>
  <div class="text-center container"> 
    <h1>ログイン</h1>
    <p>ユーザー名</p>
    <input class="user-name-text" type="text" v-model="inputUserName"/>
    <div class="right">
      <v-btn variant="outlined" @click="onEnter">ログイン</v-btn>
    </div>
  </div>
</template>

<style scoped>
/* ユーザー名入力欄のスタイル設定 */
.user-name-text {
  width: 200px;
  border: 1px solid #9d9c9c;
  border-width: 2px;
  border-radius: 10px;
  margin-bottom: 24px;
  margin-top: 5px;
  padding: 10px;
  width: 30%;
}

.card {
  width: 30%;
}

.right {
  text-align: right;
  margin-right: 30%;
}
</style>
