import Decimal from 'decimal.js';

const decimal = () => {
  const createDecimal = (value) => {
    if(!value) {
      value = 0
    }
    return new Decimal(String(value));
  }

  const plus = (a, b) => {
    const num1 = createDecimal(a);
    const num2 = createDecimal(b);
    return num1.plus(num2).toString();
  };

  const minus = (a, b) => {
    const num1 = createDecimal(a);
    const num2 = createDecimal(b);
    return num1.minus(num2).toString();
  };

  const divide = (a, b) => {
    const num1 = createDecimal(a);
    const num2 = createDecimal(b);
    return num1.dividedBy(num2).toString();
  };

  const multiply = (a, b) => {
    const num1 = createDecimal(a);
    const num2 = createDecimal(b);
    return num1.times(num2).toString();
  };

  return {
    plus,
    minus,
    divide,
    multiply
  };
};

export default decimal;