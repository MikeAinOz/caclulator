export class calculator {
  public input: HTMLInputElement;
  public answer: HTMLInputElement;
  public operator: Array<string> = ['+', '-', 'x', '/'];
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
    }
  }
  processOperatorButton(btnValue)
        {
            var inputVal = this.input.value;
            var lastChar = inputVal.substring(inputVal.length - 1);
            var btnVal = btnValue;

            if(inputVal!='' && this.operator.indexOf(lastChar) == -1)
            {
                this.input.value += " " + btnVal + " ";
            }
            else if(inputVal == '' && btnVal == '-')
            {
                this.input.value += " " + btnVal + " ";
            }

            if(this.operator.indexOf(lastChar) > -1 && inputVal.length > 1)
            {
                //input.value.replace(/.$/, btnVal);
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

// https://dev.to/macmacky/implement-a-stack-with-typescript-4e09
interface StackNode<T> {
  value: T | null
  next: StackNode<T> | null
}

class StackNode<T> implements StackNode<T> {
  constructor(val: T) {
    this.value = val
    this.next = null
  }
}

interface Stack<T> {
  size: number
  top: StackNode<T> | null
  bottom: StackNode<T> | null
  push(val: T): number
  pop(): StackNode<T> | null
}



class Stack<T = string> implements Stack<T> {
  constructor() {
    this.size = 0
    this.top = null
    this.bottom = null
  }

  push(val: T) {
    const node = new StackNode(val)
    if (this.size === 0) {
      this.top = node
      this.bottom = node
    } else {
      const currentTop = this.top
      this.top = node
      this.top.next = currentTop
    }

    this.size += 1
    return this.size
  }


  pop(): StackNode<T> | null {
    if (this.size > 0) {
      const nodeToBeRemove = this.top as StackNode<T>
      this.top = nodeToBeRemove.next
      this.size -= 1
      nodeToBeRemove.next = null
      return nodeToBeRemove
    }
    return null
  }
}