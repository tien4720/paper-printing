export type Nullable<T> = T | null

export type APIResponse<T> = {
    success: boolean
    data: Nullable<T>
    status?: number
}

export type PriceItem = {
    business_day: number
    price: number
    quantity: number
}

export type PaperPrice = {
    paper_size: string
    prices: Array<PriceItem[]>
}
