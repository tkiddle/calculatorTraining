//Custom Javascript File

Calculator = function(options){
		self = this;
		self.options = options;
		self.options.calcScreenFont = document.defaultView.getComputedStyle(self.options.calcScreen).getPropertyValue('font-size');
		self.initCalc();		
};

Calculator.prototype = {

	dM : function (toLog) {
		//Global debug logging
		if(self.options.debug){
			console.log(toLog);			
		}
		
	},
	//Loop Through Objects & Arrays for matches
	objLoop : function (theObj, matchProp) {
		for(x in theObj){
			if(theObj[x] === matchProp){
				return true;
			}
		};
		return false;
	},

	//Loop Through Elements and Attach an Event Handler
	loopElements : function (ele, event, callBack) {
	    for(var i = 0, len = ele.length; i < len; i++){
	        ele[i].addEventListener(event, callBack);
	    };
	},

	//Calculator Reset/Update
	calcReset : function (resetVal) {
		self.options.calcScreen.value = resetVal;
	},

	//Delete Last Character
	deleteLast : function () {
		if(self.options.calcScreen.value != '0'){
			self.calcReset(self.options.calcScreen.value.slice(0, self.options.calcScreen.value.length -1));
		}
	},

	//Secret Words
	suprise : function (triggerVals, triggerMatch) {

		var cssProps = document.defaultView.getComputedStyle(self.options.calc, null).getPropertyValue('transform');

		self.dM(cssProps);

		if(self.objLoop(triggerVals, triggerMatch) && cssProps !== 'matrix(-1, 0, 0, -1, 0, 0)'){
			self.options.calc.style.transform = 'rotate(180deg)';
			self.options.calc.style.transition = 'all 1s ease-in-out 0s';
		} else if(cssProps === 'matrix(-1, 0, 0, -1, 0, 0)') {
			self.options.calc.style.transform = 'rotate(0deg)';
			self.options.calc.style.transition = 'all 1s ease-in-out 0s';
		};
	},

	keyboardHandeling : function () {
		window.addEventListener('keypress', function (event, callback){
			var keyChar = String.fromCharCode(event.keyCode || event.charCode);
			self.dM(keyChar);
			if (self.objLoop(self.options.keys, keyChar)) {
				if(self.options.calcScreen.value === '0' || self.objLoop(self.options.operators, self.options.calcScreen.value)){
				keyChar === '.' ? self.calcReset('0') : self.calcReset('');	
				}
				self.calcReset(self.options.calcScreen.value + keyChar);
			}

			

		});
	},

	fadeIn : function (fadeId) {

		var opacityVal = 0, 
			eleFade = document.getElementById(fadeId);
			
		fadeAni = function () {
			
			var curOpacity = document.defaultView.getComputedStyle(eleFade).getPropertyValue('opacity');
			self.dM(curOpacity);

			if (curOpacity == 1){
				clearInterval(fade);
			}
			opacityVal += 0.1;
			eleFade.style.opacity = opacityVal;
		} 
		var fade = setInterval(fadeAni, 24);
	},

	screenFontAdj :  function () {

		if (self.options.calcScreen.value.length  >= 12 && self.options.calcScreen.value.length  < 16) 
			self.options.calcScreen.style.fontSize = '24px';
		else if (self.options.calcScreen.value.length >= 16 && self.options.calcScreen.value.length  < 23)
			self.options.calcScreen.style.fontSize = '18px';
		else if (self.options.calcScreen.value.length >= 22)
			self.options.calcScreen.style.fontSize = '16px';
		else 
			self.options.calcScreen.style.fontSize = self.options.calcScreenFont;
	},

	initCalc : function() {
		//Reset the calculator to'0' on page load
		self.calcReset('0');
		self.keyboardHandeling();

		self.loopElements(self.options.buttons, 'click', function () {
			self.screenFontAdj();
			//Set var with li's value
			var curButVal = this.childNodes[0].nodeValue;

			//If the clicked li has a class name of 'num' run the calcReset function 
			//passing the cur screen value and clicked button value in.
				
			if(this.className.indexOf('num') != -1 || this.className.indexOf('operator') != -1){
				//If the screen value is '0' remove it before adding the new values
				
				if(self.options.calcScreen.value === '0' || self.objLoop(self.options.operators, self.options.calcScreen.value)){
					curButVal === '.' ? self.calcReset('0') : self.calcReset('');
				}
				self.calcReset(self.options.calcScreen.value + curButVal);
			}

			//DELETE BUTTON
			if(this.getAttribute('id') === 'delete') {
				if(self.options.calcScreen.value.length === 1) {
					self.calcReset('0');
					return;
				}
				self.deleteLast();	
			};

			//Clear self.options.buttons
			if(this.className.indexOf('reset') != -1) {
				self.calcReset('0');
			};

			//EQUALS BUTTON
			if(this.getAttribute('id') === 'equals') {

				var screenChar = self.options.calcScreen.value.charAt(self.options.calcScreen.value.length -1);

				if(self.options.calcScreen.value === '0' || self.objLoop(self.options.operators, screenChar)) {
					confirm('Can you actually use a calculator?');
					return;
				}
				self.calcReset(eval(self.options.calcScreen.value)); //eval - yes it is evil! 
				
				self.suprise(self.options.supriseItems, self.options.calcScreen.value)
				
				self.screenFontAdj();

			}

		}); //loopElements ENDS
		
	}	
}

window.onload = function () {

		//Instantiation
		calculator =  new Calculator({
			calc : document.getElementById('calculator'),
			calcScreen : document.getElementById('screen'),
			buttons : document.getElementsByTagName('li'),
			supriseItems : ['55378008','531608', '376006'],
			operators : ['+', '*', '/'],
			keys : ['1','2','3','4','5','6','7','8','9','0','=','-'],
			debug : false
	});

};


