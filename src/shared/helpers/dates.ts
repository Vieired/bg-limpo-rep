export const getDiffDays = (startDate: string, endDate: string): number => {
    const a = new Date(startDate);
    const b = new Date(endDate);
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    const timeDiff = Math.abs(b.getTime() - a.getTime());
    const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));
    // const diffDays = Math.round(timeDiff / (1000 * 3600 * 24));
    // const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
    return diffDays;
}

export const getDiffMonths = (startDate: string, endDate: string): number => {
    const a = new Date(startDate);
    const b = new Date(endDate);
    a.setHours(0, 0, 0, 0);
    b.setHours(0, 0, 0, 0);
    const anoInicial = a.getFullYear();
    const mesInicial = a.getMonth();
    const diaInicial = a.getDate();
    const anoFinal = b.getFullYear();
    const mesFinal = b.getMonth();
    const diaFinal = b.getDate();

    // Calcula a diferença total em meses
    let diferencaMeses = (anoFinal - anoInicial) * 12 + (mesFinal - mesInicial);

    // Ajusta para meses completos
    if (diaFinal < diaInicial) {
        diferencaMeses--;
    }

    return diferencaMeses;
}

export const getTimeSinceLastCleaning = (startDate: string, endDate: string) => {
    const diffDays = getDiffDays(startDate, endDate);
    const diffMonths = getDiffMonths(startDate, endDate);

    // const days = Math.floor(diffDays % 30.6); // adicionei o decimal 0,6 e o arredondamento para baixo, para amenizar o erro de cálculo produzido pelo fato de existir variância de dias entre os meses
    const days = diffDays > 365 ? diffDays % 365 : Math.floor(diffDays % 30.6);
    const months = diffMonths % 12;
    const years = Math.floor(diffDays / 365);
    // const years = Math.floor(diffMonths / 12);

    if(diffDays < 30) { // Apenas dias
        return days > 0 ? `${Math.floor(diffDays)} dia${days > 1 ? "s" : ""}` : "";
    }

    if(diffMonths < 12) { // Meses
        const remainingDays = diffDays > 365 ? diffDays % 365 : (diffDays - months*30);
        const descriptionOfMonths = months > 0 ? `${months} mes${months > 1 ? "es" : ""}` : "";
        const descriptionOfDays = remainingDays > 0 ? `${remainingDays} dia${remainingDays > 1 ? "s" : ""}` : "";
        return descriptionOfMonths !== "" && descriptionOfDays !== ""
            ? `${descriptionOfMonths} e ${descriptionOfDays} (${diffDays} dias)`
            : descriptionOfMonths === "" && descriptionOfDays !== ""
                ? `${descriptionOfDays} (${diffDays} dias)`
                : `${descriptionOfMonths} (${diffDays} dias)`;
    }

    // Mais de um ano
    // const restDays = diffDays > 365 ? diffDays % 365 : days;
    const descriptionOfYears = years > 0 ? `${years} ano${years > 1 ? "s" :""}` : "";
    const descriptionOfMonths = months > 0 ? `${months} mes${months > 1 ? "es" : ""}` : "";
    const descriptionOfDays = days > 0 ? ` e ${days} dia${days > 1 ? "s" : ""}` : "";
    return `${descriptionOfYears} ${descriptionOfMonths} ${descriptionOfDays} (${diffDays} dias)`
}

export const getDateByDaysIncrement = (stringDate: string, daysIncrement: number) => {
    const dt = new Date(stringDate);
    dt.setHours(0, 0, 0, 0);
    return dt.setDate(dt.getDate() + daysIncrement);
}

export const getDateByMonthsIncrement = (stringDate: string, monthsIncrement: number): Date => {
    const t: Date = new Date(stringDate);
    t.setMonth(t.getMonth() + monthsIncrement);
    return new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(),0,0,0,0));
}