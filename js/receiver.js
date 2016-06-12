+function ($){
    var Receiver = function(element,options){
        this.$element = $(element);
        this.options = $.extend({},Receiver.DEFAULTS,options);
        this.init();
    };

    // 插件本身默认属性
    Receiver.DEFAULTS = {
        curPage: 1,            // 当前第一页
        pageSize: 10,          // 每页10条
    };

    Receiver.prototype.init = function(totalCount) {
        // 总页数
        this.totalCount = Math.ceil(this.options.total / this.options.pageSize);	
        // 收件人列表
        this.listData = this.options.data;
        // 已选收件人
        this.toReceiveData = this.options.toReceiveData;

        // 生成最外层页面
        this.createDom();
        // 初始化事件
        this.initEvent(this.options);
    };

    Receiver.prototype.createDom = function(){
        //生成dom
        var html = '<div class="choose-recelists">'+
                     '<div class="search-box hd"><i class="iconfont icon-sousuo"></i><input type="text" name="search" class="search" placeholder="搜索姓名"></div>'+
                     '<div class="recelists-box"><ul></ul></div>'+
                         '<div class="page-all">'+
                            '<div class="selectedAll"><input type="checkbox" name="selectAll" class="selectAll" id="selectAll"/><label for="selectAll">全选</label></div>'+
                            '<div class="page">'+
                               '<a href="#" class="page-prev mar-10"><i class="iconfont icon-navigatebefore"></i></a>'+
                               '<a href="#" class="lineto mar-10"><input type="text" class="current" value="1"/></a>'+
                               '<span class="mar-10">/</span>'+
                               '<span class="page-total mar-10">30</span>'+
                               '<a href="#" class="page-next"><i class="iconfont icon-navigatenext"></i></a>'+
                           '</div>'
                     +'</div></div>'
                     +'<div class="selected-recelists"><h4>已选收信人</h4><ul class="lists-seleced"></ul></div>'
                     +'<div class="divided"></div>'
        this.$element.append(html);
        // 设置数据“左侧收件人列表”数据
        this.setSjrListsData(this.listData);
        // 设置右侧“已选收件人数据”
        this.setSelectedData(this.toReceiveData);
    };

    // 展示左侧收件人列表
    Receiver.prototype.setSjrListsData = function(data){
        var receLists = $(".recelists-box ul");
        for(var i= 0, len=data.length; i<len; i+=1){
            var li = '<li><label>';
            if(this.isSelected(data[i].id)){
                li += '<input type="checkbox" name="sxr" class="selectSxr" checked/>'
            }else{
                li += '<input type="checkbox" name="sxr" class="selectSxr"/>'
            }
            li += '<span class="sxr-name" data-depart="'+data[i].depart+'"  id="'+data[i].id+'">'+data[i].name+'('+data[i].id+')</span></label></li>'
            receLists.append(li);
        }

        // 设置分页显示数据：
        if(this.options.total <= this.options.pageSize){
            $(".page").hide();
        }else{
            $(".current").val(this.options.curPage);
            $(".page-total").text(this.totalCount);
			// 处理分页状态
		    this.setPageStatus(this.options);
        }
        // 将左侧所有选中的收件人在右侧展示
        //this.getSelectedSjr($(".recelists-box :checkbox:checked"));
    };

    // 判断左侧“收件人列表”是否被选中: true: 选中
    Receiver.prototype.isSelected = function(id){
        for(var i = 0, len = this.toReceiveData.length; i < len; i+=1){
            if(id === this.toReceiveData[i].id ){
                return true;
            }
        }
    };

    // 展示右侧“已选收件人列表”
    Receiver.prototype.setSelectedData = function(info){
        var $listseleced = $(".lists-seleced"),
		    $selectedPid; 
        for(var i= 0, len = info.length; i<len; i+=1){
		    // 判断: 右侧是否已经存在某个收件人,如果已经存在了，全选时无需重复添加到右侧
			$selectedPid = $(".sxr-name[pid='"+info[i].id+"']",$listseleced).length;
			if(!$selectedPid){
				var li = '<li><span class="sxr-name" pid="'+info[i].id+'">'+info[i].name+' ( '+info[i].id+' )'+'</span>'+
                '<span class="sxr-yx">'+info[i].depart+'</span>'+
                '<span class="del">删除</span></li>'
                $listseleced.append(li);
			}				
        }

    };

    // 获得收件人：josn对象信息
    Receiver.prototype.getSelectedSjr = function($selectedSjr){
        // 获得所有选中收件人信息，在右侧已选收件人列表中显示
        var infoarr = [];
        $selectedSjr.each(function(i,domEle){
            var id = $(domEle).next().attr("id"),
                name = $(this).next().text(),
				name = name.substring(0,name.indexOf("("));
                yx = $(domEle).next().attr("data-depart");
            infoarr.push({id: id, name: name, depart: yx});
        });
        this.setSelectedData(infoarr);
    };
	
	/** 根据id值，从已选收件人中移除对应的收件人*/
	Receiver.prototype.removeFormRight = function(id){
		var $listSelected = $(".lists-seleced");
        
		if(id instanceof Array){
			// 取消全选
			for(var i = 0, len = id.length; i < len; i+= 1){
			  $(".sxr-name[pid='"+id[i]+"']", $listSelected).parent().remove();
		    }
		}else{
			// 取消单选
			$(".sxr-name[pid='"+id+"']", $listSelected).parent().remove();
		}
		
	}
	
	 /** 设置分页按钮状态 */
    Receiver.prototype.setPageStatus = function(data){
        var $page_prev = $(".page-prev");
        var $page_next = $(".page-next");
        (data.curPage - 1) <= 0? $page_prev.addClass("disabled") : $page_prev.removeClass("disabled");
        (data.curPage + 1) > this.totalCount ? $page_next.addClass("disabled") : $page_next.removeClass("disabled");      
    };

    /** 设置数据 */
    Receiver.prototype.setPageDatas = function(curpage){
        // 更新curPage
        this.options.curPage = curpage;
        // 更新分页组件中的“当前页面”
        $(".current").val(curpage);
    };
    
    /** 初始化事件*/
    Receiver.prototype.initEvent = function(){
        var self = this,
		    $selectedAll = $(".selectAll"),         // 全选按钮
            $selectSxr = $(".selectSxr");           // 复选框按钮
			
        /** 单击右侧“删除按钮”删除已选收件人*/
        $(".lists-seleced").on("click",".del",function(){
            $(this).parent().remove();
            // 同时于左侧收件人列表中对应的收件人取消勾选
            var pid = $(this).parent().children(".sxr-name").attr("pid");
            // 根据当前删除收信人的id找到左侧对应的收件人，取消勾选
            $(".recelists-box #"+pid).prev().attr("checked",false);
        });

        /** 单选“某个收件人”添加到右侧"已选收件人列表"中显示*/
        $(".recelists-box li").on("click",".selectSxr",function(){
            /** 单选按钮和全选按钮联动： 如果被选中的项与总的项目数相等，则全选要勾选*/
			
            var btnTotal = $selectSxr.length,      // 当前页选项总数
                chkCount = 0,                      // 单击复选框被选中项个
				id = $(this).next().attr("id");    // 对应收件人id
            $selectSxr.each(function(){
                if($(this).prop("checked") == true){
                    chkCount++;
                }
            });
            // 被选中的项和总项目个数相等
            //chkCount === btnTotal ?$selectedAll.prop("checked",true):$selectedAll.prop("checked",false);
            if(chkCount === btnTotal){
                // 全选状态
                $selectedAll.prop("checked",true);
            }
			if(this.checked){
				// 选中
				$selectedAll.prop("checked",false);
                // 将左侧选中的收件人添加到右边,this代表当前代表复选框按钮本身
                self.getSelectedSjr($(this));
			}else{
				// 取消选中，从已选收件人中移除对应的收件人
				self.removeFormRight(id);
			}
			
        });
		
        /** 全选按钮，所有的收件人都要添加到右侧‘已选收件人列表中’ */
        $selectedAll.click(function(){
			if(this.checked){
				// 全选
				$selectSxr.prop("checked",this.checked);
			    self.getSelectedSjr($(".recelists-box :checkbox:checked"));
			}else{
				// 全不选
                // 获得所有选中收件人信息，在右侧已选收件人列表中显示
				var infoarr = [];
				$(".recelists-box :checkbox").each(function(i,domEle){
				var id = $(domEle).next().attr("id");
					infoarr.push(id);
				});
				// 所有复选框取消选中
				$selectSxr.prop("checked",this.checked);
				// 移除右侧所有“已选收件人”
				self.removeFormRight(infoarr);
				
				// todo： 全不选和获得收件人json能采用同样方法吗
				
			}
			
		});
		
		/** 单击上一页*/
		 $(self.$element).on("click",".page-prev",function(){
			var curPage = self.options.curPage - 1;
			if(!($(".page-prev").is(".disabled"))){
              // 设置数据
              self.setPageDatas(curPage);
              // 跳转到指定页面
              self.options.goToPage.call(self, curPage);
              // 设置状态
              self.setPageStatus(self.options);
          }
		});
		
		 /** 下一页按钮*/
        $(self.$element).on("click",".page-next",function(){
			var curPage = self.options.curPage + 1;
            if(!($(".page-next").is(".disabled"))){
                self.setPageDatas(curPage);
                // 跳转到指定页面
                self.options.goToPage.call(self,curPage);
                // 设置状态
                self.setPageStatus(self.options);
            }
        });
		
		 /** 在文本框输入页码回车后直接跳转到指定页面*/
        $(".current").on('keyup', function(event) {
            if (event.keyCode == "13") {
                var exitPage = parseInt($(".current").val());
                //跳转到输入的页面
                if (exitPage > self.totalCount || exitPage <=0) {
                    alert("页码范围1~"+self.totalCount);
                }else{
                    self.setPageDatas(exitPage);
                    // 跳转到指定页面
                    self.options.goToPage.call(self,(exitPage));
                    // 设置状态
                    self.setPageStatus(self.options);    
                }
            }
        });
		
		 /** 单击搜索按钮进行查询*/
		 $(self.$element).on("click",".icon-sousuo",function(){			 
			var keyword = $(".search").val();
   			self.options.search.call(self,keyword);
		 });
		 
		 /** 回车键进行查询*/
		$(self.$element).on('change',".search", function(event){
			var keyword = $(".search").val();
   			self.options.search.call(self,keyword);
		});
    };
    
    function Plugin(option){
        var args = Array.prototype.slice.call(arguments, 1);
        var returnValue = this;
        this.each(function(){
            var $this = $(this),
                data = $this.data('mg.receiver'),
                options = typeof option === 'object' && option;
            if(!data){
                $this.data('mg.receiver',(data = new Receiver(this,options)));
            }
            if(typeof option === 'string'){
                returnValue = data[option].apply(data, args) || returnValue;
            }
        });
        return returnValue;
    }

    var old = $.fn.receiver;

    $.fn.receiver = Plugin;
    $.fn.receiver.Constructor = Receiver;

    $.fn.receiver.noConflict = function(){
        $.fn.receiver = old;
        return this;
    }
}(jQuery);