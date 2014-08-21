//Custom Javascript File for BUILDING A CALCULATOR

/*
Write some javascript in your normal style to and the follwing functionality.
1. 	When clicking an operand button (number) update the display with that buttons value.
2. 	When clicking another operand update the display with that buttons value and the previous value. 
3. 	When clicking the clear button clear the display and reset it to 0.
4. 	When clicking the backspace button update the display value removing the last digit,
	Repeatedly cliking the backspace button will remove another single digit at a time.
*/


(function () {

    var app = {}
    
    app.Calculator = function (gui) {
        this.operand1 = null;
        this.operand2 = null;
        this.operator = null;
    };
    
    app.Calculator.prototype = {
        setOperand: function (operand) {
            if (this.operator === null) {
                this.operand1 = this.operand1 === null ? operand : this.operand1 + '' + operand;
                return this.operand1;
            } else {
                this.operand2 = this.operand2 === null ? operand : this.operand2 + '' + operand;
                return this.operand2;
            }
        },
        
        setOperator: function (operator) {
            if ((operator === '/' && this.operand1 === '0') || (operator === '/' && this.operand2 === '0')) {
                return('-E-');
            } else if (operator === '+' || operator === '-' || operator === '/' || operator === '*') {
                this.operator = operator;
            } else if (operator === '=') {
                return this.calculate();
            } else {
                return('-E-');
            }
        },
        
        calculate: function () {
            var answer
                // Cast so that we get calculation rather than concatenation
                operand1 = parseInt(this.operand1, 10),
                operand2 = parseInt(this.operand2, 10);

            switch (this.operator) {
                case '+':
                    answer = operand1 + operand2;
                    break;
                case '-':
                    answer = operand1 - operand2;
                    break;
                case '/':
                    answer = operand1 / operand2;
                    break;
                case '*':
                    answer = operand1 * operand2;
                    break;
            }
            
            return answer;
        },

        backspace: function () {
            if (this.operator === null) {
                this.operand1 = this.operand1.length > 1 ? this.operand1.substring(0, this.operand1.length - 1) : this.operand1;
                return this.operand1;
            } else {
                this.operand2 = this.operand2.length > 1 ? this.operand2.substring(0, this.operand2.length - 1) : this.operand2;
                return this.operand2;
            }
        },

        reset: function () {
            this.operand1 = null;
            this.operand2 = null;
            this.operator = null;
            return "0";
        }
    };
    
    app.CalculatorGUI = function (el) {
        this.calc = new app.Calculator(this);
        this.registerHandlers(el);
        this.display = el.find('.display').find('input[type="text"]');
    };
    
    app.CalculatorGUI.prototype = {
        registerHandlers: function (el) {
            var self = this;
            el.find('.numbers').find('button').click(function () {
                self.setDisplay(self.calc.setOperand(this.value));
            });
            el.find('.operators').find('button').click(function () {
                self.calc.setOperator(this.value);
            });
            el.find('.equals').find('button').click(function () {
                self.setDisplay(self.calc.setOperator(this.value));
            });
            el.find('.edit').find('button[value="clear"]').click(function () {
                self.setDisplay(self.calc.reset());
            });
            el.find('.edit').find('button[value="backspace"]').click(function () {
                self.setDisplay(self.calc.backspace());
            });
        },
        
        setDisplay: function (answer) {
            this.display.val(answer);
        }
    };
    
    window.app = app;
}());


$(function () {
    var $el = $('#calculator'),
        calculator = new app.CalculatorGUI($el);
});