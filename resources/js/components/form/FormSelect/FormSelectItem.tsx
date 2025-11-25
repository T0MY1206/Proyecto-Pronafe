interface FormSelectItemProps { 
    item: SelectItem,
    active: boolean,
    onSelect: (item: SelectItem) => void
}

export default function FormSelectItem({ item, active, onSelect }: FormSelectItemProps) {
    function onClick() {
        if(onSelect instanceof Function) {
            onSelect( item )
        }
    }

    return <div onClick={ onClick } data-selectable className={`option ${ active ? 'active' : '' }`}>
        { item.label }
    </div>
}
