import { CalculatorConfig } from "./calculator-config"
import { Debt, Payment } from "./types"

type DistributionMethod = "fifo" | "byPaymentPeriod"

export type Calculator = {
    calculationDate: Date
    config: CalculatorConfig
    debts: Debt[]
    payments: Payment[]
    distributionMethod: DistributionMethod
}

function distributePayments(calculator: Calculator): Calculator {
    calculator
    throw new Error("not implemented")
}

function setCalculatorConfig(config: CalculatorConfig) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            config,
        })
}

function setCalculationDate(date: Date) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            calculationDate: date,
        })
}

function setDistributionMethod(distributionMethod: DistributionMethod) {
    return (calculator: Calculator): Calculator =>
        distributePayments({
            ...calculator,
            distributionMethod: distributionMethod,
        })
}

export const calculatorShed = {
    setConfig: setCalculatorConfig,
    setCalculationDate,
    setDistributionMethod
}

export default calculatorShed
