<template>
    <div class="container flex flex-col items-center mx-auto gap-y-15 w-full max-w-200 mt-7.25">
        <section>
            <form class="flex gap-x-6.25" @submit.prevent="addPost">
                <input type="text" placeholder="Новый пост ..." class="w-full max-w-140 py-2.5 placeholder:text-black border border-black
                    pl-2.5 rounded-2xl" v-model="newPost">
                <AddButton :disabled="!newPost" class="addbutton post" />
            </form>
        </section>
        <section class="flex flex-col gap-y-5" v-for="post in posts" :key="post.id">
            <article>
                <p>{{ post.text }}</p>
            </article>

            <div class="flex justify-between items-center border-t border-[#9C9C9C] pt-4">
                <div class="flex gap-x-5.5 items-center">
                    <button class="px-4 bg-[#216CFF]" @click="openComments(post.id)">
                        Комментарии
                    </button>

                    <p>
                        Количество комментариев -
                        {{
                            comments.filter(c => c.postID === post.id).length
                        }}
                    </p>
                </div>

                <div class="flex gap-x-5.5 items-center">
                    <EditButton @click="openEdit(post)" />
                    <DeleteButton @click="deletePost(post.id)" />
                </div>
            </div>
            <section v-if="openedPostId === post.id">
                <form class="flex gap-x-6.25" @submit.prevent="addComment(post.id)">
                    <input type="text" placeholder="Новый комментарий ..."
                        class="w-full max-w-140 py-2.5 border border-black pl-2.5 rounded-2xl"
                        v-model="newComm[post.id]" />
                    <AddButton :disabled="!newComm[post.id]" class="addbutton comment" />
                </form>

                <div v-for="comment in comments.filter(c => c.postID === post.id)" :key="comment.id"
                    class="flex gap-x-6.25 my-7.5">
                    <p class="w-full max-w-140 py-2.5 border border-black pl-2.5 rounded-2xl">
                        {{ comment.text }}
                    </p>
                    <DeleteButton @click="deleteComment(comment.id)" />
                </div>

            </section>
        </section>


    </div>
    <EditPostModal v-model="isModalOpen" :postText="currentPostText" @save="exectEdit" />
</template>

<script setup lang='ts'>
import AddButton from '@/components/AddButton.vue'
import DeleteButton from '@/components/DeleteButton.vue'
import EditButton from '@/components/EditButton.vue'
import EditPostModal from '@/components/EditPostModal.vue'
import { usePostStore } from '@/stores/posts'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const postStore = usePostStore()
const { posts, comments } = storeToRefs(postStore)

const newPost = ref('')
const newComm = ref<Record<number, string>>({})

const openedPostId = ref<number | null>(null)

const isModalOpen = ref(false)
const editedPostID = ref<number | null>(null)
const currentPostText = computed(() => {
    const post = posts.value.find(post => post.id === editedPostID.value)
    return post ? post.text : ''
})

function addPost() {
    if (!newPost.value) return

    postStore.addPost(newPost.value)
    newPost.value = ''
}

function addComment(postID: number) {
    const text = newComm.value[postID]
    if (!text) return

    postStore.addComment(text, postID)
    newComm.value[postID] = ''
}

function deletePost(idPost: number) {
    postStore.deletePostById(idPost)
}

function deleteComment(id: number) {
    postStore.deleteCommentById(id)
}

function openComments(postID: number) {
    openedPostId.value =
        openedPostId.value === postID ? null : postID
}
function openEdit(post: any) {
    editedPostID.value = post.id
    isModalOpen.value = true
}

function exectEdit(newText: string) {
    if (editedPostID.value === null || !newText) return

    postStore.updatePost(editedPostID.value, newText)
    closeModal()
}

function closeModal() {
    editedPostID.value = null
    isModalOpen.value = false
}
</script>
