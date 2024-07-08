import {
    CreateCalculatorFromConstantsUseCase,
    CreateCalculatorUseCase,
    TheStateConstantsRepo,
} from "../domain"
import { initCalculator } from "../domain/calculator"
import calculatorConfigShed from "../domain/calculator-config"
import { UserSettings } from "../domain/userSettings"

const defaultUserSettings: UserSettings = {
    legalEntity: "natural",
    distributionMethod: "fifo",
}

export function createCreateCalculatorsUseCase(
    theStateConstantsRepo: TheStateConstantsRepo
): CreateCalculatorUseCase {
    return async () => {
        const constants = await theStateConstantsRepo.getTheStateConstants()

        const calculatorConfig = calculatorConfigShed.fromTheStateConstants(
            defaultUserSettings.legalEntity,
            constants
        )

        const calculator = initCalculator(
            new Date(),
            calculatorConfig,
            defaultUserSettings.distributionMethod
        )

        return calculator
    }
}

export function createCreateCalculatorFromConstantsUseCase(): CreateCalculatorFromConstantsUseCase {
    return (theStateConstants) => {
        const calculatorConfig = calculatorConfigShed.fromTheStateConstants(
            defaultUserSettings.legalEntity,
            theStateConstants
        )

        const calculator = initCalculator(
            new Date(),
            calculatorConfig,
            defaultUserSettings.distributionMethod
        )

        return calculator
    }
}

