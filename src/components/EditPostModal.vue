<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
    modelValue: boolean
    postText: string
}>()

const emit = defineEmits(['update:modelValue', 'save'])

const localText = ref('')

watch(
    () => [props.modelValue, props.postText] as [boolean, string],
    ([isOpen, text]) => {
        if (isOpen) {
            localText.value = text
        }
    }
)

function close() {
    emit('update:modelValue', false)
}

function save() {
    if (!localText.value) return
    emit('save', localText.value)
    close()
}
</script>

<template>
    <div v-if="modelValue" class="fixed inset-0 bg-[#6C9EFF96]/59 flex items-center justify-center" @click="close">
        <div class="bg-white p-6 rounded-2xl w-100" @click.stop>
            <input v-model="localText" class="w-full border border-black p-2 rounded mb-4" />

            <div class="flex justify-end gap-4">
                <button class="px-4 bg-[#216CFF]" @click="save" :disabled="!localText">
                    Подтвердить
                </button>

                <button class="px-4 bg-[#FF218B]" @click="close">
                    Закрыть
                </button>
            </div>
        </div>
    </div>
</template>