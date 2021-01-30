import Mexp from "math-expression-evaluator";

export class Calculator {
  public input: HTMLInputElement;
  public answer: HTMLInputElement;
  public operator: Array<string> = ['+', '-', '*', '/','^'];
  public decimalAdded: boolean = false;
 
  constructor(input: HTMLInputElement, answer: HTMLInputElement) {
    this.input = input;
    this.answer = answer;
  }


  processButton(button: HTMLButtonElement) {
    switch (true) {
      case button.textContent === 'C':
        this.processResetButton();
        break;
      case !isNaN(Number(button.textContent)):
        this.processNumberButton(button.textContent);
        break;
      case (this.operator.indexOf(button.textContent) > -1):
        this.processOperatorButton(button.textContent);
        break;
      case button.textContent === '.':
        this.processDecimalButton(button.textContent);
        break;
      case button.textContent === '%':
        this.processPercentageButton(button.textContent);
        break;
      case (button.textContent === '(' || button.textContent === ')'):
        this.processParenthesesButton(button.textContent);
        break;
      case (button.textContent === '='):
      //  this.answer.value = this.valuator.evaluate(this.input.value).toString();
        this.answer.value = Mexp.eval(this.input.value)
        break;
    }
  }

  processParenthesesButton(btnValue) {
    if (this.input.value == '0')
      this.input.value = "";

    var btnVal = btnValue;

    if (btnVal == '(')
      this.input.value += btnVal + " ";
    else
      this.input.value += " " + btnVal;

    this.decimalAdded = false;
  }

  processPercentageButton(btnValue) {
    var inputVal = this.input.value;
    var btnVal = btnValue;

    if (inputVal != '' && inputVal.indexOf('-') == -1 && inputVal.indexOf('+') == -1
      && inputVal.indexOf('/') == -1 && inputVal.indexOf('x') == -1 && inputVal.indexOf('^') == -1
      && inputVal.indexOf('(') == -1 && inputVal.indexOf(')') == -1
      && inputVal.indexOf('%') == -1) {
      this.input.value += btnVal;
    }
  }
  processDecimalButton(btnValue) {
    var btnVal = btnValue;

    if (!this.decimalAdded) {
      this.input.value += btnVal;
      this.decimalAdded = true;
    }
  }
  processOperatorButton(btnValue) {
    var inputVal = this.input.value;
    var lastChar = inputVal.substring(inputVal.length - 1);
    var btnVal = btnValue;

    if (inputVal != '' && this.operator.indexOf(lastChar) == -1) {
      this.input.value += " " + btnVal + " ";
    }
    else if (inputVal == '' && btnVal == '-') {
      this.input.value += " " + btnVal + " ";
    }
    if (this.operator.indexOf(lastChar) > -1 && inputVal.length > 1) {
      this.input.value = inputVal.substring(0, inputVal.length - 1) + btnVal;
    }
    this.decimalAdded = false;
  }
  processResetButton() {
    this.input.value = "0";
    this.answer.value = "0";
    this.decimalAdded = false;
  }
  processNumberButton(btnValue) {
    if (this.input.value == "0")
      this.input.value = "";

    var btnVal = btnValue;
    this.input.value += btnVal;
    //decimalAdded = false;

  }        
}