<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePrintingStore } from '@/stores/printing'

import PriceSection from '@/components/PriceSection.vue'

const printingStore = usePrintingStore()
const { isLoading } = storeToRefs(printingStore)

onMounted(() => {
    getPaperPrintingData()
})

const getPaperPrintingData = async () => {
    printingStore.getPaperPrices()
}
</script>

<template>
    <main class="container">
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div class="content py-4" v-else>
            <div class="flex">
                <price-section @onApply="getPaperPrintingData" />
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 0;
}

.content {
    background: #202127;
    border-radius: 12px;
    min-height: 300px;
}
</style>
