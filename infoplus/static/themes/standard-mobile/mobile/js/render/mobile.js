var progress = function (content, percent, targetPercent, waitMillisecond) {
	if (isMobileApp()) {
		return;
	}

	var showPercent = function (p, waitingTimes) {
		$("#div_loader_content").addClass("show");
		$loaderTextDiv=$("#div_loader_progress_percent");
		$loaderTextDiv.css("left", p + "%");
		var percent_span=$loaderTextDiv.find(".percent_span");
		if(percent_span.size()==0){
			var percentSpan=$("<span class='percent_span'>"+p+"%</span>");
			$loaderTextDiv.append(percentSpan);
		}else{
			percent_span.text(p+"%");
		}
		$loaderTextDiv.children(".waiting").remove();
		// var $loaderTextDiv = $("#div_loader_text");
		// var $loaderText = $loaderTextDiv.children(".content");
		
		// $loaderText.text(  p + "%");

		if (waitingTimes != null) {
			//超过3秒再显示请耐心等待
			var waitingString = waitingTimes > 60 ? '请耐心等待' : '';
			for (var i = 0, len = Math.floor(waitingTimes / 3) % 6; i < len; i++) {
				waitingString += '.';
			}
			if ($loaderTextDiv.children(".waiting").length == 0) {
				var span = document.createElement("span");
				$(span).addClass("waiting").text(waitingString);
				$loaderTextDiv.append(span);
			} else {
				$loaderTextDiv.children(".waiting").text(waitingString);
			}
		}

		var $loader = $("#div_loader");
		if (!$loader.is(":visible")) {
			$loader.show();
		}

	};

	if (progressFlag != null) {
		clearInterval(progressFlag);
	}

	showPercent(percent);

	if (targetPercent != null) {
		var frames = 20,
			currentPercent = percent,
			percentStep = (targetPercent - percent) / frames,
			waitingTimes = 0;
		var wait = waitMillisecond == null ? 1000 : waitMillisecond;

		progressFlag = setInterval(function () {
			currentPercent += percentStep;
			currentPercent = Math.floor(currentPercent);
			if (currentPercent > targetPercent) {
				waitingTimes++;
				//showPercent(targetPercent, waitingTimes);
				showPercent(targetPercent);
			} else {
				showPercent(currentPercent);
			}

		}, wait / frames)
	}
};
var methodGroup={
	addStep:function(){
		var form_milestone_step_group=$("#form_milestone_holder").find(".form_milestone_step");
		if(form_milestone_step_group.size()>0){
			$(".process_tu_left").empty();
			$(".process_tu_right").empty();
			for(var i=0;i<form_milestone_step_group.size();i++){
				var tuLi=$('<li class="process_circle"><span></span></li>');
				var textLi=$('<li>'+$(form_milestone_step_group[i]).text()+'</li>');
				if($(form_milestone_step_group[i]).hasClass("green")){
					tuLi.find("span").addClass("active");
					textLi.addClass("process_finished");
				}
				if($(form_milestone_step_group[i]).hasClass("blue")){
					tuLi.find("span").addClass("active");
					textLi.addClass("process_current");
				}
				$(".process_tu_left").append(tuLi);
				$(".process_tu_right").append(textLi);
				if(!$(form_milestone_step_group[i]).hasClass("last")){
					var xianLi=$('<li class="process_xian"><span></span></li>');
					if($(form_milestone_step_group[i]).hasClass("green")){
						xianLi.find("span").addClass("active");
					}
					$(".process_tu_left").append(xianLi);
				}
			}
			//计算百分比
			var xianSize=$(".process_circle").size();
			var xianActiveSize=$(".process_finished").size();
			var process=parseInt(xianActiveSize/xianSize*100);
			$(".processCount").html("已完成："+process+"%")  
		}
	},
	getMenuGroup:function(){
		var menuGroup=$("#nav_menu").find(".nav_menu_group");
		if(menuGroup.size()>0){
			for(var i=0;i<menuGroup.size();i++){
				var menuLis=menuGroup.eq(i).find("li");
				for(var j=0;j<menuLis.size();j++){
					if((!menuLis.eq(j).hasClass("nav_menu_line"))&&(menuLis.eq(j).find(".menu_icon_bookmark").size()==0)){
						$(".menuGroupUl").append(menuLis.eq(j));
					}
				}
			}
		}
		//恢复提示修改成提示
		$("#nav_menu_recover").find(".menu_text").html("提示");
	},
	tableFirstTr:function(){
		var tableArr=$(".xdTableContentRow").find("table");
		var tableGroup=[];
		for(var i=0;i<tableArr.size();i++){
			if(tableArr.eq(i).find(".mdx_heading").size()>0){
				tableGroup.push(tableArr.eq(i));
			}
		}
		var firstTrArr=[];
		for(var i=0;i<tableGroup.length;i++){
			if($(tableGroup[i]).parents("tr").eq(0).hasClass("xdTableContentRow")){
				var firstTr=$(tableGroup[i]).find("tr").eq(0);
				if(firstTr.find(".mdx_heading").size()>0){
					firstTrArr.push(firstTr);
				}
			}
		}
		this.addLeftGreen(firstTrArr);
	},
	commandBarBottom:function(){
		var btnList=$("#form_command_bar").find(".command_button");
		var btnContainer=$("<div class='btnContainer'></div>");
		$("body").append(btnContainer);
		var tools_group=$("<ul class='toolGroup'><li class='tool_save_li hide'><div class='tool_icon_save'></div><p>保存草稿</p></li><li class='tool_guide_li hide'><div class='tool_icon_guide'></div><p>办事指南</p></li></ul>");
		$(".btnContainer").append(tools_group);
		if($$.params.saveable===true){
			$(".tool_save_li").removeClass("hide");
		}
		if($$.params.instructionUrl!=null){
			$(".tool_guide_li").removeClass("hide");
		}
		var buttons_group=$("<ul class='buttonGroup'></ul>");
		$(".btnContainer").append(buttons_group);
		$(".tool_save_li").not(".hide").click(function(){
			//触发保存
			$$.save();
		})
		$(".tool_guide_li").not(".hide").click(function(){
			//触发办事指南
			$$.instruct();
		})
		this.btnShow(btnList);
	},
	btnShow:function(btnList){
		if(btnList.size()>0){
			var forLen=btnList.size();
			if(btnList.size()>3){
				forLen=3;
			}
			var btnClass="oneButton";
			if(forLen==2){
				btnClass="twoButton";
			}
			if(forLen==3){
				btnClass="threeButton";
			}
			for(var i=0;i<forLen;i++){
				btnList.eq(i).find(".toolbar_button_tip").remove();
				if(btnList.size()==3){
					var btnItem=btnList.eq(i);
					var buttonContent=btnItem.find(".command_button_content").text();
					var newButton=$("<li class='"+btnClass+"'>"+buttonContent+"</li>");
					$(".buttonGroup").append(newButton);
					(function(i){
						newButton.click(function(){
								btnList.eq(i).click();
						})
					})(i);
				} else {
					if(i<2){
						var btnItem=btnList.eq(i);
						var buttonContent=btnItem.find(".command_button_content").text();
						var newButton=$("<li class='"+btnClass+"'>"+buttonContent+"</li>");
						$(".buttonGroup").append(newButton);
						(function(i){
							newButton.click(function(){
								 btnList.eq(i).click();
							})
						})(i);
					}else{
						var buttonCobanlntent="点击办理...";
						var newButton=$("<li class='getMore "+btnClass+"'>"+buttonCobanlntent+"<div class='moreBtnShow'></div></li>");
						$(".buttonGroup").append(newButton);
						for(var j=2;j<btnList.size();j++){
							var btnItem2=btnList.eq(j);
							var buttonContent2=btnItem2.find(".command_button_content").text();
							var newSpan=$("<span>"+buttonContent2+"</span>");
							$(".moreBtnShow").append(newSpan);
							(function(j){
								newSpan.click(function(){
									btnList.eq(j).click();
								})
							})(j);
						}
						newButton.click(function(){
							$(".moreBtnShow").toggleClass("show");
						})
					}

				}
			}
		}
	},
	getApprovalList:function(){
		$(".approvalList").empty();
		var approvalList_lis=$(".form_remark_holder").find("li");
		if(approvalList_lis.size()>0){
			for(var i=0;i<approvalList_lis.size();i++){
				var li=approvalList_lis.eq(i);
				var li_user=li.find(".color_b2>span").eq(0).text();
				var li_time=li.find(".form_remark_time").text();
				var li_status=li.find(".color_b2>b").eq(0).html();
				var li_status_01=li.find(".color_b2").find(".color_b3");
				if(li_status_01.size()>0){
					li_status=li_status+"（"+li_status_01.text()+"）";
				}
				var approvalList_li=$("<li>"+
													"<div class='approval_icon_xian'></div>"+
													"<div class='approval_icon_outer'><span></span></div>"+
													"<div class='approval_text'>"+
													"<p class='handle_status'>"+li_status+"</p>"+
													"<p>办理时间："+li_time+"</p>"+
													"<p>办理用户："+li_user+"</p>"+
													"</div>"+
											"</li>");
		
				$(".approvalList").append(approvalList_li);
			}
		}
	}
}

