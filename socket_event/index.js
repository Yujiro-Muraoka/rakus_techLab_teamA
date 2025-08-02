const animes = [
  { id: "naruto", label: "NARUTO", category: ["少年", "冒険", "バトル", "ドラマ"] },
  { id: "onepiece", label: "ONE PIECE", category: ["少年", "冒険", "バトル", "コメディ"] },
  { id: "bleach", label: "BLEACH", category: ["少年", "ファンタジー", "バトル", "ミステリー"] },
  { id: "dragonball", label: "ドラゴンボール", category: ["少年", "冒険", "バトル", "コメディ"] },
  { id: "demon-slayer", label: "鬼滅の刃", category: ["少年", "ファンタジー", "バトル", "歴史"] },
  { id: "attack-on-titan", label: "進撃の巨人", category: ["冒険", "ミステリー", "バトル", "ドラマ"] },
  { id: "jujutsu-kaisen", label: "呪術廻戦", category: ["少年", "ファンタジー", "バトル", "ホラー"] },
  { id: "my-hero-academia", label: "僕のヒーローアカデミア", category: ["少年", "バトル", "冒険", "コメディ"] },
  { id: "fairy-tail", label: "FAIRY TAIL", category: ["ファンタジー", "冒険", "バトル", "コメディ"] },
  { id: "black-clover", label: "ブラッククローバー", category: ["ファンタジー", "バトル", "冒険", "少年"] },
  { id: "hunter-x-hunter", label: "HUNTER×HUNTER", category: ["冒険", "少年", "バトル", "心理"] },
  { id: "gintama", label: "銀魂", category: ["少年", "コメディ", "歴史", "バトル"] },
  { id: "rurouni-kenshin", label: "るろうに剣心", category: ["歴史", "冒険", "バトル", "恋愛"] },
  { id: "vinland-saga", label: "ヴィンランド・サガ", category: ["歴史", "冒険", "バトル", "ドラマ"] },
  { id: "fullmetal-alchemist", label: "鋼の錬金術師", category: ["ファンタジー", "冒険", "バトル", "ドラマ"] },
  { id: "fma-brotherhood", label: "鋼の錬金術師 FULLMETAL ALCHEMIST", category: ["ファンタジー", "冒険", "バトル", "心理"] },
  { id: "code-geass", label: "コードギアス 反逆のルルーシュ", category: ["SF", "ミステリー", "バトル", "ドラマ"] },
  { id: "death-note", label: "DEATH NOTE", category: ["ミステリー", "ホラー", "心理", "ドラマ"] },
  { id: "monster", label: "MONSTER", category: ["ミステリー", "心理", "ドラマ", "歴史"] },
  { id: "paranoia-agent", label: "妄想代理人", category: ["ミステリー", "ホラー", "心理", "ドラマ"] },
  { id: "steins-gate", label: "STEINS;GATE", category: ["SF", "ミステリー", "ドラマ", "心理"] },
  { id: "steins-gate-zero", label: "STEINS;GATE ゼロ", category: ["SF", "ミステリー", "心理", "ドラマ"] },
  { id: "neon-genesis-evangelion", label: "新世紀エヴァンゲリオン", category: ["SF", "ミステリー", "心理", "バトル"] },
  { id: "gundam", label: "機動戦士ガンダム", category: ["SF", "歴史", "バトル", "ドラマ"] },
  { id: "gundam-seed", label: "機動戦士ガンダムSEED", category: ["SF", "バトル", "恋愛", "ドラマ"] },
  { id: "gundam-iron-blooded", label: "機動戦士ガンダム 鉄血のオルフェンズ", category: ["SF", "歴史", "バトル", "ドラマ"] },
  { id: "your-name", label: "君の名は。", category: ["恋愛", "ファンタジー", "ドラマ", "ミステリー"] },
  { id: "weathering-with-you", label: "天気の子", category: ["恋愛", "ファンタジー", "ドラマ", "日常"] },
  { id: "clannad", label: "CLANNAD", category: ["恋愛", "日常", "ドラマ", "コメディ"] },
  { id: "clannad-after-story", label: "CLANNAD ～AFTER STORY～", category: ["恋愛", "日常", "ドラマ", "コメディ"] },
  { id: "toradora", label: "とらドラ！", category: ["恋愛", "コメディ", "日常", "ドラマ"] },
  { id: "a-silent-voice", label: "聲の形", category: ["恋愛", "ドラマ", "日常", "心理"] },
  { id: "anohana", label: "あの日見た花の名前を僕達はまだ知らない。", category: ["恋愛", "ミステリー", "ドラマ", "日常"] },
  { id: "angel-beats", label: "Angel Beats!", category: ["ファンタジー", "恋愛", "ドラマ", "コメディ"] },
  { id: "re-zero", label: "Re:ゼロから始める異世界生活", category: ["ファンタジー", "冒険", "バトル", "ドラマ"] },
  { id: "konosuba", label: "この素晴らしい世界に祝福を！", category: ["ファンタジー", "コメディ", "冒険", "バトル"] },
  { id: "overlord", label: "オーバーロード", category: ["ファンタジー", "冒険", "バトル", "ダーク"] },
  { id: "log-horizon", label: "ログ・ホライズン", category: ["ファンタジー", "冒険", "バトル", "コメディ"] },
  { id: "sword-art-online", label: "ソードアート・オンライン", category: ["ファンタジー", "冒険", "バトル", "恋愛"] },
  { id: "no-game-no-life", label: "ノーゲーム・ノーライフ", category: ["ファンタジー", "冒険", "バトル", "コメディ"] },
  { id: "shield-hero", label: "盾の勇者の成り上がり", category: ["ファンタジー", "冒険", "バトル", "ドラマ"] },
  { id: "that-time-i-got-reincarnated-as-a-slime", label: "転生したらスライムだった件", category: ["ファンタジー", "冒険", "バトル", "コメディ"] },
  { id: "grimgar", label: "灰と幻想のグリムガル", category: ["ファンタジー", "冒険", "ドラマ", "バトル"] },
  { id: "made-in-abyss", label: "メイドインアビス", category: ["ファンタジー", "冒険", "ドラマ", "ダーク"] },
  { id: "dr-stone", label: "Dr.STONE", category: ["SF", "冒険", "コメディ", "ドラマ"] },
  { id: "chainsaw-man", label: "チェンソーマン", category: ["ホラー", "少年", "バトル", "ダーク"] },
  { id: "tokyo-ghoul", label: "東京喰種トーキョーグール", category: ["ホラー", "ミステリー", "バトル", "ダーク"] },
  { id: "parasyte", label: "寄生獣 セイの格率", category: ["ホラー", "SF", "心理", "バトル"] },
  { id: "elfen-lied", label: "エルフェンリート", category: ["ホラー", "ファンタジー", "ダーク", "バトル"] },
  { id: "another", label: "Another", category: ["ホラー", "ミステリー", "心理", "ドラマ"] },
]



