/**
 * @lang      utf-8
 * @author    Chenglin Jin [ cn:金成林 kr:김성림 en:Kim ]
 * @homePage  http://code.google.com/p/passworp-jcl/
 * @space     http://jinchenglin.spaces.live.cn/
 * @email     17204288@qq.com / 17204288@163.com
 * @msn       17204288@qq.com
 * @qq        17204288
 * @date      2008.10.30 - 
 * @version   1.0.0(Beta)
 * @license   Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 * @copyright 2008 Chenglin Jin
 */
(function(){
	
	/**
	 * 配置
	 */
	var namespace = '$';
	var debug = true;
	
	/**
	 * 保护jcl变量与namespace变量
	 */
	if(window.jcl){
		var _jcl = window.jcl;
	};
	if(namespace != '' && typeof window[namespace] != 'undefined'){
		window['_' + namespace] = window[namespace];
	};
	
	/**
	 * 初始化类
	 */
	var jcl = window.jcl = function(name, val, tag, elem, index){
		return new jcl.init(name, val, tag, elem, index);
	};
	
	/**
	 * 设置命名空间
	 */
	if(namespace != ''){
		window[namespace] = jcl;
	};
	/**
	 * 核心
	 */
	jcl.init = function(name, val, tag, elem, index, jclo){
		/*
		 * 选择器
		 */
		var S = function(){
			var elements = [];
			//把elementObject转换成jclObject
			if(!name && !val && !tag && !elem && !index && jclo){
				elements[0] = jclo;
				return elements;
			};
			//如果tag为空
			if (tag == null){
				tag = '*';
			};
			//如果elem为空
			if (elem == null){
				elem = document;
			};
			var els = elem.getElementsByTagName(tag);
			for(var i = 0, j = 0; i < els.length; i++) {
				if(name == 'id'){
					//If id
					elements[0] = document.getElementById(val);
				}else if(!name && !val){
					//If null
					for(var i = 0; i< els.length; i++){
						elements[i] = els[i];
					};
				}else{
					if(name == 'class' && jcl.browser('msie')){
						name = 'className';
					};
					if(new RegExp(val).test(els[i].getAttribute(name))){
						elements[j] = els[i];
						j++;
					};
				};
			};
			return elements;
		}();
		/*
		 * DOM操作
		 */
		//设置需要在this.each中使用的index
		this.ei = index || 0;
		this.each = function(fn){
			//Create run(this) & namespace(this) == argument[0]
			var rfn = fn.toString().replace(/^function/, 'function run');
			if(namespace == ''){
				rfn = rfn.replace(/jcl\(this\)/g, 'arguments[0]');
			}else if(/\$/.test(namespace)){
				var _$ = namespace.replace(/\$/g, '\\$');
				rfn = rfn.replace(eval('/(' + _$ + '|jcl)\\(this\\)/g'), 'arguments[0]');
			}else{
				rfn = rfn.replace(eval('/(' + namespace + '|jcl)\\(this\\)/g'), 'arguments[0]');
			};
			//防止用户写成i = 1导致内存溢出
			if(/i\s*?=[^\=]/.test(rfn)){
				jcl.debug('Not to assign i');
			};
			for(var i = 0; i < this.length(); i++){
				eval(rfn.replace(/arguments\[0\]\.eval\(\)/g, 'S[' + i + ']'));
				this.ei = i;
				run(this);
			};
		};
		this.eval = function(){
			return S[this.ei];
		};
		this.length = function(){
			return S.length;
		};
		this.html = function(val){
			if(!val){
				return S[this.ei].innerHTML;
			}else{
				S[this.ei].innerHTML = val;
				return S[this.ei];
			};
		};
		this.val = function(val){
			if(!val){
				return S[this.ei].value;
			}else{
				S[this.ei].value = val;
				return S[this.ei];
			};
		};
		this.getAttr = function(name){
			if(jcl.browser('msie')){
				if(name == 'class'){
					return S[this.ei].getAttribute('className');
				}else if(name == 'style'){
					var _v = S[this.ei].getAttribute('style').cssText.toLocaleLowerCase();
					_v = _v? _v + ';': null;
					return _v.replace(/\s/g, '');
				}else{
					return S[this.ei].getAttribute(name);
				};
			}else{
				if(name == 'style'){
					return S[this.ei].getAttribute(name).replace(/\s/g, '');
				}else{
					return S[this.ei].getAttribute(name);
				};
			};
		};
		this.addAttr = function(name, val){
			var val = val;
			if(jcl.browser('msie')){
				if(name == 'class'){
					var _v = S[this.ei].getAttribute('className');
					val = _v? _v + ' ' + val: val;
					S[this.ei].setAttribute('className', val);
					return S[this.ei];
				}else if(name == 'style'){
					var _v = S[this.ei].getAttribute('style').cssText.toLocaleLowerCase();
					val = _v? _v + ';' + val: val;
					S[this.ei].style.cssText= val;
					return S[this.ei];
				}else{
					var _v = S[this.ei].getAttribute(name);
					val = _v? _v + ' ' + val: val;
					S[this.ei].setAttribute(name, val);
					return S[this.ei];
				};
			}else{
				var _v = S[this.ei].getAttribute(name);
				val = _v? _v + ' ' + val: val;
				S[this.ei].setAttribute(name, val);
				return S[this.ei];
			};
		};
		this.delAttr = function(name, val){
			var _s = S[this.ei];
			function del(n, v, _v){
				if((new RegExp(v)).test(_v)){
					if(_v.indexOf(v) == 0){
						_v = _v.substring(v.length + 1);
					}else{
						_v = _v.replace(new RegExp('(^|\\s)' + v), '');
					};
					if(n == 'style' && jcl.browser('msie')){
						_s.style.cssText= _v;
					}else{
						_s.setAttribute(n, _v);
					};
					return _s;
				}else{
					return _s;
				};
			};
			if(jcl.browser('msie')){
				if(name == 'class'){
					var _v = S[this.ei].getAttribute('className');
					return del('className', val, _v);
				}else if(name == 'style'){
					var _v = S[this.ei].getAttribute(name).cssText.toLocaleLowerCase();
					_v = _v? _v + ';': null;
					return del(name, val, _v.replace(/\s/g, ''));
				}else{
					var _v = S[this.ei].getAttribute(name);
					return del(name, val, _v);
				};
			}else{
				if(name == 'style'){
					var _v = S[this.ei].getAttribute(name);
					return del(name, val, _v.replace(/\s/g, ''));
				}else{
					var _v = S[this.ei].getAttribute(name);
					return del(name, val, _v);
				};
			};
		};
		this.addClass = function(val){
			return this.addAttr('class', val);
		};
		this.delClass = function(val){
			return this.delAttr('class', val);
		};
		this.inBefore = function(elem){
			if(typeof elem == 'string'){
				var te = document.createElement('div');
				te.innerHTML = elem.replace(/[\r]?\n/g, '');
				var cl = te.childNodes.length;
				var arr = [];
				for(var i = 0; i < cl; i++){
					arr.push(this.inBefore(te.childNodes[te.childNodes.length-1])[0]);
				};
				te = null;
				return jcl.returnDOM(arr.reverse(), S[this.ei]);
			};
			if(S[this.ei].childNodes[0]){
				S[this.ei].insertBefore(elem, S[this.ei].childNodes[0]);
				return jcl.returnDOM(elem, S[this.ei]);
			}else{
				S[this.ei].appendChild(elem);
				return jcl.returnDOM(elem, S[this.ei]);
			};
			
		};
		this.inAfter = function(elem){
			if(typeof elem == 'string'){
				var te = document.createElement('div');
				te.innerHTML = elem.replace(/[\r]?\n/g, '');
				var cl = te.childNodes.length;
				var arr = [];
				for(var i = 0; i < cl; i++){
					arr.push(this.inAfter(te.childNodes[0])[0]);
				};
				te = null;
				return jcl.returnDOM(arr, S[this.ei]);
			};
			S[this.ei].appendChild(elem);
			return jcl.returnDOM(elem, S[this.ei]);
		};
		this.outBefore = function(elem){
			if(typeof elem == 'string'){
				var te = document.createElement('div');
				te.innerHTML = elem.replace(/[\r]?\n/g, '');
				var cl = te.childNodes.length;
				var arr = [];
				for(var i = 0; i < cl; i++){
					arr.push(this.outBefore(te.childNodes[0])[0]);
				};
				te = null;
				return jcl.returnDOM(arr, S[this.ei]);
			};
			S[this.ei].parentNode.insertBefore(elem, S[this.ei]);
			return jcl.returnDOM(elem, S[this.ei]);
		};
		this.outAfter = function(elem){
			if(typeof elem == 'string'){
				var te = document.createElement('div');
				te.innerHTML = elem.replace(/[\r]?\n/g, '');
				var cl = te.childNodes.length;
				var arr = [];
				for(var i = 0; i < cl; i++){
					arr.push(this.outAfter(te.childNodes[te.childNodes.length-1])[0]);
				};
				te = null;
				return jcl.returnDOM(arr.reverse(), S[this.ei]);
			};
			if(S[this.ei].nextSibling){
				S[this.ei].parentNode.insertBefore(elem, S[this.ei].nextSibling);
				return jcl.returnDOM(elem, S[this.ei]);
			}else{
				S[this.ei].parentNode.appendChild(elem);
				return jcl.returnDOM(elem, S[this.ei]);
			};
		};
		this.delInBefore = function(){
			var sc = S[this.ei].childNodes;
			for(var i = 0; i < sc.length; i++){
				if(jcl.isTextNode(sc[i]) || sc[i].nodeType == 1){
					S[this.ei].removeChild(sc[i]);
					return S[this.ei];
				};
			};
			return S[this.ei];
		};
		this.delInAfter = function(){
			var sc = S[this.ei].childNodes;
			for(var i = sc.length; i > 0; i--){
				if(jcl.isTextNode(sc[i-1]) || sc[i-1].nodeType == 1){
					S[this.ei].removeChild(sc[i-1]);
					return S[this.ei];
				};
			};
			return S[this.ei];
		};
		this.delOutBefore = function(){
			var sp = S[this.ei].previousSibling;
			if(sp != null){
				if(jcl.isTextNode(sp) || sp.nodeType == 1){
					S[this.ei].parentNode.removeChild(sp);
				}else{
					if(sp.previousSibling) S[this.ei].parentNode.removeChild(sp.previousSibling);
				};
			};
			return S[this.ei];
		};
		this.delOutAfter = function(){
			var sp = S[this.ei].nextSibling;
			if(sp != null){
				if(jcl.isTextNode(sp) || sp.nodeType == 1){
					S[this.ei].parentNode.removeChild(sp);
				}else{
					if(sp.nextSibling) S[this.ei].parentNode.removeChild(sp.nextSibling);
				};
			};
			return S[this.ei];
		};
		this.copyInBefore = function(elem){
			var c = jcl.clone(elem);
			return this.inBefore(c[1]);
		};
		this.copyInAfter = function(elem){
			var c = jcl.clone(elem);
			return this.inAfter(c[1]);
		};
		this.copyOutBefore = function(elem){
			var c = jcl.clone(elem);
			return this.outBefore(c[1]);
		};
		this.copyOutAfter = function(elem){
			var c = jcl.clone(elem);
			return this.outAfter(c[1]);
		};
		this.addParentNode = function(elem){
			var dc = document.createElement('div');
			dc.innerHTML = elem.replace(/[\r]?\n/g, '');
			var re = jcl.jclo(S[this.ei]).outBefore(dc.childNodes[0]);
			jcl.jclo(re[0]).inBefore(S[this.ei]);
			return jcl.returnDOM(S[this.ei], re[0]);
		};
		this.delParentNode = function(){
			var pack = S[this.ei].parentNode;
			var cl = pack.childNodes.length;
			for(var i = 0; i < cl; i++){
				pack.parentNode.insertBefore(pack.childNodes[0], pack);
			};
			pack.parentNode.removeChild(pack);
			return S[this.ei];
		};
		this.remove = function(){
			S[this.ei].parentNode.removeChild(S[this.ei]);
		};
		this.exchang = function(elem){
			var ec = S[this.ei].cloneNode(true);
			elem.parentNode.insertBefore(ec, elem);
			S[this.ei].parentNode.replaceChild(elem, S[this.ei]);
			return jcl.returnDOM(S[this.ei], elem);
		};
		this.replace = function(elem){
			S[this.ei].parentNode.replaceChild(elem, S[this.ei]);
			return elem;
		};
		this.clone = function(){
			return jcl.returnDOM(S[this.ei], S[this.ei].cloneNode(true));
		};
		this.empty = function(){
			var sc = S[this.ei].childNodes;
			for(var i = 0; i < sc.length; i++){
				if(jcl.isTextNode(sc[i])) return false;
			};
			return true;
		};
		this.serialize = function(){
			var valArr = [];
			for(var i = 0; i < S[this.ei].elements.length; i++){
				var el = S[this.ei].elements[i];
				if(el.type == 'text' || el.type == 'password' || el.type == 'hidden' || el.type == 'textarea'){
					valArr.push(el.name + '=' + el.value);
				}else if(el.type == 'radio' || el.type == 'checkbox'){
					if(el.checked){
						valArr.push(el.name + '=' + (el.value? el.value: 'on'));
					};
				};
			};
			return valArr.join('&');
		};
		this.prevNode = function(){
			var sp = S[this.ei].previousSibling;
			if(sp){
				if(jcl.isTextNode(sp) || sp.nodeType == 1){
					return jcl.jclo(sp);
				}else{
					if(sp.previousSibling) return jcl.jclo(sp.previousSibling);
				};
			};
		};
		this.nextNode = function(){
			var sp = S[this.ei].nextSibling;
			if(sp){
				if(jcl.isTextNode(sp) || sp.nodeType == 1){
					return jcl.jclo(sp);
				}else{
					if(sp.nextSibling) return jcl.jclo(sp.nextSibling);
				};
			};
		};
		this.topNode = function(){
			var sc = S[this.ei].childNodes;
			for(var i = 0; i < sc.length; i++){
				if(jcl.isTextNode(sc[i]) || sc[i].nodeType == 1) return jcl.jclo(sc[i]);
			};
		};
		this.bottomNode = function(){
			var sc = S[this.ei].childNodes;
			for(var i = sc.length; i > 0; i--){
				if(jcl.isTextNode(sc[i-1]) || sc[i-1].nodeType == 1) return jcl.jclo(sc[i-1]);
			};
		};
		this.parentNode = function(){
			var sp = S[this.ei].parentNode;
			if(sp){
				return jcl.jclo(sp);
			};
		};
		/*
		 * Style样式
		 */
		this.style = function(val){
			S[this.ei].style.cssText = val;
		};
		this.getStyle = function(){
			if(jcl.browser('msie')){
				return S[this.ei].currentStyle;
			}else{
				return getComputedStyle(S[this.ei], '');
			};
		};
		this.width = function(val){
			if(val != null){
				S[this.ei].style.width = val + 'px';
				return val;
			}else{
				var n = 0;
				//border
				var b = this.getStyle().borderRightWidth;
				if(/thin/.test(b)){
					n += 1;
				}else if(/thick/.test(b)){
					n += 5;
				}else if(/medium/.test(b)){
					//[IE BUG]如果没有设置IE会默认medium而且不等于3px而是0，medium值本应该是3px
					//所以我给他一个默认值0
					n += 0;
				}else if(!isNaN(parseInt(b))){
					n += parseInt(b);
				};
				b = this.getStyle().borderLeftWidth;
				if(/thin/.test(b)){
					n += 1;
				}else if(/thick/.test(b)){
					n += 5;
				}else if(/medium/.test(b)){
					//[IE BUG]如果没有设置IE会默认medium而且不等于3px而是0，medium值本应该是3px
					//所以我给他一个默认值0
					n += 0;
				}else if(!isNaN(parseInt(b))){
					n += parseInt(b);
				};
				//padding
				var p = this.getStyle().paddingRight;
				if(/\d+%/.test(p) && !isNaN(parseInt(p))){
					n += (S[this.ei].parentNode.offsetWidth * parseInt(p) / 100);
				}else if(!isNaN(parseInt(p))){
					n += parseInt(p);
				};
				p = this.getStyle().paddingLeft;
				if(/\d+%/.test(p) && !isNaN(parseInt(p))){
					n += (S[this.ei].parentNode.offsetWidth * parseInt(p) / 100);
				}else if(!isNaN(parseInt(p))){
					n += parseInt(p);
				};
				//return width
				return S[this.ei].offsetWidth - n;
			};
		};
		this.height = function(val){
			if(val != null){
				S[this.ei].style.height = val + 'px';
				return val;
			}else{
				var n = 0;
				//border
				var b = this.getStyle().borderTopWidth;
				if(/thin/.test(b)){
					n += 1;
				}else if(/thick/.test(b)){
					n += 5;
				}else if(/medium/.test(b)){
					//[IE BUG]如果没有设置IE会默认medium而且不等于3px而是0，medium值本应该是3px
					//所以我给他一个默认值0
					n += 0;
				}else if(!isNaN(parseInt(b))){
					n += parseInt(b);
				};
				b = this.getStyle().borderBottomWidth;
				if(/thin/.test(b)){
					n += 1;
				}else if(/thick/.test(b)){
					n += 5;
				}else if(/medium/.test(b)){
					//[IE BUG]如果没有设置IE会默认medium而且不等于3px而是0，medium值本应该是3px
					//所以我给他一个默认值0
					n += 0;
				}else if(!isNaN(parseInt(b))){
					n += parseInt(b);
				};
				//padding
				var p = this.getStyle().paddingTop;
				if(/\d+%/.test(p) && !isNaN(parseInt(p))){
					n += ((S[this.ei].parentNode.offsetHeight * parseInt(p)) / 100);
				}else if(!isNaN(parseInt(p))){
					n += parseInt(p);
				};
				p = this.getStyle().paddingBottom;
				if(/\d+%/.test(p) && !isNaN(parseInt(p))){
					n += ((S[this.ei].parentNode.offsetHeight * parseInt(p)) / 100);
				}else if(!isNaN(parseInt(p))){
					n += parseInt(p);
				};
				//return width
				return S[this.ei].offsetHeight - n;
			};
		};
		this.left = function(val){
			if(val != null){
				S[this.ei].style.left = val + 'px';
				return val;
			}else{
				return S[this.ei].offsetLeft;
			};
		};
		this.top = function(val){
			if(val != null){
				S[this.ei].style.top = val + 'px';
				return val;
			}else{
				return S[this.ei].offsetTop;
			};
		};
		this.alpha = function(val){
			if(jcl.browser('msie')){
				//读取透明度的对象之前，我们首先必须成立，否则会出问题
				//IE filter must haslayout in order to be effective -1
				if(S[this.ei].style.width == ''){
					this.width(this.width());
				};
				if(val == null){
					if(typeof S[this.ei].filters.alpha == 'undefined'){
						S[this.ei].style.filter = 'alpha(opacity=100)';
					};
					return (S[this.ei].filters.alpha.opacity);
				};
				S[this.ei].style.filter = 'alpha(opacity=' + val + ')';
				return val;
			}else{
				if(val == null){
					return (this.getStyle().opacity * 100);
				};
				S[this.ei].style.opacity = (val / 100);
				return val;
			};
		};
		/*
		 * Effect动画效果
		 */
		this.animate = function(type, speed, to, from, callback){
			//type is width height left bottom alpha
			if(from != null){
				this[type](from);
			}else{
				var from = this[type]();
			};
			var _t = this;
			var zoomOut = function(){
				_t[type](_t[type]() + speed);
				if(to <= _t[type]()){
					_t[type](to);
					jcl.timerStop(handle);
					if(typeof callback!= 'undefined'){
						callback();
					};
				};
			};
			var zoomIn = function(){
				_t[type](_t[type]() - speed);
				if(to >= _t[type]()){
					_t[type](to);
					jcl.timerStop(handle);
					if(typeof callback!= 'undefined'){
						callback();
					};
				};
			};
			if(to > from){
				var handle = jcl.timerStart(zoomOut, 10);
			}else if(to < from){
				var handle = jcl.timerStart(zoomIn, 10);
			};
			return handle;
		};
		this.animateWidth = function(speed, to, from, callback){
			return this.animate('width', speed, to, from, callback);
		};
		this.animateHeight = function(speed, to, from, callback){
			return this.animate('height', speed, to, from, callback);
		};
		this.animateLeft = function(speed, to, from, callback){
			return this.animate('left', speed, to, from, callback);
		};
		this.animateTop = function(speed, to, from, callback){
			return this.animate('top', speed, to, from, callback);
		};
		this.animateAlpha = function(speed, to, from, callback){
			return this.animate('alpha', speed, to, from, callback);
		};
	};
	
	/**
	 * 静态方法
	 */
	/*
	 * 核心
	 */
	//Memory pool,内存池
	jcl.MemPool = {};
	jcl.MemFree = function(Mem){
		Mem = null;
		if(jcl.browser('msie')){
			CollectGarbage();
		};
	};
	jcl.jclo = function(elementObject){
		return new jcl.init(null, null, null, null, null, elementObject);
	};
	jcl.debug = function(str){
		if(!str){
			throw new Error('Please input [String].');
		};
		if(debug){
			throw new Error(str);
		};
	};
	jcl.must = function(){
		if(arguments.length < 2) throw new Error('Please input error message and arguments.');
		for(var i=1; i<arguments.length; i++){
			if(!arguments[i]){
				jcl.debug(arguments[0]);
			};
		};
	};
	jcl.designMode = function(elem){
		if(elem){
			if(jcl.browser('msie')){
				var ied = elem.contentWindow;
				//当用window.frame[index]而不是document.getElementById('frame')
				if(ied){
					ied.designMode = 'on';
					ied.document.body.contentEditable = true;
				}else{
					elem.document.designMode = 'on';
				};
			}else{
				var ffd = elem.contentDocument;
				if(ffd){
					ffd.designMode = 'on';
				}else{
					elem.document.designMode = 'on';
				};
			};
		}else{
			document.designMode = 'on';
			if(jcl.browser('msie')){
				document.body.contentEditable = true;
			};
		};
	};
	jcl.browser = function(browser){
		var userAgent = navigator.userAgent.toLowerCase();
		switch(browser){
			case 'version':
				return (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
				break;
			case 'dtd':
				return !(document.firstChild.nodeName == 'HTML' && jcl.browser('msie'));
				break;
			case 'msie':
				return /msie/.test(userAgent) && !/opera/.test(userAgent);
				break;
			case 'mozilla':
				return /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent);
				break;
			case 'opera':
				return /opera/.test(userAgent);
				break;
			case 'safari':
				return /webkit/.test(userAgent);
				break;
			default:
				jcl.debug('Please input browser.');
		};
	};
	jcl.md5 = function(str){
		//Version 2.1 Copyright (C) Paul Johnston 1999 - 2002. See http://pajhome.org.uk/crypt/md5 for more info.
		var hexcase=0;var b64pad="";var chrsz=8;function hex_md5(s){return binl2hex(core_md5(str2binl(s),s.length*chrsz));};
		function b64_md5(s){return binl2b64(core_md5(str2binl(s),s.length*chrsz));};
		function str_md5(s){return binl2str(core_md5(str2binl(s),s.length*chrsz));};
		function hex_hmac_md5(key,data){return binl2hex(core_hmac_md5(key,data));};
		function b64_hmac_md5(key,data){return binl2b64(core_hmac_md5(key,data));};
		function str_hmac_md5(key,data){return binl2str(core_hmac_md5(key,data));};
		function md5_vm_test()
		{return hex_md5("abc")=="900150983cd24fb0d6963f7d28e17f72";};
		function core_md5(x,len)
		{x[len>>5]|=0x80<<((len)%32);x[(((len+64)>>>9)<<4)+14]=len;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(var i=0;i<x.length;i+=16)
		{var olda=a;var oldb=b;var oldc=c;var oldd=d;a=md5_ff(a,b,c,d,x[i+0],7,-680876936);d=md5_ff(d,a,b,c,x[i+1],12,-389564586);c=md5_ff(c,d,a,b,x[i+2],17,606105819);b=md5_ff(b,c,d,a,x[i+3],22,-1044525330);a=md5_ff(a,b,c,d,x[i+4],7,-176418897);d=md5_ff(d,a,b,c,x[i+5],12,1200080426);c=md5_ff(c,d,a,b,x[i+6],17,-1473231341);b=md5_ff(b,c,d,a,x[i+7],22,-45705983);a=md5_ff(a,b,c,d,x[i+8],7,1770035416);d=md5_ff(d,a,b,c,x[i+9],12,-1958414417);c=md5_ff(c,d,a,b,x[i+10],17,-42063);b=md5_ff(b,c,d,a,x[i+11],22,-1990404162);a=md5_ff(a,b,c,d,x[i+12],7,1804603682);d=md5_ff(d,a,b,c,x[i+13],12,-40341101);c=md5_ff(c,d,a,b,x[i+14],17,-1502002290);b=md5_ff(b,c,d,a,x[i+15],22,1236535329);a=md5_gg(a,b,c,d,x[i+1],5,-165796510);d=md5_gg(d,a,b,c,x[i+6],9,-1069501632);c=md5_gg(c,d,a,b,x[i+11],14,643717713);b=md5_gg(b,c,d,a,x[i+0],20,-373897302);a=md5_gg(a,b,c,d,x[i+5],5,-701558691);d=md5_gg(d,a,b,c,x[i+10],9,38016083);c=md5_gg(c,d,a,b,x[i+15],14,-660478335);b=md5_gg(b,c,d,a,x[i+4],20,-405537848);a=md5_gg(a,b,c,d,x[i+9],5,568446438);d=md5_gg(d,a,b,c,x[i+14],9,-1019803690);c=md5_gg(c,d,a,b,x[i+3],14,-187363961);b=md5_gg(b,c,d,a,x[i+8],20,1163531501);a=md5_gg(a,b,c,d,x[i+13],5,-1444681467);d=md5_gg(d,a,b,c,x[i+2],9,-51403784);c=md5_gg(c,d,a,b,x[i+7],14,1735328473);b=md5_gg(b,c,d,a,x[i+12],20,-1926607734);a=md5_hh(a,b,c,d,x[i+5],4,-378558);d=md5_hh(d,a,b,c,x[i+8],11,-2022574463);c=md5_hh(c,d,a,b,x[i+11],16,1839030562);b=md5_hh(b,c,d,a,x[i+14],23,-35309556);a=md5_hh(a,b,c,d,x[i+1],4,-1530992060);d=md5_hh(d,a,b,c,x[i+4],11,1272893353);c=md5_hh(c,d,a,b,x[i+7],16,-155497632);b=md5_hh(b,c,d,a,x[i+10],23,-1094730640);a=md5_hh(a,b,c,d,x[i+13],4,681279174);d=md5_hh(d,a,b,c,x[i+0],11,-358537222);c=md5_hh(c,d,a,b,x[i+3],16,-722521979);b=md5_hh(b,c,d,a,x[i+6],23,76029189);a=md5_hh(a,b,c,d,x[i+9],4,-640364487);d=md5_hh(d,a,b,c,x[i+12],11,-421815835);c=md5_hh(c,d,a,b,x[i+15],16,530742520);b=md5_hh(b,c,d,a,x[i+2],23,-995338651);a=md5_ii(a,b,c,d,x[i+0],6,-198630844);d=md5_ii(d,a,b,c,x[i+7],10,1126891415);c=md5_ii(c,d,a,b,x[i+14],15,-1416354905);b=md5_ii(b,c,d,a,x[i+5],21,-57434055);a=md5_ii(a,b,c,d,x[i+12],6,1700485571);d=md5_ii(d,a,b,c,x[i+3],10,-1894986606);c=md5_ii(c,d,a,b,x[i+10],15,-1051523);b=md5_ii(b,c,d,a,x[i+1],21,-2054922799);a=md5_ii(a,b,c,d,x[i+8],6,1873313359);d=md5_ii(d,a,b,c,x[i+15],10,-30611744);c=md5_ii(c,d,a,b,x[i+6],15,-1560198380);b=md5_ii(b,c,d,a,x[i+13],21,1309151649);a=md5_ii(a,b,c,d,x[i+4],6,-145523070);d=md5_ii(d,a,b,c,x[i+11],10,-1120210379);c=md5_ii(c,d,a,b,x[i+2],15,718787259);b=md5_ii(b,c,d,a,x[i+9],21,-343485551);a=safe_add(a,olda);b=safe_add(b,oldb);c=safe_add(c,oldc);d=safe_add(d,oldd);};
		return Array(a,b,c,d);};
		function md5_cmn(q,a,b,x,s,t)
		{return safe_add(bit_rol(safe_add(safe_add(a,q),safe_add(x,t)),s),b);};
		function md5_ff(a,b,c,d,x,s,t)
		{return md5_cmn((b&c)|((~b)&d),a,b,x,s,t);};
		function md5_gg(a,b,c,d,x,s,t)
		{return md5_cmn((b&d)|(c&(~d)),a,b,x,s,t);};
		function md5_hh(a,b,c,d,x,s,t)
		{return md5_cmn(b^c^d,a,b,x,s,t);};
		function md5_ii(a,b,c,d,x,s,t)
		{return md5_cmn(c^(b|(~d)),a,b,x,s,t);};
		function core_hmac_md5(key,data)
		{var bkey=str2binl(key);if(bkey.length>16)bkey=core_md5(bkey,key.length*chrsz);var ipad=Array(16),opad=Array(16);for(var i=0;i<16;i++)
		{ipad[i]=bkey[i]^0x36363636;opad[i]=bkey[i]^0x5C5C5C5C;};
		var hash=core_md5(ipad.concat(str2binl(data)),512+data.length*chrsz);return core_md5(opad.concat(hash),512+128);};
		function safe_add(x,y)
		{var lsw=(x&0xFFFF)+(y&0xFFFF);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&0xFFFF);};
		function bit_rol(num,cnt)
		{return(num<<cnt)|(num>>>(32-cnt));};
		function str2binl(str)
		{var bin=Array();var mask=(1<<chrsz)-1;for(var i=0;i<str.length*chrsz;i+=chrsz)
		bin[i>>5]|=(str.charCodeAt(i/chrsz)&mask)<<(i%32);return bin;};
		function binl2str(bin)
		{var str="";var mask=(1<<chrsz)-1;for(var i=0;i<bin.length*32;i+=chrsz)
		str+=String.fromCharCode((bin[i>>5]>>>(i%32))&mask);return str;};
		function binl2hex(binarray)
		{var hex_tab=hexcase?"0123456789ABCDEF":"0123456789abcdef";var str="";for(var i=0;i<binarray.length*4;i++)
		{str+=hex_tab.charAt((binarray[i>>2]>>((i%4)*8+4))&0xF)+
		hex_tab.charAt((binarray[i>>2]>>((i%4)*8))&0xF);};
		return str;};
		function binl2b64(binarray)
		{var tab="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var str="";for(var i=0;i<binarray.length*4;i+=3)
		{var triplet=(((binarray[i>>2]>>8*(i%4))&0xFF)<<16)|(((binarray[i+1>>2]>>8*((i+1)%4))&0xFF)<<8)|((binarray[i+2>>2]>>8*((i+2)%4))&0xFF);for(var j=0;j<4;j++)
		{if(i*8+j*6>binarray.length*32)str+=b64pad;else str+=tab.charAt((triplet>>6*(3-j))&0x3F);};};
		return str;};
		return hex_md5(str);
	};
	jcl.objToStr = function(obj){
		var r = [];
		if(typeof obj == "string"){
			return "\"" + obj.replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t") + "\"";
		};
		if(typeof obj == "undefined"){
			return "undefined";
		};
		if(typeof obj == "object"){
			if(obj === null){
				return "null";
			}else if(!obj.sort){
				for(var i in obj){
					r.push(i + ":" + this.objToStr(obj[i]));
				};
				r="{" + r.join() + "}";
			}else{
				for(var i = 0;i < obj.length; i++){
					r.push(this.objToStr(obj[i]));
				};
				r="[" + r.join() + "]";
			};
			return r;
		};
		return obj.toString();
	};
	jcl.strToObj = function(str){
		return eval('(' + str + ')');
	};
	
	/*
	 * DOM操作
	 */
	jcl.returnDOM = function(){
		var jclAndElement = [];
		for(var i = 0; i < arguments.length; i++){
			jclAndElement[i] = arguments[i];
		};
		return jclAndElement;
	};
	jcl.clone = function(elem){
		return jcl.returnDOM(elem, elem.cloneNode(true));
	};
	jcl.textNodes = function(str, elem){
		var textList = [];
		var iterator = 0;
		if(!elem){
			var elem = document.getElementsByTagName('body')[0];
		};
		function loop(loopElem){
			for(var i = 0; i < loopElem.childNodes.length; i++){
				if(jcl.isTextNode(loopElem.childNodes[i])){
					if(loopElem.childNodes[i].data.indexOf(str) >= 0){
						textList[iterator] = loopElem.childNodes[i];
						iterator++;
					};
					continue;
				}else if(loopElem.childNodes[i].nodeType == 1 && loopElem.childNodes[i].tagName != 'SCRIPT' && loopElem.childNodes[i].tagName != 'STYLE' && loopElem.childNodes[i].tagName != 'LINK' && loopElem.childNodes[i].tagName != 'EMBED' && loopElem.childNodes[i].tagName != 'OBJECT'){
					loop(loopElem.childNodes[i]);
				};
			};
		};
		loop(elem);
		jcl.MemFree(loop);
		return textList;
	};
	jcl.textAddPack = function(str, textElem, elem){
		var textArr = textElem.data.split(str);
		//生成外壳节点
		var dc = document.createElement('div');
		dc.innerHTML = elem.replace(/[\r]?\n/g, '');
		dc.childNodes[0].innerHTML = str;
		//生成新文本节点
		var newText = textArr[0];
		for(var i = 1; i < textArr.length; i++){
			newText += (dc.innerHTML + textArr[i]);
		};
		jcl.jclo(textElem).outBefore(newText);
		//删除原来的文本节点
		textElem.parentNode.removeChild(textElem);
	};
	jcl.isTextNode = function(elem){
		if(elem.nodeType != 3 || elem.length == 0){
			return false;
		};
		var nd = elem.data;
		for(var i = 0; i < nd.length; i++){
			if(nd.charAt(i).charCodeAt() != 9 && nd.charAt(i).charCodeAt() != 10 && nd.charAt(i).charCodeAt() != 32 && nd.charAt(i).charCodeAt() != 13){
				return true;
			};
		};
		return false;
	};
	
	/*
	 * Style样式
	 */
	jcl.scrollTop = function(){
		return document.documentElement.scrollTop || document.body.scrollTop;
	};
	jcl.scrollLeft = function(){
		return document.documentElement.scrollLeft || document.body.scrollLeft;
	};
	jcl.clientWidth = function(){
		return document.body.clientWidth;
	};
	jcl.clientHeight = function(){
		return document.body.clientHeight;
	};
	
	/*
	 * AJAX
	 */
	jcl.ajax = function(){
		/*
		 * url: 'http://localhost/',
		 * param: 'a=a&b=b',
		 * method: 'get',
		 * dataType: 'string' | 'json' | 'xml',
		 * expired: minute;
		 * success: function(data){alert(data)},
		 * disposal:  = function{},
		 * loaded: function(){},
		 * loading: function(){},
		 * timeOut: function(){},
		 * cache: minute,
		 * bCache: minute,
		 * contentType: '',
		 * async: true|false
		 */
		var _a      = arguments[0];
		var url         = _a.url;
		var param       = _a.param || '';
		var method      = _a.method || 'get';
		var dataType    = _a.dataType || 'string';
		var expired     = _a.expired || 10;
		var success     = _a.success || null;
		var disposal    = _a.disposal || null;
		var loaded      = _a.loaded || null;
		var loading     = _a.loading || null;
		var timeOut     = _a.timeOut || null;
		var cache       = _a.cache || null;
		var bCache      = _a.bCache || 'no-cache';
		var contentType = _a.contentType || 'application/x-www-form-urlencoded';
		var async       = (typeof _a.async != 'undefined')? _a.async: true;
		//为了防止两个不同的时间的同时一样的URL的时候便认为不同的资源，删除cache argument里面的值
		function regexStr(s){
			var rs = s.replace(/(,cache:\d+)|(cache:\d+,)/g, '');
			return rs;
		};
		//生成动态变量值
		var _cacheName = jcl.md5(regexStr(jcl.objToStr(_a)));
		//设置过期时间
		var oTime;
		function sendAndLoad(){
			XMLHttpReq = null;
			if(jcl.browser('msie')){
				try {
					XMLHttpReq = new ActiveXObject('Msxml2.XMLHTTP');
				}finally{
					XMLHttpReq = new ActiveXObject('Microsoft.XMLHTTP');
				};
			}else if(window.XMLHttpRequest){
				XMLHttpReq = new XMLHttpRequest();
			}else{
				XMLHttpReq = false;
			};
			if(XMLHttpReq != null){
				XMLHttpReq.open(method, url + ( (method == 'get' && param != '')? ('?' + encodeURI(encodeURI(param))): '' ), async);
				XMLHttpReq.setRequestHeader('Content-Type', contentType);
				if(bCache == 'no-cache'){
					XMLHttpReq.setRequestHeader('Cache-Control', bCache);
				}else{
					XMLHttpReq.setRequestHeader('Cache-Control', (bCache * 60));
				};
				//超时时运行的内置方法
				function stopConect(){
					success  = null;
					disposal = null;
					loaded   = null;
					loading  = null;
					if(timeOut){
						timeOut();
					};
				};
				//启动超时计时
				oTime = jcl.timerStart(stopConect, expired * 60 * 1000);
				XMLHttpReq.onreadystatechange = stateChange;
				XMLHttpReq.send( method == 'post'? encodeURI(encodeURI(param)): null);
			}else{
				jcl.debug('Your browser does not support XMLHTTP.');
			};
		};
		function stateChange(){
			/*
			 * 0 Not yet been initialized
			 * 1 Loading
			 * 2 Loaded
			 * 3 Disposal
			 * 4 Success
			 */
			if(XMLHttpReq.readyState == 4){
				if(XMLHttpReq.status == 200){
					//连接上服务器停止计时
					jcl.timerStop(oTime);
					if(success){
						var _cache;
						if(dataType == 'string'){
							_cache = XMLHttpReq.responseText;
						}else if(dataType == 'json'){
							_cache = jcl.strToObj(XMLHttpReq.responseText);
						}else if(dataType == 'xml'){
							if(jcl.browser('msie')){
								var xmlDom = new ActiveXObject("Microsoft.XMLDOM");
								xmlDom.loadXML(XMLHttpReq.responseText);
								_cache = xmlDom;
							}else{
								_cache = new DOMParser().parseFromString(XMLHttpReq.responseText, "text/xml");
							};
						};
						if(cache){
							//生成动态内存池来存放cache名称
							jcl.MemPool['jclajax' + _cacheName] = _cache;
							//资源过期删除cache的动态名称
							function clearCache(){
								jcl.MemPool['jclajax' + _cacheName] = null;
								//alert(_cacheName + ' clear ok')
							};
							jcl.timerStart(clearCache, (cache * 1000 * 60), 1);
						};
						success(_cache);
					};
				}else{
					jcl.debug('Problem retrieving data:' + XMLHttpReq.statusText);
				};
			}else if(XMLHttpReq.readyState == 3){
				if(disposal){
					disposal();
				};
			}else if(XMLHttpReq.readyState == 2){
				if(loaded){
					loaded();
				};
			}else if(XMLHttpReq.readyState == 1){
				if(loading){
					loading();
				};
			}else{
				//尚未初始化
			};
		};
		if(cache && jcl.MemPool['jclajax' + _cacheName] != null){
			if(success){
				success(jcl.MemPool['jclajax' + _cacheName]);
			};
		}else{
			sendAndLoad();
		};
	};
	jcl.sendAjax = function(url, param, method){
		jcl.ajax({
			url:    url,
			param:  param || '',
			method: method || 'GET'
		});
	};
	jcl.jsonp = function(url){
		/*
		 * function myKey(data){alert(data.name)}
		 * jcl.jsonp('http://localhost/');
		 *   http://localhost/  [myKey({name: 'yep'})]
		 */
		var script = document.createElement('script');
		script.type = "text/javascript";
		script.src = url;
		jcl(null, null, 'head').inAfter(script);
	};
	
	/*
	 * Timer时间控制器
	 */
	jcl.timerStart = function(fn, time, iterator){
		if(iterator){
			var handleArr = [];
			for(var i = 1; i <= iterator; i++){
				handleArr[i] = setTimeout(fn, time * i);
			};
			return handleArr;
		}else{
			var handle = setInterval(fn, time);
			return handle;
		};
	};
	jcl.timerStop = function(handle){
		if(handle instanceof Array){
			for(var i = 0; i < handle.length; i++){
				clearTimeout(handle[i]);
			};
		}else{
			clearInterval(handle);
		};
	};
	
	/*
	 * Effect动画效果
	 */
	jcl.animateStop = function(handle){
		if(handle instanceof Array){
			for(var i = 0; i < handle.length; i++){
				jcl.timerStop(handle[i]);
			};
		}else{
			jcl.timerStop(handle);
		};
	};
	
	/*
	 * Cookie
	 */
	jcl.setCookie = function(){
		/*
		 * {
		 * name:    'JCL',
		 * val:     'Good',
		 * expires: 1, //Default:365 day
		 * path:    '/',
		 * secure:  true
		 * }
		 */
		var _a = arguments[0];
		var name    = _a.name;
		var val     = _a.val;
		var expires = function(){
			var e = new Date;
			if(_a.expires){
				e.setTime(e.getTime()+24*60*60*_a.expires*1000);
			}else{
				e.setTime(e.getTime()+24*60*60*365*1000);
			};
			return e.toGMTString();
		};
		var path    = _a.path || '/';
		var domain  = _a.domain || '';
		var secure  = _a.secure || false;
		var c = name + '=' + encodeURIComponent(val);
		c += '; expires=' + expires();
		c += '; path=' + path;
		secure? c += '; secure': '';
		document.cookie = c;
	};
	jcl.getCookie = function(name){
		var sRE = '(?:;)?' + name + '=([^;]*);?';
		var oRE = new RegExp(sRE);
		if(oRE.test(document.cookie)){
			return decodeURIComponent(RegExp['$1']);
		}else{
			return null;
		};
	};
	jcl.delCookie = function(name){
		var val = jcl.getCookie(name);
		if(val){
			var e = new Date();
			e.setTime(e.getTime() - 1);
			document.cookie = name + '=' + val + '; expires=' + e.toGMTString();
		};
	};
	
	/*
	 * Event事件
	 */
	jcl.addEvent = function(elem, event, fn, bubble){
		if(jcl.browser('msie')){
			elem.attachEvent('on' + event, fn);
		}else{
			if(bubble){
				elem.addEventListener(event, fn, bubble);
			}else{
				elem.addEventListener(event, fn, false);
			};
		};
	};
	jcl.delEvent = function(elem, event, fn, bubble){
		if(jcl.browser('msie')){
			elem.detachEvent('on' + event, fn);
		}else{
			if(bubble){
				elem.removeEventListener(event, fn, bubble);
			}else{
				elem.removeEventListener(event, fn, false);
			};
		};
	};
	jcl.getEvent = function(){
		if(jcl.browser('msie')){
			function format(oEvent){
				if(jcl.browser('msie')){
					oEvent.charCode = (oEvent.type == 'keypress')? oEvent.keyCode: 0;
					oEvent.eventPhase = 2;
					oEvent.isChar = (oEvent.charCode > 0);
					oEvent.pageX = oEvent.clientX + jcl.scrollLeft();
					oEvent.pageY = oEvent.clientY + jcl.scrollTop();
					oEvent.preventDefault = function(){
						this.returnValue = false;
					};
					if(oEvent.type == 'mouseout'){
						oEvent.relatedTarget = oEvent.toElement;
					}else if(oEvent.type == 'mouseover'){
						oEvent.relatedTarget = oEvent.fromElement;
					};
					oEvent.stopPropagation = function(){
						this.cancelBubble = true;
					};
					oEvent.target = oEvent.srcElement;
					oEvent.time = (new Date()).getTime();
				};
				return oEvent;
			};
			return format(window.event);
		}else{
			if(jcl.browser('opera')){
				//caller并非ECMA标准，所以标准opera不支持caller
				return window.event;
			}else{
				return this.getEvent.caller.arguments[0];
			};
		};
	};
	jcl.ready = function(fn){
		var oldonload = window.onload;
		if(typeof window.onload != 'function'){
			window.onload = fn;
		}else{
			window.onload = function(){
				oldonload();
				fn();
			};
		};
	};
	jcl.domReady = function(fn){
		var elem = document.getElementsByTagName('html')[0];
		if(jcl.browser('msie')){
			var d = elem.document, done = false;
			//only fire once
			var init = function(){
				if(!done){
					done = true;
					fn();
				};
			};
			// polling for no errors    
			(function(){
				try{
					//throws errors until after ondocumentready    
					d.documentElement.doScroll('left');
				}catch(e){
					setTimeout(arguments.callee, 50);
					return;
				};
				//no errors, fire
				init();
			})();
		}else{
			document.addEventListener('DOMContentLoaded', fn, false);
		};
	};
	jcl.delErr = function(){
		function killErrors(){
			return true;
		};
		window.onerror = killErrors;
	};
	
	/**
	 * DOCTYPE
	 */
	if(!jcl.browser('dtd')){
		jcl.debug('DOCTYPE name is empty, enter the DOCTYPE.');
	};
})();