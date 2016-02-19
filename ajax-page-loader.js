var vvrc_page_loader = function(){

	var isPageLoaderWorking = false;
	var isPageLoaded = false;
	var loadURL = window.location.toString();
	var loadTimeout = false;
	var DOM_replace = '#main';
	var DOM_progress = '';
	var url_root = 'vvrc.eu/';
	
	jQuery(document).bind("ready",pageLoaderInit);
	
	Function.prototype.defaults = function()
	{
		var _f = this;
		var _a = Array(_f.length-arguments.length).concat(
			Array.prototype.slice.apply(arguments));
		return function()
		{
			return _f.apply(_f, Array.prototype.slice.apply(arguments).concat(
				_a.slice(arguments.length, _a.length)));
		}
	}
	
	function _trimendslash(str){
		var ret = str.toString();
		if (ret.substring(ret.length-1)=='/'){
			return ret.substring(0,ret.length-1);
		}
		return ret;
	}
	
	function _relativeurl(url_root,url){
		if (url.indexOf('#')==-1){
			return (url.indexOf(url_root)==-1) ? false : url.substr(url.indexOf(url_root)+url_root.length);
		}
		return (url.indexOf(url_root)==-1) ? false : url.substr(url.indexOf(url_root)+url_root.length,url.indexOf('#')-url.indexOf(url_root)-url_root.length);
	}
	function _get_current_anchor(){
		return _get_url_anchor(window.location.toString());
	}
	
	function _get_url_query(url){
		return _relativeurl(url_root,url);
	}
	function _get_url_anchor(url){
		return (url.indexOf('#')==-1) ? false : url.substring(url.indexOf('#')+1);
	}
	
	function _clearTimeout(){
		if (loadTimeout!=false) {window.clearTimeout(loadTimeout);loadTimeout=false;}
	}
	
	function _hijackLinkClick(event){
		var $href = _get_url_query(jQuery(this).attr('href'));
		if ($href!==false)
		{
			event.preventDefault();
			this.blur();
			_ajaxPageLoad($href);
		}
	}
	
	function _ajaxPageLoad(url,data,newlocation,ispost){
		if(!isPageLoaderWorking){
			loadURL=url;
			loadTimeout = window.setTimeout(function(){loadTimeout=false;isPageLoaderWorking=false;_ajaxPageLoad(url,data,newlocation,ispost)},5000);
			
			isPageLoaderWorking=true;
			jQuery(DOM_replace).slideUp();
			//jQuery('#content').html(loadingIMG.src+'<center><img src="'+loadingIMG.src+'" /></center>');
			if (ispost==true)
				jQuery.post('/'+url,data,showPage);
			else
				jQuery.get('/'+url,data,showPage);
			window.location = '#' + (newlocation || url);
		}
	}
	
	function _hijackFormSubmit(event){
		event.preventDefault();
	
		var $this = jQuery(this);
		var action = $this.attr('action');
		
		if ($this.attr('method')=='get'){
			//_ajaxPageLoad(_relativeurl(url_root,action),$this.serializeArray(),_relativeurl(url_root,action)+"?"+$this.serialize());
			_ajaxPageLoad(_relativeurl(url_root,action),$this.serializeArray(),($this.attr('id')=='searchform') ? "?"+$this.serialize() : _get_current_anchor());
		}else{
			_ajaxPageLoad(_relativeurl(url_root,action),$this.serializeArray(),_get_current_anchor(),true);
		}
	}
	
	/*################################################################################################################################
	/*################################################################################################################################*/
	
	function runAlways(){
	//
	//  Navigacio kiemelesenek frissitese
	//
		jQuery("#access .menu-item*").removeClass("current-menu-item current_page_item current-menu-ancestor current-menu-parent current_page_parent current_page_ancestor");
		jQuery('#access ul.menu li.menu-item a').each(function(){
			var $this = jQuery(this);
			var $href = false || $this.attr('href');
			var url = window.location.toString();
			$href = ($href===false) ? false : _get_url_query($href);
			
			if ($href.localeCompare(_get_url_anchor(url))==0)
			{
				$this.parentsUntil("#access").filter(".menu-item").addClass("current-menu-ancestor current-menu-parent current_page_parent current_page_ancestor");
				$this.closest('.menu-item').addClass("current-menu-item current_page_item");
			}
		});
	}
	
	/*################################################################################################################################
	/*################################################################################################################################*/
	
	function runAtStart(){
	//
	//  Oldal frissitese ha a cimben hivatkozas van
	//
		jQuery(window).hashchange(function(){if(loadURL!=_get_current_anchor())_ajaxPageLoad(_get_current_anchor())});
		
		var url = window.location.toString();
		var url_query = _get_url_query(url);
		var url_anchor = _get_url_anchor(url);
		if (url_anchor!=false){
			if (url_query!=false) window.location = '/#'+url_anchor; else _ajaxPageLoad(url_anchor);
		} else {
			if (url_query!=false) window.location = '/#'+url_query; else _ajaxPageLoad(url_query);
		}
        
	//
	//  Minden form elteritese
	//
		//jQuery('form:not(.vvrcpl)').addClass('vvrcpl').submit(_hijackFormSubmit);
		jQuery('form').live('submit',_hijackFormSubmit);
	//
	//  Minden link elteritese
	//
		//jQuery('a:not(.vvrcpl)').addClass('vvrcpl').not('[rel|="lightbox"]').click(_hijackLinkClick);
		jQuery('a:not([rel^="lightbox"], .external)').live('click',_hijackLinkClick);
	}
	
	/*################################################################################################################################
	/*################################################################################################################################*/
	
	function runAlwaysButStart(){
     // Lightbox frissitese
        doLightBox();
	}
	
	/*################################################################################################################################
	/*################################################################################################################################*/
	
	function pageLoaderInit(){
		if ((jQuery.browser.msie ) && (parseInt(jQuery.browser.version,10)<9)) return;
	
		var wloc = window.location.toString();
		if(wloc.indexOf(url_root)!==-1 && wloc.indexOf('/wp-')===-1){
	
		if (jQuery('body').data('PageLoaderRanOnce')!=true)
			{jQuery('body').data('PageLoaderRanOnce',true);
			runAtStart();}
		else
			{runAlwaysButStart();}
	
		runAlways();
		}
	}

	function showPage(data,textStatus){

 
        if (typeof _gaq == 'object') {_gaq.push(['_trackPageview']);}
	
		isPageLoaderWorking=false;
		_clearTimeout();
		if (textStatus=='success'){
			var $dom = jQuery(data);
			jQuery('#header').html($dom.find('#header').html());
 			jQuery('head title').html($dom.find('#ajax_title').html());
			jQuery(DOM_replace).html($dom.find(DOM_replace).html()).css({'visibility':'hidden'});
			jQuery(DOM_replace).queue(function(next){
				next();
				jQuery(this).css({'visibility':'visible'}).slideDown();
                jQuery(this).ready(pageLoaderInit);
			});
			//jQuery(document).triggerHandler( "ready" );
           if (vvrc_init) vvrc_init();
		}else{
			alert(http.status);
		}
	}
}();
