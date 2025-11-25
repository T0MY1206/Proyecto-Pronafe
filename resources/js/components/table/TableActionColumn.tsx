import AppIcon, { IconName } from "../Icons/AppIcon";

function onClickAction(event: any, action: TableAction, data: any) {
    event.preventDefault();

    action.action( data );
}

function getData(column: ColumnAction, data: any) {
    if(column instanceof Function) {
        return column(data);
    }

    return column ?? '';
}

function getCondition(condition: ConditionAction | undefined, data: any) {
    if (typeof condition === "function") {
        return condition(data);
    }

    if (typeof condition === "boolean") {
        return condition;
    }

    return true;
}

export default function TableActionColumn({actions, data}: {actions: TableAction[], data: any}) {
    return <td className="table-report__action">
        <div className="flex justify-center items-center">
            {actions.map((x, i) => <div key={i} >
                { getCondition( x.condition, data ) && <a href="#" className={'flex items-center mr-3 focus:outline-none focus:ring-0 ' + getData(x.className!, data)}
                        onClick={(event) => onClickAction(event, x, data)}>
                        {x.icon && <AppIcon name={getData(x.icon, data) as IconName} className={x.iconClass}></AppIcon>}
                        {getData(x.label!, data)}
                    </a>
                }
                </div>
            )}
        </div>
    </td>;
}
