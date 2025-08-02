<script setup>
import { inject, ref } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

const router = useRouter()

const socket = socketManager.getInstance()

const animeName = ref("")
const genre = ref(null)

const itemdata = [
    "少年", 
    "冒険", 
    "ファンタジー",
    "恋愛",
    "歴史",
    "ミステリー",
    "アクション",
    "SF",
    "ホラー",
    "音楽",
    "日常",
    "スポーツ",
    "コメディ",
    "バトル"
]

const back = () => {
    router.back();
}

const confirm = () => {
    if(animeName.value.trim() === "") {
        alert("アニメの名前を入力してください")
        return
    }
    if(genre.value == null){
        alert("ジャンルを入力してください")
        return
    }
    socket.emit("createAnime", JSON.stringify({"id": self.crypto.randomUUID(), "label": animeName.value, "category": genre.value}))
    router.back();
}

</script>

<template>
    <v-container style="height: 90vh">
        <v-col>
            <v-row class="mt-3" no-gutters justify="center">
                <h1>アニメを作成</h1>
            </v-row>
            <v-row class="mt-3" no-gutters justify="center">
                <h5>アニメタイトル</h5>
            </v-row>
            <v-row class="mt-3" no-gutters justify="center">
                <input class="user-name-text" v-model="animeName"/>
            </v-row>
            <v-row class="mt-3" no-gutters justify="center" v-model="animeName">
                <h5>ジャンル</h5>
            </v-row>
            <v-row class="mt-3" no-gutters justify="center">
                <v-sheet style="width: 50%">
                    <v-select 
                        multiple
                        v-model.lazy="genre"
                        variant="outlined" 
                        :items="itemdata" 
                        label="ジャンルを選択..." 
                        class="mx-2"></v-select>
                </v-sheet>
            </v-row>
            <v-row class="mt-3" no-gutters justify="space-around">
                <v-btn color="grey" @click="back">戻る</v-btn>
                <v-btn color="primary" @click="confirm">決定</v-btn>
            </v-row>
        </v-col>
    </v-container>
</template>

<style scoped>
/* ユーザー名入力欄のスタイル設定 */
.user-name-text {
  border: 1px solid #9d9c9c;
  border-width: 2px;
  border-radius: 10px;
  margin-bottom: 24px;
  margin-top: 5px;
  padding: 10px;
  width: 49%;
}

.card {
  width: 30%;
}

.right {
  text-align: right;
  margin-right: 30%;
}

.select-kind {
    border: 1px solid #9d9c9c; 
    width: 200px; 
    height: 40px;
    border-width: 2px;
    border-radius: 10px;
}
</style>