$$.ready(function(){
	//关闭新手教程
	$$.params.showTutorial=false;

//	添加头部
	if($(".preview_view").size()>0){
	}else{
		var headerTitle=$("<div class='header_title header_title_index'>"+
							"<span class='toLeft'></span>"+
							"<span class='toRightTool'></span>"+
							"<span class='heade_title_content'>"+$('.xdTitleRow').text()+"</span>"+
						"</div>");
		//	添加底部按钮
		methodGroup.commandBarBottom();
	}
	$("#header_holder").append(headerTitle);
	
	//回退按钮触发浏览器回退按钮
	$(".header_title .toLeft").click(function(){
		if($$.params.back){
			$(".i-icon-arrow-back").click();
		}else{
			window.history.back();
		}
	})
	//右侧滑出
	var mask=$("<div class='mask'></div>")
	var rightTool=$("<div class='rightTool'></div>")
	$("#nav_menu").after(mask);
	$("#nav_menu").after(rightTool);
	//里程碑
	var menuGroupUl=$("<div class='menuGroupUl'></div>");
	var processTu=$('<div class="processTitle"><p>流程进度状态</p><span class="processCount"></span></div>'
								+'<div class="process_tu">'
									+'<ul class="process_tu_left">'
									+'</ul>'
									+'<ul class="process_tu_right"></ul>'
								+'</div>');
	$(".rightTool").append(menuGroupUl);
	$(".rightTool").append(processTu);
	var approvalHistory=$('<div class="processTitle"><p>审批历史</p><a href="javascript:;" class="approvalHistoryClick">查看</a></div>');
	$(".rightTool").append(approvalHistory);
	
	$(".toRightTool").click(function(){
		methodGroup.getMenuGroup();
		methodGroup.addStep();
		$(".rightTool").toggleClass("rightShow");
		$(".mask").toggleClass("maskShow");
	})
	$(".mask").click(function(){
		$(".rightTool").toggleClass("rightShow");
		$(".mask").toggleClass("maskShow");
	})
	
	var approvalHistoryContainer=$("<div class='approvalHistoryContainer'>"+
										"<div class='header_title_01'><span class='toLeft'></span>"+
											"<span class='heade_title_content'>审批历史</span></div>"+
										"<div class='approvalList_container'><ul class='approvalList'></ul></div>"+
									"</div>");
	$("body").append(approvalHistoryContainer);
	//弹出审批历史
	$(".approvalHistoryClick").click(function(){
		$(".approvalHistoryContainer").toggleClass("rightShow");
		$("#renderForm").addClass("hidden");
		$(".rightTool").toggleClass("rightShow");
		$(".mask").toggleClass("maskShow");
		methodGroup.getApprovalList();
	})
	$(".approvalHistoryContainer .toLeft").click(function(){
		$(".approvalHistoryContainer").toggleClass("rightShow");
		$("#renderForm").removeClass("hidden");
	})
	//重复节新增随滚动条跑
//	$("div.infoplus_view_wrap_inner").scroll(function() {
//	  var scrollLeft=$(this).scrollLeft();//滚动距离
//	  var devicesWidth=$(window).width();//手机屏幕宽度
//	  var infoplus_repeatParentElement=$(this).find(".infoplus_repeatParentElement");
//	  if(infoplus_repeatParentElement.length>0){
//	  	for(var i=0;i<infoplus_repeatParentElement.length;i++){
//	  		var pa=infoplus_repeatParentElement.eq(i);
//	  		var left=pa.offset().left;//重复表和手机左侧的位移
//	  		var infoplus_addLinkContainerDiv=pa.children(".infoplus_addLinkContainerDiv");
//	  		var linkWidth=$(".infoplus_addLinkDiv").width()+10;
////	  		判断表是否在可视区
//			var offsetLeft = pa[0].offsetLeft;
//			var marginLeft=-left+offsetLeft;
//			var domWidth=pa.width();
//			if (!(left>devicesWidth||domWidth-linkWidth+left<0)) {
//				if(left<0){
//				  	infoplus_addLinkContainerDiv.find(".infoplus_addLinkDiv").css("marginLeft",marginLeft+"px");
//				  	if(offsetLeft>devicesWidth){
//				  		infoplus_addLinkContainerDiv.find(".infoplus_addLinkDiv").css("marginLeft",-left+"px");
//				  	}
//				}else{
//				  	infoplus_addLinkContainerDiv.find(".infoplus_addLinkDiv").css("marginLeft","0px");
//				}
//			}
//
//
//	  	}
//	  }
//	});
})
