(function(){
	var $$ = {};

	$$.eventAdd=function(t, m, f){

		//other Browser
		if (t.addEventListener){
			t.addEventListener(m, f, false);
		}

		//IE
		else{
			if(m=='load'){
				var d = document.body;
				if(typeof(d)!='undefined'){d = window;}

				if((typeof(onload)!='undefined' && typeof(d.onload)!='undefined' && onload == d.onload) || typeof(eval(onload))=='object'){
					t.attachEvent('on' + m, function() { f.call(t , window.event); });
				}
				else{
					f.call(t, window.event);
				}
			}
			else{
				t.attachEvent('on' + m, function() { f.call(t , window.event); });
			}
		}
	};
	$$.urlProperty=function(url){
		if(!url){url=location.href}

		var res = {};
		var urls = url.split("?");
		res.url = urls[0];
		res.domain = urls[0].split("/")[2];
		res.querys={};
		if(urls[1]){
			var querys = urls[1].split("&");
			for(var i=0;i<querys.length;i++){
				var keyValue = querys[i].split("=");
				if(keyValue.length!=2||keyValue[0]===""){continue}
				res.querys[keyValue[0]] = keyValue[1];
			}
		}
		return res;
	};

	/**
	 * Ajax
	 */
	$$.ajax = {
		xmlObj:function(f){
			var r=null;
			try{
				r=new XMLHttpRequest();
			}
			catch(e){
				try{
					r=new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch(e){
					try{
						r=new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch(e){
						return null;
					}
				}
			}
			return r;
		},
		createHttpRequest:function(){
			//Win ie用
			if(window.ActiveXObject){
				try {
					//MSXML2以降用;
					return new ActiveXObject("Msxml2.XMLHTTP")
				}
				catch(e){
					try {
						//旧MSXML用;
						return new ActiveXObject("Microsoft.XMLHTTP")
					}
					catch(e2){
						return null
					}
				}
			}
			//Win ie以外のXMLHttpRequestオブジェクト実装ブラウザ用;
			else if(window.XMLHttpRequest){
				return new XMLHttpRequest()
			}
			else{
				return null
			}
		},
		/**
		 * XMLHttpRequestオブジェクト生成
		 */
		set:function( option ){
			if(!option){return}
			var httpoj = new $$.ajax.createHttpRequest();
			if(!httpoj){return}
			//open メソッド;
			httpoj.open( option.method , option.url , option.async );
			httpoj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

			//受信時に起動するイベント;
			httpoj.onreadystatechange = function(){
				//readyState値は4で受信完了;
				if (httpoj.readyState==4){
					//コールバック
					option.onSuccess(httpoj.responseText);
				}
			};

			//query整形
			var data = [];
			if(typeof(option.query)!="undefined"){
				for(var i in option.query){
					data.push(i+"="+encodeURIComponent(option.query[i]));
				}
			}
			if(typeof(option.querys)!="undefined"){
				for(var i=0;i<option.querys.length;i++){
					data.push(option.querys[i][0]+"="+encodeURIComponent(option.querys[i][1]));
				}
			}
			//send メソッド
			if(data.length){
				httpoj.send( data.join("&") );
			}
			else{
				httpoj.send();
			}
		},
		//コールバック関数 ( 受信時に実行されます );
		onSuccess:function(oj){
			//レスポンスを取得;
			var res = oj.responseText;
			//console.log(res);
			//ダイアログで表示;
			if(res && res.match(/^[a-z|$]/)){
				eval(res);
			}
		}
	};
	//path-info Ex):p=location.href
	$$.pathinfo = function(p){
		var basename="",
		    dirname=[],
				filename=[],
				ext="";
		var p2 = p.split("?");
		var urls = p2[0].split("/");
		for(var i=0; i<urls.length-1; i++){
			dirname.push(urls[i]);
		}
		basename = urls[urls.length-1];
		var basenames = basename.split(".");
		for(var i=0;i<basenames.length-1;i++){
			filename.push(basenames[i]);
		}
		ext = basenames[basenames.length-1];
		return {
			"hostname":urls[2],
			"basename":basename,
			"dirname":dirname.join("/"),
			"filename":filename.join("."),
			"extension":ext,
			"query":(p2[1])?p2[1]:"",
			"path":p2[0]
		};
	};
	$$.urlinfo=function(uri){
		if(!uri){uri = location.href}
		var data={};
		//URLとクエリ分離分解;
		var query=[];
		if(uri.indexOf("?")!=-1){query = uri.split("?")}
		else if(uri.indexOf(";")!=-1){query = uri.split(";")}
		else{
			query[0] = uri;
			query[1] = '';
		}

		//基本情報取得;
		var sp = query[0].split("/");
		var data={
			url:query[0],
			dir:this.pathinfo(uri).dirname,
			domain:sp[2],
			protocol:sp[0].replace(":",""),
			query:(query[1])?(function(q){
				var data=[];
				var sp = q.split("&");
				for(var i=0;i<sp.length;i++){
					var kv = sp[i].split("=");
					if(!kv[0]){continue}
					data[kv[0]]=kv[1];
				}
				return data;
			})(query[1]):[],
		};

		return data;
	};

	/**
	* 直上の対象エレメントを取得
	* param @ elm : target-element
	* param @ type : [class , id]
	* param @ value : string
	**/
	$$.getElementByParentNode = function(elm,type,value){
		if(!elm){return null}

		if(type === "class"){
			if(elm.parentNode.className.indexOf(value)!=-1){
				return elm.parentNode;
			}
			else{
				return $$.getElementByParentNode(elm.parentNode,type,value);
			}
		}
		else if(type === "id"){
			if(elm.parentNode.id && elm.parentNode.id === value){
				return elm.parentNode;
			}
			else{
				return $$.getElementByParentNode(elm.parentNode,type,value);
			}
		}

	};

	window.$$LIB = $$;
	return $$;
})();
