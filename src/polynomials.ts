import { trim } from './utilities';

export class PolyMath {
    public static multiply(a: Polynomial, b: Polynomial) {
        const result = a.coefficients.reduce(
            (prev, coeff, exp) => {
                const intermediateCoeffs = this.multiplyBy(
                    b.coefficients,
                    exp,
                    coeff
                );

                return this.addCoefficients(prev, intermediateCoeffs);
            },
            [0]
        );

        return new Polynomial(result);
    }

    public static divide(dividend: Polynomial, divisor: Polynomial) {
        const result = this.divideCoeffs(
            dividend.coefficients,
            divisor.coefficients
        );

        return {
            quotient: new Polynomial(result.quotient),
            remainder: new Polynomial(result.remainder),
        };
    }

    public static add(a: Polynomial, b: Polynomial) {
        return new Polynomial(
            this.addCoefficients(a.coefficients, b.coefficients)
        );
    }

    public static subtract(minuend: Polynomial, subtrahend: Polynomial) {
        return new Polynomial(
            this.subtractCoefficients(
                minuend.coefficients,
                subtrahend.coefficients
            )
        );
    }

    private static addCoefficients(a: number[], b: number[]) {
        let longerArray: number[];
        let shorterArray: number[];

        if (a.length > b.length) {
            longerArray = [...a];
            shorterArray = [...b];
        } else {
            longerArray = [...b];
            shorterArray = [...a];
        }

        for (let i = 0; i < longerArray.length; i++) {
            if (shorterArray[i]) {
                longerArray[i] += shorterArray[i];
            }
        }

        return longerArray;
    }

    private static subtractCoefficients(
        minuend: number[],
        subtrahend: number[]
    ) {
        const subt = this.negativeCoefficients(subtrahend);

        return this.addCoefficients(minuend, subt);
    }

    private static negativeCoefficients(a: number[]) {
        let newArray = [...a];

        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i]) {
                newArray[i] = -newArray[i];
            }
        }

        return newArray;
    }

    private static multiplyBy(
        polynomialCoeffs: number[],
        xExp: number,
        xCoeff = 1
    ) {
        const toShift = new Array<number>(xExp).fill(0);
        let newCoeffs: number[] = [...toShift, ...polynomialCoeffs];

        for (let i = 0; i < newCoeffs.length; i++) {
            if (newCoeffs[i]) {
                newCoeffs[i] *= xCoeff;
            }
        }

        return newCoeffs;
    }

    private static findHighestExp(coefficients: number[]) {
        let lastIndex = coefficients.length - 1;

        while (coefficients.length > 1 && coefficients[lastIndex] === 0) {
            --lastIndex;
        }

        return lastIndex;
    }

    private static divideCoeffs(a: number[], b: number[]) {
        let tempA = [...a]; // DIVIDEND
        const maxDivisorExp = this.findHighestExp(b);
        let expA = this.findHighestExp(tempA);
        let quotient = [0];
        let remainder = [0];

        while (expA >= maxDivisorExp) {
            const multExp = expA - maxDivisorExp;
            const multCoeff = tempA[expA] / b[maxDivisorExp];
            const subt = this.multiplyBy(b, multExp, multCoeff);
            quotient = this.addCoefficients(
                quotient,
                this.multiplyBy([1], multExp, multCoeff)
            );
            tempA = this.subtractCoefficients(tempA, subt);
            expA = this.findHighestExp(tempA);
        }

        remainder = trim(tempA);

        return { quotient, remainder };
    }
}

export class Polynomial {
    public coefficients: number[];

    constructor(coeffecients: number[]) {
        this.coefficients = trim(coeffecients);
    }

    public toString(all = false) {
        let output: string = '';
        let first = true;
        let lastCoeff = 0;

        for (let i = 0; i < this.coefficients.length; i++) {
            const coeff = this.coefficients[i];

            if (all || coeff !== 0) {
                let term: string;
                let varExp: string;

                if (i === 0) {
                    varExp = '';
                } else if (i === 1) {
                    varExp = 'x';
                } else {
                    varExp = 'x^' + i;
                }

                const coeffStr =
                    Math.abs(coeff) === 1 && i > 0
                        ? ''
                        : Math.abs(coeff).toString();

                if (first) {
                    first = false;
                    term = coeffStr + varExp;
                } else {
                    const opStr = lastCoeff >= 0 ? ' + ' : ' - ';

                    term = coeffStr + varExp + opStr;
                }

                output = term + output;
                lastCoeff = coeff;
            }
        }

        return output;
    }
}
