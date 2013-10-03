$(document).on('ready',function(){
	$(".section:not(:first)").hide();
	navBar.init();
	tokenizer.init();
	$("#startParsing").on('click',function(){
		navBar.next();
		parser.start();
		console.log(parser.errorFlag);
		if(!parser.errorFlag){
			parser.success();
		}else{
			parser.failure();
		}
	});

});

var parser = {
	tokens : [],
	cursor : 0,
	currentToken : "",
	errorFlag : false,
	reset : function(){
		this.cursor = 0;
		this.errorFlag = false;
		this.currentToken = "";
		this.tokens = [];
	},
	next : function(){
		this.currentToken = this.tokens[this.cursor];
		this.cursor++;
	},
	start : function(){
		this.tokens = tokenizer.tokens;
		console.log(this.tokens);
		console.log(this.currentToken);
		console.log(this.errorFlag);
		console.log(this.cursor);
		this.next();
		this.E();
	},
	error : function(){
		this.errorFlag = true;
		console.log("Error");
	},

	Td : function(){
			console.log("Td");
		if(this.currentToken == "*" || this.currentToken == "/" ){
			this.next();
			this.F();
			this.Td;
		}
		if(this.currentToken == "id"){
			this.error();
		}
	},

	F : function(){
			console.log("F");
		if(this.currentToken == '('){
			this.next();
			this.E();
			if(this.currentToken == ')')
				this.next();
			else
				this.error();
		}
		else if(this.currentToken == "id")
			this.next();
		else
			this.error();
	},

	T : function(){
			console.log("T");
		this.F();
		this.Td();
	},

	Ed: function(){
			console.log("Ed");
			console.log(this.currentToken);
		if(this.currentToken == '+' || this.currentToken == '-'){
			this.next();
			this.T();
			this.Ed();
		}
		if(this.currentToken == "id")
			this.error();
	},	
 	E : function(){
 		console.log("E");
		this.T();
		this.Ed();
	},

	success : function(){
		$("#parserContainer").addClass("success");
	},
	failure : function(){
		$("#parserContainer").addClass("error");
	}
}

var navBar = {
	nextButton : $("#next-button"),
	prevButton : $("#prev-button"),
	sectionArray : $(".section"),
	activeClass : "active",
	hiddenClass : "hidden",
	init : function(){
		var self = this;
		self.nextButton.on('click',function(){
			self.next();
		});
		
		self.prevButton.on('click',function(){
			self.previous();
		});

		self.currentSection = $(".section:first");
	},

	next : function(){	
		var self = this;
	//	console.log("Next click");
		this.nextSection = this.currentSection.next();
	//	console.log(this.nextSection);
		$(this.nextSection).show();
		 scrollTo(this.nextSection,function(){
				self.currentSection = self.nextSection;
		});
	},

	previous : function(){
		var self = this;
		console.log("Previous click");
		this.nextSection = this.currentSection.prev();
		//console.log(this.nextSection);
		 scrollTo(this.nextSection,function(){
			self.currentSection.hide(function(){
				self.currentSection = self.nextSection;
			});
		});
	}
}

var tokenizer = {
	parseButton : $("#parseStart"),
	resetButton : $("#reset"),
	operators : ['+','*','(',')','-','/','$'],
	string : "",
	tokens : [],
	init: function(){
		var self = this;
		this.parseButton.on('click',function(){
			//console.log("Yokenizer started");
			self.setString( $("#parsingString").val());
			self.tokenize();
		});
		this.resetButton.on('click',function(){
			self.reset();
			parser.reset();
		})
	},
	reset : function(){
		this.string = "";
		this.modifiedString = "";
		this.tokens = [];
		$("#parsingString").val("");
		$("#modifiedStringContainer").hide();
		$("#parserContainer").removeClass("success");
		$("#parserContainer").removeClass("success");

	},
	setString : function(string){
		this.string = string;
		this.string;
	},
	stripSpace : function(){
		this.string = this.string.replace(/\s+/g, '');
		//console.log(this.string);
	},
	tokenize : function(){
		var cursor = 0;
		var identifierBuffer = "";
		this.stripSpace();
		this.string = this.string + '$';
		this.modifiedString = "";
		while(cursor <= this.string.length){
			curChar = this.string.charAt(cursor);
			//console.log('curChar');
			//console.log(curChar);
			if(!this.is_operator(curChar)){
				identifierBuffer = identifierBuffer + curChar;
				//console.log('identifierBuffer');
				//console.log(identifierBuffer);
			}else{
				if(identifierBuffer.length > 0){
					this.modifiedString = this.modifiedString + 'id' + curChar;
					this.tokens.push('id');
				}else{
					this.modifiedString = this.modifiedString + curChar;
				}
				//console.log(curChar);
				//console.log(this.modifiedString);
				identifierBuffer = "";
				this.tokens.push(curChar);
			}
			cursor++;
		}
		//console.log(this.tokens);
		this.modifiedString = this.modifiedString.substring(0, this.modifiedString.length - 1);
		//console.log(this.modifiedString)
		this.display(); 
	},
	is_operator : function(character){
		var i;
		var length = this.operators.length;
		for(i=0;i<length;i++){
			if(character == this.operators[i]){
				return true;
			}
		}
		return false;
	},
	display : function(){
		$("#modifiedString").html(this.modifiedString);
		$("#modifiedStringContainer").show();
	}
}

function scrollTo(div,callback)
{
  // Scroll
  //console.log("scrollTo");
  //console.log(div);
  return $('html,body').animate({scrollTop: div.offset().top},'slow','swing',callback);
}
