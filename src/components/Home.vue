<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import socketManager from "../socketManager.js"

// ルーターのインスタンスを取得
const router = useRouter()

// ソケットのインスタンスを取得
const socket = socketManager.getInstance()


// APIから取得するアニメデータ
const animeData = ref([])

// アニメデータを取得する関数(ソケットやエミットを使用)
const joinHome = () => {
  socket.emit("joinHome", (data) => {
    animeData.value = data
  })
}

// 初回データ取得
onMounted(() => {
  socket.emit("joinHome")
  socket.on("animeData", (data) => {
    animeData.value = JSON.parse(data)
  })
})

// コンポーネントがアンマウントされる前にソケットのリスナーを解除
onBeforeUnmount(() => {
  socket.off("animeData")
})
// ソート条件
const sortOption = ref("alphabet")

// 検索キーワード
const searchQuery = ref("")

// 選択中のカテゴリー
const selectedCategory = ref("全て")

// カテゴリーに基づいてフィルタリング
const filteredButtons = computed(() => {
  const search = searchQuery.value.toLowerCase()

  // アニメデータをカテゴリーと検索キーワードでフィルタリング
  return animeData.value.filter(btn => {
    const categoryMatch =
      selectedCategory.value === "全て" ||
      (selectedCategory.value === "お気に入り" && favorites.value.includes(btn.id)) ||
      btn.category.includes(selectedCategory.value)

    const searchMatch = btn.label.toLowerCase().includes(search)


    return categoryMatch && searchMatch
  })
})


// Review.vue へ遷移（クエリにアニメ名を渡す）
//const goToReview = (id) => {
  //router.push({ name: "review", query: { id } })
const goToReview = (btn) => {                       // btn = { id, label, ... }
  router.push({
    name : "review",
    query: { id: btn.id, title: btn.label }         // ← label を title に
  })
}

// ログアウトボタン
const logout = () => {
  router.push({ name: "login" })  
}

// アニメ追加ボタン
const addAnime = () => {
  router.push({ name: "create-anime" })
  // create-anime ページで追加完了時に:
  socket.emit("addAnime", newAnime)
}

// ソート処理
const sortedButtons = computed(() => {
  let list = [...filteredButtons.value] // フィルタ済みリストをコピー

  if (sortOption.value === "alphabet") {
    // 50音順（labelでソート）
    list.sort((a, b) => a.label.localeCompare(b.label, "ja"))
  } else if (sortOption.value === "reverse-alphabet") {
    // 50音逆順（降順）
    list.sort((a, b) => b.label.localeCompare(a.label, "ja"))
  }

  return list
})

// お気に入りIDを保存するリスト
const favorites = ref(JSON.parse(localStorage.getItem("favorites") || "[]"))

// お気に入り切替処理
const toggleFavorite = (id) => {
  if (favorites.value.includes(id)) {
    favorites.value = favorites.value.filter(fav => fav !== id)
  } else {
    favorites.value.push(id)
  }
}

// LocalStorageに保存
watch(favorites, (newVal) => {
  localStorage.setItem("favorites", JSON.stringify(newVal))
})

// カテゴリー一覧に「お気に入り」を追加
const categories = computed(() => {
  const uniqueCats = new Set()
  animeData.value.forEach(btn => btn.category.forEach(cat => uniqueCats.add(cat)))
  const sortedCats = Array.from(uniqueCats).sort((a, b) =>
    a.localeCompare(b, "ja")
  )
  return ["全て", "お気に入り", ...sortedCats]
})



// お気に入り判定用ヘルパー
const isFavorite = (id) => favorites.value.includes(id)
</script>

