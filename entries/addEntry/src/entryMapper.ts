interface EntryMapperResult {
    isValid : boolean,
    errorMessage? : String,
    keyword? : String,
    amount? : number
}

export default (entry:String): EntryMapperResult => {
    const provideCategoryAmountMessage = "Please provide a Category and an amount.";

    if (!entry) {
        return {
            isValid: false,
            errorMessage: provideCategoryAmountMessage
        };
    }

    const entryParts = entry.split(" ");

    if (entryParts.length < 2) {
        return {
            isValid: false,
            errorMessage: provideCategoryAmountMessage
        };
    }

    const amountText = entryParts.pop().replace("$", '');
    let amount = Number(amountText);

    if (isNaN(amount)) {
        return {
            isValid: false,
            errorMessage: "Please provide a valid amount."
        };
    }

    amount = Math.abs(amount);
    amount = Number(amount.toFixed(2));

    const keyword = entryParts.join(" ");

    return {
        isValid: true,
        keyword,
        amount
    };
};