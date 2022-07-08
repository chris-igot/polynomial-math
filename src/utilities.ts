export function trim(coefficients: number[]) {
    let lastIndex = coefficients.length - 1;

    while (coefficients.length > 1 && coefficients[lastIndex] === 0) {
        --lastIndex;
    }

    return coefficients.slice(0, lastIndex + 1);
}
