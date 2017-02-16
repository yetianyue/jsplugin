/**
 * Description of function
 * Ajax加载 提示loading
 * 展示与隐藏 LOADING.show(),LOADING.hide() 
 * LOADING.setOptions(options); options = { width:int,height:int,type:string,color:string}
 * type 可选为fadingcircle cubegrid threebounce wanderingcubes wave chasingdots singlebounce doublebounce rotateplane
 * 兼容性：Internet Explorer 10、Firefox 以及 Opera 支持 @keyframes 规则和 animation 属性。Chrome 和 Safari 需要前缀 -webkit-。
 * 		   Internet Explorer 9，以及更早的版本，不支持 @keyframe 规则或 animation 属性。
 * @author 叶天跃
 * @datetime 2016-09-06 13:09:02
 */
var LOADING = (function(){
	var SpinnerStyle = _getSpinnerStyle();			
	var loading = {
		_body:document.body,
		_spinnerWidth:100,
		_spinnerHeight:100,
		_spinnerType:'rotateplane',
		_spinnerColor:'#67CF22',
		_spinnerClass:'loading-spinner',
		_spinnerStyle:SpinnerStyle['rotateplane'],
		_backdropId:'loading-backdrop',
	}
	loading.setOptions = function(options){
		this._backdrop = this._spinner = null;
		this._spinnerWidth = options.width?options.width:this._spinnerWidth;
		this._spinnerHeight = options.height?options.height:this._spinnerHeight;
		this._spinnerType = options.type?options.type:this._spinnerType;
		this._spinnerColor = options.color?options.color:this._spinnerColor;
	}
	loading.show = function(){
		var params = _getSpinnerParams();
		if(!this._spinner)
			_createHtml();
		if(!this._backdrop)
			_createBackdrop();
		this._spinner.style.top = params.top+"px";
		this._spinner.style.left = params.left+"px";
		this._spinner.style.display = "block";
		this._backdrop.style.display = "";
	}
	loading.hide = function(){
		this._spinner.style.display = "none";
		this._backdrop.style.display = "none";
	};
	function _getSpinnerParams(){
		var width = document.documentElement.clientWidth;
		var height = document.documentElement.clientHeight;
		return spinnerParams = {
			left:width/2-loading._spinnerWidth/2,
			top:height/2-loading._spinnerHeight/2
		}
	};
	function _createHtml(){
		_createStyle();
		var child = 0;
		switch(loading._spinnerType){
			case 'rotateplane':case 'singlebounce':
				child = 0;
				break;
			case 'doublebounce':case 'chasingdots':case 'wanderingcubes':
				child = 2;
				break;
			case 'threebounce':
				child = 3;
				break;
			case 'foldingcube':
				child = 4;
				break;
			case 'wave':
				child = 5;
				break;
			case 'cubegrid':
				child = 9;
				break;
			case 'fadingcircle':
				child = 12;
				break;
			default:
				break;
		}
		_createSpiner(child);
	}
	function _createStyle(){
		var style = document.createElement("style");
		loading._defaultStyle = SpinnerStyle[loading._spinnerType].replace(/\$SPINNERCOLOR\$/g,loading._spinnerColor);
		style.innerText = loading._defaultStyle;
		loading._spinnerStyle = style;
		loading._body.appendChild(style);
	};
	function _createSpiner(child){
		var spinner = document.createElement("div");
		spinner.setAttribute('class',loading._spinnerClass);
		spinner.style.width = loading._spinnerWidth+'px';
		spinner.style.height = loading._spinnerHeight+'px';
		spinner.style.position = "absolute";
		spinner.style.opacity = "1";
		spinner.style.top = "0px";
		spinner.style.right = "0px";
		spinner.style.bottom = "0px";
		spinner.style.left = "0px" ;
		spinner.style.zIndex = "1200";
        spinner.style.display = "none";
		loading._body.appendChild(spinner);
		for(var i = 1;i <= child ;i++){
			var spinnerChild = document.createElement("div");
			spinnerChild.setAttribute('class','spinnerChild'+i);
			spinner.appendChild(spinnerChild);
		}
		loading._spinner = spinner;
	}
	function _createBackdrop(){
		var backdrop = document.createElement("div");
		backdrop.id = loading._backdropId;
		backdrop.style.position = "fixed";
		backdrop.style.opacity = "0.50";
		backdrop.style.top = "0px";
		backdrop.style.right = "0px";
		backdrop.style.bottom = "0px";
		backdrop.style.left = "0px" ;
		backdrop.style.zIndex = "1000";
		backdrop.style.backgroundColor = "#000";
		backdrop.style.display = "none";
		loading._body.appendChild(backdrop);
		loading._backdrop = backdrop;
	}
	function _getSpinnerStyle(){
		var SpinnerStyle = new Array();
		SpinnerStyle['rotateplane'] = '.loading-spinner {-webkit-animation: rotateplane 1.2s infinite ease-in-out;animation: rotateplane 1.2s infinite ease-in-out;background-color: $SPINNERCOLOR$;}@-webkit-keyframes rotateplane {0% { -webkit-transform: perspective(120px)}50% { -webkit-transform: perspective(120px) rotateY(180deg)}100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg)}} @keyframes rotateplane {0% {transform: perspective(120px) rotateX(0deg) rotateY(0deg);-webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)} 50% {transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);-webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)} 100% {transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);-webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);}}';
		SpinnerStyle['doublebounce'] = '.loading-spinner{} .spinnerChild1,.spinnerChild2{width:100%;height:100%;border-radius:50%;background-color:$SPINNERCOLOR$;opacity:.6;position:absolute;top:0;left:0;-webkit-animation:bounce 2.0s infinite ease-in-out;animation:bounce 2.0s infinite ease-in-out}.spinnerChild2{-webkit-animation-delay:-1.0s;animation-delay:-1.0s}@-webkit-keyframes bounce{0%,100%{-webkit-transform:scale(0.0)}50%{-webkit-transform:scale(1.0)}}@keyframes bounce{0%,100%{transform:scale(0.0);-webkit-transform:scale(0.0)}50%{transform:scale(1.0);-webkit-transform:scale(1.0)}}';
		SpinnerStyle['singlebounce'] = '.loading-spinner{background-color:$SPINNERCOLOR$;border-radius:100%;-webkit-animation:scaleout 1.0s infinite ease-in-out;animation:scaleout 1.0s infinite ease-in-out}@-webkit-keyframes scaleout{0%{-webkit-transform:scale(0.0)}100%{-webkit-transform:scale(1.0);opacity:0}}@keyframes scaleout{0%{transform:scale(0.0);-webkit-transform:scale(0.0)}100%{transform:scale(1.0);-webkit-transform:scale(1.0);opacity:0}}';
		SpinnerStyle['chasingdots'] = '.loading-spinner{-webkit-animation:rotate 2.0s infinite linear;animation:rotate 2.0s infinite linear}.spinnerChild1,.spinnerChild2{width:60%;height:60%;display:inline-block;position:absolute;top:0;background-color:$SPINNERCOLOR$;border-radius:100%;-webkit-animation:bounce 2.0s infinite ease-in-out;animation:bounce 2.0s infinite ease-in-out}.spinnerChild2{top:auto;bottom:0;-webkit-animation-delay:-1.0s;animation-delay:-1.0s}@-webkit-keyframes rotate{100%{-webkit-transform:rotate(360deg)}}@keyframes rotate{100%{transform:rotate(360deg);-webkit-transform:rotate(360deg)}}@-webkit-keyframes bounce{0%,100%{-webkit-transform:scale(0.0)}50%{-webkit-transform:scale(1.0)}}@keyframes bounce{0%,100%{transform:scale(0.0);-webkit-transform:scale(0.0)}50%{transform:scale(1.0);-webkit-transform:scale(1.0)}}';
		SpinnerStyle['wave'] = '.loading-spinner>div{background-color:$SPINNERCOLOR$;height:100%;width:8%;display:inline-block;margin:2%;-webkit-animation:stretchdelay 1.2s infinite ease-in-out;animation:stretchdelay 1.2s infinite ease-in-out}.loading-spinner .spinnerChild2{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.loading-spinner .spinnerChild3{-webkit-animation-delay:-1.0s;animation-delay:-1.0s}.loading-spinner .spinnerChild4{-webkit-animation-delay:-0.9s;animation-delay:-0.9s}.loading-spinner .spinnerChild5{-webkit-animation-delay:-0.8s;animation-delay:-0.8s}@-webkit-keyframes stretchdelay{0%,40%,100%{-webkit-transform:scaleY(0.4)}20%{-webkit-transform:scaleY(1.0)}}@keyframes stretchdelay{0%,40%,100%{transform:scaleY(0.4);-webkit-transform:scaleY(0.4)}20%{transform:scaleY(1.0);-webkit-transform:scaleY(1.0)}}';
		SpinnerStyle['wanderingcubes'] = '.spinnerChild1,.spinnerChild2{background-color:$SPINNERCOLOR$;width:40%;height:40%;position:absolute;top:0;left:0;-webkit-animation:cubemove 1.8s infinite ease-in-out;animation:cubemove 1.8s infinite ease-in-out}.spinnerChild2{-webkit-animation-delay:-0.9s;animation-delay:-0.9s}@-webkit-keyframes cubemove{25%{-webkit-transform:translateX(42px) rotate(-90deg) scale(0.5)}50%{-webkit-transform:translateX(42px) translateY(42px) rotate(-180deg)}75%{-webkit-transform:translateX(0px) translateY(42px) rotate(-270deg) scale(0.5)}100%{-webkit-transform:rotate(-360deg)}}@keyframes cubemove{25%{transform:translateX(42px) rotate(-90deg) scale(0.5);-webkit-transform:translateX(42px) rotate(-90deg) scale(0.5)}50%{transform:translateX(42px) translateY(42px) rotate(-179deg);-webkit-transform:translateX(42px) translateY(42px) rotate(-179deg)}50.1%{transform:translateX(42px) translateY(42px) rotate(-180deg);-webkit-transform:translateX(42px) translateY(42px) rotate(-180deg)}75%{transform:translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);-webkit-transform:translateX(0px) translateY(42px) rotate(-270deg) scale(0.5)}100%{transform:rotate(-360deg);-webkit-transform:rotate(-360deg)}}';
		SpinnerStyle['threebounce'] = '.loading-spinner>div{width:20%;height:20%;background-color:$SPINNERCOLOR$;border-radius:100%;display:inline-block;-webkit-animation:bouncedelay 1.4s infinite ease-in-out;animation:bouncedelay 1.4s infinite ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both}.loading-spinner .spinnerChild1{-webkit-animation-delay:-0.32s;animation-delay:-0.32s}.loading-spinner .spinnerChild2{-webkit-animation-delay:-0.16s;animation-delay:-0.16s}@-webkit-keyframes bouncedelay{0%,80%,100%{-webkit-transform:scale(0.0)}40%{-webkit-transform:scale(1.0)}}@keyframes bouncedelay{0%,80%,100%{transform:scale(0.0);-webkit-transform:scale(0.0)}40%{transform:scale(1.0);-webkit-transform:scale(1.0)}}';
		SpinnerStyle['cubegrid'] = '.loading-spinner>div{width:33.33%;height:33.33%;background-color:$SPINNERCOLOR$;float:left;-webkit-animation:spinnerChildGridScaleDelay 1.3s infinite ease-in-out;animation:spinnerChildGridScaleDelay 1.3s infinite ease-in-out}.loading-spinner .spinnerChild1{-webkit-animation-delay:.2s;animation-delay:.2s}.loading-spinner .spinnerChild2{-webkit-animation-delay:.3s;animation-delay:.3s}.loading-spinner .spinnerChild3{-webkit-animation-delay:.4s;animation-delay:.4s}.loading-spinner .spinnerChild4{-webkit-animation-delay:.1s;animation-delay:.1s}.loading-spinner .spinnerChild5{-webkit-animation-delay:.2s;animation-delay:.2s}.loading-spinner .spinnerChild6{-webkit-animation-delay:.3s;animation-delay:.3s}.loading-spinner .spinnerChild7{-webkit-animation-delay:.0s;animation-delay:.0s}.loading-spinner .spinnerChild8{-webkit-animation-delay:.1s;animation-delay:.1s}.loading-spinner .spinnerChild9{-webkit-animation-delay:.2s;animation-delay:.2s}@-webkit-keyframes spinnerChildGridScaleDelay{0%,70%,100%{-webkit-transform:scale3D(1,1,1);transform:scale3D(1,1,1)}35%{-webkit-transform:scale3D(0,0,1);transform:scale3D(0,0,1)}}@keyframes spinnerChildGridScaleDelay{0%,70%,100%{-webkit-transform:scale3D(1,1,1);transform:scale3D(1,1,1)}35%{-webkit-transform:scale3D(0,0,1);transform:scale3D(0,0,1)}}';
		SpinnerStyle['fadingcircle'] = '.loading-spinner>div{width:100%;height:100%;position:absolute;left:0;top:0}.loading-spinner>div:before{content:"";display:block;margin:0 auto;width:15%;height:15%;background-color:$SPINNERCOLOR$;border-radius:100%;-webkit-animation:spinnerChildFadeDelay 1.2s infinite ease-in-out both;animation:spinnerChildFadeDelay 1.2s infinite ease-in-out both}.loading-spinner .spinnerChild2{-webkit-transform:rotate(30deg);-ms-transform:rotate(30deg);transform:rotate(30deg)}.loading-spinner .spinnerChild3{-webkit-transform:rotate(60deg);-ms-transform:rotate(60deg);transform:rotate(60deg)}.loading-spinner .spinnerChild4{-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.loading-spinner .spinnerChild5{-webkit-transform:rotate(120deg);-ms-transform:rotate(120deg);transform:rotate(120deg)}.loading-spinner .spinnerChild6{-webkit-transform:rotate(150deg);-ms-transform:rotate(150deg);transform:rotate(150deg)}.loading-spinner .spinnerChild7{-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}.loading-spinner .spinnerChild8{-webkit-transform:rotate(210deg);-ms-transform:rotate(210deg);transform:rotate(210deg)}.loading-spinner .spinnerChild9{-webkit-transform:rotate(240deg);-ms-transform:rotate(240deg);transform:rotate(240deg)}.loading-spinner .spinnerChild10{-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}.loading-spinner .spinnerChild11{-webkit-transform:rotate(300deg);-ms-transform:rotate(300deg);transform:rotate(300deg)}.loading-spinner .spinnerChild12{-webkit-transform:rotate(330deg);-ms-transform:rotate(330deg);transform:rotate(330deg)}.loading-spinner .spinnerChild2:before{-webkit-animation-delay:-1.1s;animation-delay:-1.1s}.loading-spinner .spinnerChild3:before{-webkit-animation-delay:-1s;animation-delay:-1s}.loading-spinner .spinnerChild4:before{-webkit-animation-delay:-0.9s;animation-delay:-0.9s}.loading-spinner .spinnerChild5:before{-webkit-animation-delay:-0.8s;animation-delay:-0.8s}.loading-spinner .spinnerChild6:before{-webkit-animation-delay:-0.7s;animation-delay:-0.7s}.loading-spinner .spinnerChild7:before{-webkit-animation-delay:-0.6s;animation-delay:-0.6s}.loading-spinner .spinnerChild8:before{-webkit-animation-delay:-0.5s;animation-delay:-0.5s}.loading-spinner .spinnerChild9:before{-webkit-animation-delay:-0.4s;animation-delay:-0.4s}.loading-spinner .spinnerChild10:before{-webkit-animation-delay:-0.3s;animation-delay:-0.3s}.loading-spinner .spinnerChild11:before{-webkit-animation-delay:-0.2s;animation-delay:-0.2s}.loading-spinner .spinnerChild12:before{-webkit-animation-delay:-0.1s;animation-delay:-0.1s}@-webkit-keyframes spinnerChildFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}@keyframes spinnerChildFadeDelay{0%,39%,100%{opacity:0}40%{opacity:1}}';
		return SpinnerStyle;
	}
	return loading;
})();