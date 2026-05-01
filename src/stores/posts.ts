import { defineStore } from 'pinia'
import type { Comments, Post } from '@/types/Post'

export const usePostStore = defineStore('posts', {
  state: () => ({
    posts: [] as Post[],
    comments: [] as Comments[],
    nextID: 0,
    nextIDCom: 0
  }),

  actions: {
    addPost(text: string) {
      this.posts.push({ id: this.nextID++, text })
    },

    addComment(text: string, postID: number) {
      this.comments.push({id: this.nextIDCom++, text, postID
      })
    },

    deletePostById(idPost: number) {
      this.posts = this.posts.filter(post => post.id !== idPost)
      this.comments = this.comments.filter(comment => comment.postID !== idPost)
    },

    deleteCommentById(id: number) {
      this.comments = this.comments.filter(c => c.id !== id)
    },

    updatePost(id: number, newText: string){
      const post = this.posts.find(post=> post.id === id)
      if(post){
        post.text = newText
      }
    }
  }
})