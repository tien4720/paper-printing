<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePrintingStore, PaperType, type PrintingItem } from '../stores/printing'

const printingStore = usePrintingStore()
const { type, printingItems, orderPrice } = storeToRefs(printingStore)
const { paperTypes } = printingStore
const emit = defineEmits(['onApply'])

const limit = ref(5)
const isSeeMore = ref(false)
const isSubmiting = ref(false)
const noticeMessage = ref('')

const onSelectType = (selectType: PaperType) => {
    printingStore.onSelectType(selectType)
}

const onSeeMore = () => {
    isSeeMore.value = !isSeeMore.value
    limit.value = isSeeMore.value ? printingItems.value.length : 5
}

const onApply = () => {
    noticeMessage.value = ''
    emit('onApply')
}

const onCart = () => {
    if (orderPrice.value === '0') {
        noticeMessage.value = 'Your cart is empty. Please select an item.'
    } else {
        noticeMessage.value = ''
        isSubmiting.value = true
        setTimeout(() => {
            printingStore.resetData()
            noticeMessage.value = 'Your order has been sent successfully.'
            isSubmiting.value = false
        }, 100)
    }
}

const onSelectPrintingItem = (item: PrintingItem) => {
    noticeMessage.value = ''
    printingStore.onSelectPrintingItem(item)
}
</script>

<template>
    <section class="price-section px-3">
        <div class="flex pb-4">
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle btn-select-type" type="button"
                    data-bs-toggle="dropdown" aria-expanded="false">
                    {{ type }}
                </button>
                <ul class="dropdown-menu">
                    <li v-for="paperType in paperTypes" :key="paperType" @click="onSelectType(paperType)">
                        <a class="dropdown-item" href="#">{{ paperType }}</a>
                    </li>
                </ul>
            </div>
            <div class="btn-apply-holder px-3">
                <button type="button" class="btn btn-primary" @click="onApply()">Apply</button>
            </div>
            <div class="summary">
                <span class="order-price">Order Price: <span class="price">${{ orderPrice }}</span></span>
                <button type="button" class="btn btn-outline-primary" @click="onCart"
                    :disabled="isSubmiting">Cart</button>
            </div>
        </div>
        <div class="price-table">
            <ul class="price-table-row" v-for="(row, rowIndex) in printingItems.slice(0, limit)"
                :key="rowIndex + row.length">
                <li class="price-table-col title">Quantity: {{ row[0].quantity }}</li>
                <li class="price-table-col clickable" v-for="(item, itemIndex) in row" :key="itemIndex"
                    @click="onSelectPrintingItem(item)" :class="{ 'selected': item.is_selected }">
                    {{ item.business_day }} days - ¥{{ item.price }}
                </li>
            </ul>
        </div>
        <button type="button" class="btn btn-outline-primary mt-3" @click="onSeeMore">
            {{ isSeeMore ? 'See Less' : 'See More' }}
        </button>
        <div class="notice-message text-warning pb-4" v-if="noticeMessage">{{ noticeMessage }}</div>
    </section>
</template>

<style lang="scss" scoped>
.price-table {
    width: 720px;
}

.price-table-row {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #6b6767;

    &:last-child {
        border-bottom: none;
    }
}

.price-table-col {
    flex-grow: 1;
    flex-basis: 0;
    height: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #6b6767;

    &.title {
        background-color: #6ea8fe;
    }

    &:last-child {
        border-right: none;
    }

    &.clickable {
        cursor: pointer;

        &:hover {
            background-color: #efefb7b8;
        }

        &.selected {
            background-color: #efefb7b8;

            &:hover {
                background-color: #c7c84d;
            }
        }
    }
}

.btn-apply-holder {
    flex: 1 auto;
}

.notice-message {
    text-align: right;
}

.order-price {
    font-size: 20px;
    position: relative;
    top: 2px;
    margin-right: 16px;
}
</style>
