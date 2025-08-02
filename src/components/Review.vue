<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import socketManager from '../socketManager.js'

const router  = useRouter()
const route   = useRoute()
const animeId    = route.query.id    ?? null
const animeTitle = route.query.title ?? animeId   // ← 無ければ ID をそのまま     // ★ 作品 ID （無ければ全件）

/* ---------- ローカルストレージ取得 ---------- */



// ★ ソケットインスタンスを setup のトップレベルで取得
const socket = socketManager.getInstance() 


const reviews = ref([])

// ★ onMounted: コンポーネントがマウントされた時の処理
onMounted(() => {
  // 1. ローカルストレージからレビューを読み込む
  const loadedReviews = JSON.parse(localStorage.getItem("reviews") || "[]")
  reviews.value = loadedReviews.map((review, index) => ({
    ...review,
    id: review.id || `review-${index}` // IDがない場合に備える
  }))

  // ★ 2. サーバーからの 'evaluate_review' イベントをリッスンする
  if (socket) {
    socket.on('review_updated', (data) => {
      console.log('サーバーから評価の平均値データを受信しました:', data)
      console.log('受信したreviewId:', data.reviewId); // 追加

      reviews.value = reviews.value.map(review => {
        console.log('現在のレビューID:', review.id); // 追加
        if (review.id === data.reviewId) {
          console.log('IDが一致しました。評価を更新します:', review.id); // 追加
          return { ...review, evaluation: data.newAverage }
        }
        return review
      })

      localStorage.setItem("reviews", JSON.stringify(reviews.value))
    })
  }
})

// ★ onUnmounted: コンポーネントが破棄される時の処理
onUnmounted(() => {
  // イベントリスナーを解除してメモリリークを防ぐ
  if (socket) {
    socket.off('review_updated')
  }
})

/* ---------- ID でフィルタ ---------- */
// filtered computed プロパティをここに追加します
const filtered = computed(() => {
  const allReviews = reviews.value; // reviews.value へのリアクティブな依存を明示
  if (animeId) {
    return allReviews.filter(r => r.anime === animeId);
  } else {
    return allReviews;
  }
});


// --- 以下、既存のコード (一部変更あり) ---

const expandedIndex = ref(null)
const selectedRatings = ref({})

const getStars = (score) => {
  // toFixed(1)などで丸められた値にも対応できるよう、小数点以下も考慮
  const fullStars = Math.floor(score)
  const halfStar = score % 1 >= 0.5 
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
  return "★".repeat(fullStars) + (halfStar ? "☆" : "") + "☆".repeat(emptyStars)
}


const setRating = (index, value) => {
  selectedRatings.value[index] = value
}

const toggleExpand = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

const goHome = () => {
  router.push({ name: "home" })
}

const goChat = () => {
  router.push({                              // ★ title も忘れず持っていく
    name : "chat",
    query: { id: animeId, title: animeTitle }
  })
}

const evaluateReview = (index) => {
  const selected = selectedRatings.value[index]
  if (!selected) return

  const review = filtered.value[index] // filteredの配列から対象のレビューを取得

  // ★ サーバーに 'evaluate_review' を送信する
  if (socket && socket.connected) {
    const dataToSend = {
      reviewId: review.id, // 取得したレビューのIDをそのまま使用
      rating: selected,
      animeId: animeId // ★ サーバーにも animeId を送信することを検討 (後述)
    }
    socket.emit('evaluate_review', dataToSend)
  } else {
    console.error('ソケットが接続されていません。')
  }
}
</script>

<template>
  <div class="review-container">
    <h1 class="text-h3 font-weight-medium">
      レビュー一覧 <span v-if="animeId">（{{ animeTitle }}）</span>
    </h1>

    <div class="review-wrapper">
      <div class="review-list">
        <div v-for="(r,i) in filtered" :key="i" class="review-card" @click="toggleExpand(i)">
        <!-- <div v-for="(r,i) in reviews" :key="i" class="review-card" @click="toggleExpand(i)"> -->
          <div class="avatar"></div>
          <div class="review-content">
            <p class="review-text">{{ r.text }}</p>
            <p class="review-stars">{{ getStars(r.evaluation) }}</p>
            <p class="review-score">{{ r.evaluation.toFixed(1) }} / 5</p>

            <!-- 展開表示 -->
            <div v-if="expandedIndex === i" class="expand-area">
              <p>このレビューを評価してください:</p>
              <div class="star-select">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="select-star"
                  :class="{ selected: selectedRatings[i] >= n }"
                  @click.stop="setRating(i, n)"
                >
                  ★
                </span>
              </div>
              <button class="btn btn-evaluate" @click.stop="evaluateReview(i)">
                このレビューを評価する
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button-area">
      <button class="btn btn-secondary" @click="goHome">戻る</button>
      <button class="btn btn-primary"   @click="goChat">レビューを投稿する</button>
    </div>
  </div>
</template>

<style scoped>
.review-container {
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}
.text-h3 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}
.review-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}
.review-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e6e6e6;
}
.avatar {
  width: 50px;
  height: 50px;
  background-color: #ccc;
  border-radius: 50%;
  margin-right: 16px;
}
.review-content {
  flex: 1;
}
.review-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 6px;
}
.review-stars {
  color: #f39c12;
  font-size: 18px;
  margin-bottom: 4px;
}
.review-score {
  font-size: 14px;
  color: #666;
}
/* 下部ボタン */
.button-area {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 30px;
}
.btn {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: #fff;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}
.btn-secondary:hover {
  background-color: #565e64;
}
.expand-area {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ddd;
}
.star-select {
  display: flex;
  gap: 8px;
  margin: 10px 0;
}
.select-star {
  font-size: 24px;
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
}
.select-star.selected {
  color: #f39c12;
}
.btn-evaluate {
  padding: 8px 16px;
  font-size: 14px;
  background-color: #28a745;
  color: white;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.btn-evaluate:hover {
  background-color: #218838;
}
/* 
.review-container{max-width:80%;margin:0 auto;padding:20px;font-family:Arial, sans-serif;}
.text-h3{text-align:center;margin-bottom:20px;font-size:24px;}
.review-list{display:flex;flex-direction:column;gap:16px;margin-bottom:30px;}
.review-card{display:flex;align-items:center;border:1px solid #e6e6e6;border-radius:10px;padding:16px;box-shadow:0 2px 8px rgba(0,0,0,.08);}
.avatar{width:50px;height:50px;border-radius:50%;background:#ccc;margin-right:16px}
.review-text{font-weight:500;margin-bottom:6px}
.review-score{color:#555;font-size:14px}
.button-area{display:flex;justify-content:center;gap:16px;margin-top:30px}
.btn{padding:12px 20px;border:none;border-radius:8px;font-weight:bold;cursor:pointer}
.btn-primary{background:#007bff;color:#fff}.btn-primary:hover{background:#0056b3}
.btn-secondary{background:#6c757d;color:#fff}.btn-secondary:hover{background:#565e64}
 */

</style>
