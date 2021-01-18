interface EntryMapperResult {
    error? : string,
    keyword? : string,
    amount? : number
}

export default (entry: string): EntryMapperResult => {
    const provideCategoryAmountMessage = "Please provide a Category and an amount.";
    const provideValidAmountMessage = "Please provide a valid amount.";

    if (!entry) {
        return { error: provideCategoryAmountMessage };
    }
    
    const entryParts = entry.split(" ");

    if (entryParts.length < 2) {
        return { error: provideCategoryAmountMessage };
    }

    const amountText = entryParts.pop().replace('$', '');
    let amount = Number(amountText);

    if (isNaN(amount)) {
        return { error: provideValidAmountMessage };
    }

    amount = Math.abs(amount);
    amount = Number(amount.toFixed(2));

    const keyword = entryParts.join(" ");

    return { keyword, amount };
};