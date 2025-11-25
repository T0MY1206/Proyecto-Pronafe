interface SelectItem {
    label: string,
    value: string | null,
    unique?: boolean
}

type ChangeSelectEvent = (event: { target: { id: string; value: any } }) => void;
