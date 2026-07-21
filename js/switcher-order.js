function canonicalizeSwitcherName(str) {
    return str.trim().toLowerCase().replace(/ /g, '_');
}
function orderSwitchersByPrepList(switchers, prepSwitchers = []) {
    const prepOrder = new Map();
    prepSwitchers.forEach((switcher, index) => {
        const switcherName = canonicalizeSwitcherName(switcher);
        if (!prepOrder.has(switcherName))
            prepOrder.set(switcherName, index);
    });
    return [...switchers].sort((a, b) => {
        const aOrder = prepOrder.get(canonicalizeSwitcherName(a.name)) ?? Number.MAX_SAFE_INTEGER;
        const bOrder = prepOrder.get(canonicalizeSwitcherName(b.name)) ?? Number.MAX_SAFE_INTEGER;
        return aOrder - bOrder;
    });
}
