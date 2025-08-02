import { createRouter, createWebHistory } from "vue-router"
import Chat from "../components/Chat.vue"
import Login from "../components/Login.vue"
import Home from "../components/Home.vue"
import Review from "../components/Review.vue"
import CreateAnime from "../components/CreateAnime.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },{
      path: "/chat/",
      name: "chat",
      component: Chat,
    },
    {
      path: "/home/",
      name: "home",
      component: Home
    },{
      path: "/review/",
      name: "review",
      component: Review,
    },{
      path: "/create-anime/",
      name: "create-anime",
      component: CreateAnime,
    }
  ],
})

export default router