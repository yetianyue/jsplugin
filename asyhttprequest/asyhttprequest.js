(function(w,f){
    w.asyhttprequest = w.asy = f();
}(window,function(){
	var doc = window.document;
	var pto = Object.prototype;
	var asyhttprequest = {
		/**
	     * 将两个或更多对象的内容合并到第一个对象。
	     * 这里第一个对象以下称为：待扩展对象
	     *         后续对象称为：待合并对象
	     *
	     * @param {boolean} isDeep 是否深度扩展, 默认不深度扩展, 首个参数为true进行深度扩展
	     * @param {Object} obj 可变参数，长度不为零。
	     * @return {Object} 对象
	     */
		extend:function(isdeep,obj){
			var src, copyIsArray, copy, name, options, clone,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length,
				deep = false;

			// target 是传入的第一个参数
			// 如果第一个参数是布尔类型，则表示是否要深递归，
			if (typeof target === "boolean") {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				// 如果传了类型为 boolean 的第一个参数，i 则从 2 开始
				i = 2;
			}

			// 如果传入的第一个参数是 字符串或者其他
			if (typeof target !== "object" && !asyhttprequest.isFunction(target)) {
				target = {};
			}

			// 如果参数的长度为 1 ，表示是 asyhttprequest 静态方法
			if (length === i) {
				target = this;
				--i;
			}

			// 可以传入多个复制源
			// i 是从 1或2 开始的
			for (; i < length; i++) {

				// 将每个源的属性全部复制到 target 上
				if ((options = arguments[i]) != null) {

					for (name in options) {
						// src 是源（即本身）的值
						// copy 是即将要复制过去的值
						src = target[name];
						copy = options[name];

						// 防止有环，例如 extend(true, target, {'target':target});
						if (target === copy) {
							continue;
						}

						// 这里是递归调用，最终都会到下面的 else if 分支
						// asyhttprequest.isPlainObject 用于测试是否为纯粹的对象
						// 纯粹的对象指的是 通过 "{}" 或者 "new Object" 创建的
						// 如果是深复制
						if (deep && copy && (asyhttprequest.isPlainObject(copy) || (copyIsArray = asyhttprequest.isArray(copy)))) {
							// 数组
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && asyhttprequest.isArray(src) ? src : [];

								// 对象
							} else {
								clone = src && asyhttprequest.isPlainObject(src) ? src : {};
							}
							// 递归
							target[name] = asyhttprequest.extend(deep, clone, copy);
							// 最终都会到这条分支
							// 简单的值覆盖
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}
			// 返回新的 target
			// 如果 i < length ，是直接返回没经过处理的 target，也就是 arguments[0]
			// 也就是如果不传需要覆盖的源，调用 $.extend 其实是增加 asyhttprequest 的静态方法
			return target;
		},
		/**
		 * [ajax ajax实现]
		 * @param  {[object]} options [description]
		 * @return {[type]}         [description]
		 */
		ajax:function(options){
			var opt = asyhttprequest.extend({
				url:null,
				data:{},
				type:'GET',
				dataType:'JSON',
				async:true,
				cache:true,
				beforeSend:function(){},
				success:function(){},
				error:function(){},
				complete:function(){},
			},options);
			if(!opt.url){
				throw new Error('function ajax (url is required)');
			}
			var dataType = opt.dataType.toUpperCase();
			if( dataType === 'JSONP'){
				return asyhttprequest.jsonp(opt.url,opt.data,opt.success);
			}
			var xhr = new XMLHttpRequest(),
			data,
			type = opt.type.toUpperCase();
			data = asyhttprequest.param(opt.data);
			xhr.onreadystatechange = function(){
				if(xhr.readyState === 4){
					if(xhr.status !== 200){
						 opt.error(xhr);
					}
					switch(dataType){
						case'JSON':
							try{								
								opt.success(JSON.parse(xhr.responseText));
							}catch(e){
								 opt.error(xhr);
							}
							break;
						case 'XML':
							if (xhr.responseXML) {
                                opt.success(xhr.responseXML);
                            }else {
                                opt.error(xhr);
                            }
                            break;
						case 'HTML':
						default:
							opt.success(xhr.responseText);
					}
					opt.complete(xhr);
				}
			};
			if(opt.beforeSend(xhr) === false){
				return xhr.abort();
			}
			if(type === 'POST'){
				xhr.open(type,opt.url,opt.async);
				(typeof data === 'string') && 
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send(data);
			}else{
				xhr.open(type, opt.url.match(/\?/) ? (opt.url + '&' + data) : (opt.url + '?' + data), opt.async);
                opt.cache || xhr.setRequestHeader('Cache-Control', 'no-cache');
                xhr.send();
			}
		},
		/**
		 * [jsonp jsonp请求方法]
		 * @param  {[type]}   url      [请求的链接]
		 * @param  {[type]}   data     [数据]
		 * @param  {Function} callback [回调函数]
		 */
		jsonp:function(url,data,callback){
			if(asyhttprequest.isFunction(data)){
				callback = data;
				data = {};
			}
			var time = new Date().getTime();
			var callbackName = 'asyhttprequest_'+time;
			data.callback = callbackName;
			data._t = time;
			var script = doc.createElement("script");
			script.src = url+'?'+asyhttprequest.param(data);
			var body = document.body;
			body.appendChild(script);
			window[callbackName] = callback || function(){} ;
			script.onload = function(){
				delete window[callbackName];
				body.removeChild(script);
			};

		},
		/**
		 * [param 将一个序列换数组或数据对象转化成 序列化字符串。]
		 * @param  {[*]} serialize [传入的序列化数组对象或者string]
		 * @return {[string]}      [序列化字符串，形如： a=1&b=2&c=3&c=4]
		 */
		param:function(serialize){
			var arr ;
			if(typeof serialize === 'object'){
				arr = asyhttprequest.obj2Array(serialize);
			}
			return arr.map(function(item){
				if(typeof item.value === 'undefined'){
					return '';
				}
				//数可把字符串作为 URI 组件进行编码,数组转换为&链接字符串，替换＋符号
				return encodeURIComponent(item.name)+'='+encodeURIComponent(item.value);
			}).join('&').replace(/%20/g, '+');
		},
		/**
		 * [obj2Array 将对象转换为数组]
		 * @param  {[type]} obj [对象]
		 * @return {[type]}     [数组]
		 */
		obj2Array:function(obj){
			var res = [];
			for (var key in obj) {
				//判断为本身的属性，不是从继承获取出来的。
				if(obj.hasOwnProperty(key)){
					res.push({
						name:key,
						value:obj[key],
					});
				}
			}
			return res;
		},
		/**
		 * [isFunction 判断一个对象是否一个方法，包括使用new Funtion创建的]
		 * @param  {Function} fn [description]
		 * @return {Boolean}     [description]
		 */
		isFunction:function(fn){
			// Object.prototype.toString.call()进行类型判断
			return pto.toString.call(fn) === '[object Function]';
		},
		/**
		 * [isPlainObject 用于测试是否为纯粹的对象,
		 * 纯粹的对象指的是 通过 "{}" 或者 "new Object" 创建的]
		 * @param  {[type]}  obj [description]
		 * @return {Boolean}     [description]
		 */
		isPlainObject:function(obj){
			if(typeof obj !== 'object' || obj.nodeType || obj == obj.window){
				return false;
			}
			if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
            return true;
		},
		isArray:Array.isArray,

	};
	return asyhttprequest;
}));