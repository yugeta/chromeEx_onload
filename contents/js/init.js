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

			setInterval(function(){
				$$.gmail.check_aoI();
				$$.gmail.checkSuggest();
				$$.gmail.viewImage();
			},1000);

		},
		data:{
			serverPath:"https://sv3.sctv-test.net/yugeta/domainDatabase/",
			domain:{}
		},
		/**
		* send button push event
		**/
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

				// for(var i in domain){
				// 	console.log(i);
				// }
			}
		},
		/**
		* mail address suggest
		**/
		checkSuggest:function(){
			//suggest-check
			var aJS = document.getElementsByClassName("aJS");
			for(var i=0;i<aJS.length;i++){
				//if(aJS[i].getAttribute("data-GmailSenderChecker") === "true"){continue}
				$$.gmail.setSuggestArea(aJS[i]);
				//aJS[i].setAttribute("data-GmailSenderChecker","true");
			}
			//console.log("aJS:"+aJS.length);
		},
		setSuggestArea:function(suggest_area){
			var axF = suggest_area.getElementsByClassName("Jd-axF");
			//console.log("list-count : "+axF.length);

			for(var i=0;i<axF.length;i++){
				//console.log(axF[i].tagName);
				//console.log($$.gmail.getDomain(axF[i]));
				if(axF[i].getAttribute("data-GmailSenderChecker") === "true"){continue}
				axF[i].setAttribute("data-GmailSenderChecker","true");
				$$.gmail.setSuggestIcon(axF[i]);
			}
			//$$.gmail.setSuggestIcon(aJS[i]);
		},
		getDomain:function(target_elm){
			if(!target_elm){return ""}
			var val  = target_elm.getElementsByClassName("Sr");
			if(!val.length){return ""}
			return val[0].innerText;
		},
		setSuggestIcon:function(suggest_item){
			var mail = $$.gmail.getDomain(suggest_item);

			var mails= mail.split("@");
			if(mails.length!=2){return}

			var domain = mails[1];
			if(!domain){return}

			if(mails.length != 2){return}
			if(typeof($$.gmail.data.domain[domain])!="undefined"){return}

			$$.gmail.data.domain[domain] = "";
			$$LIB.ajax.set({
				url:$$.gmail.data.serverPath+ "search.php",
				method:"post",
				async:"true",
				query:{
					get:"logoPath",
					domain:domain
				},
				onSuccess:function(res){
					if(!res){return}
					var json = JSON.parse(res);
					//console.log(this.query.domain+" : "+json.domain +" : "+json.image);
					$$.gmail.data.domain[json.domain] = json.image;
					//suggestに画像表示
					$$.gmail.viewImage();
				}
			});

		},
		//suggestに画像表示
		viewImage:function(){

			//suggestエリアを取得
			var aJS = document.getElementsByClassName("aJS");
			for(var j=0;j<aJS.length;j++){

				//suggestリスト一覧を取得
				var axF = aJS[j].getElementsByClassName("Jd-axF");
				for(var i=0;i<axF.length;i++){

					//メアドリスト表示部分の取得
					var aq = axF[i].getElementsByClassName("aq");
					if(!aq.length){continue}

					//画像表示済みの確認
					var domainImage = aq[0].getElementsByClassName("domain-image");
					if(domainImage.length!=0){continue}

					//メールアドレスの取得
					var innerMail = $$.gmail.getDomain(axF[i]);
					//ドメインの取得
					var innerDomain = innerMail.split("@")[1];

					//image取得
					if(typeof($$.gmail.data.domain[innerDomain])=="undefined"){continue}
					var image = $$.gmail.data.domain[innerDomain];
					if(!image){continue}

					//画像表示処理
					var div = document.createElement("div");
					var img = document.createElement("img");
					div.appendChild(img);
					aq[0].appendChild(div);

					div.className = "domain-image";
					div.style.setProperty("position","absolute","important");
					div.style.setProperty("display","inline-block","important");
					div.style.setProperty("right","0","important");
					div.style.setProperty("top","0","important");
					//div.innerHTML = image;

					img.src = $$.gmail.data.serverPath + image;
					img.style.setProperty("max-height","32px","important");
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
