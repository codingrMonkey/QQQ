	function initPaiging(pageId,tableId,rowAttr){
		var trId = pageId + tableId;
		var trClass = pageId + '_' +  tableId;//用于标识新生成的tr的class，方便删除时候使用
		if($("#" + trId).size() == 0){//初始化表头，只执行一次
			var trTitle = '<tr id="' + trId + '">';
			if(rowAttr.showNum){//表示要显示序号
				trTitle += '<th>序号</th>';
			}
			for(var k=0;k<rowAttr.rowList.length;k++){
				//add by changxw 当设置hidden属性的时候，不显示
				if(!rowAttr.rowList[k].hidden) {
					trTitle += '<th>' + rowAttr.rowList[k].title + '</th>';
				}
			}
			trTitle += '</tr>';
			//alert(trTitle);
			$("#" + tableId).append(trTitle);
		}
		var pageSize = rowAttr.pageSize;
		var getData = function(rowAttr,start){
			var pageSize = rowAttr.pageSize;
			$.ajax({
				url:rowAttr.url() + '&start=' + start + '&limit=' + pageSize,
				type:'GET',
				dataType:'JSON',
				success:function(data){
					var rowList = rowAttr.rowList;
					var totalCounts = parseInt(data.total);
					totalCounts = totalCounts == 0?1:totalCounts;
					$('#' + pageId).jqPaginator('option', {
						totalCounts: totalCounts,
						pageSize: pageSize
					});
					var currObj = $("#" + trId);
					var rowData = {};
					if(data != null && data.rows != null){
						var newObj = "";
						$("tr." + trClass).remove();
						for(var i=0;i<data.rows.length;i++){
							newObj += '<tr class="bor-bottom ' + trClass + '">';
							rowData = {};//记录这一行的数据
							//先用一次循环初始化好rowData
							for(var j=0;j<rowList.length;j++){//这层循环用来拼接td 
								var value = data.rows[i][rowList[j].field];
								if(value == undefined){
									value = "";
								}
								rowData[rowList[j].field] = value;
							}
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
					currObj.after(newObj);
					//add by changxw
						if(rowAttr.dataMap){
							for(var i=0;i<rowAttr.dataMap.length;i++){
								var key = rowAttr.dataMap[i].field;
								$("#"+rowAttr.dataMap[i].id).html(data[key]);
							}
						}
					}else{
						$("tr." + trClass).remove();	
					}
				}
			});//ajax end
		};
		$.jqPaginator('#' + pageId, {
		    totalCounts : 1,
		    pageSize: pageSize,
		    currentPage: 1,
		    prev: '<li class="prev"><a href="javascript:;">&#139</a></li>', 
		    next: '<li class="next"><a href="javascript:;">&#155</a></li>',
		    page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
		    onPageChange: function (num, type) {
		    	var start = pageSize * (num-1);
		        getData(rowAttr,start);
		    }
		});
	};
	Date.prototype.formatDate = function(){
		 var year = this.getFullYear();
		 var month = this.getMonth() + 1 < 10 ? "0" + (this.getMonth() + 1)
		   : this.getMonth() + 1;
		 var day = this.getDate() < 10 ? "0" + this.getDate() : this
		   .getDate();
		 var dateStr = year + "-" + month + "-" + day;
		 return dateStr;
	};
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