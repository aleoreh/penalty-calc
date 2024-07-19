/**
 * Ключевая ставка
 */
export type KeyRate = number

/**
 * Константы, заданные соответствующими нормативно-правовыми актами
 */
export type TheStateConstants = {
    /**
     * Количество дней для оплаты счёта за ЖКУ
     */
    daysToPay: number
    /**
     * Количество дней, предоставляемых для отсрочки платежа, прежде чем
     * начинает начисляться пеня
     */
    deferredDaysCount: number
    /**
     * День, на который меняется доля ключевой ставки для расчёта
     */
    fractionChangeDay: number
    /**
     * Ключевые ставки в зависимости от даты
     */
    keyRates: [Date, KeyRate][]
    /**
     * Действующие моратории на начисление пеней
     * Задаются как временные интервалы
     */
    moratoriums: [DateString, DateString][]
}

