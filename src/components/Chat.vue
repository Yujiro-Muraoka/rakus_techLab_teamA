<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import socketManager from "../socketManager.js"
import { useRouter, useRoute } from "vue-router"

const userName = inject("userName")
const socket   = socketManager.getInstance()
const router   = useRouter()
const route    = useRoute()
const animeId    = route.query.id
const animeTitle = route.query.title            // ★ Home から渡された作品 ID

/* ---------- 入力 & ログ ---------- */
const chatContent = ref("")
const chatList    = reactive([])

/* ---------- 送信 ---------- */
const onPublish = () => {
  const msg = chatContent.value.trim()
  if (!msg) return

  socket.emit(
    "publishEvent",
    JSON.stringify({ content: msg, user: userName.value, anime: animeId })
  )

  const reviews = JSON.parse(localStorage.getItem("reviews") || "[]")
  reviews.push({ text: msg, evaluation: 0, anime: animeId })
  localStorage.setItem("reviews", JSON.stringify(reviews))

  chatContent.value = ""
  router.push({
  name : "review",
  query: { id: animeId, title: animeTitle }   // ★ title を一緒に
})
}

/* ---------- 戻る ---------- */
const onExit = () => {
  socket.emit("exitEvent", userName.value)
  router.push({
  name : "review",
  query: { id: animeId, title: animeTitle }
})
}

/* ---------- 受信 ---------- */
const onReceivePublish = (data) => {
  const chat = JSON.parse(data)
  chatList.push(`${chat.user}さん：${chat.content}`)
}

/* ---------- ソケット登録 ---------- */
onMounted(() => socket.on("publishEvent", onReceivePublish))
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <div class="mt-10">
      <textarea rows="15" class="area" v-model="chatContent"
                placeholder="投稿文を入力してください" />

      <div class="button-row">
        <router-link :to="{ name:'review', query:{ id:animeId } }" class="link">
          <button class="button-normal button-exit" type="button" @click="onExit">戻る</button>
        </router-link>
        <button class="button-normal" @click="onPublish">投稿</button>
      </div>

      <div class="mt-5" v-if="chatList.length">
        <ul>
          <li class="item mt-4" v-for="(c,i) in [...chatList].reverse()" :key="i">{{ c }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link{
  text-decoration:none
}

.area{
  width:80%;
  max-width:800px;
  display:block;
  margin:8px auto 0;
  border:1px solid #000;
}

.button-row{
  width:80%;
  max-width:800px;
  margin:8px auto 0;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.button-normal{
  height:44px;
  padding:0 24px;
  margin:0
}

.button-exit{
  background:#6c757d;color:#fff
}

.item{
  display:block
  }
</style>
