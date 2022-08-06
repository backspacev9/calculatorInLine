const calcInput = document.getElementById("calcInput");
const btnСalculate = document.getElementById("btn-calculate");
const btnsNumber = document.querySelectorAll(".number");
const btnsAction = document.querySelectorAll(".action");
const rescontainer = document.getElementById("rescontainer");
const resultContainer = document.getElementById("resultContainer");
const btnClear = document.getElementById("btnClear");

btnsNumber.forEach((el) =>
  el.addEventListener("click", (ev) => {
    calcInput.value += el.innerText;
  })
);
btnsAction.forEach((el) =>
  el.addEventListener("click", (ev) => {
    calcInput.value += el.innerText;
  })
);
btnClear.addEventListener("click", () => (calcInput.value = ""));
btnСalculate.addEventListener("click", () => {
  console.clear();
  const res = calculate(calcInput.value);
  resultContainer.innerText = `= ${Number(res).toFixed(2)}`;
  console.log(Number(res).toFixed(2));
});

const actions = {
  "-": (a, b) => Number(a) - Number(b),
  "+": (a, b) => Number(a) + Number(b),
  "*": (a, b) => Number(a) * Number(b),
  "/": (a, b) => Number(a) / Number(b),
};

const commonNumberRegex = new RegExp(/^[+-]?\d+(\.\d+)?$/, "g");
const patternBrackets = new RegExp(/\(([^()]+)\)/, "g");
const splitRegex = new RegExp(/(^-?\d+(\.\d+)?|\d+(\.\d+)?|\d+(\.\d+)?)|./, "g"); //(^-?\d+|\d+|\(-\d+\))|.
const splitIfMinus = new RegExp(/\d+(\.\d+)?|([*/+])|(-\d+(\.\d+)?)|(-)/, "g");
const minusRegex = new RegExp(/\(-\d+(\.\d+)?\)/, "g");
const firstPriority = new RegExp(
  /(^-?\d+(\.\d+)?|\d+(\.\d+)?|\(-\d+(\.\d+)?\))(\*|\/)(-?\d+(\.\d+)?|\d+(\.\d+)?|\(-\d+(\.\d+)?\))/,
  "g"
);
const secondPriority = new RegExp(
  /(^-?\d+(\.\d+)?|\d+(\.\d+)?|\(-\d+(\.\d+)?\))(\+|\-)(-?\d+(\.\d+)?|\d+(\.\d+)?|\(-\d+(\.\d+)?\))/,
  "g"
);
const ifMinusRegex = new RegExp(/\d+(\.\d+)?[+-/*]\-\d+(\.\d+)?/, "g");
//const secondPriority = new RegExp(/\d+(\+|\-)\d+/, "g");
//const autoBracketsRegex = new RegExp(/((\-{2})|(\+\-)\d+)/, "g");

const calculate = (str) => {
  // console.log("inputC :", str);
  if (!commonNumberRegex.test(str)) {
    const bracketsValue = str.match(patternBrackets);
    let bracketsExpretion, replacePattern;
    bracketsExpretion = replacePattern = "";
    if (bracketsValue) {
      bracketsExpretion = bracketsValue[0].replace(/[\(\)]/g, "");
      replacePattern = bracketsValue[0];
      if (bracketsValue[0].match(minusRegex)) {
        str = str.replace(bracketsValue[0], bracketsValue[0].replace(/[\(\)]/g, ""));
        console.log("strtogo", str);
        return calculate(str);
      }
    } else {
      return calculateString(str);
    }
    const result = calculateString(bracketsExpretion);
    str = str.replace(replacePattern, result);
    console.log("res :", str);
    return calculate(str);
  }
};

const calculateString = (str) => {
  console.log("inputCalctr :", str);
  if (!commonNumberRegex.test(str)) {
    const expression = str.match(firstPriority)
      ? str.match(firstPriority)[0]
      : str.match(secondPriority)[0];
    const splitedRegex = expression.match(ifMinusRegex)
      ? expression.match(splitIfMinus)
      : expression.match(splitRegex);
    const replacePattern = expression;
    const action = splitedRegex[1];
    const a = splitedRegex[0];
    const b = splitedRegex[2];
    console.log(a, action, b);
    const result = actions[action](a, b);
    str = str.replace(replacePattern, result);
    // console.log("res2 :", str);
    // console.log("action :", action);
    return calculateString(str);
  }
  return str;
};