const reviewEvaluations = {};

export default (io, socket) => {
  // 入室メッセージをクライアントに送信する
  socket.on("enterEvent", (data) => {
    io.sockets.emit("enterEvent", data)
  }
  )

  // 退室メッセージをクライアントに送信する
  socket.on("exitEvent", (data) => {
    io.sockets.emit("exitEvent", data)
  })

  // 投稿メッセージを送信する
  socket.on("publishEvent", (data) => {
    io.sockets.emit("publishEvent", data)
  })
  
  socket.on("joinHome", (data) => {
    socket.emit("animeData", JSON.stringify(animes))
  })
  
  socket.on("createAnime", (data) => {
    animes.push(JSON.parse(data))
  })

  // レビューの評価を送信する
  socket.on('evaluate_review', (data) => {
    const { reviewId, rating } = data;

    // reviewId に対応する評価データがなければ初期化
    if (!reviewEvaluations[reviewId]) {
      reviewEvaluations[reviewId] = {
        ratings: [],
        average: 0
      };
    }

    // 新しい評価を追加
    reviewEvaluations[reviewId].ratings.push(rating);

    // 平均値を再計算
    const currentReview = reviewEvaluations[reviewId];
    const sum = currentReview.ratings.reduce((acc, val) => acc + val, 0);
    currentReview.average = sum / currentReview.ratings.length;

    console.log(`Review ID: ${reviewId}, New Average: ${currentReview.average}`);

    // ★ 計算した平均値を 'review_updated' という新しいイベントで全クライアントに送信
    io.sockets.emit('review_updated', {
      reviewId: reviewId,
      newAverage: currentReview.average
    });
  });
}