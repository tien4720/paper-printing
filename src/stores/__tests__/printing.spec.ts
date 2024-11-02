import { vi, beforeEach, describe, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
    usePrintingStore,
    PaperType,
    type PrintingItem,
} from '@/stores/printing'
import { formatMoney } from '@/utils'
import { API } from '@/services'
import { mockData } from './mockData'

describe('Printing Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('init printing data', async () => {
        const store = usePrintingStore()
        vi.spyOn(API.printing, 'getPaperPrices').mockResolvedValue({
            status: 200,
            success: true,
            data: mockData,
        })
        await store.getPaperPrices()
        expect(store.printingItems.length).toBe(10)
        store.printingItems.forEach((items: PrintingItem[]) => {
            items.forEach(item => {
                expect(item.is_selected).toBe(false)
            })
        })
        store.pricesData = mockData.prices
        expect(store.isLoading).toBe(false)
        expect(store.type).toBe(PaperType.A4)
        expect(store.orderPrice).toBe('0')
        expect(store.paperTypes.length).toBe(4)
    })

    it('select type', () => {
        const store = usePrintingStore()
        expect(store.type).toBe(PaperType.A4)
        store.onSelectType(PaperType.A5)
        expect(store.type).toBe(PaperType.A5)
    })

    it('select printing price', async () => {
        const store = usePrintingStore()
        vi.spyOn(API.printing, 'getPaperPrices').mockResolvedValue({
            status: 200,
            success: true,
            data: mockData,
        })
        await store.getPaperPrices()
        const printItem1 = store.printingItems[0][0]
        const printItem2 = store.printingItems[1][4]
        store.onSelectPrintingItem(printItem1)
        expect(store.orderPrice).toBe('1,568')
        store.onSelectPrintingItem(printItem2)
        expect(store.orderPrice).toBe('3,248')
        store.onSelectPrintingItem(printItem2)
        expect(store.orderPrice).toBe('1,568')
        store.onSelectPrintingItem(printItem1)
        expect(store.orderPrice).toBe('0')
    })

    it('reset data', async () => {
        const store = usePrintingStore()
        store.resetData()
        expect(store.orderPrice).toBe('0')
        store.printingItems.forEach((items: PrintingItem[]) => {
            items.forEach(item => {
                expect(item.is_selected).toBe(false)
            })
        })
    })

    it('format price', async () => {
        const price1 = 1
        const price2 = 12
        const price3 = 123
        const price4 = 1234
        const price5 = 12345
        const price6 = 123456
        const price7 = 1234567
        const price8 = 12345678
        expect(formatMoney(price1)).toBe('1')
        expect(formatMoney(price2)).toBe('12')
        expect(formatMoney(price3)).toBe('123')
        expect(formatMoney(price4)).toBe('1,234')
        expect(formatMoney(price5)).toBe('12,345')
        expect(formatMoney(price6)).toBe('123,456')
        expect(formatMoney(price7)).toBe('1,234,567')
        expect(formatMoney(price8)).toBe('12,345,678')
    })
})
