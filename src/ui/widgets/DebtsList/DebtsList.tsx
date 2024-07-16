import { ExpandMore } from "@mui/icons-material"
import Accordion from "@mui/material/Accordion"
import AccordionActions from "@mui/material/AccordionActions"
import AccordionDetails from "@mui/material/AccordionDetails"
import AccordionSummary from "@mui/material/AccordionSummary"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { DateValidationError } from "@mui/x-date-pickers"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs, { Dayjs } from "dayjs"
import { useMemo, useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { BillingPeriod, billingPeriodFromDate } from "@/lib/billing-period"
import { kopekFromRuble } from "@/lib/kopek"
import { ModalForm } from "@/ui/components/ModalForm"
import { useModalForm } from "@/ui/components/useModalForm"
import { useSectionTitle } from "@/ui/components/useSectionTitle"
import { useValidatedForm } from "@/ui/components/useValidatedForm"
import { useValidatedInput } from "@/ui/components/useValidatedInput"
import { useCalculatorConfig } from "@/ui/hooks/useCalculatorConfig"
import { useDebt } from "@/ui/hooks/useDebt"
import { useDebts } from "@/ui/hooks/useDebts"
import { validationDecoders } from "@/ui/validation/validationDecoders"
import { DebtItem } from "./DebtItem"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

function periodIsIn(periods: BillingPeriod[]) {
    return (period: Dayjs) =>
        periods.includes(billingPeriodFromDate(period.toDate()))
}

export function DebtsList() {
    const { debts, addDebt } = useDebts()
    const { getDefaultDueDate } = useDebt()
    const { config } = useCalculatorConfig()

    const [inputDebtPeriod, setInputDebtPeriod] = useState<Dayjs | null>(null)
    const [inputDebtPeriodError, setInputDebtPeriodError] =
        useState<DateValidationError | null>(null)
    const [inputDueDate, setInputDueDate] = useState<Dayjs | null>(null)

    const debtAmountInput = useValidatedInput("", validationDecoders.decimal)

    const modalForm = useModalForm()
    const validatedForm = useValidatedForm([debtAmountInput])

    const periodErrorMessage = useMemo(() => {
        switch (inputDebtPeriodError) {
            case "shouldDisableMonth":
                return "Такой период уже есть в списке"
            default:
                return ""
        }
    }, [inputDebtPeriodError])

    const title = useSectionTitle()

    const handleInputDebtPeriodChange = (value: Dayjs | null) => {
        setInputDebtPeriod(value)
        value &&
            setInputDueDate(
                dayjs(
                    getDefaultDueDate(
                        billingPeriodFromDate(value.toDate()),
                        config.daysToPay
                    )
                )
            )
    }

    const submitAddDebt = () => {
        if (
            inputDebtPeriod === null ||
            inputDueDate === null ||
            debtAmountInput.validatedValue === undefined
        ) {
            return
        }

        addDebt(
            billingPeriodFromDate(inputDebtPeriod.toDate()),
            inputDueDate.toDate(),
            kopekFromRuble(debtAmountInput.validatedValue)
        )
    }

    const submitAddDebtAndContinue = () => {
        submitAddDebt()
        modalForm.open()
        handleInputDebtPeriodChange(inputDebtPeriod?.add(1, "month") || null)
        // setInputDebtPeriod(inputDebtPeriod?.add(1, "month") || null)
    }

    return (
        <>
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography {...title}>Долги</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Stack>
                        {debts.map((x, i) => (
                            <DebtItem key={i} debt={x} />
                        ))}
                    </Stack>
                </AccordionDetails>
                <AccordionActions>
                    <Button type="button" onClick={modalForm.open}>
                        Добавить
                    </Button>
                    <Button>Добавить несколько</Button>
                </AccordionActions>
            </Accordion>
            <ModalForm
                title="Добавить долг"
                {...modalForm}
                {...validatedForm}
                submit={submitAddDebt}
                submitAndContinue={submitAddDebtAndContinue}
            >
                <Stack>
                    <DatePicker
                        label={"Период"}
                        value={inputDebtPeriod}
                        onChange={handleInputDebtPeriodChange}
                        views={["year", "month"]}
                        view="month"
                        openTo="year"
                        shouldDisableMonth={periodIsIn(
                            debts.map((x) => x.period)
                        )}
                        onError={setInputDebtPeriodError}
                        slotProps={{
                            textField: {
                                helperText: periodErrorMessage,
                            },
                        }}
                    />
                    <DatePicker
                        label={"Начало просрочки"}
                        value={inputDueDate}
                        onChange={setInputDueDate}
                    />
                    <TextField
                        {...debtAmountInput.input}
                        label="Сумма"
                        required
                    />
                </Stack>
            </ModalForm>
        </>
    )
}

