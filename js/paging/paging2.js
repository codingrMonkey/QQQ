	/**
	 * 
	 * @param pageId  分页组件的ID
	 * @param tableId 列表的ID
	 * @param rowAttr 行数据的属性
	 */
	function initPaiging(pageId,tableId,rowAttr){
		rowAttr.selected = [];
		var trId = pageId + tableId;
		var trClass = pageId + '_' +  tableId;//用于标识新生成的tr的class，方便删除时候使用
		if($("#" + trId).size() == 0){//初始化表头，只执行一次
			var trTitle = '<tr id="' + trId + '">';
			if(rowAttr.showNum){//表示要显示序号
				trTitle += '<th>序号</th>';
			}
			for(var k=0;k<rowAttr.rowList.length;k++){
				if(rowAttr.checkbox && k == 0){
					trTitle += '<th style="text-align:center"><input id="' + tableId + '-checkall" type="checkbox"/>' + rowAttr.rowList[k].title + '</th>';
					continue;
				}
				if(!rowAttr.rowList[k].hidden) {
					trTitle += '<th style="text-align:center">' + rowAttr.rowList[k].title + '</th>';
				}
			}
			trTitle += '</tr>';
			//alert(trTitle);
			$("#" + tableId).append(trTitle);
			//注册check全选函数
			$("#" + tableId + "-checkall").click(function(){
				var obj = $("#" + tableId).find("input[type='checkbox']");
				if(this.checked){
					for(var i=0;i<obj.size();i++){
						obj.get(i).checked = true;
					}
				}else{
					for(var i=0;i<obj.size();i++){
						obj.get(i).checked = false;
					}
				}
			});
		}
		var getData = function(rowAttr,start){
		//	alert("start = " + start);
			rowAttr.selected = [];
			var pageSize = rowAttr.pageSize;
			$.ajax({
				url:rowAttr.url() + '&start=' + start + '&limit=' + pageSize,
				type:'GET',
				dataType:'JSON',
				success:function(data){
					var rowList = rowAttr.rowList;
					var orignaltotalCounts = parseInt(data.total);
					var totalCounts = orignaltotalCounts == 0?1:orignaltotalCounts;
					var currObj = $("#" + trId);
					var rowData = {};
					if(data != null && data.rows != null){
						var newObj = "";
						$("tr." + trClass).remove();
						for(var i=0;i<data.rows.length;i++){
							newObj += '<tr class="bor-bottom ' + trClass + '">';
							var checkId = tableId + "-check" + i;
							if(rowAttr.checkbox){
								newObj += '<td><input id="' + checkId + '" type="checkbox"/></td>';
							}
							rowData = {};//记录这一行的数据
							rowData.checkId = checkId;
							//先用一次循环初始化好rowData
							for(var j=0;j<rowList.length;j++){//这层循环用来拼接td 
								var value = data.rows[i][rowList[j].field];
								if(value == undefined){
									value = "";
								}  
								rowData[rowList[j].field] = value;
							}
							rowAttr.selected.push(rowData);
							if(rowAttr.showNum){//用来展示行号，如果showNum存在就会用到
								newObj += '<td>' + (i + 1) + '</td>';
							}
							for(var j=0;j<rowList.length;j++){//这层循环用来拼接td 
								var value = data.rows[i][rowList[j].field];
								if(value == undefined){
									value = "";
								}
								if(rowList[j].formatter != undefined){
									value = rowList[j].formatter(value,rowData,j);
								}
								//add by changxw 隐藏列 hidden 属性的，不展现
								if(!rowList[j].hidden){
									newObj += '<td>' + value + '</td>';
								}
							}
							newObj += '</tr>';
						}
						//alert(newObj);
						currObj.after(newObj);
						if(rowAttr.dataMap){
							for(var i=0;i<rowAttr.dataMap.length;i++){
								var key = rowAttr.dataMap[i].field;
								$("#"+rowAttr.dataMap[i].id).html(data[key]);
							}
						}
					}else{
						$("tr." + trClass).remove();	
					}
					var currentPageNum = Math.ceil(start/pageSize)==0?1:(Math.ceil(start/pageSize)+1);
					//alert("currentPageNum" + currentPageNum);
					//结束之后需要重绘分页列表
					var pageNum = Math.ceil(totalCounts/pageSize);//返回页码总数
					//alert("pageNum = " + pageNum);
					var addHtml = '<div class="page-wrap">';
					addHtml += '<a href="javascript:void(0);" class="last-page-data"><i class="prev-i">&lt;</i></a>';
					for(var k=currentPageNum,j=1;k<=pageNum;k++,j++){
						if(currentPageNum == k){//如果是当前页码展示位选中状态
							addHtml += '<a href="javascript:void(0);" class="footer curr">' + k + '</a>';
						}else{
							addHtml += '<a href="javascript:void(0);" class="footer">' + k + '</a>';
						}
						if(j > 2){//最多显示三条
							break;
						}
					}
					addHtml += '<span class="apostrophe">···</span>';
					addHtml += '<a href="javascript:void(0);" class="next-page-data"><i class="next-i">&gt;</i></a>';
					addHtml += '<span class="tol-pag">共' + orignaltotalCounts + '条记录</span>';
					addHtml += '</div>';
					$("#" + pageId).html(addHtml);
					//alert($("#" + pageId).find(".footer").size());
					$("#" + pageId).find(".footer").click(function(){
						getData(rowAttr,(parseInt($(this).text()) - 1) * pageSize);
					});
					$("#" + pageId).find(".last-page-data").unbind("click");
					$("#" + pageId).find(".next-page-data").unbind("click");
					$("#" + pageId).find(".last-page-data").click(function(){
						var toPage = (currentPageNum - 2)<0?0:(currentPageNum - 2);//不断点击上一页的时候防止报错
						getData(rowAttr, toPage * pageSize);
					});
					$("#" + pageId).find(".next-page-data").click(function(){
						var toPage = (currentPageNum == pageNum)?(currentPageNum - 1):currentPageNum;
						getData(rowAttr,toPage * pageSize);
					});
				}
			});//ajax end
		};//getDate end
		getData(rowAttr,0);
	};
	function getSelectedRows(tableId,rowAttr){
		var obj = $("#" + tableId).find("input[type='checkbox']:checked");
		var selected = rowAttr.selected;
		var result = [];
		for(var i=0;i<obj.size();i++){
			for(var j=0;j<selected.length;j++){
				if(obj[i].id == selected[j].checkId){
					result.push(selected[j]);
				}
			}
		}
		return result;
	}
	Date.prototype.formatDate = function(){
		 var year = this.getFullYear();
		 var month = this.getMonth() + 1 < 10 ? "0" + (this.getMonth() + 1)
		   : this.getMonth() + 1;
		 var day = this.getDate() < 10 ? "0" + this.getDate() : this
		   .getDate();
		 var hour = this.getHours() < 10 ? ("0" + this.getHours()) : this.getHours();
		 var minutes = this.getMinutes() < 10 ? ("0" + this.getMinutes()) : this.getMinutes();
		 var seconds = this.getSeconds() < 10 ? ("0" + this.getSeconds()) : this.getSeconds();
		 var dateStr = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
		 return dateStr;
	};
	var converToDate = function(time){
		if(time == null || time == "" || time == undefined)
			return "";
		return new Date(time).formatDate();
	};
	function showLayer(obj){
        var _this = this;
        if (!obj[0])return false;
      //  var winHeight = $(window).height();
      //  var winScrollTop = $(window).scrollTop();
       // var objH = obj.height();
       // var objW = obj.width();
        var winMask = $('<div class="windowmask"></div>');
        setTimeout(function(){
        	obj.show();
           // obj.css({"top": winScrollTop + Math.max(0, (winHeight - objH) / 2) + "px", "margin-left": -objW / 2 | 0 + "px"}).show();
        },300);
        $('body').append(winMask);
        winMask.animate({opacity: 0.5}, 300);

        obj.find('.panelclose').unbind();
        obj.find('.panelclose').bind('click', function(){
            _this.hideLayer(obj);
        });
	}
	function hideLayer(obj){
	    $('.windowmask').animate({opacity: 0}, 300, function(){
	        $(this).remove();
	    });
	    obj.hide();
	}
	
	
	var toMaskPhone = function(str){
		  if(str == null || str == "" || str == undefined){
		    return "";
		  }
		  var start = str.substring(0,3);
		  var end = str.substring(7,11);
		  return start + "****" + end;
	};
	var toMaskCard = function(str){
		  if(str == null || str == "" || str == undefined){
		    return "";
		  }
		  var start = str.substring(0,6);
		  var end = str.substring(14,19);
		  return start + "********" + end;
	};
	var toMaskBankCard = function(str){
		  if(str == null || str == "" || str == undefined){
		    return "";
		  }
		  var start = str.substring(0,4);
		  var end = str.substring(str.length-4,str.length);
		  return start + "********" + end;
	};
	var toPercent = function(num){
		if(num != null && num != "" && num != undefined){
			if(typeof(num) == "number"){
				return (Math.round(num * 10000)/100).toFixed(2) + '%';
			}else{
				try{
					num = parseFloat(num);
					return (Math.round(num * 10000)/100).toFixed(2) + '%';
				}catch(e){
					
				}
			}
			return num;
		}
		return num;
	};
	var BankCode2Name = function(code){
		this.code = code;
	};
	BankCode2Name.prototype.toBankName = function(){
		var bankCode = this.code.toUpperCase();
		if(this.obj[bankCode] != undefined){
			return this.obj[bankCode];
		}
		return bankCode;
	};
	BankCode2Name.prototype.obj = {
		"ICBC":"工商银行",
		"CMB":"招商银行",
		"ABC":"农业银行",
		"BEA":"东亚银行",
		"SPDB":"浦东发展银行",
		"BOB":"北京银行",
		"CCB":"建设银行",
		"CEB":"光大银行",
		"CIB":"兴业银行",
		"GDB":"广东发展银行",
		"HXB":"华夏银行",
		"SDB":"深圳发展银行",
		"BCOM":"交通银行",
		"CBHB":"渤海银行",
		"CMBC":"民生银行",
		"NBCB":"宁波银行",
		"NJCB":"南京银行",
		"BJRCB":"北京农村商业银行",
		"CITIC":"中信银行",
		"POST":"中国邮政储蓄",
		"SRCB":"上海农村商业银行",
		"BOC":"中国银行",
		"GZRCC":"广州农村信用合作社",
		"GZCB":"广州市商业银行",
		"HZB":"杭州银行",
		"PAB":"平安银行",
		"HSB":"徽商银行",
		"CZB":"浙商银行",
		"SHB":"上海银行",
		"JSB":"江苏银行",
		"WZCB":"温州银行",
		"CQRCB":"重庆农商银行",
		"CQCB":"重庆银行",
		"BONC":"南昌银行",
		"GDNYCB":"广东南粤银行",
		"JZCB":"晋商银行",
		"BOLG":"龙江银行",
		"TAB":"泰安银行"};
var rowAttrAccount={
            showNum:false,
            url:function(){
                    return "/worksheet/doQueryMerchantAccount.do?merchantNo=" + ${quotaEntity.merchantNo};
                },
            rowList:[
                {field:'accountCode',title:'账户号',width:'10%',align:'center'},
                {field:'productName',title:'支付产品',width:'20%',align:'center'},  
                {field:'status',title:'合同状态',width:'20%'},
                {field:'industry3',title:'行业（二级）',width:'20%'},
                {field:'webSite1',title:'APP',width:'10%'},
                {field:'webSite',title:'网站',width:'10%'},
                {field:'publicWeChatNum',title:'微信公众号',width:'10%'},
                {field:'null',title:'操作',width:'10%',align:'center',formatter: function (value, row, index){
	        		return '<a href="javascript:void(0);" onclick="showAccountDetail(' + row.id + ',' + row.accountNo + ')">查看</a>';
					}
				}
            ],  
             pageSize:2
        };
		initPaiging("pageAccount","tableAccount",rowAttrAccount);
	
