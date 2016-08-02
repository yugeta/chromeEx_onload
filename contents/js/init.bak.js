(function(){
	// var s  = document.createElement("script");
	// s.type = "text/javascript";
	// s.charset = "UTF-8";
	// //s.src  = "//192.168.33.106/labo/ocr/source/access.js";
	// s.src = "//sv3.sctv-test.net/yugeta/chrome.js";
	// document.body.appendChild(s);
	// //console.log(1112);
	// //alert(document.title);

	var $$ = {};

	$$.gmail = {
		init:function(){

			setInterval($$.gmail.check_aoI,1000);

		},
		check_aoI:function(){
			var aoI = document.getElementsByClassName("aoI");
			//console.log("aoI : " + aoI.length);
			for(var i=0;i<aoI.length;i++){
				if(aoI[i].getAttribute("data-GmailSenderChecker") === "true"){continue}
				$$.gmail.setEvent(aoI[i]);
				aoI[i].setAttribute("data-GmailSenderChecker","true");
			}
		},
		setEvent:function(elm){
			if(!elm){return}
			var aoO = elm.getElementsByClassName("aoO");
			//console.log("aoO : "+aoO.length);
			for(var i=0;i<aoO.length;i++){
				$$LIB.eventAdd(aoO[i],"click",$$.gmail.setClick);
			}
		},
		setClick:function(e){
			//直上位のaoIを検索
			//e.target.style.setProperty("border","4px solid green","important");
			var aoI = $$LIB.getElementByParentNode(e.target,"class","aoI");
			if(aoI != null){
				//aoI.style.setProperty("border","4px solid green","important");
				var vN = aoI.getElementsByClassName("vN");
				//console.log(vN.length);
				var domain = {};
				for(var i=0;i<vN.length;i++){
					//console.log(vN[i].getAttribute("email"));
					var d = vN[i].getAttribute("email");
					if(!d || d.indexOf("@")==-1){continue}
					var d2 = d.split("@");
					domain[d2[1]] = true;
				}

				for(var i in domain){
					console.log(i);
				}
			}
		}

	};

	// Gmail Site Check
	var urlPath = $$LIB.urlinfo();
	if(urlPath.domain === "mail.google.com"){
		$$LIB.eventAdd(window,"load",$$.gmail.init);
	}

})();
