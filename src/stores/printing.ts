import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AxiosError } from 'axios'
import { API } from '@/services'
import type { APIResponse, PaperPrice, PriceItem } from '@/services/types'
import { formatMoney } from '@/utils'

export enum PaperType {
    A4 = 'A4',
    A5 = 'A5',
    B4 = 'B4',
    B5 = 'B5',
}

export type PrintingItem = { is_selected: boolean } & PriceItem

export const usePrintingStore = defineStore('printing', () => {
    const isLoading = ref(false)
    const type = ref(PaperType.A4)
    const printingItems = ref<Array<PrintingItem[]>>([])
    const pricesData = ref<Array<PriceItem[]>>([])
    const orderPrice = ref('0')
    const paperTypes = [PaperType.A4, PaperType.A5, PaperType.B4, PaperType.B5]

    const getPaperPrices = async (): Promise<APIResponse<PaperPrice>> => {
        isLoading.value = true
        try {
            isLoading.value = false
            const { status, data } = await API.printing.getPaperPrices(
                type.value,
            )
            if (status === 200) {
                pricesData.value = data.prices
                initPrintingItems(data.prices)
                orderPrice.value = '0'
                return {
                    success: true,
                    data: data,
                }
            }
        } catch (error) {
            isLoading.value = false
            const _error = error as AxiosError<string>
            pricesData.value = []
            printingItems.value = []
            orderPrice.value = '0'
            return {
                success: false,
                data: null,
                status: _error.response?.status,
            }
        }
        return {
            success: false,
            data: null,
            status: 400,
        }
    }

    const initPrintingItems = (prices: Array<PriceItem[]>) => {
        printingItems.value = []
        prices.forEach((items: PriceItem[]) => {
            const colItems: PrintingItem[] = []
            items.forEach(item => {
                colItems.push({
                    business_day: item.business_day,
                    price: item.price,
                    quantity: item.quantity,
                    is_selected: false,
                })
            })
            printingItems.value.push(colItems)
        })
    }

    const onSelectType = (selectType: PaperType) => {
        type.value = selectType
    }

    const onSelectPrintingItem = (printingItem: PrintingItem) => {
        printingItem.is_selected = !printingItem.is_selected
        calculateOrderPrice()
    }

    const calculateOrderPrice = () => {
        let totalPrice = 0
        printingItems.value.forEach((items: PrintingItem[]) => {
            items.forEach(item => {
                if (item.is_selected && item.price) totalPrice += item.price
            })
        })
        orderPrice.value = formatMoney(totalPrice)
    }

    const resetData = () => {
        orderPrice.value = '0'
        printingItems.value.forEach((items: PrintingItem[]) => {
            items.forEach(item => {
                item.is_selected = false
            })
        })
    }

    return {
        isLoading,
        type,
        paperTypes,
        printingItems,
        pricesData,
        orderPrice,
        getPaperPrices,
        onSelectType,
        onSelectPrintingItem,
        resetData,
    }
})
