	function initPaiging(pageId,tableId,rowAttr){
		var trId = pageId + tableId;
		var trClass = pageId + '_' +  tableId;//用于标识新生成的tr的class，方便删除时候使用
		if($("#" + trId).size() == 0){//初始化表头，只执行一次
			var trTitle = '<tr id="' + trId + '">';
			for(var k=0;k<rowAttr.rowList.length;k++){
				trTitle += '<th>' + rowAttr.rowList[k].title + '</th>';
			}
			trTitle += '</tr>';
			//alert(trTitle);
			$("#" + tableId).append(trTitle);
		}
		var pageSize = rowAttr.pageSize;
		var getData = function(rowAttr,start){
			var pageSize = rowAttr.pageSize;
		//	alert("getDdata");
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
							for(var j=0;j<rowList.length;j++){//这层循环用来拼接td 
								var value = data.rows[i][rowList[j].field];
								if(value == undefined){
									value = "&nbsp";
								}
								if(rowList[j].formatter != undefined){
									value = rowList[j].formatter(value,rowData,j);
								}
								rowData[rowList[j].field] = value;
								newObj += '<td>' + value + '</td>';
							}
							newObj += '</tr>';
						}
					currObj.after(newObj);
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