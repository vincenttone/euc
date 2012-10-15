//检查消息方法
function vCheckMessages() {
    var person_count = 0;
    var more_person_count = 0;
    var persons = [];
    var avatar_img = "";
    person_count = $("#main .chat").length;
    more_person_count = $(".moreChater ul li").length;
    console.log("Normal chater: " + person_count);
    console.log("More charter: " + more_person_count);
    if (person_count > 0) {
	$(".chatTab ul li").each(function() {
	    if ($(this).hasClass("newCall")) {
			chat_id = $(this).attr('id');
			chat_area_id = getChatAreaId(chat_id);
			chat_data = processVnotify(chat_id, chat_area_id);
			chater_name = chat_data['chater_name']
			console.log(chater_name + " has new message.");
			persons.push(chater_name);
	    }else if($(this).hasClass("nonce")){
			$(".v-nonce").removeClass("v-nonce");
			$(this).removeClass("nonce").addClass("v-nonce");
			/*
			  chat_id = $(this).attr('id');
			  chat_area_id = getChatAreaId(chat_id);
			  chat_count = $("#"+chat_area_id+" .chatArea .chatBody ul li").length;
			  
			  if(count_json[chat_area_id] == undefined ){
		      count_json[chat_area_id] = chat_count;
		      if(chat_count > 0){
			  processVnotify(chat_id, chat_area_id);
			  count_json[chat_area_id] = chat_count;
		      }
			  }else if (count_json[chat_area_id] < chat_count){
		      processVnotify(chat_id, chat_area_id);
		      count_json[chat_area_id] = chat_count;
			  };
			*/
			//点击移除当前标签样式
			$(".chatTab ul li").click(function(){
				$(".v-nonce").removeClass("v-nonce");
			});
			$(".groupingList ul li").click(function(){
				$(".v-nonce").removeClass("v-nonce");
			});
	    }
	    
	});
	
	if (more_person_count > 0) {
	    $(".moreChater ul li").each(function() {
		if ($(this).hasClass("newCall")) {
		    more_id = $(this).attr('id');
		    more_area_id = getChatAreaId(more_id);
		    more_data = processVnotify(more_id, more_area_id);
		    more_name = more_data['chater_name'];
		    console.log(more_name + " has new message.");
		    persons.push(more_name);
		}
	    });
	}
	/*
	  $("#main .chat").each(function(index){
	  chat_class = $(this).attr('id');
	  console.log($("#"+chat_class+" .chatArea .chatBody ul li").length);
	});
	*/
	
    }
    /*
    if (persons.length > 0) {
	var v_notify_message = persons.join(", ") + " 给你发消息啦。";
	console.log(v_notify_message);
	vSendNofity("", "您有新消息", v_notify_message);
    }
    */
    $(".chatInput div textarea").focus(function(){
	$(".v-nonce").removeClass("newCall").removeClass("v-new-call");
	$(".nonce").removeClass("newCall").removeClass("v-new-call");
    });
    setTimeout("vCheckMessages()", 20000);
}
//根据标签ID获取聊天框ID
function getChatAreaId(chat_tab_id)
{
    return chat_tab_id.replace("chatTab_", "");
}
//获取要发送的消息并发送出去
function processVnotify(chat_id, chat_area_id)
{
    //新消息提示
    chater_name = $("#" + chat_id + " div span").attr("title");
    avatar_img = $("#" + chat_id + " img").attr("src");
    chat_content = $("#"+chat_area_id+" .chatArea .chatBody ul li:last").text();
    chat_tab_class = $("#"+chat_id).attr("class");
    chat_class = $("#"+chat_area_id+" .chatArea .chatBody ul li:last").attr("class");
    window_status = $("#v-notify").attr("wstatus");
    console.log(chater_name + " has new message.");
    console.log("chat class:"+chat_class+", window satus:"+window_status);
    if(chat_class != "myself" && window_status == 2){
		//提示消息
		vSendNotify(avatar_img, chater_name, chat_content);
    }
    
    if(chat_tab_class == "v-nonce"){
		//移除当前标签的newCall状态
		$(".v-nonce").removeClass("newCall");
    }else if(chat_tab_class == "nonce"){
		$("#" + chat_id).removeClass("newCall");
    }else{
		//修改样式
		$("#" + chat_id).removeClass("newCall").addClass("v-new-call").click(function(){
			$(this).removeClass("v-new-call");
		});
    }
    
    return {"chater_name": chater_name, "avatar_img": avatar_img, "chat_content": chat_content};
}

function setVnotifyButton() {
    $("#wrapper #header").append('<a href="#" id="v-notify" wstatus="1">开启通知</a>');
}

function setVnotifyButtonVal(){
    $(window).blur(function(){
	$("#v-notify").attr("wstatus","2");
	console.log("Minisize status.");
    });
    $(window).focus(function(){
	$("#v-notify").attr("wstatus","1");
	console.log("Leave minisize status.");
    });
}

function setVnotify() {
    $("#v-notify").click(function() {
	var v_notify = new vNotify();
	if (!v_notify.isSupport()) {
	    console.log("Broswer is not support notify.");
	    return false;
	}
	v_notify.getPermission();

	if (v_notify.checkPermission()) {
	    v_notify.show("", "Easy UC 通知", "开启成功!");
	    $("#v-notify").text("已经开启通知");
	} else {
	    $("#v-notify").text("开启通知");
	    console.log("Do not have notify permission.");
	}

        return true;
    });
}

function checkVnotifyOpening()
{
    var v_notify = new vNotify();
    if (!v_notify.isSupport()) {
	console.log("Broswer is not support notify.");
	return false;
    }

    if (v_notify.checkPermission()) {
	$("#v-notify").text("已经开启通知");
    }
    return true;
}

function vSendNotify(icon, title, message)
{
    var v_notify = new vNotify();
    if (!v_notify.isSupport()) {
	console.log("Broswer is not support notify.");
    }
    if (v_notify.checkPermission()) {
	v_notify.show(icon, title, message);
    }
}

function vNotify() {}
//判断是否支持webkitNotifications  
vNotify.prototype.isSupport = function() {
    return !! window.webkitNotifications;
};
//需要向用户申请权限来确定是否支持webkitNotifications，如果得到权限，就会执行callback，参数为true.  
vNotify.prototype.getPermission = function() {
    window.webkitNotifications.requestPermission();
};
//查看是否得到权限  
vNotify.prototype.checkPermission = function() {
    return !! (window.webkitNotifications.checkPermission() === 0);
};
//声明一个webkitNotifications实例，并且使用show方法触发桌面提示框  
vNotify.prototype.show = function(icon, title, body) {
    //声明webkitNotifications实例  
    var _notify = window.webkitNotifications.createNotification(icon, title, body);
    _notify.show();
    setTimeout(function(){_notify.cancel();}, 5000);
};

//判断是否最小化
function isMinStatus() {
    if(window.outerHeight == window.innerHeight){
	return true;
    }
    return false;
}

//增加表情,未完成
function addFaceImg(){
	$("div.chatToolBar").append('<a href="###" id="letter-face">EUC表情/mao</a>');
}

setVnotifyButton();
setVnotify();
setVnotifyButtonVal();
checkVnotifyOpening();

vCheckMessages();