<template>
  <div class="home-container">
    <!-- ヘッダー部分 -->
    <div class="header-bar">
      <button class="logout-btn" @click="logout">ログアウト</button>
    </div>

    <!-- 検索タブ -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="検索..."
        class="search-input"
      />
      <button class="add-btn" @click="addAnime">＋ アニメ新規追加</button>
    </div>


    <!-- カテゴリー欄（スライド式） -->
    <div class="category-bar scroll-x">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['category-btn', { active: selectedCategory === cat }]"
        @click="selectedCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- ソートUI -->
    <div class="sort-bar">
      <label>並び替え :  </label>
      <select v-model="sortOption">
        <option value="alphabet">50音順</option>
        <option value="reverse-alphabet">50音逆順</option>
      </select>
    </div>

    <!-- グリッド配置 -->
    <div class="grid">
      <div
        v-for="btn in sortedButtons"
        :key="btn.id"
        class="grid-card"
      >
        <!-- お気に入りボタン（右上固定） -->
        <button
          class="favorite-btn"
          :class="{ active: isFavorite(btn.id) }"
          @click.stop="toggleFavorite(btn.id)"
          title="お気に入り切替"
        >
          ★
        </button>

        <!-- アニメボタン -->
        <button
          class="grid-btn"
          @click="goToReview(btn.id)"
        >
          {{ btn.label }}
        </button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.search-bar {
  display: flex;
  margin-bottom: 10px;
}

.search-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}

/*カテゴリ➖*/
.category-bar.scroll-x {
  display: flex;
  flex-wrap: nowrap;      /* 折り返さず横並び */
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;       /* 横スクロール有効化 */
  overflow-y: hidden;
  white-space: nowrap;    /* テキスト折り返し防止 */
  width: 100%;
  -webkit-overflow-scrolling: touch; /* スマホでの慣性スクロール */
}

.category-bar.scroll-x button {
  flex: 0 0 auto;         /* 子要素が縮まないように固定幅化 */
}

/* カテゴリーボタン */
.category-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #e3f2fd;  /* 薄い青 */
  cursor: pointer;
  font-size: 14px;
  color: #0d47a1; /* 文字色 濃い青 */
  transition: background-color 0.2s;
}

.category-btn:hover {
  background-color: #90caf9; /* 中間の青 */
}

.category-btn.active {
  background-color: #1976d2; /* 濃い青 */
  color: white;
}

/* 並び替えセレクトボックス */
.sort-bar select {
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid #4caf50;
  background-color: #e8f5e9; /* 薄い緑 */
  color: #1b5e20;
  font-size: 14px;
  cursor: pointer;
  transition: border 0.2s;
}

.sort-bar select:hover,
.sort-bar select:focus {
  border-color: #2e7d32; /* 濃い緑 */
}


/* スクロールバーの装飾（WebKit系） */
.category-bar.scroll-x::-webkit-scrollbar {
  height: 6px;
}
.category-bar.scroll-x::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}
.category-bar.scroll-x::-webkit-scrollbar-track {
  background: transparent;
}


/* グリッド配置 */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
  justify-content: center;
}


/* アニメボタン */
.grid-btn {
  --btn-height: clamp(50px, 8vh, 80px);
  height: var(--btn-height);
  width: calc(var(--btn-height) * 2.4);
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.grid-btn:hover {
  background-color: #1976d2;
}

.header-bar {
  width: 100%;
  display: flex;  
  justify-content: flex-end;
  margin-bottom: 10px;
}

/* カード全体 */
.grid-card {
  position: relative;
  display: flex;
  align-items: flex-end;   /* 下端に揃える */
  justify-content: flex-start;
  width: 72%;
  height: var(--btn-height); /* ボタンと同じ高さに統一 */
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background-color: #fafafa;
  transition: box-shadow 0.2s, border-color 0.2s;
  padding: 0; /* 不要な余白削除 */
}

.grid-card:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  border-color: #90caf9;
}

.logout-btn {
  padding: 6px 12px;
  background-color: #f44336;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #d32f2f;
}

.add-btn {
  padding: 8px 12px;
  border: none;
  background: #4caf50;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 8px;
}

.add-btn:hover {
  background: #388e3c;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px; /* ボタンと星の間隔 */
}

/* 星ボタンを右上に配置して重ねる */
.favorite-btn {
  position: absolute;
  top: 17px;
  right: 2px;
  background: none;
  border: none;
  font-size: 20px;
  color: #ccc;
  cursor: pointer;
  transition: color 0.2s, transform 0.1s;
}

.favorite-btn.active {
  color: #ffca28; /* 黄色の星 */
}

.favorite-btn:hover {
  color: #ffa000;
  transform: scale(1.2);
}
</style>