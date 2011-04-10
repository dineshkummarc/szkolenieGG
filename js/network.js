(function(){
var network = GAME.namespace('GAME.network'); 

 var EasyWebSocket=function(a){var b=this;this.url=a;this.bufferedAmount=0;this.readyState=EasyWebSocket.CONNECTING;this.resource=this.url;this.log=EasyWebSocket.logFunction;this.serverUrl=EasyWebSocket.serverUrl;this.iframeUrl=this.serverUrl+"/gapp/iframe/index.html";this._iframeCtor();this.onopen=function(){b.log("default onopen")};this.onmessage=function(){b.log("default onmessage")};this.onerror=function(){b.log("default onerror")};this.onclose=function(){b.log("default onclose")};window.addEventListener("message",function(c){c.origin==b.serverUrl&&b._onWindowMessage(c)},false)};EasyWebSocket.prototype._onWindowMessage=function(a){a=JSON.parse(a.data);var b=a.type,c=a.data;this.log("recevied message from iframe",a);if(b=="connected"){this.readyState=EasyWebSocket.OPEN;this.onopen()}else b=="data"&&this.onmessage({data:c})};EasyWebSocket.prototype.send=function(a){this._iframeSendData(a)};EasyWebSocket.prototype.close=function(){this.readyState=EasyWebSocket.CLOSING;this._iframeDtor();this.readyState=EasyWebSocket.CLOSED};EasyWebSocket.prototype._iframeCtor=function(){var a=this;this.iframeId="EasyWebSocket-iframe-"+Math.floor(Math.random()*99999);var b=document.createElement("iframe");b.src=this.iframeUrl;b.id=this.iframeId;b.style.position="absolute";b.style.visibility="hidden";b.style.top=b.style.left="0";b.style.width=b.style.height="0";b.onload=function(){a.log("iframe loaded");a._iframeSendConnect()};document.getElementsByTagName("body")[0].appendChild(b)};EasyWebSocket.prototype._iframeDtor=function(){var a=document.getElementById(this.iframeId);a.parent.removeChild(a)};EasyWebSocket.prototype._iframeExist=function(){return this.iframeId};EasyWebSocket.prototype._iframeSendRaw=function(a){this.log("iframeSendRaw(",a,")");document.getElementById(this.iframeId).contentWindow.postMessage(JSON.stringify(a),"*")};EasyWebSocket.prototype._iframeSendConnect=function(){this._iframeSendRaw({type:"connect",data:{wsUrl:this.resource}})};EasyWebSocket.prototype._iframeSendData=function(a){this._iframeSendRaw({type:"data",data:{message:a}})};EasyWebSocket.CONNECTING=0;EasyWebSocket.OPEN=1;EasyWebSocket.CLOSING=2;EasyWebSocket.CLOSED=3;EasyWebSocket.serverUrl="http://easywebsocket.appspot.com";EasyWebSocket.logFunction=function(){};
 
 var socket;

network.connect = function() {
	
	//remove this alert
	alert('go to js/network.js to set connection');
	
	//put 'url-like' string to connect with below 
    socket = new EasyWebSocket(""/* <- here */);
    socket.onopen = function(){
        network.send({
            type: 'gimmePlayers'
        });
    }
}

network.send = function(e) {
    socket.send(JSON.stringify(e));
}

network.onmessage = function(e) {
    socket.onmessage = function(event) {
        var data = JSON.parse(event.data);
		if (data.id !== GAME.players.id || data.type === 'hello' || data.type === 'takePlayers') {
			e(data);
		}
    }
}

})();