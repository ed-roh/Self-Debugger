function addNumbers(a, b) {
  return a + b;
}

function calculate(operation, num1, num2) {
  let result;
  switch (operation) {
    case "add":
      result = addNumbers(num1, num2);
      break;
    case "subtract":
      result = subtractNumbers(num1, num2);
      break;
    default:
      return;
  }
  return result;
}

console.log(calculate("subtract", 4, 3));
