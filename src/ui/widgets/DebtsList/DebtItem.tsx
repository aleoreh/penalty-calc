import { Delete, Edit } from "@mui/icons-material"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Divider from "@mui/material/Divider"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

import { kopekToRuble } from "@/lib/kopek"
import { ModalConfirmDialog } from "@/ui/components/ConfirmDialog"
import { ModalForm } from "@/ui/components/ModalForm"
import { useConfirmDialog } from "@/ui/components/useConfirmDialog"
import { useModalForm } from "@/ui/components/useModalForm"
import { useRegularText } from "@/ui/components/useRegularText"
import { useValidatedForm } from "@/ui/components/useValidatedForm"
import { useValidatedInput } from "@/ui/components/useValidatedInput"
import {
    Debt,
    Payoff,
    useDebtItemFormat,
    usePayoffItemFormat,
} from "@/ui/hooks/useDebtFormat"
import { validationDecoders } from "@/ui/validation/validationDecoders"

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

type PayoffItemProps = {
    payoff: Payoff
}

function PayoffItem({ payoff }: PayoffItemProps) {
    const payoffItemFormat = usePayoffItemFormat(payoff)
    const regularText = useRegularText()
    return (
        <Stack direction="row" justifyContent="flex-end">
            <Typography {...regularText}>
                {payoffItemFormat.paymentDate}
            </Typography>
            <Typography {...regularText}>
                {payoffItemFormat.repaymentAmount}
            </Typography>
        </Stack>
    )
}

type DebtItemProps = {
    debt: Debt
    deleteDebt: () => void
    updateDebt: (dueDate: Date, amountRub: number) => void
}

export function DebtItem({ debt, deleteDebt, updateDebt }: DebtItemProps) {
    const [inputDueDate, setInputDueDate] = useState<Dayjs | null>(
        dayjs(debt.dueDate)
    )

    const text = useRegularText()
    const debtItemView = useDebtItemFormat(debt)

    const confirmDeleteDialog = useConfirmDialog()

    const debtAmountInput = useValidatedInput(
        String(kopekToRuble(debt.amount)),
        validationDecoders.decimal
    )

    const editDebtValidatedForm = useValidatedForm([debtAmountInput])

    const editModalForm = useModalForm()

    const handleEditSubmit = () => {
        if (!inputDueDate || debtAmountInput.validatedValue === undefined) return

        updateDebt(inputDueDate.toDate(), debtAmountInput.validatedValue)
    }

    return (
        <>
            <Card>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography {...text}>{debtItemView.period}</Typography>
                        <Typography {...text}>{debtItemView.amount}</Typography>
                    </Stack>
                    <Typography {...text} align="right">
                        {debtItemView.dueDate}
                    </Typography>
                    {debt.payoffs.map((payoff, i) => (
                        <PayoffItem key={i} payoff={payoff} />
                    ))}
                    <Divider />
                    <Typography {...text} align="right">
                        {debtItemView.remainder}
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "flex-end" }}>
                    <IconButton
                        onClick={() => {
                            editDebtValidatedForm.reset()
                            editModalForm.open()
                        }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton onClick={confirmDeleteDialog.open}>
                        <Delete />
                    </IconButton>
                </CardActions>
            </Card>
            <ModalConfirmDialog
                {...confirmDeleteDialog}
                title="Удалить долг?"
                submit={deleteDebt}
                submitMessage="Да, удалить!"
            />
            <ModalForm
                {...editModalForm}
                {...editDebtValidatedForm}
                title="Изменение долга"
                submit={handleEditSubmit}
            >
                <Stack>
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

