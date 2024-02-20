/**
* Author: 倘若飘邈 
* <940461709@qq.com> <微信jiao_ao8>
*/

(function(){
    //加载数据
    function Load_data(obj){
        var _this = this;
        _this.data=$.extend({
            "load_type":0,
            "fill_type":0,
            "scroll":true,
            "scroll_bar":true,
            "scroll_barStyle": {},
            "niceScrollObj":null,
            "dom": null,
            "url": null,
            "dataType":null,
            "listParams": {"pageIndex":1,"pageSize":30},
            "listData": {},
            "format_callBack": function () {
            },
            "callback": function () {
            }    
        }, obj);
        if(_this.data.scroll_bar){
            var scroll_barStyle={
                autohidemode:false,
                horizrailenabled:false,
                cursorwidth: "4px",
                cursorcolor:"rgba(0,0,0,0.3)",
                background: "transparent",
                cursorborder: "none",
                cursorborderradius: "10px",
            };
            _this.data.scroll_barStyle=$.extend(scroll_barStyle,_this.data.scroll_barStyle);
            _this.scrollBar();
        }
        
        if(_this.data.scroll){
            if(_this.data.load_type==0){
                //向下滚动加载下一页
                var scroll_dom=$(_this.data.dom+" .scroll");
                scroll_dom.scroll(function(){
                    var scroll_top=scroll_dom[0].scrollTop;
                    var scroll_height=scroll_dom.height();
                    var list_height=scroll_dom.find(".list").height();
                    var loading=scroll_dom.attr("data-loading");
                    // console.log(scroll_top+"|"+scroll_height+"|"+list_height+"|"+(scroll_top+scroll_height));
                    if (scroll_top + scroll_height >= list_height-30) {
                        if(loading=="true") return;
                        scroll_dom.attr("data-loading","true");
                        var isMore=scroll_dom.attr("isMore");
                        if(isMore=="1"){
                            //下一页
                            scroll_dom.find(".loadMore").html("加载中...").show();
                            _this.scroll_data({});
                        }
                        else {
                            scroll_dom.find(".loadMore").html("已加载所有").show();
                        }
                    }
                }) 
            }
            else if(_this.data.load_type==1){
                //向上滚动加载下一页
                var scroll_dom=$(_this.data.dom+" .scroll");
                scroll_dom.scroll(function(){
                    var scroll_top=scroll_dom[0].scrollTop;
                    var loading=scroll_dom.attr("data-loading");
                    if(scroll_top==0){
                        if(loading=="true") return;
                        scroll_dom.attr("data-loading","true");
                        var isMore=scroll_dom.attr("isMore");
                        if(isMore=="1"){
                            //下一页
                            scroll_dom.find(".loadMore").html("加载中...").show();
                            _this.scroll_data({});
                        }
                        else {
                            scroll_dom.find(".loadMore").html("已加载所有").show();
                        }
                    }
                }) 
            }
        }
    }
    Load_data.prototype = {
        constructor: Load_data,
        //滚动获取数据
        scroll_data: function(obj) {
            var _this=this;
            var param_cover=obj.param_cover ? obj.param_cover : false;
            if(param_cover==1){
                _this.data.listParams={};
            }
            if(obj.callBack){
                _this.data.callBack=obj.callBack;
            }
            var params=$.extend(_this.data.listParams, obj.params);
            var paramsObj={
                "type" : "POST",
                "url" : _this.data.url,
                "params" : params,
                "callBack" : function(reParams){
                    var params=reParams.params;
                    var pageIndex = params.pageIndex;
                    var pageSize=params.pageSize;
                    var reData=reParams.data;
                    if(reData.status==1){
                        var totalPage = reData.totalPage;
                        var count = reData.count;
                        var total = reData.total;
                        // console.log("pageIndex:"+pageIndex+"，totalPage:"+totalPage+"，total:"+total+"，count:"+count);
                        if(count==0){
                            $(_this.data.dom).find(".scroll .list").html('');
                            $(_this.data.dom).find(".loadMore").html('').hide();
                        }
                        else{
                            if(totalPage > 1){
                                $(_this.data.dom).find(".scroll").attr("isMore","1");
                                if(pageIndex==totalPage) {
                                    $(_this.data.dom).find(".scroll").attr("isMore","0");
                                    $(_this.data.dom).find(".loadMore").html('已加载所有').show();
                                }
                            }
                            else {
                                $(_this.data.dom).find(".scroll").attr("isMore","0");
                                $(_this.data.dom).find(".loadMore").html('已加载所有').show();
                            }
                
                            pageIndex++;
                            _this.data.listParams.pageIndex=pageIndex;
                        }
                        var listHtml="";
                        var list=reData.data;
                        if(list){
                            var cou=list.length;
                            for(var i=0; i<cou; i++){
                                var curObj = list[i];
                                if(curObj.id){
                                    var id = curObj.id;
                                    _this.data.listData[id]=curObj; 
                                }
                                if (_this.data.format_callBack && $.isFunction(_this.data.format_callBack)) {
                                    var reHtml=_this.data.format_callBack({"index":i, "data":curObj});
                                    if(reHtml){
                                        listHtml+=reHtml;
                                        if(_this.data.fill_type==1){
                                            $(_this.data.dom).find(".scroll .list").append(reHtml);
                                        }
                                    }
                                }
                            }
                        }
                        if(_this.data.fill_type==0){
                            $(_this.data.dom).find(".scroll .list").append(listHtml);
                        }
                        $(_this.data.dom).find(".scroll").attr("data-loading","false");
                    }
                    else{
                        // console.log(reData.info);
                    }
                    if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
                        _this.data.callBack({"data":reData});
                    }
                    if(_this.data.scroll_bar){
                        $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        setTimeout(function(){
                            $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        },1000);
                    }
                }
            };
            if(_this.data.dataType){
                paramsObj.dataType=_this.data.dataType;
            }
            trpm.ajax(paramsObj);
        },
        //分页获取数据
        page_data: function(obj) {
            var _this=this;
            var param_cover=obj.param_cover ? obj.param_cover : false;
            if(param_cover==1){
                _this.data.listParams={};
            }
            if(obj.callBack){
                _this.data.callBack=obj.callBack;
            }
            var params=$.extend(_this.data.listParams, obj.params);
            var paramsObj={
                "type" : "POST",
                "url" : _this.data.url,
                "params" : params,
                "callBack" : function(reParams){
                    var params=reParams.params;
                    var pageIndex = params.pageIndex;
                    var pageSize=params.pageSize;
                    var reData=reParams.data;
                    if(reData.status==1){
                        var totalPage = reData.totalPage;
                        var count = reData.count;
                        var total = reData.total;
                        // console.log("pageIndex:"+pageIndex+"，totalPage:"+totalPage+"，total:"+total+"，count:"+count);
                        if(count==0){
                            $(_this.data.dom).find(".scroll .list").html('');
                            $(_this.data.dom).find(".pagination-box .pagination").html('');
                        }
                        else{
                            if(totalPage > 1){
                                $(_this.data.dom).find(".pagination-box").show();
                            }
                            //分页
                            $(_this.data.dom+' .pagination-box .pagination').pagination({
                                // pageCount: totalPage,
                                current: pageIndex,
                                totalData: count,
                                showData: pageSize,
                                count:2,
                                coping: true,
                                // jump: true,
                                // jumpBtn:"跳转",
                                //homePage: '首页',
                                //endPage: '末页',
                                //prevContent: '上一页',
                                //nextContent: '下一页',
                                keepShowPN: true,
                                isHide: false,
                                callback: function (res) {
                                    // console.log(res.getCurrent());
                                    _this.data.listParams.pageIndex=res.getCurrent();
                                    _this.page_data({"params":obj.params});
                                }
                            });
                            pageIndex++;
                            _this.data.listParams.pageIndex=pageIndex;
                        }
                        var listHtml="";
                        var list=reData.data;
                        if(list){
                            var cou=list.length;
                            for(var i=0; i<cou; i++){
                                var curObj = list[i];
                                if(curObj.id){
                                    var id = curObj.id;
                                    _this.data.listData[id]=curObj; 
                                }
                                if (_this.data.format_callBack && $.isFunction(_this.data.format_callBack)) {
                                    var reHtml=_this.data.format_callBack({"index":i, "data":curObj});
                                    if(reHtml){
                                        listHtml+=reHtml;
                                        if(_this.data.fill_type==1){
                                            $(_this.data.dom).find(".scroll .list").append(reHtml);
                                        }
                                    }
                                }
                            }
                        }
                        if(_this.data.fill_type==0){
                            $(_this.data.dom).find(".scroll .list").html(listHtml);
                            $(_this.data.dom).find(".scroll").scrollTop(0);
                        }
                    }
                    else{
                        // console.log(reData.info);
                    }
                    if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
                        _this.data.callBack({"data":reData});
                    }
                    if(_this.data.scroll_bar){
                        $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        setTimeout(function(){
                            $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        },1000);
                    }
                }
            };
            if(_this.data.dataType){
                paramsObj.dataType=_this.data.dataType;
            }
            trpm.ajax(paramsObj);
        },
        //获取数据
        list_data: function(obj) {
            var _this=this;
            delete _this.data.listParams.pageIndex;
            delete _this.data.listParams.pageSize;
            var param_cover=obj.param_cover ? obj.param_cover : false;
            if(param_cover==1){
                _this.data.listParams={};
            }
            if(obj.callBack){
                _this.data.callBack=obj.callBack;
            }
            var params=$.extend(_this.data.listParams, obj.params);
            var paramsObj={
                "type" : "POST",
                "url" : _this.data.url,
                "params" : params,
                "callBack" : function(reParams){
                    var params=reParams.params;
                    var reData=reParams.data;
                    if(reData.status==1){
                        var listHtml="";
                        var list=reData.data;
                        if(list){
                            var cou=list.length;
                            for(var i=0; i<cou; i++){
                                var curObj = list[i];
                                if(curObj.id){
                                    var id = curObj.id;
                                    _this.data.listData[id]=curObj; 
                                }
                                if (_this.data.format_callBack && $.isFunction(_this.data.format_callBack)) {
                                    var reHtml=_this.data.format_callBack({"index":i, "data":curObj});
                                    if(reHtml){
                                        listHtml+=reHtml;
                                        if(_this.data.fill_type==1){
                                            $(_this.data.dom).find(".scroll .list").append(reHtml);
                                        }
                                    }
                                }
                            }
                        }
                        if(_this.data.fill_type==0){
                            $(_this.data.dom).find(".scroll .list").html(listHtml);
                            $(_this.data.dom).find(".scroll").scrollTop(0);
                        }
                    }
                    else{
                        // console.log(reData.info);
                    }
                    if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
                        _this.data.callBack({"data":reData});
                    }
                    if(_this.data.scroll_bar){
                        $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        setTimeout(function(){
                            $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        },1000);
                    }
                }
            };
            if(_this.data.dataType){
                paramsObj.dataType=_this.data.dataType;
            }
            trpm.ajax(paramsObj);
        },
        //更新滚动条
        scrollBar: function(obj) {
            var _this=this;
            // _this.data.niceScrollObj=$(_this.data.dom+" .scroll").niceScroll(_this.data.scroll_barStyle);
            if(_this.data.niceScrollObj){
                $(_this.data.dom+" .scroll").getNiceScroll().resize();
            }
            else{
                _this.data.niceScrollObj=$(_this.data.dom+" .scroll").niceScroll(_this.data.scroll_barStyle);
            }            
        }
    }
              
    function materialModule(obj) {
        var _this = this;
        _this.data={
            "userAgent":null,
            "eventName":"click",
            "resourcePublic":paramObj.resourcePublic,
            "resourceWasee":paramObj.resourceWasee,
            "myserver":paramObj.myserver,
            "icon_load": paramObj.resourcePublic+"/images/loading2.gif",
            "skin":"",//皮肤
            "loadFile":false,//文件是否加载完成
            "title":{//107:hdr(json) 208:作品材质(传参)
                "121":"我的全景图","3":"我的高清矩阵","130":"我的全景视频","23030":"我的图片","23031":"我的视频","2":"我的音乐","4":"我的文档","5":"我的模型","6":"倾斜摄影","8":"我的材质","9":"我的贴图","10":"公共图片","20":"公共音乐","30":"公共视频","50":"公共模型","70":"公共HDR","80":"公共材质","90":"公共贴图","107":"公共HDR","208":"作品材质","11":"我的AI知识库"
            }, 
            "ty":121, 
            "cur_ty":121,
            "load_panoCls":null,
            "load_pano":null,
            "data_pano":null,

            "load_panoVideoCls":null,
            "load_panoVideo":null,
            "data_panoVideo":null,

            "load_imgCls":null,
            "load_img":null,
            "data_img":null,

            "load_videoCls":null,
            "load_video":null,
            "data_video":null,

            "load_musicCls":null,
            "load_music":null,
            "data_music":null,

            "load_sysImgCls":null,
            "load_sysImg":null,
            "data_sysImg":null,

            "load_sysVideoCls":null,
            "load_sysVideo":null,
            "data_sysVideo":null,

            "load_sysMusicCls":null,
            "load_sysMusic":null,
            "data_sysMusic":null,

            "load_sysHdrCls":null,
            "load_sysHdr":null,
            "data_sysHdr":null,

            "load_sysModelCls":null,
            "load_sysModel":null,
            "data_sysModel":null,

            "load_sysTextureCls":null,
            "load_sysTexture":null,
            "data_sysTexture":null,

            "load_sysTietuCls":null,
            "load_sysTietu":null,
            "data_sysTietu":null,

            "load_scenicCls":null,
            "load_scenic":null,
            "data_scenic":null,

            "load_docCls":null,
            "load_doc":null,
            "data_doc":null,

            "load_modelCls":null,
            "load_model":null,
            "data_model":null,

            "load_model2Cls":null,
            "load_model2":null,
            "data_model2":null,

            "load_textureCls":null,
            "load_texture":null,
            "data_texture":null,

            "load_tietuCls":null,
            "load_tietu":null,
            "data_tietu":null,

            "load_staticHdrCls":null,
            "load_staticHdr":null,
            "data_staticHdr":null,
            "data_staticHdrJson":null,

            "load_varTextureCls":null,
            "load_varTexture":null,
            "data_varTexture":null,

            "load_ailibCls":null,
            "load_ailib":null,
            "data_ailib":null,

            "data_json":{//数据（主要用于传参类型数据如作品材质）  
                "208":null
            }, 
            "lf":{//左侧是否显示   
                "121":true,"3":true,"130":true,"23030":true,"23031":true,"2":true,"4":true,"5":true,"6":true,"8":true,"9":true,"10":true,"30":true,"50":true,"70":true,"80":true,"208":false,"11":true
            }, 
            "all":{//是否显示全部   
                "121":{"show":1,"cid":""},"3":{"show":1,"cid":""},"130":{"show":1,"cid":""},"23030":{"show":1,"cid":""},"23031":{"show":1,"cid":""},"2":{"show":1,"cid":""},"4":{"show":1,"cid":""},"5":{"show":1,"cid":""},"6":{"show":1,"cid":""},"8":{"show":1,"cid":""},"9":{"show":1,"cid":""},"10":{"show":1,"cid":""},"90":{"show":1,"cid":""},"30":{"show":1,"cid":""},"50":{"show":1,"cid":""},"70":{"show":1,"cid":""},"80":{"show":1,"cid":""},"11":{"show":1,"cid":""}
            },  
            "clsParams":{
                "121":{"pid":0},"3":{"pid":0},"130":{"pid":0},"23030":{"pid":0},"23031":{"pid":0},"2":{"pid":0},"4":{"pid":0},"5":{"pid":0},"6":{"pid":0},"8":{"pid":0},"9":{"pid":0},"10":{"pid":0},"30":{"pid":0},"50":{"pid":0},"70":{"pid":0},"80":{"pid":0},"90":{"pid":0},"11":{"pid":0}
            },
            "clsInitParams":{//分类初始参数 
                "121":{"pid":0},"3":{"pid":0},"130":{"pid":0},"23030":{"pid":0},"23031":{"pid":0},"2":{"pid":0},"4":{"pid":0},"5":{"pid":0},"6":{"pid":0},"8":{"pid":0},"9":{"pid":0},"10":{"pid":0},"30":{"pid":0},"50":{"pid":0},"70":{"pid":0},"80":{"pid":0},"90":{"pid":0},"11":{"pid":0}
            },  
            "params":{
                "121":{"pageIndex":1,"pageSize":30},"3":{"pageIndex":1,"pageSize":30},"130":{"pageIndex":1,"pageSize":30},"23030":{"pageIndex":1,"pageSize":30},"23031":{"pageIndex":1,"pageSize":30},"2":{"pageIndex":1,"pageSize":30},"4":{"pageIndex":1,"pageSize":30},"5":{"pageIndex":1,"pageSize":30},"6":{"pageIndex":1,"pageSize":30},"8":{"pageIndex":1,"pageSize":30},"9":{"pageIndex":1,"pageSize":30},"10":{"pageIndex":1,"pageSize":30},"30":{"pageIndex":1,"pageSize":30},"50":{"pageIndex":1,"pageSize":30},"70":{"pageIndex":1,"pageSize":30},"80":{"pageIndex":1,"pageSize":30},"90":{"pageIndex":1,"pageSize":30},"11":{"pageIndex":1,"pageSize":30}
            },
            "initParams":{//初始参数  
                "121":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"3":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"130":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"23030":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"23031":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"2":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"4":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"5":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"6":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"8":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"9":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"10":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"30":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"50":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"70":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"80":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"90":{"pageIndex":1,"pageSize":30,cid:"","keyword":""},"11":{"pageIndex":1,"pageSize":30,cid:"","keyword":""}
            },
            "cls_load":false,
            "check":0, //0单选 1多选
            "check_data":{},//选中数据
            "ids":[],//默认选中数据
            "unFinishedData": {"121":[],"130":[],"3":[],"5":[],"6":[]}, //轮询未处理数据
            "domInit_callBack": function(bkData){}, //dom初始化回调
            "toggle_callBack": function(bkData){}, //切换化回调
            "class_callBack": function(bkData){}, //分类点击回调
            "ok_callBack": function(bkData){}, //确定回调
            "upload_btn":{"121":false,"3":false,"130":false,"23030":false,"23031":false,"2":false,"4":false,"5":false,"6":false,"8":false,"9":false},
            "upload_img":{
                "uploadObj":null,
                "formDatas":{
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                }
            },
            "upload_music": {
                "uploadObj": null,
                "formDatas": {
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                }
            },
            "upload_video": {
                "uploadObj": null,
                "formDatas": {
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                }
            },
            "upload_pano": {
                "uploadObj": null,
                "expireTime": 0,
                "isExpire": 0,
                "formData": { //当前表单参数
                    'key': '',
                    'policy': '',
                    'OSSAccessKeyId': '',
                    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                    'callback': '',
                    'signature': '',
                },
                "formDatas": {
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                },
                "per":2,//宽高比
                "file_cou":0,
                "file_fail":[]
            },
            "upload_panoVideo":{
                "uploadObj":null,
                "expireTime" : 0,
                "isExpire" : 0,
                "formData":{ //当前表单参数
                    'key' : '',
                    'policy': '',
                    'OSSAccessKeyId': '',
                    'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
                    'callback' : '',
                    'signature': '',
                },
                "formDatas":{
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                }
            },
            "upload_scenic": {
                "uploadObj": null,
                "expireTime": 0,
                "isExpire": 0,
                "formData": { //当前表单参数
                    'key': '',
                    'policy': '',
                    'OSSAccessKeyId': '',
                    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                    'callback': '',
                    'signature': '',
                },
                "formDatas": {
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                },
                "per":2,//宽高比
                "file_cou":0,
                "file_fail":[]
            },
            "upload_doc": {
                "uploadObj": null,
                "formDatas": {
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                }
            },
            "upload_model": {
                "uploadObj": null,
                "expireTime": 0,
                "isExpire": 0,
                "formData": { //当前表单参数
                    'key': '',
                    'policy': '',
                    'OSSAccessKeyId': '',
                    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                    'callback': '',
                    'signature': '',
                },
                "formDatas": {
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                },
                "file_cou":0,
                "file_fail":[]
            },
            "upload_model2": {
                "uploadObj": null,
                "expireTime": 0,
                "isExpire": 0,
                "formData": { //当前表单参数
                    'key': '',
                    'policy': '',
                    'OSSAccessKeyId': '',
                    'success_action_status': '200', //让服务端返回200,不然，默认会返回204
                    'callback': '',
                    'signature': '',
                },
                "formDatas": {
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                },
                "file_cou":0,
                "file_fail":[]
            },
            "upload_texture": {
                "uploadObj": null,
                "formDatas": {
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                }
            },
            "upload_tietu":{
                "uploadObj":null,
                "formDatas":{
                    // "file_1":{
                    //     'key' : '',
                    //     'policy': '',
                    //     'OSSAccessKeyId': '',
                    //     'success_action_status' : '200',
                    //     'callback' : '',
                    //     'signature': '',
                    // }
                }
            },
            "drag":false,
            "synthesisParams":{"btn":false, "data":{}},//音频合成
            "kuorong":1,//1显示 2不显示 3显示但是不显示“扩容”
        }
        _this.data.userAgent=trpm.device();
        if(_this.data.userAgent.mobile){
            _this.data.eventName="touchend";
        }
        if(obj){
            // Object.assign(this.data, obj);
            $.extend(true,this.data, obj);
        }

        //导入文件
        _this.import_file({})
        .then(function(res){
            _this.data.loadFile = true;
        })
        .catch(function(rej){
            console.log(rej);
        });
    }

    materialModule.prototype = {
        constructor: materialModule,
        //导入文件
        async import_file(obj) {
            var _this = this;
            let file_cou=0;
            //初始化公共js
            let public_obj=await trpm.init({
                "public_path":_this.data.resourcePublic,
                "font":true,
                "css":true
            }).catch(function(rej){
                console.log(rej);
            });
            // console.log(public_obj);
            if(public_obj){
                //导入css
                let resource_css_obj=await trpm.loadCss({
                    "id":"resource_css",
                    "url":_this.data.resourcePublic+'/trpm/resource/css/resource1.3.css?ver='+new Date().getTime()
                }).catch(function(rej){
                    console.log(rej);
                });
                if(resource_css_obj){
                    file_cou++;
                }

                //导入js
                let layer_pm=trpm.loadScript({"id":"layer_script","val":"layer","url":_this.data.resourcePublic+'/trpm/layer/3.5.1/layer.js'});
                let nicescroll_pm=trpm.loadScript({"id":"nicescroll_script","url":_this.data.resourcePublic+'/trpm/jquery-nicescroll/jquery.nicescroll.min.js'});
                let payUpgrade_pm=trpm.loadScript({"id":"payUpgrade_script","url":_this.data.resourcePublic+'/trpm/payUpgrade/js/payUpgrade1.3.js?ver='+new Date().getTime()});
                let webuploader_pm=trpm.loadScript({"id":"webuploader_script","url":_this.data.resourcePublic+'/trpm/webuploader/js/webuploader1.3.js?ver='+new Date().getTime()});
                let vrpano_pm=trpm.loadScript({"id":"vrpano_script","url":_this.data.resourceWasee+'/vrpano/vrpano.js?ver='+new Date().getTime()});
                let waseePlayer_pm=trpm.loadScript({"id":"waseePlayer_script","url":_this.data.resourcePublic+'/player/wasee2/js/waseePlayer.min.js?ver='+new Date().getTime()});

                let layer_obj = await layer_pm.catch(function(rej){
                    console.log(rej);
                });
                let nicescroll_obj = await nicescroll_pm.catch(function(rej){
                    console.log(rej);
                });
                let payUpgrade_obj = await payUpgrade_pm.catch(function(rej){
                    console.log(rej);
                });
                let webuploader_obj = await webuploader_pm.catch(function(rej){
                    console.log(rej);
                });
                let vrpano_obj = await vrpano_pm.catch(function(rej){
                    console.log(rej);
                });
                let waseePlayer_obj = await waseePlayer_pm.catch(function(rej){
                    console.log(rej);
                });

                if(layer_obj.status==1){
                    file_cou++;
                }
                if(nicescroll_obj.status==1){
                    file_cou++;
                }
                if(payUpgrade_obj.status==1){
                    file_cou++;
                }
                if(webuploader_obj.status==1){
                    file_cou++;
                }
                if(vrpano_obj.status==1){
                    file_cou++;
                }
                if(waseePlayer_obj.status==1){
                    file_cou++;
                }
            }
            return file_cou;
        },
        //设置参数
        setParams: function(obj){
            var _this=this;
            _this.data=$.extend(_this.data, obj);
        },
        //dom
        alert: function(obj){
            var _this=this;
            function _A(){
                if(!_this.data.loadFile){
                    setTimeout(function(){
                        _A();
                    },100);
                    return;
                }
                else{
                    mainFun();
                }
            }
            _A();
            // mainFun();
            function mainFun(){
                _this.data.loop_timer=true;
                _this.data.cls_load=false;
                _this.data.check_data={};
                _this.data.ids=[];
                if(obj){
                    _this.data=$.extend(_this.data, obj);
                    //分类初始参数
                    _this.data.clsInitParams=JSON.parse(JSON.stringify(_this.data.clsParams));
                }
                let ty=_this.data.ty;
                let ty_type=(typeof ty);
                let cur_ty=ty;
                if(ty_type=="object"){
                    cur_ty=ty[0];
                }
                _this.data.cur_ty=obj.cur_ty ? obj.cur_ty : cur_ty;
                $("#resource-alert").remove();
                try {
                    var domHtml='<div class="trpm-alert resource-alert '+_this.data.skin+'" id="resource-alert">'+
                                    '<div class="trpm-bk"></div>'+
                                    '<div class="trpm-flex trpm-mc">'+
                                        '<div class="trpm-x">'+
                                            '<span class="trpm-flex-xy">'+
                                                '<span class="icon-d">'+
                                                    '<i class="trpm-iconfont icon_close"></i>'+
                                                '</span>'+
                                            '</span>'+
                                        '</div>'+
                                        '<div class="trpm-tl">'+
                                            '<div class="tag">'+
                                                '<span class="sp trpm-none" data-ty="121">我的全景图</span>'+
                                                '<span class="sp trpm-none" data-ty="130">我的全景视频</span>'+
                                                '<span class="sp trpm-none" data-ty="23030">我的图片</span>'+
                                                '<span class="sp trpm-none" data-ty="23031">我的视频</span>'+
                                                '<span class="sp trpm-none" data-ty="2">我的音乐</span>'+
                                                '<span class="sp trpm-none" data-ty="3">我的高清矩阵</span>'+
                                                '<span class="sp trpm-none" data-ty="4">我的文档</span>'+
                                                '<span class="sp trpm-none" data-ty="5">我的3D物体/空间</span>'+
                                                '<span class="sp trpm-none" data-ty="6">我的倾斜摄影</span>'+
                                                '<span class="sp trpm-none" data-ty="9">我的贴图</span>'+
                                                '<span class="sp trpm-none" data-ty="8">我的材质</span>'+
                                                '<span class="sp trpm-none" data-ty="11">我的AI知识库</span>'+
                                                '<span class="sp trpm-none" data-ty="10">公共图片</span>'+
                                                '<span class="sp trpm-none" data-ty="30">公共视频</span>'+
                                                '<span class="sp trpm-none" data-ty="20">公共音乐</span>'+
                                                '<span class="sp trpm-none" data-ty="50">公共模型</span>'+
                                                '<span class="sp trpm-none" data-ty="70">公共HDR</span>'+
                                                '<span class="sp trpm-none" data-ty="80">公共材质</span>'+             
                                                '<span class="sp trpm-none" data-ty="90">公共贴图</span>'+                                   
                                                '<span class="sp trpm-none" data-ty="107">公共HDR</span>'+
                                                '<span class="sp trpm-none" data-ty="208">作品材质</span>'+
                                                
                                            '</div>'+
                                        '</div>'+
                                        '<div class="trpm-flex m-d">'+
                                            '<div class="lf trpm-none">'+
                                                '<div class="tree-boxs">'+

                                                    '<div class="tree-box pano-tree trpm-none" data-ty="121">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box panoVideo-tree trpm-none" data-ty="130">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box img-tree trpm-none" data-ty="23030">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                    '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">默认分组</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box video-tree trpm-none" data-ty="23031">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                                '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                    '<div class="tl-lf">'+
                                                                        '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                        '<i class="folder" style="margin-left: 0;"></i>'+
                                                                        '<span class="txt">默认分组</span>'+
                                                                    '</div>'+
                                                                    '<div class="tl-rg">'+
                                                                        '<span class="cou">0</span>'+
                                                                    '</div>'+
                                                                    '<div class="striped trpm-none"></div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box music-tree trpm-none" data-ty="2">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                                '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                    '<div class="tl-lf">'+
                                                                        '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                        '<i class="folder" style="margin-left: 0;"></i>'+
                                                                        '<span class="txt">默认分组</span>'+
                                                                    '</div>'+
                                                                    '<div class="tl-rg">'+
                                                                        '<span class="cou">0</span>'+
                                                                    '</div>'+
                                                                    '<div class="striped trpm-none"></div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box scenic-tree trpm-none" data-ty="3">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box doc-tree trpm-none" data-ty="4">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                    '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">默认分组</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    
                                                    '<div class="tree-box model-tree trpm-none" data-ty="5">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                    '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">默认分组</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box model2-tree trpm-none" data-ty="6">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                    '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">默认分组</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box tietu-tree trpm-none" data-ty="9">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                    '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">默认分组</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box texture-tree trpm-none" data-ty="8">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                                '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                    '<div class="tl-lf">'+
                                                                        '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                        '<i class="folder" style="margin-left: 0;"></i>'+
                                                                        '<span class="txt">默认分组</span>'+
                                                                    '</div>'+
                                                                    '<div class="tl-rg">'+
                                                                        '<span class="cou">0</span>'+
                                                                    '</div>'+
                                                                    '<div class="striped trpm-none"></div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box ailib-tree trpm-none" data-ty="11">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                    '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder" style="margin-left: 0;"></i>'+
                                                                            '<span class="txt">默认分组</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box sysImg-tree trpm-none" data-ty="10">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li trpm-none" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box sysVideo-tree trpm-none" data-ty="30">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li trpm-none" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box sysMusic-tree trpm-none" data-ty="20">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li trpm-none" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="tree-box sysModel-tree trpm-none" data-ty="50">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li trpm-none" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="tree-box sysHdr-tree trpm-none" data-ty="70">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li trpm-none" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box sysTexture-tree trpm-none" data-ty="80">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li trpm-none" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box sysTitu-tree trpm-none" data-ty="90">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li trpm-none" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box staticHdr-tree trpm-none" data-ty="107">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="tree-box varTexture-tree trpm-none" data-ty="208">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li" data-id="-1">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="trpm-iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                '</div>'+
                                            '</div>'+
                                            '<div class="trpm-flex rg">'+
                                                '<div class="trpm-flex ser-d">'+
                                                    '<div class="inp-d">'+
                                                        '<input class="trpm-inp inp" type="text" value="" placeholder="请输入">'+
                                                        '<span class="trpm-iconfont icon_search btn-ser"></span>'+
                                                    '</div>'+
                                                    '<div class="trpm-flex-y bts">'+
                                                        '<div class="trpm-flex-xy btn-check trpm-none">'+
                                                            '<i class="trpm-iconfont icon_radio"></i>'+
                                                            '<span class="txt">全选</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-synthesis trpm-none" style="background-color: rgba(255,116,50,1);">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_tubiaozhizuomoban4"></i>'+
                                                            '<span class="txt">合成音频</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upImg trpm-none" data-ty="23030">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upVideo trpm-none" data-ty="23031">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upMusic trpm-none" data-ty="2">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upPano trpm-none" data-ty="121">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upScenic trpm-none" data-ty="3">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upPanoVideo trpm-none" data-ty="130">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upDoc trpm-none" data-ty="4">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upModel trpm-none" data-ty="5">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upModel2 trpm-none" data-ty="6">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upTexture trpm-none" data-ty="8">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-upload btn-upTietu trpm-none" data-ty="9">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                        '<div class="trpm-flex-y trpm-btn btn-up trpm-none">'+
                                                            '<span class="bk"></span>'+
                                                            '<i class="trpm-iconfont icon_upload"></i>'+
                                                            '<span class="txt">上传</span>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="boxs">'+

                                                    '<div class="box pano-box" data-ty="121">'+
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                                '<!--<div class="li on" data-id="1">'+
                                                                    '<div class="m">'+
                                                                        '<div class="img">'+
                                                                            '<img src="'+_this.data.resourceWasee+'/VRHome/img/yangtu.jpg" alt="">'+
                                                                        '</div>'+
                                                                        '<div class="bk"></div>' +
                                                                        '<div class="gou"></div>'+
                                                                        '<div class="name">外滩</div>'+
                                                                    '</div>'+
                                                                '</div>-->'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box panoVideo-box trpm-none" data-ty="130">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box img-box trpm-none" data-ty="23030">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box video-box trpm-none" data-ty="23031">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box music-box trpm-none" data-ty="2">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box scenic-box" data-ty="3">'+
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box doc-box trpm-none" data-ty="4">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box model-box trpm-none" data-ty="5">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box model2-box trpm-none" data-ty="6">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box texture-box trpm-none" data-ty="8">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box tietu-box trpm-none" data-ty="9">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box ailib-box trpm-none" data-ty="11">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box sysImg-box trpm-none" data-ty="10">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box sysVideo-box trpm-none" data-ty="30">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box sysMusic-box trpm-none" data-ty="20">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="box sysModel-box trpm-none" data-ty="50">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="box sysHdr-box trpm-none" data-ty="70">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box sysTexture-box trpm-none" data-ty="80">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box sysTietu-box trpm-none" data-ty="90">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box staticHdr-box trpm-none" data-ty="107">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                    '<div class="box varTexture-box trpm-none" data-ty="208">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="trpm-iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+

                                                '</div>'+
                                            '</div>'+
                                            '<div class="empty-box trpm-none"></div>'+
                                        '</div>'+
                                        '<div class="trpm-flex-y btn-d">'+
                                            '<div class="cou-d trpm-none">已选<span class="cou">0</span>个</div>'+
                                            '<div class="trpm-flex-y btns">'+
                                                '<audio class="trpm-none" id="material_audio" autoplay="" src="" loop=""></audio>'+
                                                '<div class="trpm-flex-y trpm-btn btn-cancel">'+
                                                    '<span class="txt">取消</span>'+
                                                '</div>'+
                                                '<div class="trpm-flex-y trpm-btn btn-ok">'+
                                                    '<span class="txt">确定</span>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
                } catch (error) {
                }
                $("body").append(domHtml);
                for(let key in _this.data.title){
                    let val=_this.data.title[key];
                    $("#resource-alert .trpm-tl .tag .sp[data-ty="+key+"]").text(val);
                }
                if(ty_type=="object"){
                    ty.forEach(function(o,i) {
                        let on=o==_this.data.cur_ty ? "on" : "";
                        $("#resource-alert .trpm-tl .tag .sp[data-ty="+o+"]").removeClass("trpm-none").addClass(on);
                    });
                }
                else{
                    $("#resource-alert .trpm-tl .tag .sp[data-ty="+_this.data.cur_ty+"]").removeClass("trpm-none").addClass("on");
                }
                $("#resource-alert .lf .tree-boxs .tree-box[data-ty="+_this.data.cur_ty+"], #resource-alert .rg .boxs .box[data-ty="+_this.data.cur_ty+"]").removeClass("trpm-none").siblings().addClass("trpm-none");
                if(_this.data.check==1){
                    $("#resource-alert .rg .ser-d .btn-check").removeClass("trpm-none");
                }
                if(_this.data.upload_btn[_this.data.cur_ty]){
                    $("#resource-alert .ser-d .btn-upload[data-ty="+_this.data.cur_ty+"]").removeClass("trpm-none").siblings(".btn-upload").addClass("trpm-none");
                }    
                if(_this.data.synthesisParams.btn && _this.data.cur_ty==2){
                    $("#resource-alert .ser-d .btn-synthesis").removeClass("trpm-none");
                }       
                if(_this.data.upload_btn["121"]){
                    _this.uploadInit({"ty":121,"btn":"#resource-alert .ser-d .btn-upPano .bk"});
                }
                if(_this.data.upload_btn["3"]){
                    _this.uploadInit({"ty":3,"btn":"#resource-alert .ser-d .btn-upScenic .bk"});
                }
                if(_this.data.upload_btn["130"]){
                    _this.uploadInit({"ty":130,"btn":"#resource-alert .ser-d .btn-upPanoVideo .bk"});
                }
                if(_this.data.upload_btn["23030"]){
                    _this.uploadInit({"ty":23030,"btn":"#resource-alert .ser-d .btn-upImg .bk"});
                }
                if(_this.data.upload_btn["23031"]){
                    _this.uploadInit({"ty":23031,"btn":"#resource-alert .ser-d .btn-upVideo .bk"});
                }
                if(_this.data.upload_btn["2"]){
                    _this.uploadInit({"ty":2,"btn":"#resource-alert .ser-d .btn-upMusic .bk"});
                }
                if(_this.data.upload_btn["4"]){
                    _this.uploadInit({"ty":4,"btn":"#resource-alert .ser-d .btn-upDoc .bk"});
                }
                if(_this.data.upload_btn["5"]){
                    _this.uploadInit({"ty":5,"btn":"#resource-alert .ser-d .btn-upModel .bk"});
                }
                if(_this.data.upload_btn["6"]){
                    _this.uploadInit({"ty":6,"btn":"#resource-alert .ser-d .btn-upModel2 .bk"});
                }  
                if(_this.data.upload_btn["8"]){
                    _this.uploadInit({"ty":8,"btn":"#resource-alert .ser-d .btn-upTexture .bk"});
                }      
                if(_this.data.upload_btn["9"]){
                    _this.uploadInit({"ty":9,"btn":"#resource-alert .ser-d .btn-upTietu .bk"});
                }   
                        
                if ($.isFunction(_this.data.domInit_callBack)) {
                    _this.data.domInit_callBack({});
                    mFun();
                }
                else{
                    mFun();
                }

                function mFun(){
                    _this.kuorong();
                    $("#resource-alert").show();
                    setTimeout(function(){
                        $("#resource-alert .lf .tree-uls").css({"height":$("#resource-alert .lf .tree-boxs").height()});
                        $("#resource-alert .rg .scroll").css({"height":$("#resource-alert .rg .boxs").height()});
                    },500);
                    let domObj=_this.getDom({"ty":_this.data.cur_ty});

                     //是否显示全部
                     _this.showAll();
                     
                    let [clsParams,params]=[_this.data.clsInitParams[_this.data.cur_ty],_this.data.initParams[_this.data.cur_ty]];                 
                    //获取分类列表
                    _this.getCls({
                        "isInit":true,
                        "lf":true,
                        "rg":false,
                        "dom":domObj.dom_tree+" .tree-one-ul",
                        "params":clsParams,
                        "callBack":function(bkData){     
                            console.log(bkData);
                            let curAll=(_this.data.all && _this.data.all[_this.data.cur_ty]) ? _this.data.all[_this.data.cur_ty] : {};
                            if(curAll.show==0){//不显示全部
                                let list=bkData.data.data;
                                if(list && list.length>0){
                                    params.cid=list[0].id;
                                    $(domObj.dom_tree+" .tree-tl").removeClass("active");
                                    $(`#resource-alert .tree-box[data-ty=${_this.data.cur_ty}] .tree-li[data-id=${params.cid}] .tree-tl`).addClass("active");
                                    //获取列表
                                    _this.getList({"isInit":true,"params":params,"sumCount":bkData.sumCount});
                                }
                            }
                            else if(curAll.show==2){
                                let list=bkData.data.data;
                                if(list && list.length>0){
                                    let cidAry=[];
                                    list.forEach(function(item){
                                        cidAry.push(item.id);
                                    });
                                    curAll.cid=cidAry.join(',');
                                    params.cid=curAll.cid;
                                    // $(`#resource-alert .tree-box[data-ty=${_this.data.cur_ty}] .tree-li[data-id=-1] .tree-tl .cou`).text(bkData.sumCount);
                                    //获取列表
                                    _this.getList({"isInit":true,"params":params,"sumCount":bkData.sumCount});
                                }
                            }
                            else{
                                //获取列表
                                _this.getList({"isInit":true,"params":params,"sumCount":bkData.sumCount});
                            }
                        }
                    });
                }

                $("#resource-alert")
                //关闭
                .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                    var thisObj=$(this);
                    //全景-状态轮询
                    _this.data.unFinishedData["121"]=[];
                    _this.data.unFinishedData["130"]=[];
                    _this.data.unFinishedData["3"]=[];
                    _this.data.unFinishedData["5"]=[];
                    _this.data.unFinishedData["6"]=[];
                    $("#resource-alert").remove();
                })
                //tab切换
                .on("click", ".trpm-tl .tag .sp", function () {
                    let thisObj=$(this);
                    let obj_type=thisObj.attr("data-ty");
                    if(ty_type!="object"){
                        return false;
                    }
                    $("#resource-alert .btn-check").attr("data-ck","0").removeClass("ck").find(".trpm-iconfont").removeClass("icon_radioed").addClass("icon_radio");
                    if ($.isFunction(_this.data.toggle_callBack)) {
                        _this.data.toggle_callBack({"obj_type":obj_type});
                        mainFun();
                    }
                    else{
                        mainFun();
                    }
                    
                    function mainFun(){
                        _this.data.unFinishedData["121"]=[];
                        _this.data.unFinishedData["130"]=[];
                        _this.data.unFinishedData["3"]=[];
                        _this.data.check_data={};
                        _this.data.cur_ty=obj_type;
                        _this.data.cls_load=false;
                        let domObj=_this.getDom({"ty":_this.data.cur_ty});
                        thisObj.addClass("on").siblings().removeClass("on");
                        $("#resource-alert .lf .tree-boxs .tree-box[data-ty="+obj_type+"], #resource-alert .rg .boxs .box[data-ty="+obj_type+"]").removeClass("trpm-none").siblings().addClass("trpm-none");
                        $(domObj.dom_tree+" .tree-one-ul .tree-li:gt(0)").remove();
                        $("#resource-alert .ser-d .btn-upload").addClass("trpm-none");
                        if(_this.data.upload_btn[obj_type]){
                            $("#resource-alert .ser-d .btn-upload[data-ty="+obj_type+"]").removeClass("trpm-none").siblings(".btn-upload").addClass("trpm-none");
                        }
                        if(_this.data.synthesisParams.btn && _this.data.cur_ty==2){
                            $("#resource-alert .ser-d .btn-synthesis").removeClass("trpm-none");
                        }
                        else{
                            $("#resource-alert .ser-d .btn-synthesis").addClass("trpm-none");
                        }
                        // console.log(_this.data.clsInitParams,_this.data.initParams);
                        let [clsParams,params]=[ _this.data.clsInitParams[_this.data.cur_ty],_this.data.initParams[_this.data.cur_ty] ];
                        //获取分类列表
                        _this.getCls({
                            "isInit":true,
                            "lf":true,
                            "rg":false,
                            "dom":domObj.dom_tree+" .tree-one-ul",
                            "params":clsParams,
                            "callBack":function(bkData){
                                console.log(bkData);
                                let curAll=(_this.data.all && _this.data.all[_this.data.cur_ty]) ? _this.data.all[_this.data.cur_ty] : {};
                                if(curAll.show==0){
                                    let list=bkData.data.data;
                                    if(list && list.length>0){
                                        params.cid=list[0].id;
                                        $(domObj.dom_tree+" .tree-tl").removeClass("active");
                                        $(`#resource-alert .tree-box[data-ty=${_this.data.cur_ty}] .tree-li[data-id=${params.cid}] .tree-tl`).addClass("active");
                                        //获取列表
                                        _this.getList({"isInit":true,"params":params,"sumCount":bkData.sumCount});
                                    }
                                }
                                else if(curAll.show==2){
                                    let list=bkData.data.data;
                                    if(list && list.length>0){
                                        let cidAry=[];
                                        list.forEach(function(item){
                                            cidAry.push(item.id);
                                        });
                                        curAll.cid=cidAry.join(',');
                                        params.cid=curAll.cid;
                                        // $(`#resource-alert .tree-box[data-ty=${_this.data.cur_ty}] .tree-li[data-id=-1] .tree-tl .cou`).text(bkData.sumCount);
                                        //获取列表
                                        _this.getList({"isInit":true,"params":params,"sumCount":bkData.sumCount});
                                    }
                                }
                                else{
                                    //获取列表
                                    _this.getList({"isInit":true,"params":params,"sumCount":bkData.sumCount});
                                }
                            }
                        });
                    }
                    return false;
                })
                //input  focus
                .on("focus",".inp",function(){
                    var thisObj=$(this);
                    let pObj=thisObj.parents(".inp-d");
                    pObj.addClass("focus");
                })
                //input  blur
                .on("blur",".inp",function(){
                    var thisObj=$(this);
                    let pObj=thisObj.parents(".inp-d");
                    pObj.removeClass("focus");
                })
                //全选
                .on("click", ".btn-check", function () {
                    var thisObj=$(this);
                    let ck = thisObj.attr("data-ck");
                    let cur_ty=_this.data.cur_ty;
                    if(ck==1){
                        thisObj.attr("data-ck","0").removeClass("ck").find(".trpm-iconfont").removeClass("icon_radioed").addClass("icon_radio");
                    }
                    else{
                        thisObj.attr("data-ck","1").addClass("ck").find(".trpm-iconfont").removeClass("icon_radio").addClass("icon_radioed");
                    }

                    $("#resource-alert .boxs .box[data-ty="+cur_ty+"] .list .li").each(function(i){
                        var thisObj=$(this);
                        let atr=thisObj.attr("data-atr");
                        let id=thisObj.attr("data-id");
                        var curObj={};
                        if(cur_ty==121){
                            curObj=_this.data.data_pano[id];
                        }
                        else if(cur_ty==130){
                            curObj=_this.data.data_panoVideo[id];
                        }
                        else if(cur_ty==23030){
                            curObj=_this.data.data_img[id];
                        }
                        else if(cur_ty==23031){
                            curObj=_this.data.data_video[id];
                        }
                        else if(cur_ty==2){
                            curObj=_this.data.data_music[id];
                        }                        
                        else if(cur_ty==3){
                            curObj=_this.data.data_scenic[id];
                        }
                        else if(cur_ty==4){
                            curObj=_this.data.data_doc[id];
                        }
                        else if(cur_ty==5){
                            curObj=_this.data.data_model[id];
                        }
                        else if(cur_ty==6){
                            curObj=_this.data.data_model2[id];
                        }
                        else if(cur_ty==8){
                            curObj=_this.data.data_texture[id];
                        }
                        else if(cur_ty==9){
                            curObj=_this.data.data_tietu[id];
                        }
                        else if(cur_ty==10){
                            curObj=_this.data.data_sysImg[id];
                        }
                        else if(cur_ty==20){
                            curObj=_this.data.data_sysMusic[id];
                        }
                        else if(cur_ty==30){
                            curObj=_this.data.data_sysVideo[id];
                        }
                        else if(cur_ty==50){
                            curObj=_this.data.data_sysModel[id];
                        }
                        else if(cur_ty==70){
                            curObj=_this.data.data_sysHdr[id];
                        }
                        else if(cur_ty==80){
                            curObj=_this.data.data_sysTexture[id];
                        }
                        else if(cur_ty==90){
                            curObj=_this.data.data_sysTietu[id];
                        }
                        if(thisObj.hasClass("no") || thisObj.hasClass("sta1") || thisObj.hasClass("sta2")){
                        }
                        else{
                            if(ck==1){
                                thisObj.attr("data-atr",0).removeClass("on");
                                delete _this.data.check_data[id];
                            }
                            else{
                                thisObj.attr("data-atr",1).addClass("on");
                                _this.data.check_data[id]=curObj;
                            }
                        }
                    });
                    return false;
                })
                //搜索
                .on("click", ".ser-d .btn-ser", function () {
                    var val = $("#resource-alert .ser-d .inp").val();
                    //获取列表
                    let params={"pageIndex":1,"keyword":val};
                    _this.getList({"params":params});
                    return false;
                })
                //搜索回车
                .on('keypress','.ser-d .inp',function(event){
                    if(event.keyCode == 13){  
                        $("#resource-alert .ser-d .btn-ser").click();
                    }  
                })
                //上传
                .on("click", ".ser-d .btn-upload .bk", function () {
                    let thisObj=$(this);
                    let ty=thisObj.parent().attr("data-ty");
                    //上传
                    _this.upload({"ty":ty});
                })
                //合成音频
                .on("click", ".ser-d .btn-synthesis .bk", function () {
                    let thisObj=$(this);
                    //合成音频
                    _this.synthesis({});
                })
                //右侧 mouseout
                .on("mouseout",".list .li",function(){
                    var thisObj=$(this);
                    thisObj.removeClass("in");
                })
                //右侧选中
                .on("click",".list .li",function(){
                    var thisObj=$(this);
                    let atr=thisObj.attr("data-atr");
                    let id=thisObj.attr("data-id");
                    if(thisObj.hasClass("no") || thisObj.hasClass("sta1") || thisObj.hasClass("sta2")){
                        return false;
                    }
                    var curObj={};
                    if(_this.data.cur_ty==121){
                        curObj=_this.data.data_pano[id];
                    }
                    else if(_this.data.cur_ty==130){
                        curObj=_this.data.data_panoVideo[id];
                    }
                    else if(_this.data.cur_ty==23030){
                        curObj=_this.data.data_img[id];
                    }
                    else if(_this.data.cur_ty==23031){
                        curObj=_this.data.data_video[id];
                    }
                    else if(_this.data.cur_ty==2){
                        curObj=_this.data.data_music[id];
                    }
                    else if(_this.data.cur_ty==3){
                        curObj=_this.data.data_scenic[id];
                    }
                    else if(_this.data.cur_ty==4){
                        curObj=_this.data.data_doc[id];
                    }
                    else if(_this.data.cur_ty==5){
                        curObj=_this.data.data_model[id];
                    }
                    else if(_this.data.cur_ty==6){
                        curObj=_this.data.data_model2[id];
                    }
                    else if(_this.data.cur_ty==8){
                        curObj=_this.data.data_texture[id];
                    }
                    else if(_this.data.cur_ty==9){
                        curObj=_this.data.data_tietu[id];
                    }
                    else if(_this.data.cur_ty==10){
                        curObj=_this.data.data_sysImg[id];
                    }
                    else if(_this.data.cur_ty==11){
                        curObj=_this.data.data_ailib[id];
                    }
                    else if(_this.data.cur_ty==20){
                        curObj=_this.data.data_sysMusic[id];
                    }
                    else if(_this.data.cur_ty==30){
                        curObj=_this.data.data_sysVideo[id];
                    }
                    else if(_this.data.cur_ty==50){
                        curObj=_this.data.data_sysModel[id];
                    }
                    else if(_this.data.cur_ty==70){
                        curObj=_this.data.data_sysHdr[id];
                    }
                    else if(_this.data.cur_ty==80){
                        curObj=_this.data.data_sysTexture[id];
                    }
                    else if(_this.data.cur_ty==90){
                        curObj=_this.data.data_sysTietu[id];
                    }
                    else if(_this.data.cur_ty==107){
                        curObj=_this.data.data_staticHdr[id];
                    }
                    else if(_this.data.cur_ty==208){
                        curObj=_this.data.data_varTexture[id];
                    }
                    
                    if(atr==1){
                        thisObj.attr("data-atr",0).removeClass("on").addClass("in");
                        if(_this.data.check==0){
                            _this.data.check_data={};
                        }
                        else{
                            delete _this.data.check_data[id];
                        }
                    }
                    else{
                        thisObj.attr("data-atr",1).removeClass("in").addClass("on");
                        if(_this.data.check==0){
                            thisObj.siblings().attr("data-atr",0).removeClass("on in");
                            _this.data.check_data=curObj;
                        }
                        else{
                            _this.data.check_data[id]=curObj;
                        }
                    }
                    // console.log(_this.data.check_data);
                })
                //右侧 音乐播放
                .on("click",".list .li .music-play",function(){
                    var thisObj=$(this);
                    var pObj=thisObj.parents(".li");
                    var lObj=thisObj.parents(".list");
                    let atr=thisObj.attr("data-atr");
                    let id=pObj.attr("data-id");
                    let curObj={};
                    if(_this.data.cur_ty==2){
                        curObj=_this.data.data_music[id];
                    }
                    else if(_this.data.cur_ty==20){
                        curObj=_this.data.data_sysMusic[id];
                    }
                    let url=curObj.url;
                    let audioObj=$("#material_audio");
                    let audio_url=audioObj.attr("src");
                    if(url!=audio_url){
                        audioObj.attr("src",url);
                    }
                    var audioElm=audioObj.get(0);
                    lObj.find(".music-play").attr("data-atr","0").addClass("icon_kaishi").removeClass("icon_zanting");
                    if(atr=="1"){
                        thisObj.attr("data-atr","0").addClass("icon_kaishi").removeClass("icon_zanting");
                        audioElm.pause();
                    }
                    else{
                        thisObj.attr("data-atr","1").addClass("icon_zanting").removeClass("icon_kaishi");
                        audioElm.play();
                    }
                    return false;
                })
                //右侧预览
                .on("click",".list .li .eye",function(){
                    var thisObj=$(this);
                    var pObj=thisObj.parents(".li");
                    let atr=pObj.attr("data-atr");
                    let id=pObj.attr("data-id");
                    var curObj={};
                    if(_this.data.cur_ty==121){
                        curObj=_this.data.data_pano[id];
                        _this.eyePano(curObj);
                    }
                    if(_this.data.cur_ty==130){
                        curObj=_this.data.data_panoVideo[id];
                        _this.eyePanoVideo(curObj);
                    }
                    else if(_this.data.cur_ty==23030){
                        curObj=_this.data.data_img[id];
                        _this.eyeImg(curObj);
                    }
                    else if(_this.data.cur_ty==23031){
                        curObj=_this.data.data_video[id];
                        _this.eyeVideo(curObj);
                    }
                    else if(_this.data.cur_ty==2){
                    }
                    else if(_this.data.cur_ty==3){
                        curObj=_this.data.data_scenic[id];
                        _this.eyeScenic(curObj);
                    }
                    else if(_this.data.cur_ty==4){
                        curObj=_this.data.data_doc[id];
                        _this.eyeDoc(curObj);
                    }
                    else if(_this.data.cur_ty==5){
                        curObj=_this.data.data_model[id];
                        _this.eyeModel({"data":curObj,"pub":0});
                    }
                    else if(_this.data.cur_ty==6){
                        curObj=_this.data.data_model2[id];
                        _this.eyeModel2(curObj);
                    }
                    else if(_this.data.cur_ty==8){
                        curObj=_this.data.data_texture[id];
                        _this.eyeTexture(curObj);
                    }
                    else if(_this.data.cur_ty==9){
                        curObj=_this.data.data_tietu[id];
                        _this.eyeImg(curObj);
                    }
                    else if(_this.data.cur_ty==10){
                        curObj=_this.data.data_sysImg[id];
                        _this.eyeImg(curObj);
                    }
                    else if(_this.data.cur_ty==11){
                        curObj=_this.data.data_ailib[id];
                        _this.eyeAilib(curObj);
                    }
                    else if(_this.data.cur_ty==20){
                    }
                    else if(_this.data.cur_ty==30){
                        curObj=_this.data.data_sysVideo[id];
                        _this.eyeVideo(curObj);
                    }
                    else if(_this.data.cur_ty==50){
                        curObj=_this.data.data_sysModel[id];
                        _this.eyeModel({"data":curObj,"pub":1});
                    }
                    else if(_this.data.cur_ty==70){
                        curObj=_this.data.data_sysHdr[id];
                        _this.eyeHdr(curObj);
                    }
                    else if(_this.data.cur_ty==80){
                        curObj=_this.data.data_sysTexture[id];
                        _this.eyeTexture(curObj);
                    }
                    else if(_this.data.cur_ty==90){
                        curObj=_this.data.data_sysTietu[id];
                        _this.eyeImg(curObj);
                    }
                    return false;
                })
                //确定
                .on("click",".btns .btn-ok",function(){
                    var thisObj=$(this);
                    if ($.isEmptyObject(_this.data.check_data)) {
                        layer.msg("请先选择",{time:1000}); 
                        return false;
                　　}
                    if ($.isFunction(_this.data.ok_callBack)) {
                        _this.data.ok_callBack({"data":_this.data.check_data,"ty":_this.data.cur_ty});
                    }
                    $("#resource-alert").remove();
                })
                //分类点击
                .on("click", ".lf .tree-tl", function () {
                    var thisObj = $(this);
                    var pObj = thisObj.parent(".tree-box");
                    var liObj = thisObj.parent(".tree-li");
                    var id = thisObj.attr("data-id");
                    var arrow = thisObj.attr("data-arrow");
                    var isAjax = thisObj.attr("data-ajax");
                    let domObj=_this.getDom({"ty":_this.data.cur_ty});
                    $(domObj.dom_tree+" .tree-tl").removeClass("active");
                    thisObj.addClass("active");
                    if(arrow==1){
                        thisObj.attr("data-arrow","0").removeClass("show-sub");
                        thisObj.next(".tree-ul").hide();
                    }
                    else{
                        thisObj.attr("data-arrow","1").addClass("show-sub");
                        thisObj.next(".tree-ul").show();
                    }
                    $("#resource-alert .ser-d .inp").val("");

                    _this.data.check_data={};
                    let clsParams={"pid":id}, listParams={"pageIndex":1,"cid":id,"keyword":""};
                    if(isAjax==1){
                        if(id>0){
                            _this.getCls({
                                "lf":false,
                                "rg":true,
                                "dom":domObj.dom_tree+" .tree-ul[pid="+id+"]",
                                "params":clsParams,
                                "callBack":function(bkData){
                                }
                            });
                        }
                        else{
                            $(domObj.dom_box+" .folder-box").hide();
                            $(domObj.dom_box+" .bti[data-ty=file]").hide();
                            let curAll=(_this.data.all && _this.data.all[_this.data.cur_ty]) ? _this.data.all[_this.data.cur_ty] : {};
                            if(id==-1 && curAll.show==2){
                                listParams.cid=curAll.cid;
                            }
                        }
                        //获取列表
                        _this.getList({"params":listParams});
                    }
                    else{
                        thisObj.attr("data-ajax","1");
                        if(id>0){
                            _this.getCls({
                                "lf":true,
                                "rg":true,
                                "dom":domObj.dom_tree+" .tree-ul[pid="+id+"]",
                                "params":clsParams,
                                "callBack":function(bkData){
                                    //获取列表
                                    _this.getList({"params":listParams});
                                }
                            });
                        }
                        else{
                            //获取列表
                            _this.getList({"params":listParams});
                        }
                    }
                    if ($.isFunction(_this.data.class_callBack)) {
                        _this.data.class_callBack({"obj_type":_this.data.cur_ty,"id":id});
                    }
                    
                    return false;
                });
                //右侧分类点击
                $("#resource-alert .rg .folder-box .folder-ul").off('click').on("click", ".folder-li", function () {
                    var thisObj = $(this);
                    var id = thisObj.attr("data-id");
                    let domObj=_this.getDom({"ty":_this.data.cur_ty});
                    var lf_tlObj = $(domObj.dom_tree+" .tree-tl[data-id="+id+"]");
                    var lf_liObj=lf_tlObj.parent();
                    var lf_isAjax = lf_tlObj.attr("data-ajax");
                    var lf=false;
                    if(lf_isAjax=='0'){
                        lf=true;
                        lf_tlObj.attr("data-ajax","1");
                    }
                    
                    $(domObj.dom_tree+" .tree-tl").removeClass("active");
                    lf_liObj.parents(".tree-li").find(".tree-tl:first").attr("data-arrow","1").addClass("show-sub");
                    lf_liObj.parents(".tree-li").find(".tree-tl:first").next(".tree-ul").show();
                    lf_tlObj.attr("data-arrow","1").addClass("active show-sub");
                    lf_tlObj.next(".tree-ul").show();

                    _this.data.check_data={};
                    _this.getCls({
                        "lf":lf,
                        "rg":true,
                        "dom":domObj.dom_tree+" .tree-ul[pid="+id+"]",
                        "params":{"pid":id},
                        "callBack":function(bkData){
                            //获取列表
                            _this.getList({"params":{"pageIndex":1,"cid":id}});
                        }
                    });
                    return false;
                })
                //右侧分组显示隐藏
                $("#resource-alert .rg .folder-box .bti").on("click", ".sq", function () {
                    var thisObj = $(this);
                    var pObj=thisObj.parents(".folder-box");
                    var is_show = thisObj.attr("data-show");
                    if(is_show==1){
                        thisObj.attr("data-show",0);
                        thisObj.find("font").text("展开");
                        thisObj.find(".jt").addClass("icon_top").removeClass("icon_bottom");
                        pObj.find(".folder-ul").css({"display":"none"});
                    }
                    else{
                        thisObj.attr("data-show",1).removeClass("in");
                        thisObj.find("font").text("收起");
                        thisObj.find(".jt").addClass("icon_bottom").removeClass("icon_top");
                        pObj.find(".folder-ul").css({"display":"flex"});
                    }
                    return false;
                })
                
            }
        },
        //是否显示全部
        showAll: function(obj){
            var _this=this;
            if(_this.data.all){
                for(let key in _this.data.all){
                    let val=_this.data.all[key];
                    if(val.show!=0){
                        $(`#resource-alert .tree-box[data-ty=${key}] .tree-li[data-id=-1]`).removeClass("trpm-none");
                    }
                }
            }
        },
        // 获取当前类型dom
        getDom: function(obj){
            var _this=this;
            let ty=obj.ty ? obj.ty : _this.data.cur_ty;
            let dom_tree="#resource-alert .lf .pano-tree",dom_box="#resource-alert .rg .pano-box";
            if(ty==130){
                dom_tree="#resource-alert .lf .panoVideo-tree";
                dom_box="#resource-alert .rg .panoVideo-box";
            }
            else if(ty==23030){
                dom_tree="#resource-alert .lf .img-tree";
                dom_box="#resource-alert .rg .img-box";
            }
            else if(ty==23031){
                dom_tree="#resource-alert .lf .video-tree";
                dom_box="#resource-alert .rg .video-box";
            }
            else if(ty==2){
                dom_tree="#resource-alert .lf .music-tree";
                dom_box="#resource-alert .rg .music-box";
            }            
            else if(ty==3){
                dom_tree="#resource-alert .lf .scenic-tree";
                dom_box="#resource-alert .rg .scenic-box";
            }
            else if(ty==4){
                dom_tree="#resource-alert .lf .doc-tree";
                dom_box="#resource-alert .rg .doc-box";
            }
            else if(ty==5){
                dom_tree="#resource-alert .lf .model-tree";
                dom_box="#resource-alert .rg .model-box";
            }
            else if(ty==6){
                dom_tree="#resource-alert .lf .model2-tree";
                dom_box="#resource-alert .rg .model2-box";
            }
            else if(ty==8){
                dom_tree="#resource-alert .lf .texture-tree";
                dom_box="#resource-alert .rg .texture-box";
            }
            else if(ty==9){
                dom_tree="#resource-alert .lf .tietu-tree";
                dom_box="#resource-alert .rg .tietu-box";
            }
            else if(ty==10){
                dom_tree="#resource-alert .lf .sysImg-tree";
                dom_box="#resource-alert .rg .sysImg-box";
            }
            else if(ty==11){
                dom_tree="#resource-alert .lf .ailib-tree";
                dom_box="#resource-alert .rg .ailib-box";
            }
            else if(ty==20){
                dom_tree="#resource-alert .lf .sysMusic-tree";
                dom_box="#resource-alert .rg .sysMusic-box";
            }
            else if(ty==30){
                dom_tree="#resource-alert .lf .sysVideo-tree";
                dom_box="#resource-alert .rg .sysVideo-box";
            }
            else if(ty==50){
                dom_tree="#resource-alert .lf .sysModel-tree";
                dom_box="#resource-alert .rg .sysModel-box";
            }
            else if(ty==70){
                dom_tree="#resource-alert .lf .sysHdr-tree";
                dom_box="#resource-alert .rg .sysHdr-box";
            }
            else if(ty==80){
                dom_tree="#resource-alert .lf .sysTexture-tree";
                dom_box="#resource-alert .rg .sysTexture-box";
            }
            else if(ty==90){
                dom_tree="#resource-alert .lf .sysTietu-tree";
                dom_box="#resource-alert .rg .sysTietu-box";
            }
            else if(ty==107){
                dom_tree="#resource-alert .lf .staticHdr-tree";
                dom_box="#resource-alert .rg .staticHdr-box";
            }
            else if(ty==208){
                dom_tree="#resource-alert .lf .varTexture-tree";
                dom_box="#resource-alert .rg .varTexture-box";
            }
            return {"dom_tree":dom_tree,"dom_box":dom_box};
        },
        //分类列表
        getCls: function (obj) {
            var _this = this;
            let ty=obj.ty ? obj.ty : _this.data.cur_ty;
            if(obj.params && obj.params.pid != undefined && obj.params.pid==-1){
                obj.params.pid= "";
            }
            if(ty==121){ //全景分类
                _this.panoClsList(obj);
            }
            else if(ty==3){ //高清矩阵
                _this.scenicClsList(obj);
            }
            else if(ty==130){ //全景视频分类
                _this.panoVideoClsList(obj);
            }
            else if(ty==23030){ //图片
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.imgClsList(obj);
            }
            else if(ty==23031){ //视频
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.videoClsList(obj);
            }
            else if(ty==2){ //音乐
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.musicClsList(obj);
            }
            else if(ty==4){ //文档
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.docClsList(obj);
            }
            else if(ty==5){ //模型
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.modelClsList(obj);
            }
            else if(ty==6){ //模型-倾斜摄影
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.model2ClsList(obj);
            }
            else if(ty==8){ //材质
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.textureClsList(obj);
            }
            else if(ty==9){ //贴图
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.tietuClsList(obj);
            }
            else if(ty==10){ //公共图片
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.sysImgClsList(obj);
            }
            else if(ty==11){ //AI知识库
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.ailibClsList(obj);
            }
            else if(ty==20){ //公共音乐
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.sysMusicClsList(obj);
            }
            else if(ty==30){ //公共视频
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.sysVideoClsList(obj);
            }
            else if(ty==50){ //公共模型
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.sysModelClsList(obj);
            }
            else if(ty==70){ //公共Hdr
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.sysHdrClsList(obj);
            }
            else if(ty==80){ //公共材质
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.sysTextureClsList(obj);
            }
            else if(ty==90){ //公共贴图
                if(obj.params && obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.sysTietuClsList(obj);
            }
            else if(ty==107){ //staticHdr
                _this.staticHdrClsList(obj);
            }
            else if(ty==208){ //varTexture
                _this.varTextureClsList(obj);
            }
        },
        //列表
        getList: function (obj) {
            var _this = this;
            let ty= obj.ty ? obj.ty : _this.data.cur_ty;
            if(obj.params && obj.params.cid != undefined && obj.params.cid==-1){
                obj.params.cid= "";
            }
            if(ty==121){ //全景
                if(obj.params && obj.params.cid != undefined){
                    obj.params.category_id=obj.params.cid;
                    delete obj.params.cid;
                }
                $("#resource-alert .rg .pano-box .list").html(" ");
                _this.panoList(obj);
            }
            else if(ty==3){ //高清矩阵
                if(obj.params && obj.params.cid != undefined){
                    obj.params.category_id=obj.params.cid;
                    delete obj.params.cid;
                }
                $("#resource-alert .rg .scenic-box .list").html(" ");
                _this.scenicList(obj);
            }
            else if(ty==130){ //全景视频
                $("#resource-alert .rg .panoVideo-box .list").html(" ");
                _this.panoVideoList(obj);
            }
            else if(ty==23030){ //图片
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .img-box .list").html(" ");
                _this.imgList(obj);
            }
            else if(ty==23031){ //视频
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .video-box .list").html(" ");
                _this.videoList(obj);
            }
            else if(ty==2){ //音乐
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .music-box .list").html(" ");
                _this.musicList(obj);
            }            
            else if(ty==4){ //文档
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .doc-box .list").html(" ");
                _this.docList(obj);
            }
            else if(ty==5){ //模型
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .model-box .list").html(" ");
                _this.modelList(obj);
            }
            else if(ty==6){ //模型-倾斜摄影
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .model2-box .list").html(" ");
                _this.model2List(obj);
            }
            else if(ty==8){ //材质
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .texture-box .list").html(" ");
                _this.textureList(obj);
            }
            else if(ty==9){ //贴图
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .tietu-box .list").html(" ");
                _this.tietuList(obj);
            }
            else if(ty==10){ //公共图片
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .sysImg-box .list").html(" ");
                _this.sysImgList(obj);
            }
            else if(ty==11){ //AI知识库
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .ailib-box .list").html(" ");
                _this.ailibList(obj);
            }
            else if(ty==20){ //公共音乐
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .sysMusic-box .list").html(" ");
                _this.sysMusicList(obj);
            }
            else if(ty==30){ //公共视频
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .sysVideo-box .list").html(" ");
                _this.sysVideoList(obj);
            }
            else if(ty==50){ //公共模型
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .sysModel-box .list").html(" ");
                _this.sysModelList(obj);
            }
            else if(ty==70){ //公共Hdr
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .sysHdr-box .list").html(" ");
                _this.sysHdrList(obj);
            }
            else if(ty==80){ //公共材质
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .sysTexture-box .list").html(" ");
                _this.sysTextureList(obj);
            }
            else if(ty==90){ //公共贴图
                if(obj.params && obj.params.keyword != undefined){
                    obj.params.name=obj.params.keyword;
                    delete obj.params.keyword;
                }
                $("#resource-alert .rg .sysTietu-box .list").html(" ");
                _this.sysTietuList(obj);
            }
            else if(ty==107){ //staticHdr
                $("#resource-alert .rg .staticHdr-box .list").html(" ");
                _this.staticHdrList(obj);
            }
            else if(ty==208){ //varTexture
                $("#resource-alert .rg .varTexture-box .list").html(" ");
                _this.varTextureList(obj);
            }
        },

        //全景分类
        panoClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_panoCls=isInit ? null : _this.data.load_panoCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["121"]){
                params=$.extend({},_this.data.clsParams["121"],params);
            }
            _this.data.clsParams["121"]=params;
            // console.log(_this.data.clsParams);
            if(!_this.data.load_panoCls){
                _this.data.load_panoCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .pano-tree",
                    "url": '/Wasee/VRIndex/getPanoCategory',
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_panoCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_panoCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .pano-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .pano-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .pano-box .folder-box").show();
                            $("#resource-alert .rg .pano-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .pano-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .pano-box .folder-box").hide();
                        $("#resource-alert .rg .pano-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["121"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .pano-tree  .scroll").css({"height":"100%"});
                    _this.data.load_panoCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //全景
        panoList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_pano=isInit ? null : _this.data.load_pano;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["121"];
            }
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["121"]){
                params=$.extend({},_this.data.params["121"],params);
            }
            _this.data.params["121"]=params;
            if(!_this.data.load_pano){
                _this.data.load_pano=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .pano-box",
                    "url": '/Wasee/VRIndex/getPanoMediaList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":0},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.thumburl;
                        var status = curObj.status;
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        let tips="";
                        switch (status) {
                            case 0: //未上传完成
                                tips="未上传完成";
                                on="sta2";
                                break;
                            case 1: //正在处理
                                tips="正在处理";
                                on="sta1";
                                break;
                            case 2: //上传失败
                                tips="上传失败";
                                on="sta2";
                                break;
                            case 3:  //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["121"].push(id);
                                break;
                            case 4:  //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["121"].push(id);
                                break;
                            case 5: //成功
                                break;
                            case 6: //处理失败，提示重传
                                tips="处理失败";
                                on="sta2";
                                break;
                            case 7: //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["121"].push(id);
                                break;
                            default:  //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["121"].push(id);
                                break;
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">' + tips + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_pano=_this.data.load_pano.data.listData;
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .pano-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                        if(reData.unFinishedCount && reData.unFinishedCount>0){
                            setTimeout(function(){
                                //全景-状态轮询
                                _this.loop_pano({});
                            },2000);
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_pano.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_pano.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_pano=_this.data.load_pano.data.listData;
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .pano-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                    }
                });
            }
        },

        //全景视频分类
        panoVideoClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_panoVideoCls=isInit ? null : _this.data.load_panoVideoCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["130"]){
                params=$.extend({},_this.data.clsParams["130"],params);
            }
            _this.data.clsParams["130"]=params;
            if(!_this.data.load_panoVideoCls){
                _this.data.load_panoVideoCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .panoVideo-tree",
                    "url": '/Wasee/VRIndex/getPanoVideoCategory',
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_panoVideoCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_panoVideoCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .panoVideo-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .panoVideo-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .panoVideo-box .folder-box").show();
                            $("#resource-alert .rg .panoVideo-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .panoVideo-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .panoVideo-box .folder-box").hide();
                        $("#resource-alert .rg .panoVideo-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["130"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .panoVideo-tree  .scroll").css({"height":"100%"});
                    _this.data.load_panoVideoCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //全景视频
        panoVideoList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_panoVideo=isInit ? null : _this.data.load_panoVideo;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["130"];
            }
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["130"]){
                params=$.extend({},_this.data.params["130"],params);
            }
            _this.data.params["130"]=params;
            if(!_this.data.load_panoVideo){
                _this.data.load_panoVideo=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .panoVideo-box",
                    "url": '/Wasee/VRIndex/getPanoVideoList',
                    "listParams": {"pageIndex":1,"pageSize":30},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url;
                        var status = curObj.status;
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        let tips="";
                        switch (status) {
                            case 101: //处理中
                                tips="处理中";
                                on="sta2";
                                _this.data.unFinishedData["130"].push(id);
                                break;
                            case 203:
                                break;
                            case 204: //处理失败
                                tips="处理失败";
                                on="sta2";
                                break;
                            default:  //处理中
                                tips="处理中";
                                on="sta1";
                                break;
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">' + tips + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_panoVideo=_this.data.load_panoVideo.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .panoVideo-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                        if(reData.unFinishedCount && reData.unFinishedCount>0){
                            setTimeout(function(){
                                //全景视频-状态轮询
                                _this.loop_panoVideo({});
                            },2000);
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_panoVideo.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_panoVideo.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_panoVideo=_this.data.load_panoVideo.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .panoVideo-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                    }
                });
            }
        },

        //图片分类
        imgClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_imgCls=isInit ? null : _this.data.load_imgCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["23030"]){
                params=$.extend({},_this.data.clsParams["23030"],params);
            }
            _this.data.clsParams["23030"]=params;
            if(!_this.data.load_imgCls){
                _this.data.load_imgCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .img-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":1},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_imgCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_imgCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .img-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .img-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .img-box .folder-box").show();
                            $("#resource-alert .rg .img-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .img-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .img-box .folder-box").hide();
                        $("#resource-alert .rg .img-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["23030"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .img-tree  .scroll").css({"height":"100%"});
                    _this.data.load_imgCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //图片
        imgList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_img=isInit ? null : _this.data.load_img;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["23030"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["23030"]){
                params=$.extend({},_this.data.params["23030"],params); 
            }
            _this.data.params["23030"]=params;
            if(!_this.data.load_img){
                _this.data.load_img=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .img-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":1},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.url.indexOf(".ico") >-1 ? curObj.url : curObj.url+'?x-oss-process=image/resize,l_400';
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_img=_this.data.load_img.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .img-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .img-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_img.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_img.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_img=_this.data.load_img.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .img-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .img-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //视频分类
        videoClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_videoCls=isInit ? null : _this.data.load_videoCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["23031"]){
                params=$.extend({},_this.data.clsParams["23031"],params);
            }
            _this.data.clsParams["23031"]=params;
            if(!_this.data.load_videoCls){
                _this.data.load_videoCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .video-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":3},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_videoCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_videoCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .video-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .video-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .video-box .folder-box").show();
                            $("#resource-alert .rg .video-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .video-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .video-box .folder-box").hide();
                        $("#resource-alert .rg .video-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["23031"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .video-tree  .scroll").css({"height":"100%"});
                    _this.data.load_videoCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //视频
        videoList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_video=isInit ? null : _this.data.load_video;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["23031"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["23031"]){
                params=$.extend({},_this.data.params["23031"],params);
            }
            _this.data.params["23031"]=params;
            if(!_this.data.load_video){
                _this.data.load_video=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .video-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":3},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url;
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_video=_this.data.load_video.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .video-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .video-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_video.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_video.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_video=_this.data.load_video.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .video-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .video-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //音乐分类
        musicClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_musicCls=isInit ? null : _this.data.load_musicCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["2"]){
                params=$.extend({},_this.data.clsParams["2"],params);
            }
            _this.data.clsParams["2"]=params;
            if(!_this.data.load_musicCls){
                _this.data.load_musicCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .music-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":2},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_musicCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_musicCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .music-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .music-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .music-box .folder-box").show();
                            $("#resource-alert .rg .music-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .music-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .music-box .folder-box").hide();
                        $("#resource-alert .rg .music-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["2"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .music-tree  .scroll").css({"height":"100%"});
                    _this.data.load_musicCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //音乐
        musicList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_music=isInit ? null : _this.data.load_music;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["2"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["2"]){
                params=$.extend({},_this.data.params["2"],params);
            }
            _this.data.params["2"]=params;
            if(!_this.data.load_music){
                _this.data.load_music=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .music-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":2},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url;
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="trpm-flex-y info">' +
                                                '<div class="trpm-flex-y tl">' +
                                                    '<i class="trpm-iconfont icon_kaishi music-play"></i>'+
                                                    '<div class="name">' + name + '</div>' +
                                                '</div>' +
                                                '<div class="bk"></div>' +
                                                '<div class="gou"></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_music=_this.data.load_music.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .music-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .music-tree  .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_music.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_music.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_music=_this.data.load_music.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .music-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .music-tree  .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //高清矩阵分类
        scenicClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_scenicCls=isInit ? null : _this.data.load_scenicCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["3"]){
                params=$.extend({},_this.data.clsParams["3"],params);
            }
            _this.data.clsParams["3"]=params;
            if(!_this.data.load_scenicCls){
                _this.data.load_scenicCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .scenic-tree",
                    "url": '/Wasee/VRIndex/getPanoCategory',
                    "listParams": {"type":1},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_scenicCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_scenicCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .scenic-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .scenic-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .scenic-box .folder-box").show();
                            $("#resource-alert .rg .scenic-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .scenic-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .scenic-box .folder-box").hide();
                        $("#resource-alert .rg .scenic-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["3"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .scenic-tree  .scroll").css({"height":"100%"});
                    _this.data.load_scenicCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //高清矩阵
        scenicList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_scenic=isInit ? null : _this.data.load_scenic;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["3"];
            }
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["3"]){
                params=$.extend({},_this.data.params["3"],params);
            }
            _this.data.params["3"]=params;
            if(!_this.data.load_scenic){
                _this.data.load_scenic=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .scenic-box",
                    "url": '/Wasee/VRIndex/getPanoMediaList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":1},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.thumburl;
                        var status = curObj.status;
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        let tips="";
                        switch (status) {
                            case 0: //未上传完成
                                tips="未上传完成";
                                on="sta2";
                                break;
                            case 1: //正在处理
                                tips="正在处理";
                                on="sta1";
                                break;
                            case 2: //上传失败
                                tips="上传失败";
                                on="sta2";
                                break;
                            case 3:  //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["3"].push(id);
                                break;
                            case 4:  //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["3"].push(id);
                                break;
                            case 5: //成功
                                break;
                            case 6: //处理失败，提示重传
                                tips="处理失败";
                                on="sta2";
                                break;
                            case 7: //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["3"].push(id);
                                break;
                            default:  //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["3"].push(id);
                                break;
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">' + tips + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_scenic=_this.data.load_scenic.data.listData;
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .scenic-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                        if(reData.unFinishedCount && reData.unFinishedCount>0){
                            setTimeout(function(){
                                //矩阵-状态轮询
                                _this.loop_scenic({});
                            },2000);
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_scenic.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_scenic.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_scenic=_this.data.load_scenic.data.listData;
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .scenic-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                    }
                });
            }
        },

        //文档分类
        docClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_docCls=isInit ? null : _this.data.load_docCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["4"]){
                params=$.extend({},_this.data.clsParams["4"],params);
            }
            _this.data.clsParams["4"]=params;
            // console.log(_this.data.clsParams);
            if(!_this.data.load_docCls){
                _this.data.load_docCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .doc-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":4},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_docCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_docCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .doc-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .doc-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .doc-box .folder-box").show();
                            $("#resource-alert .rg .doc-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .doc-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .doc-box .folder-box").hide();
                        $("#resource-alert .rg .doc-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["4"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .doc-tree  .scroll").css({"height":"100%"});
                    _this.data.load_docCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //文档
        docList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_doc=isInit ? null : _this.data.load_doc;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["4"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["4"]){
                params=$.extend({},_this.data.params["4"],params);
            }
            _this.data.params["4"]=params;
            if(!_this.data.load_doc){
                _this.data.load_doc=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .doc-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":4},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var ext = curObj.ext;
                        let img_url=paramObj.resourcePublic+'/trpm/resource/img/pdf.png';
                        if(ext.includes('doc')){
                            img_url=paramObj.resourcePublic+'/trpm/resource/img/word.png';
                        }
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');background-size: 40%;">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_doc=_this.data.load_doc.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .doc-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .doc-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_doc.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_doc.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_doc=_this.data.load_doc.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .doc-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .doc-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //模型分类
        modelClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_modelCls=isInit ? null : _this.data.load_modelCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["5"]){
                params=$.extend({},_this.data.clsParams["5"],params);
            }
            _this.data.clsParams["5"]=params;
            // console.log(_this.data.clsParams);
            if(!_this.data.load_modelCls){
                _this.data.load_modelCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .model-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":5},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_modelCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_modelCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .model-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .model-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .model-box .folder-box").show();
                            $("#resource-alert .rg .model-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .model-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .model-box .folder-box").hide();
                        $("#resource-alert .rg .model-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["5"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .model-tree  .scroll").css({"height":"100%"});
                    _this.data.load_modelCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //模型
        modelList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_model=isInit ? null : _this.data.load_model;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["5"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["5"]){
                params=$.extend({},_this.data.params["5"],params);
            }
            _this.data.params["5"]=params;
            if(!_this.data.load_model){
                _this.data.load_model=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .model-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":5},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var ext = curObj.ext;
                        let img_url=curObj.cover_url;
                        var status = curObj.status;
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        let tips="";
                        switch (status) {
                            case "1": //成功
                                tips="成功";
                                break;
                            case "2": //上传失败
                                tips="上传失败";
                                on="sta2";
                                break;
                            default:  //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["5"].push(id);
                                break;
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');background-size: cover;">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">' + tips + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_model=_this.data.load_model.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .model-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .model-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                        if(reData.unFinishedCount && reData.unFinishedCount>0){
                            setTimeout(function(){
                                //全景-状态轮询
                                _this.loop_model({});
                            },2000);
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_model.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_model.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_model=_this.data.load_model.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .model-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .model-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //模型分类-倾斜摄影
        model2ClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_model2Cls=isInit ? null : _this.data.load_model2Cls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["6"]){
                params=$.extend({},_this.data.clsParams["6"],params);
            }
            _this.data.clsParams["6"]=params;
            // console.log(_this.data.clsParams);
            if(!_this.data.load_model2Cls){
                _this.data.load_model2Cls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .model2-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":6},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_model2Cls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_model2Cls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .model2-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .model2-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .model2-box .folder-box").show();
                            $("#resource-alert .rg .model2-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .model2-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .model2-box .folder-box").hide();
                        $("#resource-alert .rg .model2-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["6"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .model2-tree  .scroll").css({"height":"100%"});
                    _this.data.load_model2Cls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //模型-倾斜摄影
        model2List: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_model2=isInit ? null : _this.data.load_model2;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["6"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["6"]){
                params=$.extend({},_this.data.params["6"],params);
            }
            _this.data.params["6"]=params;
            if(!_this.data.load_model2){
                _this.data.load_model2=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .model2-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":6},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var ext = curObj.ext;
                        let img_url=curObj.cover_url;
                        var status = curObj.status;
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        let tips="";
                        switch (status) {
                            case "1": //成功
                                tips="成功";
                                break;
                            case "2": //上传失败
                                tips="上传失败";
                                on="sta2";
                                break;
                            default:  //处理中
                                tips="处理中";
                                on="sta1";
                                _this.data.unFinishedData["6"].push(id);
                                break;
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');background-size: cover;">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">' + tips + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_model2=_this.data.load_model2.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .model2-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .model2-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                        if(reData.unFinishedCount && reData.unFinishedCount>0){
                            setTimeout(function(){
                                //全景-状态轮询
                                _this.loop_model2({});
                            },2000);
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_model2.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_model2.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_model2=_this.data.load_model2.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .model2-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .model2-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //材质分类
        textureClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_textureCls=isInit ? null : _this.data.load_textureCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["8"]){
                params=$.extend({},_this.data.clsParams["8"],params);
            }
            _this.data.clsParams["8"]=params;
            if(!_this.data.load_textureCls){
                _this.data.load_textureCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .texture-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":8},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_textureCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_textureCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .texture-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .texture-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .texture-box .folder-box").show();
                            $("#resource-alert .rg .texture-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .texture-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .texture-box .folder-box").hide();
                        $("#resource-alert .rg .texture-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["8"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .texture-tree  .scroll").css({"height":"100%"});
                    _this.data.load_textureCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //材质
        textureList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_texture=isInit ? null : _this.data.load_texture;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["8"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["8"]){
                params=$.extend({},_this.data.params["8"],params);
            }
            _this.data.params["8"]=params;
            if(!_this.data.load_texture){
                _this.data.load_texture=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .texture-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":8},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url;
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li li2 '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye trpm-none"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_texture=_this.data.load_texture.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .texture-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .texture-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_texture.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_texture.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_texture=_this.data.load_texture.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .texture-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .texture-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //贴图分类
        tietuClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_tietuCls=isInit ? null : _this.data.load_tietuCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["9"]){
                params=$.extend({},_this.data.clsParams["9"],params);
            }
            _this.data.clsParams["9"]=params;
            if(!_this.data.load_tietuCls){
                _this.data.load_tietuCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .tietu-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":9},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_tietuCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_tietuCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .tietu-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .tietu-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .tietu-box .folder-box").show();
                            $("#resource-alert .rg .tietu-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .tietu-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .tietu-box .folder-box").hide();
                        $("#resource-alert .rg .tietu-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["9"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .tietu-tree  .scroll").css({"height":"100%"});
                    _this.data.load_tietuCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //贴图
        tietuList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_tietu=isInit ? null : _this.data.load_tietu;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["9"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["9"]){
                params=$.extend({},_this.data.params["9"],params); 
            }
            _this.data.params["9"]=params;
            if(!_this.data.load_tietu){
                _this.data.load_tietu=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .tietu-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":9},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.url+'?x-oss-process=image/resize,l_400';
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_tietu=_this.data.load_tietu.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .tietu-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .tietu-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_tietu.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_tietu.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_tietu=_this.data.load_tietu.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .tietu-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .tietu-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //公共图片分类
        sysImgClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysImgCls=isInit ? null : _this.data.load_sysImgCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["10"]){
                params=$.extend({},_this.data.clsParams["10"],params);
            }
            _this.data.clsParams["10"]=params;
            if(!_this.data.load_sysImgCls){
                _this.data.load_sysImgCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .sysImg-tree",
                    "url": '/Wasee/Base/getPublicResourceCategoryList',
                    "listParams": {"type":1},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysImgCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysImgCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .sysImg-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .sysImg-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .sysImg-box .folder-box").show();
                            $("#resource-alert .rg .sysImg-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .sysImg-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .sysImg-box .folder-box").hide();
                        $("#resource-alert .rg .sysImg-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["10"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .sysImg-tree  .scroll").css({"height":"100%"});
                    _this.data.load_sysImgCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //公共图片
        sysImgList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysImg=isInit ? null : _this.data.load_sysImg;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["10"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["10"]){
                params=$.extend({},_this.data.params["10"],params); 
            }
            _this.data.params["10"]=params;
            if(!_this.data.load_sysImg){
                _this.data.load_sysImg=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .sysImg-box",
                    "url": '/Wasee/Base/getPublicResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":1},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.url ? curObj.url+'?x-oss-process=image/resize,l_400' : _this.data.resourceWasee+'/metaverse/img/empty_img.png';
                        let bk_size= curObj.cover_url ? '':'background-size: 50%;';
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');'+bk_size+'">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';

                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysImg=_this.data.load_sysImg.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysImg-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysImg-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysImg.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysImg.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysImg=_this.data.load_sysImg.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysImg-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysImg-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //公共视频分类
        sysVideoClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysVideoCls=isInit ? null : _this.data.load_sysVideoCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["30"]){
                params=$.extend({},_this.data.clsParams["30"],params);
            }
            _this.data.clsParams["30"]=params;
            if(!_this.data.load_sysVideoCls){
                _this.data.load_sysVideoCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .sysVideo-tree",
                    "url": '/Wasee/Base/getPublicResourceCategoryList',
                    "listParams": {"type":3},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysVideoCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysVideoCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .sysVideo-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .sysVideo-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .sysVideo-box .folder-box").show();
                            $("#resource-alert .rg .sysVideo-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .sysVideo-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .sysVideo-box .folder-box").hide();
                        $("#resource-alert .rg .sysVideo-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["30"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .sysVideo-tree  .scroll").css({"height":"100%"});
                    _this.data.load_sysVideoCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //公共视频
        sysVideoList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysVideo=isInit ? null : _this.data.load_sysVideo;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["30"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["30"]){
                params=$.extend({},_this.data.params["30"],params); 
            }
            _this.data.params["30"]=params;
            if(!_this.data.load_sysVideo){
                _this.data.load_sysVideo=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .sysVideo-box",
                    "url": '/Wasee/Base/getPublicResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":3},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url ? curObj.cover_url+'?x-oss-process=image/resize,l_400' : _this.data.resourceWasee+'/metaverse/img/empty_img.png';
                        let bk_size= curObj.cover_url ? '':'background-size: 50%;';
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');'+bk_size+'">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';

                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysVideo=_this.data.load_sysVideo.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysVideo-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysVideo-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysVideo.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysVideo.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysVideo=_this.data.load_sysVideo.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysVideo-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysVideo-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //公共音乐分类
        sysMusicClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysMusicCls=isInit ? null : _this.data.load_sysMusicCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["20"]){
                params=$.extend({},_this.data.clsParams["20"],params);
            }
            _this.data.clsParams["20"]=params;
            if(!_this.data.load_sysMusicCls){
                _this.data.load_sysMusicCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .sysMusic-tree",
                    "url": '/Wasee/Base/getPublicResourceCategoryList',
                    "listParams": {"type":2},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysMusicCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysMusicCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .sysMusic-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .sysMusic-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .sysMusic-box .folder-box").show();
                            $("#resource-alert .rg .sysMusic-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .sysMusic-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .sysMusic-box .folder-box").hide();
                        $("#resource-alert .rg .sysMusic-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["20"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .sysMusic-tree  .scroll").css({"height":"100%"});
                    _this.data.load_sysMusicCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //公共音乐
        sysMusicList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysMusic=isInit ? null : _this.data.load_sysMusic;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["20"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["20"]){
                params=$.extend({},_this.data.params["20"],params); 
            }
            _this.data.params["20"]=params;
            if(!_this.data.load_sysMusic){
                _this.data.load_sysMusic=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .sysMusic-box",
                    "url": '/Wasee/Base/getPublicResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":2},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url;
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="trpm-flex-y info">' +
                                                '<div class="trpm-flex-y tl">' +
                                                    '<i class="trpm-iconfont icon_kaishi music-play"></i>'+
                                                    '<div class="name">' + name + '</div>' +
                                                '</div>' +
                                                '<div class="bk"></div>' +
                                                '<div class="gou"></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysMusic=_this.data.load_sysMusic.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysMusic-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysMusic-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysMusic.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysMusic.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysMusic=_this.data.load_sysMusic.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysMusic-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysMusic-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //公共Hdr分类
        sysHdrClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysHdrCls=isInit ? null : _this.data.load_sysHdrCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["70"]){
                params=$.extend({},_this.data.clsParams["70"],params);
            }
            _this.data.clsParams["70"]=params;
            if(!_this.data.load_sysHdrCls){
                _this.data.load_sysHdrCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .sysHdr-tree",
                    "url": '/Wasee/Base/getPublicResourceCategoryList',
                    "listParams": {"type":7},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysHdrCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysHdrCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .sysHdr-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .sysHdr-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .sysHdr-box .folder-box").show();
                            $("#resource-alert .rg .sysHdr-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .sysHdr-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .sysHdr-box .folder-box").hide();
                        $("#resource-alert .rg .sysHdr-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["70"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .sysHdr-tree  .scroll").css({"height":"100%"});
                    _this.data.load_sysHdrCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //公共Hdr
        sysHdrList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysHdr=isInit ? null : _this.data.load_sysHdr;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["70"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["70"]){
                params=$.extend({},_this.data.params["70"],params); 
            }
            _this.data.params["70"]=params;
            if(!_this.data.load_sysHdr){
                _this.data.load_sysHdr=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .sysHdr-box",
                    "url": '/Wasee/Base/getPublicResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":7},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url ? curObj.cover_url+'?x-oss-process=image/resize,l_400' : _this.data.resourceWasee+'/metaverse/img/empty_img.png';
                        let bk_size= curObj.cover_url ? '':'background-size: 50%;';
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');'+bk_size+'">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';

                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysHdr=_this.data.load_sysHdr.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysHdr-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysHdr-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysHdr.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysHdr.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysHdr=_this.data.load_sysHdr.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysHdr-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysHdr-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //公共模型分类
        sysModelClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysModelCls=isInit ? null : _this.data.load_sysModelCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["50"]){
                params=$.extend({},_this.data.clsParams["50"],params);
            }
            _this.data.clsParams["50"]=params;
            console.log(_this.data.clsParams,params);
            if(!_this.data.load_sysModelCls){
                _this.data.load_sysModelCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .sysModel-tree",
                    "url": '/Wasee/Base/getPublicResourceCategoryList',
                    "listParams": {"type":5},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysModelCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysModelCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .sysModel-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .sysModel-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .sysModel-box .folder-box").show();
                            $("#resource-alert .rg .sysModel-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .sysModel-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .sysModel-box .folder-box").hide();
                        $("#resource-alert .rg .sysModel-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["50"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .sysModel-tree  .scroll").css({"height":"100%"});
                    _this.data.load_sysModelCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //公共模型
        sysModelList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysModel=isInit ? null : _this.data.load_sysModel;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["50"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["50"]){
                params=$.extend({},_this.data.params["50"],params); 
            }
            _this.data.params["50"]=params;
            if(!_this.data.load_sysModel){
                _this.data.load_sysModel=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .sysModel-box",
                    "url": '/Wasee/Base/getPublicResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":5},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url ? curObj.cover_url+'?x-oss-process=image/resize,l_400' : _this.data.resourceWasee+'/metaverse/img/empty_img.png';
                        let bk_size= curObj.cover_url ? '':'background-size: 50%;';
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');background-size: contain;'+bk_size+'">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';

                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysModel=_this.data.load_sysModel.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysModel-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysModel-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysModel.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysModel.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysModel=_this.data.load_sysModel.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysModel-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysModel-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //公共材质分类
        sysTextureClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysTextureCls=isInit ? null : _this.data.load_sysTextureCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["80"]){
                params=$.extend({},_this.data.clsParams["80"],params);
            }
            _this.data.clsParams["80"]=params;
            console.log(_this.data.clsParams,params);
            if(!_this.data.load_sysTextureCls){
                _this.data.load_sysTextureCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .sysTexture-tree",
                    "url": '/Wasee/Base/getPublicResourceCategoryList',
                    "listParams": {"type":8},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysTextureCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysTextureCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .sysTexture-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .sysTexture-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .sysTexture-box .folder-box").show();
                            $("#resource-alert .rg .sysTexture-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .sysTexture-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .sysTexture-box .folder-box").hide();
                        $("#resource-alert .rg .sysTexture-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["80"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .sysTexture-tree  .scroll").css({"height":"100%"});
                    _this.data.load_sysTextureCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //公共材质
        sysTextureList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysTexture=isInit ? null : _this.data.load_sysTexture;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["80"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["80"]){
                params=$.extend({},_this.data.params["80"],params); 
            }
            _this.data.params["80"]=params;
            if(!_this.data.load_sysTexture){
                _this.data.load_sysTexture=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .sysTexture-box",
                    "url": '/Wasee/Base/getPublicResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":8},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url ? curObj.cover_url+'?x-oss-process=image/resize,l_400' : _this.data.resourceWasee+'/metaverse/img/empty_img.png';
                        let bk_size= curObj.cover_url ? '':'background-size: 50%;';
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li li2 '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');background-size: contain;'+bk_size+'">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye trpm-none"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';

                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysTexture=_this.data.load_sysTexture.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysTexture-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysTexture-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysTexture.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysTexture.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysTexture=_this.data.load_sysTexture.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysTexture-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysTexture-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //公共贴图分类
        sysTietuClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysTietuCls=isInit ? null : _this.data.load_sysTietuCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["90"]){
                params=$.extend({},_this.data.clsParams["90"],params);
            }
            _this.data.clsParams["90"]=params;
            if(!_this.data.load_sysTietuCls){
                _this.data.load_sysTietuCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .sysTietu-tree",
                    "url": '/Wasee/Base/getPublicResourceCategoryList',
                    "listParams": {"type":9},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysTietuCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysTietuCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .sysTietu-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .sysTietu-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .sysTietu-box .folder-box").show();
                            $("#resource-alert .rg .sysTietu-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .sysTietu-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .sysTietu-box .folder-box").hide();
                        $("#resource-alert .rg .sysTietu-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["90"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .sysTietu-tree  .scroll").css({"height":"100%"});
                    _this.data.load_sysTietuCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //公共贴图
        sysTietuList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_sysTietu=isInit ? null : _this.data.load_sysTietu;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["90"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["90"]){
                params=$.extend({},_this.data.params["90"],params); 
            }
            _this.data.params["90"]=params;
            if(!_this.data.load_sysTietu){
                _this.data.load_sysTietu=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .sysTietu-box",
                    "url": '/Wasee/Base/getPublicResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":9},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.url ? curObj.url+'?x-oss-process=image/resize,l_400' : _this.data.resourceWasee+'/metaverse/img/empty_img.png';
                        let bk_size= curObj.cover_url ? '':'background-size: 50%;';
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');'+bk_size+'">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';

                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysTietu=_this.data.load_sysTietu.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysTietu-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysTietu-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysTietu.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_sysTietu.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_sysTietu=_this.data.load_sysTietu.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .sysTietu-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            // $("#resource-alert .lf .sysTietu-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //staticHdr分类
        staticHdrClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            // let isInit=obj.isInit ? obj.isInit : false;
            // _this.data.load_staticHdrCls=isInit ? null : _this.data.load_staticHdrCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["107"]){
                params=$.extend({},_this.data.clsParams["107"],params);
            }
            _this.data.clsParams["107"]=params;
            if(_this.data.data_staticHdr){
                formatData();
            }
            else{
                trpm.ajax({
                    "isPromise":true,
                    "type":"post",
                    "url": _this.data.resourceWasee+'/public/json/hdr.json?ver='+new Date().getTime(),
                    "dataType": 'json',
                    "params":params
                })
                .then(function (response) {
                    console.log(response);
                    let bkData = response.data;
                    let {status,data:reData}=bkData;
                    let sumCount=0;
                    if (status == 1) {
                        _this.data.data_staticHdrJson=reData;
                        _this.data.data_staticHdr={};
                        sumCount = reData.list.length;
                        reData.list.forEach(item=> {
                            _this.data.data_staticHdr[item.id]=item;
                        })
                        $("#resource-alert .lf .staticHdr-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(sumCount);
                        formatData();
                    }                    
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
            

            function formatData(){
                layer.closeAll('loading');
                let list=_this.data.data_staticHdrJson.group;
                if(params.pid && params.pid>0){
                    list=_this.data.data_staticHdrJson.group.filter(item=>{
                        return item.pid==params.pid;
                    });
                }

                var sumCount=0;
                var listHtml = "",listHtml2 = "";
                var cou = list.length;
                list.forEach(item=>{
                    let {id,name,count}=item;
                    sumCount+=Number(count);
                    var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                        '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                            '<div class="tl-lf">'+
                                                '<i class="folder"></i>'+
                                                '<span class="txt">' + name + '</span>'+
                                            '</div>'+
                                            '<div class="tl-rg">'+
                                                '<span class="cou">' + count + '</span>'+
                                            '</div>'+
                                            '<div class="striped trpm-none" style></div>'+
                                        '</div>'+
                                        '<div class="tree-ul" pid="'+ id +'">'+
                                        '</div>'+
                                    '</div>';
                    var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                        '<div class="m">'+
                                            '<div class="img"></div>'+
                                            '<div class="info">'+
                                                '<div class="name">'+ name +'</div>'+
                                                '<div class="cou">'+ count +'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';
                    listHtml += tempHtml;
                    listHtml2 += tempHtml2;
                })
                if (cou > 0) {
                    if(lf){
                        $(dom).append(listHtml);
                    }
                    if(rg){
                        $("#resource-alert .rg .staticHdr-box .bti[data-ty=folder] .cou").text(cou);
                        $("#resource-alert .rg .staticHdr-box .folder-ul").html(listHtml2);
                        $("#resource-alert .rg .staticHdr-box .folder-box").show();
                        $("#resource-alert .rg .staticHdr-box .bti[data-ty=file]").show();
                    }
                }
                else{
                    $("#resource-alert .rg .staticHdr-box .folder-box .bti .cou").text(0);
                    $("#resource-alert .rg .staticHdr-box .folder-box").hide();
                    $("#resource-alert .rg .staticHdr-box .bti[data-ty=file]").hide();
                }

                if(_this.data.lf["107"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .staticHdr-tree  .scroll").css({"height":"100%"});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":{"status":1,"data":list},"sumCount":sumCount});
                }
            }
        },
        //staticHdr
        staticHdrList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_staticHdr=isInit ? null : _this.data.load_staticHdr;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["107"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["107"]){
                params=$.extend({},_this.data.params["107"],params); 
            }
            _this.data.params["107"]=params;
            formatData();
            function formatData(){
                layer.closeAll('loading');
                console.log(_this.data.data_staticHdrJson);
                let list=_this.data.data_staticHdrJson.list;
                if(params.cid && params.cid>0){
                    list=_this.data.data_staticHdrJson.list.filter(item=>{
                        return item.cid==params.cid;
                    });
                }

                if(params.keyword && params.keyword!=""){
                    list=list.filter(item=>{    
                        return item.name.indexOf(params.keyword)>-1;
                    });
                }

                var listHtml = "";
                var cou = list.length;
                list.forEach(item=>{
                    let {id,name,cover_url:img_url}=item;
                    var on="",atr="0";
                    if($.inArray(id.toString(), ids)>-1){ 
                        on="no",atr="1";
                    }
                    var tempHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                    '<div class="m">' +
                                        '<div class="img" style="background-image: url(' + img_url + ')">' +
                                            '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                        '</div>' +
                                        '<div class="bk"></div>' +
                                        '<div class="gou"></div>' +
                                        '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                        '<div class="name">' + name + '</div>' +
                                    '</div>' +
                                '</div>';
                    listHtml += tempHtml;
                })
                $("#resource-alert .rg .staticHdr-box .list").html(listHtml);
            }
        },

        //varTexture分类
        varTextureClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["208"]){
                params=$.extend({},_this.data.clsParams["208"],params);
            }
            _this.data.clsParams["208"]=params;
            if(_this.data.data_varTexture){
                formatData();
            }
            else{
                let list=_this.data.data_json[208];
                _this.data.data_varTexture={};
                let sumCount = list.length;
                list.forEach(item=> {
                    _this.data.data_varTexture[item.id]=item;
                })
                $("#resource-alert .lf .varTexture-tree  .tree-uls .tree-tl[data-id=-1] .cou").html(sumCount);
                formatData(); 
            }

            function formatData(){
                if(_this.data.lf["208"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .varTexture-tree  .scroll").css({"height":"100%"});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":{"status":1,"data":null},"sumCount":0});
                }
            }
        },
        //varTexture
        varTextureList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_varTexture=isInit ? null : _this.data.load_varTexture;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["208"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["208"]){
                params=$.extend({},_this.data.params["208"],params); 
            }
            _this.data.params["208"]=params;
            formatData();
            function formatData(){
                layer.closeAll('loading');
                console.log(_this.data.data_json[208]);
                let list=_this.data.data_json[208];
                // if(params.cid && params.cid>0){
                //     list=_this.data.data_json[208].list.filter(item=>{
                //         return item.cid==params.cid;
                //     });
                // }

                if(params.keyword && params.keyword!=""){
                    list=list.filter(item=>{    
                        return item.name.indexOf(params.keyword)>-1;
                    });
                }

                var listHtml = "";
                var cou = list.length;
                list.forEach(item=>{
                    let {id,name,title,base64}=item;
                    img_url=base64 ? base64 : _this.data.resourceWasee+'/metaverse/img/29.png';
                    var on="",atr="0";
                    if($.inArray(id.toString(), ids)>-1){ 
                        on="no",atr="1";
                    }
                    var tempHtml ='<div class="li li2 '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                    '<div class="m">' +
                                        '<div class="img" style="background-image: url(' + img_url + ')">' +
                                            '<!--<img src="' + img_url + '" alt="'+title+'">-->' +
                                        '</div>' +
                                        '<div class="bk"></div>' +
                                        '<div class="gou"></div>' +
                                        '<div class="eye trpm-none"><i class="trpm-iconfont icon_preview"></i></div>' +
                                        '<div class="name">' + title + '</div>' +
                                    '</div>' +
                                '</div>';
                    listHtml += tempHtml;
                })
                $("#resource-alert .rg .varTexture-box .list").html(listHtml);
            }
        },

        //AI知识库分类
        ailibClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_ailibCls=isInit ? null : _this.data.load_ailibCls;
            let params=obj.params ? obj.params : {};
            if(_this.data.clsParams && _this.data.clsParams["11"]){
                params=$.extend({},_this.data.clsParams["11"],params);
            }
            _this.data.clsParams["11"]=params;
            // console.log(_this.data.clsParams);
            if(!_this.data.load_ailibCls){
                _this.data.load_ailibCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .ailib-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":10},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        layer.closeAll('loading');
                        formatData(bkData);
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_ailibCls.list_data({
                    "params":params,
                });
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_ailibCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                layer.closeAll('loading');
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="trpm-iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img"></div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .ailib-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .ailib-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .ailib-box .folder-box").show();
                            $("#resource-alert .rg .ailib-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .ailib-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .ailib-box .folder-box").hide();
                        $("#resource-alert .rg .ailib-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }

                if(_this.data.lf["4"]){
                    $("#resource-alert .lf").removeClass("trpm-none");
                    $("#resource-alert .lf .ailib-tree  .scroll").css({"height":"100%"});
                    _this.data.load_ailibCls.scrollBar({});
                }
                else{
                    $("#resource-alert .lf").addClass("trpm-none");
                }

                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //AI知识库
        ailibList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_ailib=isInit ? null : _this.data.load_ailib;
            let ids=[];
            if(Array.isArray(_this.data.ids)) {
        　　　　ids=_this.data.ids;
        　　}
            else if(typeof _this.data.ids =="object"){
                ids=_this.data.ids["11"];
            }
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(_this.data.params && _this.data.params["1"]){
                params=$.extend({},_this.data.params["11"],params);
            }
            _this.data.params["11"]=params;
            if(!_this.data.load_ailib){
                _this.data.load_ailib=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .ailib-box",
                    "url": '/Wasee/VRIndex/getLiveLibList',
                    "listParams": {"pageIndex":1,"pageSize":30},
                    "format_callBack": function(bkData){
                        console.log(bkData);
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        let img_url=paramObj.resourcePublic+'/trpm/resource/img/lib.png';
                        var on="",atr="0";
                        if($.inArray(id.toString(), ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ');background-size: 40%;">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye trpm-none"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_ailib=_this.data.load_ailib.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .ailib-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .ailib-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_ailib.scroll_data({"params":params});
            }
            else{
                layer.load(1,{shade:[0.5,'#000']});
                _this.data.load_ailib.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_ailib=_this.data.load_ailib.data.listData; 
                        layer.closeAll('loading');
                        if (_this.data.cls_load==false) {
                            _this.data.cls_load=true;
                            $("#resource-alert .lf .ailib-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .ailib-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },

        //查看全景
        eyePano: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.title;
            $("#eye-pano-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-pano-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box" id="eye-pano-box">'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xtips">'+obj.width+'*'+obj.height+' | '+obj.file_size+' | '+obj.format+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-pano-alert").show();

            loadPano();

            $("#eye-pano-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                $("#eye-pano-alert").remove();
            })

            function loadPano(){
                var config_myserver = _this.data.myserver;
                var config_mypath = _this.data.resourceWasee+"/home/krpano";
                var xml_url=location.protocol+"//"+location.host+"/Wasee/VRIndex/doGetMediaPreviewXml?id="+id;
                if(_this.data.clsParams && _this.data.clsParams[121] && _this.data.clsParams[121].pano_vkey){
                    xml_url+="&pano_vkey="+_this.data.clsParams[121].pano_vkey;
                    xml_url+="&pano_type="+_this.data.clsParams[121].pano_type;
                }
                embedpano({
                    html5: "auto",
                    target: "eye-pano-box",
                    xml: xml_url,
                    wmode: "opaque",
                    passQueryParameters: true,
                    initvars: {
                        mypath: config_mypath,
                        time: "20161009",
                        myserver: config_myserver
                    }
                });
            }
        },
        //查看全景视频
        eyePanoVideo: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.name;
            var cover_url=obj.cover_url;
            var videoObj=obj.video;
            var video_url=videoObj._2K
            video_url= videoObj._4K ? videoObj._4K : video_url;
            video_url= videoObj.high ? videoObj.high : video_url;
            video_url= videoObj.smooth ? videoObj.smooth : video_url;
            video_url= videoObj.super ? videoObj.super : video_url;
            video_url= videoObj.original ? videoObj.original : video_url;
            $("#eye-panoVideo-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-panoVideo-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box" id="eye-panoVideo-box">'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xtips">'+obj.width+'*'+obj.height+' | '+obj.file_size+' | '+obj.format+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-panoVideo-alert").show();
            $("#eye-panoVideo-alert .m-d .rg .eye-box").css({"width":$("#eye-panoVideo-alert .m-d .rg").width(),"height":$("#eye-panoVideo-alert .m-d .rg").height()});
            setTimeout(function() {
                // 初始化播放器
                waseePlayer.init({
                    "box":"eye-panoVideo-box",
                    "path":_this.data.resourcePublic+"/player/wasee2/",
                    // "isCtrl":false,
                    // "isTime":false,
                    // "isSeek":false,
                    // "isPlayBtn":false,
                    // "autorotate":{"enabled":false,"waittime":1,"speed":8},
                    "logo":{"visible":false},
                    "callBack":function(){
                        waseePlayer.addPlayUrl({"name":"videoName"+id,"url":video_url});
                        waseePlayer.play({"name":"videoName"+id});
                    }
                });
            }, 200);

            $("#eye-panoVideo-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                waseePlayer.destroy();
                $("#eye-panoVideo-alert").remove();
            })
        },
        //查看视频
        eyeVideo: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.name;
            var cover_url=obj.cover_url;
            var video_url=obj.url;
            $("#eye-video-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-video-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box">'+
                                                '<video class="video" id="eye-video" src="" poster="" controls="true" controlslist="nodownload"></video>'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xtips">'+obj.width+'*'+obj.height+' | '+obj.file_size+' | '+obj.format+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-video-alert").show();
            // $("#eye-video-alert .m-d .rg .eye-box").css({"width":$("#eye-video-alert .m-d .rg").width(),"height":$("#eye-video-alert .m-d .rg").height()});

            $("#eye-video-alert .video").attr({ "src": video_url, "poster": cover_url });
            $("#eye-video-alert .video")[0]['disablePictureInPicture'] = true; //隐藏控件中的画中画
            $("#eye-video-alert .video").get(0).play();

            $("#eye-video-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                document.getElementById('eye-video').pause();
                $("#eye-video-alert").remove();
            })
        },
        //查看图片
        eyeImg: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.name;
            var img_url=obj.url;
            $("#eye-img-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-img-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box">'+
                                                '<div class="trpm-flex-xy big-img-box">'+
                                                    '<img class="big-img" src="" />'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xgaBtn"><span class="reset iconfont icon_refresh"></span><div class="jxhom"><span class="add iconfont icon_add-circle-line1"></span><span class="txt">100%</span><span class="sub iconfont icon_indeterminate-circle-line"></span></div></div>'+
                                                '<div class="xtips">'+(obj.width>0?obj.width:"-")+'*'+(obj.height>0?obj.height:"-")+' | '+obj.file_size+' | '+(obj.format?obj.format:"")+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-img-alert").show();
            // $("#eye-img-alert .m-d .rg .eye-box").css({"width":$("#eye-img-alert .m-d .rg").width(),"height":$("#eye-img-alert .m-d .rg").height()});
            $("#eye-img-alert .m-d .rg .big-img").attr("src",img_url);
            let _max_h=$('.trpm-alert.resource-alert.eye-alert .m-d .rg .big-img-box').height(),_max_w=$('.trpm-alert.resource-alert.eye-alert .m-d .rg .big-img-box').width();

            $("#eye-img-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                $("#eye-img-alert").remove();
            })
            .on("mousewheel DOMMouseScroll",".big-img-box",function(){
                var delta = 0;
                if (!event) event = window.event;
                if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
                    delta = event.wheelDelta/120; 
                    if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
                } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
                    delta = -event.detail/3;
                }
                if (delta){
                    let width= $("#eye-img-alert .m-d .rg .big-img").width(),height= $("#eye-img-alert .m-d .rg .big-img").height(),emp=Math.floor(width*1.1);
                    if (delta <0){//向下滚动
                        emp=Math.floor(width/1.1);
                    }else{
                        if(emp>_max_w || height*1.1>_max_h){
                            return;
                        }
                    }
                    $("#eye-img-alert .m-d .rg .big-img").css("width",emp+"px");
                }
            })
        },
        //查看矩阵
        eyeScenic: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.title;
            $("#eye-scenic-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-scenic-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box" id="eye-scenic-box">'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xtips">'+obj.width+'*'+obj.height+' | '+obj.file_size+' | '+obj.format+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-scenic-alert").show();

            loadPano();

            $("#eye-scenic-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                $("#eye-scenic-alert").remove();
            })

            function loadPano(){
                var config_myserver = _this.data.myserver;
                var config_mypath = _this.data.resourceWasee+"/home/krpano";
                var xml_url=location.protocol+"//"+location.host+"/Wasee/VRIndex/doGetMediaPreviewXml?id="+id;
                embedpano({
                    html5: "auto",
                    target: "eye-scenic-box",
                    xml: xml_url,
                    wmode: "opaque",
                    passQueryParameters: true,
                    initvars: {
                        mypath: config_mypath,
                        time: "20161009",
                        myserver: config_myserver
                    }
                });
            }
        },
        //查看文档
        eyeDoc: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.name;
            var doc_url=obj.url;
            doc_url=doc_url.includes('.doc') ? doc_url+".pdf" : doc_url;
            doc_url=doc_url.replace('http:',"https:");
            $("#eye-doc-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-doc-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box" style="padding:12px;">'+
                                                '<iframe class="iframe" src="'+doc_url+'"></iframe>'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xtips">'+obj.width+'*'+obj.height+' | '+obj.file_size+' | '+obj.ext+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-doc-alert").show();
            $("#eye-doc-alert .m-d .rg .eye-box").css({"width":$("#eye-doc-alert .m-d .rg").width(),"height":$("#eye-doc-alert .m-d .rg").height()});

            $("#eye-doc-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                $("#eye-doc-alert").remove();
            })
        },
        //查看模型
        eyeModel: function (obj) {
            var _this=this;
            let {data,pub=0}=obj;
            let {id,name,file_size,file_name}=data;
            var iframe_url=location.protocol+"//"+location.host+"/Wasee/VRHome/3dplayer?id="+id+"&pub="+pub;
            $("#eye-model-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-model-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box" style="padding:12px;">'+
                                                '<iframe class="iframe" src="'+iframe_url+'"></iframe>'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xtips">'+file_size+' | '+(file_name!=""?file_name.split('.')[1]:"-")+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-model-alert").show();
            $("#eye-model-alert .m-d .rg .eye-box").css({"width":$("#eye-model-alert .m-d .rg").width(),"height":$("#eye-model-alert .m-d .rg").height()});

            $("#eye-model-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                $("#eye-model-alert").remove();
            })
        },
        //查看模型-倾斜摄影
        eyeModel2: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.name;
            var iframe_url=location.protocol+"//"+location.host+"/Wasee/VRHome/3drealsceneplayer?id="+id;
            $("#eye-model-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-model-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box" style="padding:12px;">'+
                                                '<iframe class="iframe" src="'+iframe_url+'"></iframe>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-model-alert").show();
            $("#eye-model-alert .m-d .rg .eye-box").css({"width":$("#eye-model-alert .m-d .rg").width(),"height":$("#eye-model-alert .m-d .rg").height()});

            $("#eye-model-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                $("#eye-model-alert").remove();
            })
        },
        //查看Hdr
        eyeHdr: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.name;
            var img_url=obj.cover_url;
            $("#eye-img-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-img-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box">'+
                                                '<div class="trpm-flex-xy big-img-box">'+
                                                    '<img class="big-img" src="" />'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xgaBtn"><span class="reset iconfont icon_refresh"></span><div class="jxhom"><span class="add iconfont icon_add-circle-line1"></span><span class="txt">100%</span><span class="sub iconfont icon_indeterminate-circle-line"></span></div></div>'+
                                                '<div class="xtips">'+obj.width+'*'+obj.height+' | '+obj.file_size+' | '+obj.format+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-img-alert").show();
            // $("#eye-img-alert .m-d .rg .eye-box").css({"width":$("#eye-img-alert .m-d .rg").width(),"height":$("#eye-img-alert .m-d .rg").height()});
            $("#eye-img-alert .m-d .rg .big-img").attr("src",img_url);
            let _max_h=$('.trpm-alert.resource-alert.eye-alert .m-d .rg .big-img-box').height(),_max_w=$('.trpm-alert.resource-alert.eye-alert .m-d .rg .big-img-box').width();

            $("#eye-img-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                $("#eye-img-alert").remove();
            })
            .on("mousewheel DOMMouseScroll",".big-img-box",function(){
                var delta = 0;
                if (!event) event = window.event;
                if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
                    delta = event.wheelDelta/120; 
                    if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
                } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
                    delta = -event.detail/3;
                }
                if (delta){
                    let width= $("#eye-img-alert .m-d .rg .big-img").width(),height= $("#eye-img-alert .m-d .rg .big-img").height(),emp=Math.floor(width*1.1);
                    if (delta <0){//向下滚动
                        emp=Math.floor(width/1.1);
                    }else{
                        if(emp>_max_w || height*1.1>_max_h){
                            return;
                        }
                    }
                    $("#eye-img-alert .m-d .rg .big-img").css("width",emp+"px");
                }
            })
        },
        //查看材质
        eyeTexture: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.name;
            var img_url=obj.cover_url;
            $("#eye-img-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-img-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box">'+
                                                '<div class="trpm-flex-xy big-img-box">'+
                                                    '<img class="big-img" src="" />'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xgaBtn"><span class="reset iconfont icon_refresh"></span><div class="jxhom"><span class="add iconfont icon_add-circle-line1"></span><span class="txt">100%</span><span class="sub iconfont icon_indeterminate-circle-line"></span></div></div>'+
                                                '<div class="xtips">'+obj.file_size+' | '+(obj.file_name!=""?obj.file_name.split('.')[1]:"-")+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-img-alert").show();
            // $("#eye-img-alert .m-d .rg .eye-box").css({"width":$("#eye-img-alert .m-d .rg").width(),"height":$("#eye-img-alert .m-d .rg").height()});
            $("#eye-img-alert .m-d .rg .big-img").attr("src",img_url);
            let _max_h=$('.trpm-alert.resource-alert.eye-alert .m-d .rg .big-img-box').height(),_max_w=$('.trpm-alert.resource-alert.eye-alert .m-d .rg .big-img-box').width();

            $("#eye-img-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                $("#eye-img-alert").remove();
            })
            .on("mousewheel DOMMouseScroll",".big-img-box",function(){
                var delta = 0;
                if (!event) event = window.event;
                if (event.wheelDelta) {//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
                    delta = event.wheelDelta/120; 
                    if (window.opera) delta = -delta;//因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
                } else if (event.detail) {//FF浏览器使用的是detail,其值为“正负3”
                    delta = -event.detail/3;
                }
                if (delta){
                    let width= $("#eye-img-alert .m-d .rg .big-img").width(),height= $("#eye-img-alert .m-d .rg .big-img").height(),emp=Math.floor(width*1.1);
                    if (delta <0){//向下滚动
                        emp=Math.floor(width/1.1);
                    }else{
                        if(emp>_max_w || height*1.1>_max_h){
                            return;
                        }
                    }
                    $("#eye-img-alert .m-d .rg .big-img").css("width",emp+"px");
                }
            })
        },
        //查看AI知识库
        eyeAilib: function (obj) {
            var _this=this;
            var id = obj.id;
            var name = obj.name;
            var doc_url=obj.url;
            doc_url=doc_url.includes('.doc') ? doc_url+".pdf" : doc_url;
            doc_url=doc_url.replace('http:',"https:");
            $("#eye-ailib-alert").remove();
            try {
                var domHtml='<div class="trpm-alert resource-alert eye-alert '+_this.data.skin+'" id="eye-ailib-alert">'+
                                '<div class="trpm-bk"></div>'+
                                '<div class="trpm-flex trpm-mc">'+
                                    '<div class="trpm-x">'+
                                        '<span class="trpm-flex-xy">'+
                                            '<span class="icon-d">'+
                                                '<i class="trpm-iconfont icon_close"></i>'+
                                            '</span>'+
                                        '</span>'+
                                    '</div>'+
                                    '<div class="trpm-tl">'+
                                        '<div class="tag">'+
                                            '<span class="sp">'+name+'</span>'+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="trpm-flex m-d">'+
                                        '<div class="trpm-flex rg">'+
                                            '<div class="eye-box" style="padding:12px;">'+
                                                '<iframe class="iframe" src="'+doc_url+'"></iframe>'+
                                            '</div>'+
                                            '<div class="imgcontrol">'+
                                                '<div class="xtips">'+obj.width+'*'+obj.height+' | '+obj.file_size+' | '+obj.ext+'</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>';
            } catch (error) {
            }
            $("body").append(domHtml);
            $("#eye-ailib-alert").show();
            $("#eye-ailib-alert .m-d .rg .eye-box").css({"width":$("#eye-ailib-alert .m-d .rg").width(),"height":$("#eye-ailib-alert .m-d .rg").height()});

            $("#eye-ailib-alert")
            // 关闭
            .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                var thisObj=$(this);
                $("#eye-ailib-alert").remove();
            })
        },

        //轮询-全景状态
        loop_pano: function (obj) {
            var _this = this;
            
            let params= { "pageIndex": 1, "pageSize": 100000, "type": 0 };
            if (_this.data.unFinishedData["121"].length > 0) {
                params.media_id = _this.data.unFinishedData["121"].join('|');
            }
            else{
                return false;
            }
            if(_this.data.params && _this.data.params[121]){
                let listParams=_this.data.params[121];
                if(listParams.pano_vkey){
                    params.pano_vkey=listParams.pano_vkey;
                }
                if(listParams.pano_type){
                    params.pano_type=listParams.pano_type;
                }
            }
            var paramsObj = {
                "type": "POST",
                "url": '/Wasee/VRIndex/getPanoMediaList',
                "params": params,
                "callBack": function (reParams) {
                    var params = reParams.params;
                    var pageIndex = params.pageIndex;
                    var pageSize = params.pageSize;
                    var reData = reParams.data;
                    if (reData.status == 1) {
                        var totalPage = reData.totalPage;
                        var count = reData.count;
                        var total = reData.total;
                        var list = reData.data;
                        var cou = list.length;
                        for (var i = 0; i < cou; i++) {
                            var curObj = list[i];
                            var id = curObj.id;
                            _this.data.data_pano[id] = curObj;
                            var name = curObj.name;
                            var img_url = curObj.thumburl;
                            var status = curObj.status;
                            if (status == 5) {
                                _this.data.unFinishedData["121"].splice(_this.data.unFinishedData["121"].indexOf(id), 1);
                                var tempHtml ='<div class="m">' +
                                                    '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                        '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                                    '</div>' +
                                                    '<div class="bk"></div>' +
                                                    '<div class="gou"></div>' +
                                                    '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                                    '<div class="name">' + name + '</div>' +
                                                    '<div class="tips"></div>' +
                                                '</div>';
                                $("#resource-alert .rg .boxs .pano-box .list .li[data-id=" + id + "]").removeClass("sta1 sta2").html(tempHtml);
                            }
                        }
                        if (cou > 0) {
                            if (_this.data.unFinishedData["121"].length > 0) {
                                setTimeout(function () {
                                    _this.loop_pano(obj);
                                }, 2000);
                            }
                        }
                    }
                }
            };
            trpm.ajax(paramsObj);
        },
        //轮询-全景视频状态
        loop_panoVideo: function (obj) {
            var _this = this;
            var params = { "pageIndex": 1, "pageSize": 100000,};
            if (_this.data.unFinishedData["130"].length > 0) {
                params.media_id = _this.data.unFinishedData["130"].join('|');
            }
            else{
                return false;
            }
            var paramsObj = {
                "type": "POST",
                "url": '/Wasee/VRIndex/getPanoVideoList',
                "params": params,
                "callBack": function (reParams) {
                    var params = reParams.params;
                    var pageIndex = params.pageIndex;
                    var pageSize = params.pageSize;
                    var reData = reParams.data;
                    if (reData.status == 1) {
                        var totalPage = reData.totalPage;
                        var count = reData.count;
                        var total = reData.total;
                        var list = reData.data;
                        var cou = list.length;
                        for (var i = 0; i < cou; i++) {
                            var curObj = list[i];
                            var id = curObj.id;
                            _this.data.data_panoVideo[id] = curObj;
                            var name = curObj.name;
                            var img_url = curObj.cover_url;
                            var status = curObj.status;
                            if (status == 203) {
                                _this.data.unFinishedData["130"].splice(_this.data.unFinishedData["130"].indexOf(id), 1);
                                var tempHtml ='<div class="m">' +
                                                '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                    '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                                '</div>' +
                                                '<div class="bk"></div>' +
                                                '<div class="gou"></div>' +
                                                '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                                '<div class="name">' + name + '</div>' +
                                                '<div class="tips"></div>' +
                                            '</div>';
                                $("#resource-alert .rg .boxs .panoVideo-box .list .li[data-id=" + id + "]").removeClass("sta1 sta2").html(tempHtml);
                            }
                        }
                        if (cou > 0) {
                            if (_this.data.unFinishedData["130"].length > 0) {
                                setTimeout(function () {
                                    _this.loop_panoVideo(obj);
                                }, 2000);
                            }
                        }
                    }
                }
            };
            trpm.ajax(paramsObj);
        },
        //轮询-矩阵状态
        loop_scenic: function (obj) {
            var _this = this;
            var params = { "pageIndex": 1, "pageSize": 100000, "type": 1 };
            if (_this.data.unFinishedData["3"].length > 0) {
                params.media_id = _this.data.unFinishedData["3"].join('|');
            }
            else{
                return false;
            }
            var paramsObj = {
                "type": "POST",
                "url": '/Wasee/VRIndex/getPanoMediaList',
                "params": params,
                "callBack": function (reParams) {
                    var params = reParams.params;
                    var pageIndex = params.pageIndex;
                    var pageSize = params.pageSize;
                    var reData = reParams.data;
                    if (reData.status == 1) {
                        var totalPage = reData.totalPage;
                        var count = reData.count;
                        var total = reData.total;
                        var list = reData.data;
                        var cou = list.length;
                        for (var i = 0; i < cou; i++) {
                            var curObj = list[i];
                            var id = curObj.id;
                            _this.data.data_scenic[id] = curObj;
                            var name = curObj.name;
                            var img_url = curObj.thumburl;
                            var status = curObj.status;
                            if (status == 5) {
                                _this.data.unFinishedData["3"].splice(_this.data.unFinishedData["3"].indexOf(id), 1);
                                let tempHtml ='<div class="m">' +
                                                '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                    '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                                '</div>' +
                                                '<div class="bk"></div>' +
                                                '<div class="gou"></div>' +
                                                '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                                '<div class="name">' + name + '</div>' +
                                                '<div class="tips"></div>' +
                                            '</div>';
                                $("#resource-alert .rg .boxs .scenic-box .list .li[data-id=" + id + "]").removeClass("sta1 sta2").html(tempHtml);
                            }
                        }
                        if (cou > 0) {
                            if (_this.data.unFinishedData["3"].length > 0) {
                                setTimeout(function () {
                                    _this.loop_scenic(obj);
                                }, 2000);
                            }
                        }
                    }
                }
            };
            trpm.ajax(paramsObj);
        },
        //轮询-模型状态
        loop_model: function (obj) {
            var _this = this;
            
            let params= { "pageIndex": 1, "pageSize": 100000, "type": 5 };
            if (_this.data.unFinishedData["5"].length > 0) {
                params.id = _this.data.unFinishedData["5"].join('|');
            }
            else{
                return false;
            }
            if(_this.data.params && _this.data.params[5]){
                let listParams=_this.data.params[5];
                if(listParams.pano_vkey){
                    params.pano_vkey=listParams.pano_vkey;
                }
                if(listParams.pano_type){
                    params.pano_type=listParams.pano_type;
                }
            }
            var paramsObj = {
                "type": "POST",
                "url": '/Wasee/Index/getResourceList',
                "params": params,
                "callBack": function (reParams) {
                    var params = reParams.params;
                    var pageIndex = params.pageIndex;
                    var pageSize = params.pageSize;
                    var reData = reParams.data;
                    if (reData.status == 1) {
                        var totalPage = reData.totalPage;
                        var count = reData.count;
                        var total = reData.total;
                        var list = reData.data;
                        var cou = list.length;
                        for (var i = 0; i < cou; i++) {
                            var curObj = list[i];
                            var id = curObj.id;
                            _this.data.data_model[id] = curObj;
                            var name = curObj.name;
                            var img_url = curObj.cover_url;
                            var status = curObj.status;
                            if (status == 1) {
                                _this.data.unFinishedData["5"].splice(_this.data.unFinishedData["5"].indexOf(id), 1);
                                var tempHtml ='<div class="m">' +
                                                    '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                        '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                                    '</div>' +
                                                    '<div class="bk"></div>' +
                                                    '<div class="gou"></div>' +
                                                    '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                                    '<div class="name">' + name + '</div>' +
                                                    '<div class="tips"></div>' +
                                                '</div>';
                                $("#resource-alert .rg .boxs .model-box .list .li[data-id=" + id + "]").removeClass("sta1 sta2").html(tempHtml);
                            }
                        }
                        if (cou > 0) {
                            if (_this.data.unFinishedData["5"].length > 0) {
                                setTimeout(function () {
                                    _this.loop_model(obj);
                                }, 2000);
                            }
                        }
                    }
                }
            };
            trpm.ajax(paramsObj);
        },
        //轮询-模型状态 倾斜摄影
        loop_model2: function (obj) {
            var _this = this;
            
            let params= { "pageIndex": 1, "pageSize": 100000, "type": 6 };
            if (_this.data.unFinishedData["6"].length > 0) {
                params.id = _this.data.unFinishedData["6"].join('|');
            }
            else{
                return false;
            }
            if(_this.data.params && _this.data.params[6]){
                let listParams=_this.data.params[6];
                if(listParams.pano_vkey){
                    params.pano_vkey=listParams.pano_vkey;
                }
                if(listParams.pano_type){
                    params.pano_type=listParams.pano_type;
                }
            }
            var paramsObj = {
                "type": "POST",
                "url": '/Wasee/Index/getResourceList',
                "params": params,
                "callBack": function (reParams) {
                    var params = reParams.params;
                    var pageIndex = params.pageIndex;
                    var pageSize = params.pageSize;
                    var reData = reParams.data;
                    if (reData.status == 1) {
                        var totalPage = reData.totalPage;
                        var count = reData.count;
                        var total = reData.total;
                        var list = reData.data;
                        var cou = list.length;
                        for (var i = 0; i < cou; i++) {
                            var curObj = list[i];
                            var id = curObj.id;
                            _this.data.data_model2[id] = curObj;
                            var name = curObj.name;
                            var img_url = curObj.cover_url;
                            var status = curObj.status;
                            if (status == 1) {
                                _this.data.unFinishedData["6"].splice(_this.data.unFinishedData["6"].indexOf(id), 1);
                                var tempHtml ='<div class="m">' +
                                                    '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                        '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                                    '</div>' +
                                                    '<div class="bk"></div>' +
                                                    '<div class="gou"></div>' +
                                                    '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                                    '<div class="name">' + name + '</div>' +
                                                    '<div class="tips"></div>' +
                                                '</div>';
                                $("#resource-alert .rg .boxs .model-box .list .li[data-id=" + id + "]").removeClass("sta1 sta2").html(tempHtml);
                            }
                        }
                        if (cou > 0) {
                            if (_this.data.unFinishedData["6"].length > 0) {
                                setTimeout(function () {
                                    _this.loop_model2(obj);
                                }, 2000);
                            }
                        }
                    }
                }
            };
            trpm.ajax(paramsObj);
        },

        //上传初始化
        uploadInit:function(obj){
            var _this=this;
            let ty=obj.ty ? obj.ty : _this.data.cur_ty;
            let skin=_this.data.skin;
            let drag=_this.data.drag;
            let btn=obj.btn ? obj.btn : "";
            if(!btn){
                return;
            }
            if(ty==121){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    "propressCloseTime":0,
                    "propressFileHide":false,
                    "upload_option": {
                        "auto": false,
                        "pick": { id: btn },
                        "accept": {
                            title: '全景图',
                            extensions: 'jpg,jpeg,tif',
                            // mimeTypes: 'image/*'
                            mimeTypes: 'image/jpg,image/jpeg,image/tif'
                        },
                        "fileSingleSizeLimit": (1024 * 1024 * 120),
                        // disableGlobalDnd: true,
                        // dnd: '.page-box .list-box .scroll',
                        // paste: document.body,
                    },
                    "upload_error": function (bkData) {
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=121;
                    delete params.upload_option.pick;
                }
                _this.data.upload_pano.uploadObj = new Trpm_webuploaderModule(params);
            }
            else if(ty==3){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    "propressCloseTime":0,
                    "propressFileHide":false,
                    "upload_option": {
                        "auto": false,
                        "pick": { id: btn },
                        "accept": {
                            title: '图片',
                            extensions: 'jpg,jpeg,tif',
                            // mimeTypes: 'image/*'
                            mimeTypes: 'image/jpg,image/jpeg,image/tif'
                        },
                        "fileSingleSizeLimit": (1024 * 1024 * 100),
                        // disableGlobalDnd: true,
                        // dnd: '.page-box .list-box .scroll',
                        // paste: document.body,
                    },
                    "upload_error": function (bkData) {
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=3;
                    delete params.upload_option.pick;
                }
                _this.data.upload_scenic.uploadObj = new Trpm_webuploaderModule(params);
            }
            else if(ty==130){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    "upload_option":{
                        "auto": false,
                        "pick": { id: btn},
                        "accept": {
                            "title": '视频',
                            "extensions": 'mp4',
                            "mimeTypes": 'video/*'
                        },
                        "fileSingleSizeLimit":5368709120
                    },
                    "upload_error": function(bkData){
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=130;
                    delete params.upload_option.pick;
                }
                _this.data.upload_panoVideo.uploadObj = new Trpm_webuploaderModule(params);
            }
            else if(ty==23030){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    "upload_option":{
                        "auto": false,
                        "pick": { id: btn},
                        "fileSingleSizeLimit":(1024*1024*10),
                        "server":'/Wasee/Index/doUploadResource?type=1&method=1',
                    },
                    "upload_error": function(bkData){
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=23030;
                    delete params.upload_option.pick;
                }
                _this.data.upload_img.uploadObj = new Trpm_webuploaderModule(params);
            }
            else if(ty==23031){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    "upload_option": {
                        "auto": false,
                        "pick": { id: btn },
                        "accept": {
                            "title": '视频',
                            "extensions": 'mp4',
                            "mimeTypes": 'video/*'
                        },
                        "fileSingleSizeLimit": (1024 * 1024 * 200),
                        "server":'/Wasee/Index/doUploadResource?type=3&method=1',
                    },
                    "upload_error": function (bkData) {
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=23031;
                    delete params.upload_option.pick;
                }
                _this.data.upload_video.uploadObj = new Trpm_webuploaderModule(params);               
            }
            else if(ty==2){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    "upload_option": {
                        "auto": false,
                        "pick": { id: btn },
                        "accept": {
                            "title": '音频',
                            "extensions": 'mp3',
                            "mimeTypes": 'audio/mp3'
                        },
                        "fileSingleSizeLimit": (1024 * 1024 * 20),
                        "server":'/Wasee/Index/doUploadResource?type=2&method=1',
                    },
                    "upload_error": function (bkData) {
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=2;
                    delete params.upload_option.pick;
                }
                _this.data.upload_music.uploadObj = new Trpm_webuploaderModule(params);               
            }
            else if(ty==4){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    "upload_option": {
                        "auto": false,
                        "pick": { id: btn},
                        "accept": {
                            "title": '文档',
                            "extensions": 'doc,docx,pdf',
                            "mimeTypes": 'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf'
                        },
                        "fileSingleSizeLimit": (1024 * 1024 * 16),
                        "server":'/Wasee/Index/doUploadResource?type=4&method=1',
                    },
                    "upload_error": function(bkData){
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=5;
                    delete params.upload_option.pick;
                }
                _this.data.upload_doc.uploadObj = new Trpm_webuploaderModule(params);
            }
            else if(ty==5){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    // "propressCloseTime":0,
                    // "propressFileHide":false,
                    "upload_option": {
                        "auto": false,
                        "pick": { id: btn },
                        "accept": {
                            "title": '3D物体/空间 格式：obj,stl,fbx',
                            "extensions": 'zip',
                            "mimeTypes": 'application/zip'
                        },
                        "fileSingleSizeLimit": (1024 * 1024 * 120),
                        // "server":'/Wasee/Index/doUploadResource?type=5&method=1',
                    },
                    "upload_error": function (bkData) {
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=4;
                    delete params.upload_option.pick;
                }
                // console.log(params.upload_option.accept);
                _this.data.upload_model.uploadObj = new Trpm_webuploaderModule(params);
            }
            else if(ty==6){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    // "propressCloseTime":0,
                    // "propressFileHide":false,
                    "upload_option": {
                        "auto": false,
                        "pick": { id: btn },
                        "accept": {
                            "title": '倾斜摄影 格式：OSGB',
                            "extensions": 'zip,rar',
                            "mimeTypes": 'application/zip,application/rar'
                        },
                        "fileSingleSizeLimit": (1024 * 1024 * 1024*5),
                        // "server":'/Wasee/Index/doUploadResource?type=6&method=1',
                    },
                    "upload_error": function (bkData) {
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=6;
                    delete params.upload_option.pick;
                }
                // console.log(params.upload_option.accept);
                _this.data.upload_model2.uploadObj = new Trpm_webuploaderModule(params);
            }
            else if(ty==8){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    "upload_option": {
                        "auto": false,
                        "pick": { id: btn },
                        "accept": {
                            "title": '材质',
                            "extensions": 'zip',
                            // "mimeTypes": 'video/*'
                        },
                        "fileSingleSizeLimit": (1024 * 1024 * 200),
                        "server":'/Wasee/Index/doUploadResource?type=8&method=1',
                    },
                    "upload_error": function (bkData) {
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=8;
                    delete params.upload_option.pick;
                }
                _this.data.upload_video.uploadObj = new Trpm_webuploaderModule(params);               
            }
            else if(ty==9){
                let params={
                    "skin":skin,
                    "public_path":_this.data.resourcePublic,
                    "upload_option":{
                        "auto": false,
                        "pick": { id: btn},
                        "fileSingleSizeLimit":(1024*1024*10),
                        "server":'/Wasee/Index/doUploadResource?type=9&method=1',
                    },
                    "upload_error": function(bkData){
                        // console.log(bkData);
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                        layer.msg("上传失败",{time:1000}); 
                    }
                };
                if(drag){
                    params.drag=9;
                    delete params.upload_option.pick;
                }
                _this.data.upload_tietu.uploadObj = new Trpm_webuploaderModule(params);
            }            
        },
        //上传
        upload:function(obj){
            var _this=this;
            let ty=obj.ty ? obj.ty : _this.data.cur_ty;
            let listParams=_this.data.params[ty];
            let formParams={}, cid=0;
            if(listParams){
                if(listParams.category_id){
                    cid=listParams.category_id;
                    formParams.category_id=listParams.category_id;
                }
                if(listParams.cid){
                    cid=listParams.cid;
                    formParams.cid=listParams.cid;
                }
                if(listParams.pano_vkey){
                    if(!cid){
                        layer.msg("请先选择分类",{time:1000}); 
                        return false;
                    }
                    formParams.pano_vkey=listParams.pano_vkey;
                }
                if(listParams.pano_type){
                    formParams.pano_type=listParams.pano_type;
                }
            }
            // console.log(listParams,formParams);
            if(ty==121){
                formParams.auth_type=1;
                _this.data.upload_pano.file_cou=0,_this.data.upload_pano.file_fail=[];
                _this.data.upload_pano.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function (up_bkData) {
                        // console.log("upload_fileQueued----",up_bkData);
                        var fileData = up_bkData.file;
                        var file_id = fileData.id;
                        var file_name = fileData.name;
                        formParams.name=file_name;
                        // //读取图片数据
                        // let blob=fileData.source.source;
                        // var reader = new FileReader();
                        // reader.onload = function (e) {
                        //     let data = e.target.result;
                        //     //加载图片获取图片真实宽度和高度
                        //     var image = new Image();
                        //     image.onload=function(){
                        //         var width = image.width;
                        //         var height = image.height;
                        //         if(width/height==_this.data.upload_pano.per){
                        //             geFormData();
                        //         }
                        //         else{
                        //             _this.data.upload_pano.file_fail.push(fileData);
                        //             // _this.data.upload_pano.uploadObj.removeFile({"file":fileData});
                        //             var curDom=$(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"]");
                        //             curDom.find(".webuploader-propress-sta").text("上传失败:宽高比不符合2:1");
                        //         }
                        //         _this.data.upload_pano.file_cou++;
                        //     };
                        //     image.onerror=function(err){console.log(err,'值过大，无法修改')}; 
                        //     image.src= data;
                        // };
                        // reader.readAsDataURL(blob);
                        geFormData();
                        function geFormData(){
                            _this.getPanoFormData({
                                "params": formParams,
                                "callBack": function (bkData) {
                                    // console.log(bkData);
                                    var upToOssData = bkData.data;
                                    if (_this.data.upload_pano.isExpire == 1) {
                                        var curTime = new Date().getTime() / 1000;
                                        _this.data.upload_pano.expireTime = curTime + upToOssData.expire;
                                        _this.data.upload_pano.formData.policy = upToOssData.policy;
                                        _this.data.upload_pano.formData.OSSAccessKeyId = upToOssData.accessid;
                                        _this.data.upload_pano.formData.signature = upToOssData.signature;
                                    }
                                    var formData = {
                                        "policy": _this.data.upload_pano.formData.policy,
                                        "OSSAccessKeyId": _this.data.upload_pano.formData.OSSAccessKeyId,
                                        "signature": _this.data.upload_pano.formData.signature,
                                        "key": upToOssData.dir + (new Date()).getTime() + '/${filename}',
                                        "oss_host": upToOssData.host,
                                        "callback": upToOssData.callback,
                                    };
                                    _this.data.upload_pano.formDatas["file_" + file_id] = formData;
                                    // console.log(_this.data.upload_pano.formData);
                                    // console.log(formData);
                                    _this.data.upload_pano.uploadObj.setOption({
                                        "upload_option": {
                                            "server": upToOssData.host,
                                            // "formData":_this.data.upload_pano.formData
                                        },
                                    });
                                    // _this.data.upload_pano.uploadObj.upload();
                                    _this.data.upload_pano.flag=true;
                                }
                            });
                        }
                    },
                    "upload_filesQueued": function (up_bkData) {
                        // console.log("upload_filesQueued-----",up_bkData);
                        _this.data.upload_pano.file_cou=up_bkData.file.length;
                        function a(){
                            if(_this.data.upload_pano.file_cou==up_bkData.file.length){
                                if(_this.data.upload_pano.file_fail.length==0){
                                    _this.data.upload_pano.uploadObj.upload();
                                }
                                else{
                                    for(let i=0;i<up_bkData.file.length;i++){
                                        _this.data.upload_pano.uploadObj.removeFile({"file":up_bkData.file[i]});
                                    }
                                }
                                // if(_this.data.upload_pano.file_fail.length>0){
                                //     for(let i=0;i<_this.data.upload_pano.file_fail.length;i++){
                                //         _this.data.upload_pano.uploadObj.removeFile({"file":_this.data.upload_pano.file_fail[i]});
                                //     }
                                // }
                                // _this.data.upload_pano.uploadObj.upload();
                            }
                            else{
                                setTimeout(function(){
                                    a();
                                },100);
                            }
                        }
                        a();
                    },
                    "upload_uploadBeforeSend": function (up_bkData) {
                        // console.log("upload_uploadBeforeSend",up_bkData);
                        var fileData = up_bkData.obj;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        // up_bkData.data.category_id=0;
                        up_bkData.data = $.extend(up_bkData.data, _this.data.upload_pano.formDatas["file_" + file_id]);
                    },
                    "upload_uploadSuccess": function (bkData) {
                        console.log("upload_uploadSuccess",bkData);
                        var file=bkData.file;
                        var response = bkData.response;
                        var status = response.status;
                        if (status == 1) {
                            let id = response.id;
                            let name = file.name;
                            let img_url="";
                            _this.data.data_pano[id]={"id":id,"name":name};
                            _this.data.unFinishedData[ty].push(id);
                            let itemHtml ='<div class="li sta1" data-id="' + id + '" data-atr="0">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">处理中</div>' +
                                        '</div>' +
                                    '</div>';
                            $("#resource-alert .rg .pano-box .list").prepend(itemHtml);

                            _this.changeCou({"ty":121,"cid":cid,"cou":1});
                        }
                        else {
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function () {
                        // console.log("upload_uploadFinished");
                        $("#"+_this.data.upload_pano.uploadObj.data.propressDomId).hide();
                        $("#"+_this.data.upload_pano.uploadObj.data.propressDomId+" .webuploader-propress-ul").html('');
                        setTimeout(function () {
                            //全景-状态轮询
                            _this.loop_pano({});
                        }, 2000);
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_pano.uploadObj.drag({});
                }
            }
            else if(ty==3){
                formParams.auth_type=1;
                formParams.type=3;
                _this.data.upload_scenic.file_cou=0,_this.data.upload_scenic.file_fail=[];
                _this.data.upload_scenic.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function (up_bkData) {
                        console.log("upload_fileQueued----",up_bkData);
                        var fileData = up_bkData.file;
                        var file_id = fileData.id;
                        var file_name = fileData.name;
                        formParams.name=file_name;
                        // //读取图片数据
                        // let blob=fileData.source.source;
                        // var reader = new FileReader();
                        // reader.onload = function (e) {
                        //     let data = e.target.result;
                        //     //加载图片获取图片真实宽度和高度
                        //     var image = new Image();
                        //     image.onload=function(){
                        //         var width = image.width;
                        //         var height = image.height;
                        //         if(width<=15000 && height<=15000){
                        //             geFormData();
                        //         }
                        //         else{
                        //             _this.data.upload_scenic.file_fail.push(fileData);
                        //             // _this.data.upload_scenic.uploadObj.removeFile({"file":fileData});
                        //             var curDom=$(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"]");
                        //             curDom.find(".webuploader-propress-sta").text("上传失败:长宽不超过15000像素");
                        //         }
                        //         _this.data.upload_scenic.file_cou++;
                        //     };
                        //     image.src= data;
                        // };
                        // reader.readAsDataURL(blob);
                        geFormData();
                        function geFormData(){
                            _this.getScenicFormData({
                                "params": formParams,
                                "callBack": function (bkData) {
                                    // console.log(bkData);
                                    var upToOssData = bkData.data;
                                    if (_this.data.upload_scenic.isExpire == 1) {
                                        var curTime = new Date().getTime() / 1000;
                                        _this.data.upload_scenic.expireTime = curTime + upToOssData.expire;
                                        _this.data.upload_scenic.formData.policy = upToOssData.policy;
                                        _this.data.upload_scenic.formData.OSSAccessKeyId = upToOssData.accessid;
                                        _this.data.upload_scenic.formData.signature = upToOssData.signature;
                                    }
                                    var formData = {
                                        "policy": _this.data.upload_scenic.formData.policy,
                                        "OSSAccessKeyId": _this.data.upload_scenic.formData.OSSAccessKeyId,
                                        "signature": _this.data.upload_scenic.formData.signature,
                                        "key": upToOssData.dir + (new Date()).getTime() + '/${filename}',
                                        "oss_host": upToOssData.host,
                                        "callback": upToOssData.callback,
                                    };
                                    _this.data.upload_scenic.formDatas["file_" + file_id] = formData;
                                    // console.log(_this.data.upload_scenic.formData);
                                    // console.log(formData);
                                    _this.data.upload_scenic.uploadObj.setOption({
                                        "upload_option": {
                                            "server": upToOssData.host,
                                            // "formData":_this.data.upload_scenic.formData
                                        },
                                    });
                                    // _this.data.upload_scenic.uploadObj.upload();
                                }
                            });
                        }
                        // _this.data.upload_scenic.file_cou++;
                    },
                    "upload_filesQueued": function (up_bkData) {
                        console.log("upload_filesQueued-----",up_bkData);
                        _this.data.upload_scenic.file_cou=up_bkData.file.length;
                        function a(){
                            if(_this.data.upload_scenic.file_cou==up_bkData.file.length){
                                if(_this.data.upload_scenic.file_fail.length==0){
                                    _this.data.upload_scenic.uploadObj.upload();
                                }
                                else{
                                    for(let i=0;i<up_bkData.file.length;i++){
                                        _this.data.upload_scenic.uploadObj.removeFile({"file":up_bkData.file[i]});
                                    }
                                }
                                // if(_this.data.upload_scenic.file_fail.length>0){
                                //     for(let i=0;i<_this.data.upload_scenic.file_fail.length;i++){
                                //         _this.data.upload_scenic.uploadObj.removeFile({"file":_this.data.upload_scenic.file_fail[i]});
                                //     }
                                // }
                                // _this.data.upload_scenic.uploadObj.upload();
                            }
                            else{
                                setTimeout(function(){
                                    a();
                                },100);
                            }
                        }
                        a();
                    },
                    "upload_uploadBeforeSend": function (up_bkData) {
                        // console.log(up_bkData);
                        var fileData = up_bkData.obj;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        // up_bkData.data.category_id=0;
                        up_bkData.data = $.extend(up_bkData.data, _this.data.upload_scenic.formDatas["file_" + file_id]);
                    },
                    "upload_uploadSuccess": function (bkData) {
                        // console.log(bkData);
                        var file=bkData.file;
                        var response = bkData.response;
                        var status = response.status;
                        if (status == 1) {
                            let id = response.id;
                            let name = file.name;
                            let img_url="";
                            _this.data.data_scenic[id]={"id":id,"name":name};
                            _this.data.unFinishedData[ty].push(id);
                            let itemHtml ='<div class="li sta1" data-id="' + id + '" data-atr="0">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">处理中</div>' +
                                        '</div>' +
                                    '</div>';
                            $("#resource-alert .rg .scenic-box .list").prepend(itemHtml);

                            _this.changeCou({"ty":3,"cid":cid,"cou":1});
                        }
                        else {
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function () {
                        $("#"+_this.data.upload_scenic.uploadObj.data.propressDomId).hide();
                        $("#"+_this.data.upload_scenic.uploadObj.data.propressDomId+" .webuploader-propress-ul").html('');
                        setTimeout(function () {
                            //全景-状态轮询
                            _this.loop_scenic({});
                        }, 2000);
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_scenic.uploadObj.drag({});
                }
            }
            else if(ty==130){
                formParams.auth_type=1;
                _this.data.upload_panoVideo.file_cou=0,_this.data.upload_panoVideo.file_fail=[];
                _this.data.upload_panoVideo.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept------", bkData);
                    },
                    "upload_fileQueued": function(up_bkData){
                        console.log("upload_fileQueued-------",up_bkData);
                        var fileData=up_bkData;
                        var file_id=fileData.file.id;
                        var file_name=fileData.file.name;
                        formParams.name=file_name;
                        _this.getPanoVideoFormData({
                            "params":formParams,
                            "callBack":function(bkData){
                                // console.log(bkData);
                                var upToOssData = bkData.data;
                                if(_this.data.upload_panoVideo.isExpire == 1) {
                                    var curTime = new Date().getTime() / 1000;
                                    _this.data.upload_panoVideo.expireTime = curTime + upToOssData.expire;
                                    _this.data.upload_panoVideo.formData.policy=upToOssData.policy;
                                    _this.data.upload_panoVideo.formData.OSSAccessKeyId=upToOssData.accessid;
                                    _this.data.upload_panoVideo.formData.signature=upToOssData.signature; 
                                }
                                var formData={
                                    "policy":_this.data.upload_panoVideo.formData.policy,
                                    "OSSAccessKeyId":_this.data.upload_panoVideo.formData.OSSAccessKeyId,
                                    "signature":_this.data.upload_panoVideo.formData.signature,
                                    "key":upToOssData.dir + (new Date()).getTime() + '/${filename}',
                                    "oss_host":upToOssData.host,
                                    "callback":upToOssData.callback,
                                };
                                _this.data.upload_panoVideo.formDatas["file_"+file_id]=formData;

                                // console.log(_this.data.upload_panoVideo.formData);
                                // console.log(formData);

                                _this.data.upload_panoVideo.uploadObj.setOption({
                                    "upload_option":{
                                        "server":upToOssData.host,
                                        // "formData":_this.data.upload_panoVideo.formData
                                    },
                                });
                                // _this.data.upload_panoVideo.uploadObj.upload();
                            }
                        });
                        _this.data.upload_panoVideo.file_cou++;
                    },
                    "upload_filesQueued": function(up_bkData){
                        console.log("upload_filesQueued：---------",up_bkData);
                        function a(){
                            if(_this.data.upload_panoVideo.file_cou==up_bkData.file.length){
                                if(_this.data.upload_panoVideo.file_fail.length==0){
                                    _this.data.upload_panoVideo.uploadObj.upload();
                                }
                                else{
                                    for(let i=0;i<up_bkData.file.length;i++){
                                        _this.data.upload_panoVideo.uploadObj.removeFile({"file":up_bkData.file[i]});
                                    }
                                }
                            }
                            else{
                                setTimeout(function(){
                                    a();
                                },100);
                            }
                        }
                        a();
                    },
                    "upload_uploadBeforeSend": function(up_bkData){
                        // console.log(up_bkData);
                        var fileData=up_bkData.obj;
                        var file_id=fileData.file.id;
                        var file_name=fileData.file.name;
                        // up_bkData.data.cid=0;
                        up_bkData.data=$.extend(up_bkData.data,_this.data.upload_panoVideo.formDatas["file_"+file_id]);  
                    },
                    "upload_uploadSuccess": function(bkData){
                        // console.log(bkData);
                        var file=bkData.file;
                        var response=bkData.response;
                        var status=response.status;
                        if(status==1){
                            let id=response.id;
                            let name = file.name;
                            let img_url="";
                            _this.data.data_panoVideo[id]={"id":id,"name":name};
                            _this.data.unFinishedData[ty].push(id);
                            let itemHtml ='<div class="li sta1" data-id="' + id + '" data-atr="0">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">处理中</div>' +
                                        '</div>' +
                                    '</div>';
                            $("#resource-alert .rg .panoVideo-box .list").prepend(itemHtml);

                            _this.changeCou({"ty":130,"cid":cid,"cou":1});
                        }
                        else{
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function(){
                        // $("#"+_this.data.panoVideoUpload.uploadObj.data.propressDomId).hide();
                        // $("#"+_this.data.panoVideoUpload.uploadObj.data.propressDomId+" .webuploader-propress-ul").html('');
                        setTimeout(function(){
                            //全景视频-状态轮询
                            _this.loop_panoVideo({});
                        },2000);
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_panoVideo.uploadObj.drag({});
                }
            }
            else if(ty==23030){
                _this.data.upload_img.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function(up_bkData){
                        var fileData=up_bkData;
                        var file_id=fileData.file.id;
                        var file_name=fileData.file.name;
                        _this.data.upload_img.formDatas["file_"+file_id]=formParams;
                    },
                    "upload_filesQueued": function(up_bkData){
                        // console.log(up_bkData);
                        _this.data.upload_img.uploadObj.upload();
                    },
                    "upload_uploadBeforeSend": function(up_bkData){
                        // console.log(up_bkData);
                        var fileData=up_bkData.obj;
                        var file_id=fileData.file.id;
                        var file_name=fileData.file.name;
                        // up_bkData.data.ty=1111;
                        up_bkData.data=$.extend(up_bkData.data,_this.data.upload_img.formDatas["file_"+file_id]);  
                    },
                    "upload_uploadSuccess": function(bkData){
                        // console.log(bkData);
                        var file=bkData.file;
                        var response=bkData.response;
                        var status=response.status;
                        if(status==1){
                            let id=response.id;
                            let img_url=response.url;
                            let name=response.name;
                            _this.data.data_img[id]=response;
                            let itemHtml ='<div class="li" data-id="' + id + '" data-atr="0">' +
                                '<div class="m">' +
                                    '<div class="img" style="background-image: url(' + img_url + ')">' +
                                        '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                    '</div>' +
                                    '<div class="bk"></div>' +
                                    '<div class="gou"></div>' +
                                    '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                    '<div class="name">' + name + '</div>' +
                                '</div>' +
                            '</div>';
                            $("#resource-alert .rg .img-box .list").prepend(itemHtml);

                            _this.changeCou({"ty":23030,"cid":cid,"cou":1});
                        }
                        else{
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function(){
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_img.uploadObj.drag({});
                }
            }
            else if(ty==23031){
                _this.data.upload_video.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function (up_bkData) {
                        var fileData = up_bkData;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        _this.data.upload_video.formDatas["file_" + file_id] = formParams;
                        // _this.data.upload_video.uploadObj.setOption({
                        //     "upload_option": {
                        //         "server": '/Wasee/Index/doUploadResource?type=3&method=1',
                        //     },
                        // });
                    },
                    "upload_filesQueued": function (up_bkData) {
                        // console.log(up_bkData);
                        _this.data.upload_video.uploadObj.upload();
                    },
                    "upload_uploadBeforeSend": function (up_bkData) {
                        // console.log(up_bkData);
                        var fileData = up_bkData.obj;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        // up_bkData.data.ty=1111;
                        up_bkData.data = $.extend(up_bkData.data, _this.data.upload_video.formDatas["file_" + file_id]);
                    },
                    "upload_uploadSuccess": function (bkData) {
                        // console.log(bkData);
                        var file=bkData.file;
                        var response = bkData.response;
                        var status = response.status;
                        if (status == 1) {
                            let id = response.id;
                            let name = response.name;
                            let img_url = response.cover_url;
                            _this.data.data_video[id]=response;
                            let itemHtml ='<div class="li" data-id="' + id + '" data-atr="0">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                            $("#resource-alert .rg .video-box .list").prepend(itemHtml);

                            _this.changeCou({"ty":23031,"cid":cid,"cou":1});
                        }
                        else {
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function () {
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_video.uploadObj.drag({});
                }
            }
            else if(ty==2){
                _this.data.upload_music.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function (up_bkData) {
                        var fileData = up_bkData;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        _this.data.upload_music.formDatas["file_" + file_id] = formParams;
                        // _this.data.upload_music.uploadObj.setOption({
                        //     "upload_option": {
                        //         "server": '/Wasee/Index/doUploadResource?type=3&method=1',
                        //     },
                        // });
                    },
                    "upload_filesQueued": function (up_bkData) {
                        // console.log(up_bkData);
                        _this.data.upload_music.uploadObj.upload();
                    },
                    "upload_uploadBeforeSend": function (up_bkData) {
                        // console.log(up_bkData);
                        var fileData = up_bkData.obj;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        // up_bkData.data.ty=1111;
                        up_bkData.data = $.extend(up_bkData.data, _this.data.upload_music.formDatas["file_" + file_id]);
                    },
                    "upload_uploadSuccess": function (bkData) {
                        // console.log(bkData);
                        var file=bkData.file;
                        var response = bkData.response;
                        var status = response.status;
                        if (status == 1) {
                            let id = response.id;
                            let name = response.name;
                            let img_url = response.cover_url;
                            _this.data.data_music[id]=response;
                            let itemHtml ='<div class="li" data-id="' + id + '" data-atr="0">' +
                                        '<div class="m">' +
                                            '<div class="trpm-flex-y info">' +
                                                '<div class="trpm-flex-y tl">' +
                                                    '<i class="trpm-iconfont icon_kaishi music-play"></i>'+
                                                    '<div class="name">' + name + '</div>' +
                                                '</div>' +
                                                '<div class="bk"></div>' +
                                                '<div class="gou"></div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>';
                            $("#resource-alert .rg .music-box .list").prepend(itemHtml);

                            _this.changeCou({"ty":2,"cid":cid,"cou":1});
                        }
                        else {
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function () {
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_music.uploadObj.drag({});
                }
            }
            else if(ty==4){
                _this.data.upload_doc.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function(up_bkData){
                        var fileData=up_bkData;
                        var file_id=fileData.file.id;
                        var file_name=fileData.file.name;
                        _this.data.upload_doc.formDatas["file_"+file_id]=formParams;
                    },
                    "upload_filesQueued": function(up_bkData){
                        // console.log(up_bkData);
                        _this.data.upload_doc.uploadObj.upload();
                    },
                    "upload_uploadBeforeSend": function(up_bkData){
                        // console.log(up_bkData);
                        var fileData=up_bkData.obj;
                        var file_id=fileData.file.id;
                        var file_name=fileData.file.name;
                        // up_bkData.data.ty=1111;
                        up_bkData.data=$.extend(up_bkData.data,_this.data.upload_doc.formDatas["file_"+file_id]);  
                    },
                    "upload_uploadSuccess": function(bkData){
                        // console.log(bkData);
                        var file=bkData.file;
                        var response=bkData.response;
                        var status=response.status;
                        if(status==1){
                            let id=response.id;
                            let doc_url=response.url;
                            let name=response.name;
                            let img_url=paramObj.resourcePublic+'/trpm/resource/img/pdf.png';
                            if(doc_url.includes('.doc')){
                                img_url=paramObj.resourcePublic+'/trpm/resource/img/word.png';
                            }
                            _this.data.data_doc[id]=response;
                            let itemHtml ='<div class="li" data-id="' + id + '" data-atr="0">' +
                                '<div class="m">' +
                                    '<div class="img" style="background-image: url(' + img_url + ');background-size: 40%;">' +
                                        '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                    '</div>' +
                                    '<div class="bk"></div>' +
                                    '<div class="gou"></div>' +
                                    '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                    '<div class="name">' + name + '</div>' +
                                '</div>' +
                            '</div>';
                            $("#resource-alert .rg .doc-box .list").prepend(itemHtml);

                            _this.changeCou({"ty":4,"cid":cid,"cou":1});
                        }
                        else{
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function(){
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_doc.uploadObj.drag({});
                }
            }
            else if(ty==5){
                formParams.auth_type=1;
                formParams.model_type=1;
                _this.data.upload_model.file_cou=0,_this.data.upload_model.file_fail=[];
                _this.data.upload_model.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function (up_bkData) {
                        // console.log("upload_fileQueued----",up_bkData);
                        var fileData = up_bkData.file;
                        var file_id = fileData.id;
                        var file_name = fileData.name;
                        formParams.name=file_name;
                        geFormData();
                        function geFormData(){
                            _this.getModelFormData({
                                "params": formParams,
                                "callBack": function (bkData) {
                                    // console.log(bkData);
                                    var upToOssData = bkData.data;
                                    if (_this.data.upload_model.isExpire == 1) {
                                        var curTime = new Date().getTime() / 1000;
                                        _this.data.upload_model.expireTime = curTime + upToOssData.expire;
                                        _this.data.upload_model.formData.policy = upToOssData.policy;
                                        _this.data.upload_model.formData.OSSAccessKeyId = upToOssData.accessid;
                                        _this.data.upload_model.formData.signature = upToOssData.signature;
                                    }
                                    var formData = {
                                        "policy": _this.data.upload_model.formData.policy,
                                        "OSSAccessKeyId": _this.data.upload_model.formData.OSSAccessKeyId,
                                        "signature": _this.data.upload_model.formData.signature,
                                        "key": upToOssData.dir + (new Date()).getTime() + '/${filename}',
                                        "oss_host": upToOssData.host,
                                        "callback": upToOssData.callback,
                                    };
                                    _this.data.upload_model.formDatas["file_" + file_id] = formData;
                                    // console.log(_this.data.upload_model.formData);
                                    // console.log(formData);
                                    _this.data.upload_model.uploadObj.setOption({
                                        "upload_option": {
                                            "server": upToOssData.host,
                                            // "formData":_this.data.upload_model.formData
                                        },
                                    });
                                    // _this.data.upload_model.uploadObj.upload();
                                    _this.data.upload_model.flag=true;
                                }
                            });
                        }
                    },
                    "upload_filesQueued": function (up_bkData) {
                        // console.log("upload_filesQueued-----",up_bkData);
                        _this.data.upload_model.file_cou=up_bkData.file.length;
                        function a(){
                            if(_this.data.upload_model.file_cou==up_bkData.file.length){
                                if(_this.data.upload_model.file_fail.length==0){
                                    _this.data.upload_model.uploadObj.upload();
                                }
                                else{
                                    for(let i=0;i<up_bkData.file.length;i++){
                                        _this.data.upload_model.uploadObj.removeFile({"file":up_bkData.file[i]});
                                    }
                                }
                                // if(_this.data.upload_model.file_fail.length>0){
                                //     for(let i=0;i<_this.data.upload_model.file_fail.length;i++){
                                //         _this.data.upload_model.uploadObj.removeFile({"file":_this.data.upload_model.file_fail[i]});
                                //     }
                                // }
                                // _this.data.upload_model.uploadObj.upload();
                            }
                            else{
                                setTimeout(function(){
                                    a();
                                },100);
                            }
                        }
                        a();
                    },
                    "upload_uploadBeforeSend": function (up_bkData) {
                        // console.log("upload_uploadBeforeSend",up_bkData);
                        var fileData = up_bkData.obj;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        // up_bkData.data.category_id=0;
                        up_bkData.data = $.extend(up_bkData.data, _this.data.upload_model.formDatas["file_" + file_id]);
                    },
                    "upload_uploadSuccess": function (bkData) {
                        console.log("upload_uploadSuccess",bkData);
                        var file=bkData.file;
                        var response = bkData.response;
                        var status = response.status;
                        if (status == 1) {
                            let id = response.data.id;
                            let name = file.name;
                            let img_url="";
                            _this.data.data_model[id]={"id":id,"name":name};
                            _this.data.unFinishedData[ty].push(id);
                            let itemHtml ='<div class="li sta1" data-id="' + id + '" data-atr="0">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">处理中</div>' +
                                        '</div>' +
                                    '</div>';
                            $("#resource-alert .rg .model-box .list").prepend(itemHtml);
                            // //获取详情
                            // var paramsObj = {
                            //     "type": "POST",
                            //     "url": '/Wasee/Index/getResourceList',
                            //     "params": {type: 5,id:id},
                            //     "callBack": function (reParams) {
                            //         // console.log(reParams);
                            //         let reData = reParams.data;
                            //         if (reData.status == 1 && reData.count>0) {
                            //             let curObj=reData.data[0];
                            //             // console.log(curObj);
                            //             let name=curObj.name;
                            //             let img_url=curObj.cover_url;
                            //             _this.data.data_model[id]=curObj;
                            //             _this.data.unFinishedData[ty].push(id);
                            //             let itemHtml ='<div class="li" data-id="' + id + '" data-atr="0">' +
                            //                         '<div class="m">' +
                            //                             '<div class="img" style="background-image: url(' + img_url + ')">' +
                            //                                 '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                            //                             '</div>' +
                            //                             '<div class="bk"></div>' +
                            //                             '<div class="gou"></div>' +
                            //                             '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                            //                             '<div class="name">' + name + '</div>' +
                            //                         '</div>' +
                            //                     '</div>';
                            //             $("#resource-alert .rg .model-box .list").prepend(itemHtml);
                            //         }
                            //     }
                            // };
                            // trpm.ajax(paramsObj);
                            _this.changeCou({"ty":5,"cid":cid,"cou":1});
                        }
                        else {
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function () {
                        // console.log("upload_uploadFinished");
                        $("#"+_this.data.upload_model.uploadObj.data.propressDomId).hide();
                        $("#"+_this.data.upload_model.uploadObj.data.propressDomId+" .webuploader-propress-ul").html('');
                        setTimeout(function () {
                            //全景-状态轮询
                            _this.loop_model({});
                        }, 2000);
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_model.uploadObj.drag({});
                }
            }
            else if(ty==6){
                formParams.auth_type=1;
                formParams.model_type=2;
                _this.data.upload_model2.file_cou=0,_this.data.upload_model2.file_fail=[];
                _this.data.upload_model2.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function (up_bkData) {
                        // console.log("upload_fileQueued----",up_bkData);
                        var fileData = up_bkData.file;
                        var file_id = fileData.id;
                        var file_name = fileData.name;
                        formParams.name=file_name;
                        geFormData();
                        function geFormData(){
                            _this.getModelFormData2({
                                "params": formParams,
                                "callBack": function (bkData) {
                                    // console.log(bkData);
                                    var upToOssData = bkData.data;
                                    if (_this.data.upload_model2.isExpire == 1) {
                                        var curTime = new Date().getTime() / 1000;
                                        _this.data.upload_model2.expireTime = curTime + upToOssData.expire;
                                        _this.data.upload_model2.formData.policy = upToOssData.policy;
                                        _this.data.upload_model2.formData.OSSAccessKeyId = upToOssData.accessid;
                                        _this.data.upload_model2.formData.signature = upToOssData.signature;
                                    }
                                    var formData = {
                                        "policy": _this.data.upload_model2.formData.policy,
                                        "OSSAccessKeyId": _this.data.upload_model2.formData.OSSAccessKeyId,
                                        "signature": _this.data.upload_model2.formData.signature,
                                        "key": upToOssData.dir + (new Date()).getTime() + '/${filename}',
                                        "oss_host": upToOssData.host,
                                        "callback": upToOssData.callback,
                                    };
                                    _this.data.upload_model2.formDatas["file_" + file_id] = formData;
                                    // console.log(_this.data.upload_model2.formData);
                                    // console.log(formData);
                                    _this.data.upload_model2.uploadObj.setOption({
                                        "upload_option": {
                                            "server": upToOssData.host,
                                            // "formData":_this.data.upload_model2.formData
                                        },
                                    });
                                    // _this.data.upload_model2.uploadObj.upload();
                                    _this.data.upload_model2.flag=true;
                                }
                            });
                        }
                    },
                    "upload_filesQueued": function (up_bkData) {
                        // console.log("upload_filesQueued-----",up_bkData);
                        _this.data.upload_model2.file_cou=up_bkData.file.length;
                        function a(){
                            if(_this.data.upload_model2.file_cou==up_bkData.file.length){
                                if(_this.data.upload_model2.file_fail.length==0){
                                    _this.data.upload_model2.uploadObj.upload();
                                }
                                else{
                                    for(let i=0;i<up_bkData.file.length;i++){
                                        _this.data.upload_model2.uploadObj.removeFile({"file":up_bkData.file[i]});
                                    }
                                }
                                // if(_this.data.upload_model2.file_fail.length>0){
                                //     for(let i=0;i<_this.data.upload_model2.file_fail.length;i++){
                                //         _this.data.upload_model2.uploadObj.removeFile({"file":_this.data.upload_model2.file_fail[i]});
                                //     }
                                // }
                                // _this.data.upload_model2.uploadObj.upload();
                            }
                            else{
                                setTimeout(function(){
                                    a();
                                },100);
                            }
                        }
                        a();
                    },
                    "upload_uploadBeforeSend": function (up_bkData) {
                        // console.log("upload_uploadBeforeSend",up_bkData);
                        var fileData = up_bkData.obj;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        // up_bkData.data.category_id=0;
                        up_bkData.data = $.extend(up_bkData.data, _this.data.upload_model2.formDatas["file_" + file_id]);
                    },
                    "upload_uploadSuccess": function (bkData) {
                        console.log("upload_uploadSuccess",bkData);
                        var file=bkData.file;
                        var response = bkData.response;
                        var status = response.status;
                        if (status == 1) {
                            let id = response.data.id;
                            let name = file.name;
                            let img_url="";
                            _this.data.data_model2[id]={"id":id,"name":name};
                            _this.data.unFinishedData[ty].push(id);
                            let itemHtml ='<div class="li sta1" data-id="' + id + '" data-atr="0">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                            '<div class="tips">处理中</div>' +
                                        '</div>' +
                                    '</div>';
                            $("#resource-alert .rg .model2-box .list").prepend(itemHtml);
                            // //获取详情
                            // var paramsObj = {
                            //     "type": "POST",
                            //     "url": '/Wasee/Index/getResourceList',
                            //     "params": {type: 6,id:id},
                            //     "callBack": function (reParams) {
                            //         // console.log(reParams);
                            //         let reData = reParams.data;
                            //         if (reData.status == 1 && reData.count>0) {
                            //             let curObj=reData.data[0];
                            //             // console.log(curObj);
                            //             let name=curObj.name;
                            //             let img_url=curObj.cover_url;
                            //             _this.data.data_model[id]=curObj;
                            //             _this.data.unFinishedData[ty].push(id);
                            //             let itemHtml ='<div class="li" data-id="' + id + '" data-atr="0">' +
                            //                         '<div class="m">' +
                            //                             '<div class="img" style="background-image: url(' + img_url + ')">' +
                            //                                 '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                            //                             '</div>' +
                            //                             '<div class="bk"></div>' +
                            //                             '<div class="gou"></div>' +
                            //                             '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                            //                             '<div class="name">' + name + '</div>' +
                            //                         '</div>' +
                            //                     '</div>';
                            //             $("#resource-alert .rg .model2-box .list").prepend(itemHtml);
                            //         }
                            //     }
                            // };
                            // trpm.ajax(paramsObj);
                            _this.changeCou({"ty":6,"cid":cid,"cou":1});
                        }
                        else {
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function () {
                        // console.log("upload_uploadFinished");
                        $("#"+_this.data.upload_model2.uploadObj.data.propressDomId).hide();
                        $("#"+_this.data.upload_model2.uploadObj.data.propressDomId+" .webuploader-propress-ul").html('');
                        setTimeout(function () {
                            //全景-状态轮询
                            _this.loop_model2({});
                        }, 2000);
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_model2.uploadObj.drag({});
                }
            }
            else if(ty==8){
                _this.data.upload_texture.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function (up_bkData) {
                        var fileData = up_bkData;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        _this.data.upload_texture.formDatas["file_" + file_id] = formParams;
                        // _this.data.upload_texture.uploadObj.setOption({
                        //     "upload_option": {
                        //         "server": '/Wasee/Index/doUploadResource?type=3&method=1',
                        //     },
                        // });
                    },
                    "upload_filesQueued": function (up_bkData) {
                        // console.log(up_bkData);
                        _this.data.upload_texture.uploadObj.upload();
                    },
                    "upload_uploadBeforeSend": function (up_bkData) {
                        // console.log(up_bkData);
                        var fileData = up_bkData.obj;
                        var file_id = fileData.file.id;
                        var file_name = fileData.file.name;
                        // up_bkData.data.ty=1111;
                        up_bkData.data = $.extend(up_bkData.data, _this.data.upload_texture.formDatas["file_" + file_id]);
                    },
                    "upload_uploadSuccess": function (bkData) {
                        // console.log(bkData);
                        var file=bkData.file;
                        var response = bkData.response;
                        var status = response.status;
                        if (status == 1) {
                            let id = response.id;
                            let name = response.name;
                            let img_url = response.cover_url;
                            _this.data.data_texture[id]=response;
                            let itemHtml ='<div class="li li2" data-id="' + id + '" data-atr="0">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="bk"></div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                            $("#resource-alert .rg .texture-box .list").prepend(itemHtml);

                            _this.changeCou({"ty":8,"cid":cid,"cou":1});
                        }
                        else {
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function () {
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_texture.uploadObj.drag({});
                }
            }
            else if(ty==9){
                _this.data.upload_tietu.uploadObj.setOption({
                    "upload_dndAccept": function (bkData) {
                        console.log("upload_dndAccept", bkData);
                    },
                    "upload_fileQueued": function(up_bkData){
                        var fileData=up_bkData;
                        var file_id=fileData.file.id;
                        var file_name=fileData.file.name;
                        _this.data.upload_tietu.formDatas["file_"+file_id]=formParams;
                    },
                    "upload_filesQueued": function(up_bkData){
                        // console.log(up_bkData);
                        _this.data.upload_tietu.uploadObj.upload();
                    },
                    "upload_uploadBeforeSend": function(up_bkData){
                        // console.log(up_bkData);
                        var fileData=up_bkData.obj;
                        var file_id=fileData.file.id;
                        var file_name=fileData.file.name;
                        // up_bkData.data.ty=1111;
                        up_bkData.data=$.extend(up_bkData.data,_this.data.upload_tietu.formDatas["file_"+file_id]);  
                    },
                    "upload_uploadSuccess": function(bkData){
                        // console.log(bkData);
                        var file=bkData.file;
                        var response=bkData.response;
                        var status=response.status;
                        if(status==1){
                            let id=response.id;
                            let img_url=response.url;
                            let name=response.name;
                            _this.data.data_tietu[id]=response;
                            let itemHtml ='<div class="li" data-id="' + id + '" data-atr="0">' +
                                '<div class="m">' +
                                    '<div class="img" style="background-image: url(' + img_url + ')">' +
                                        '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                    '</div>' +
                                    '<div class="bk"></div>' +
                                    '<div class="gou"></div>' +
                                    '<div class="eye"><i class="trpm-iconfont icon_preview"></i></div>' +
                                    '<div class="name">' + name + '</div>' +
                                '</div>' +
                            '</div>';
                            $("#resource-alert .rg .tietu-box .list").prepend(itemHtml);

                            _this.changeCou({"ty":9,"cid":cid,"cou":1});
                        }
                        else{
                            layer.msg(response.info,{time:2000}); 
                        }
                    },
                    "upload_uploadFinished": function(){
                    }
                });
                if(_this.data.drag){
                    //拖拽弹框
                    _this.data.upload_tietu.uploadObj.drag({});
                }
            }
        },
        //获取全景表单数据
        getPanoFormData: function (obj) {
            var _this = this;
            var params = { "web": 1 };
            params=$.extend({},params, obj.params);
            var ajaxUrl = '/Wasee/VRIndex/getUploadPanoMediaData';
            var _now = new Date().getTime() / 1000;
            if (_now > _this.data.upload_pano.expireTime) {
                _this.data.upload_pano.isExpire = 1;
                ajaxUrl += '&expire=1';
            } else {
                _this.data.upload_pano.isExpire = 0;
            }
            var paramsObj = {
                "type": "POST",
                "async": false,
                "url": ajaxUrl,
                "params": params,
                "callBack": function (reParams) {
                    // console.log(reParams);
                    var reData = reParams.data;
                    if (reData.status == 1) {
                        if ($.isFunction(obj.callBack)) {
                            obj.callBack(reData);
                        }
                    }
                    else {
                        layer.msg(reData.info,{time:1500}); 
                    }
                }
            };
            trpm.ajax(paramsObj);
        },
        //获取矩阵表单数据
        getScenicFormData: function (obj) {
            var _this = this;
            var params = { "web": 1 };
            params=$.extend({},params, obj.params);
            var ajaxUrl = '/Wasee/VRIndex/getUploadPanoMediaData';
            var _now = new Date().getTime() / 1000;
            if (_now > _this.data.upload_scenic.expireTime) {
                _this.data.upload_scenic.isExpire = 1;
                ajaxUrl += '&expire=1';
            } else {
                _this.data.upload_scenic.isExpire = 0;
            }
            var paramsObj = {
                "type": "POST",
                "async": false,
                "url": ajaxUrl,
                "params": params,
                "callBack": function (reParams) {
                    // console.log(reParams);
                    var reData = reParams.data;
                    if (reData.status == 1) {
                        if ($.isFunction(obj.callBack)) {
                            obj.callBack(reData);
                        }
                    }
                    else {
                        layer.msg(reData.info,{time:1500}); 
                    }
                }
            };
            trpm.ajax(paramsObj);
        },
        //获取全景视频表单数据
        getPanoVideoFormData: function(obj){
            var _this=this;
            var params={"web":1};
            params=$.extend({},params, obj.params);
            var ajaxUrl='/Wasee/VRIndex/doUploadPanoVideo';
            var _now = new Date().getTime() / 1000;
            if (_now > _this.data.upload_panoVideo.expireTime) {
                _this.data.upload_panoVideo.isExpire = 1;
                ajaxUrl += '&expire=1';
            } else {
                _this.data.upload_panoVideo.isExpire = 0;
            }
            var paramsObj={
                "type" : "POST",
                "async": false,
                "url" : ajaxUrl,
                "params" : params,
                "callBack" : function(reParams){
                    // console.log(reParams);
                    var reData=reParams.data;
                    if(reData.status==1){
                        if ($.isFunction(obj.callBack)) {
                            obj.callBack(reData);
                        }
                    }
                    else{
                        layer.msg(reData.info,{time:1500}); 
                    }
                }
            };
            trpm.ajax(paramsObj);
        },
        //获取模型表单数据
        getModelFormData: function (obj) {
            var _this = this;
            var params = { "web": 1 };
            params=$.extend({},params, obj.params);
            var ajaxUrl = '/Wasee/VRIndex/getUploadModelData';
            var _now = new Date().getTime() / 1000;
            if (_now > _this.data.upload_model.expireTime) {
                _this.data.upload_model.isExpire = 1;
                ajaxUrl += '&expire=1';
            } else {
                _this.data.upload_model.isExpire = 0;
            }
            var paramsObj = {
                "type": "POST",
                "async": false,
                "url": ajaxUrl,
                "params": params,
                "callBack": function (reParams) {
                    // console.log(reParams);
                    var reData = reParams.data;
                    if (reData.status == 1) {
                        if ($.isFunction(obj.callBack)) {
                            obj.callBack(reData);
                        }
                    }
                    else {
                        layer.msg(reData.info,{time:1500}); 
                    }
                }
            };
            trpm.ajax(paramsObj);
        },
        //获取模型表单数据-倾斜摄影
        getModelFormData2: function (obj) {
            var _this = this;
            var params = { "web": 1 };
            params=$.extend({},params, obj.params);
            var ajaxUrl = '/Wasee/VRIndex/getUploadModelData';
            var _now = new Date().getTime() / 1000;
            if (_now > _this.data.upload_model2.expireTime) {
                _this.data.upload_model2.isExpire = 1;
                ajaxUrl += '&expire=1';
            } else {
                _this.data.upload_model2.isExpire = 0;
            }
            var paramsObj = {
                "type": "POST",
                "async": false,
                "url": ajaxUrl,
                "params": params,
                "callBack": function (reParams) {
                    // console.log(reParams);
                    var reData = reParams.data;
                    if (reData.status == 1) {
                        if ($.isFunction(obj.callBack)) {
                            obj.callBack(reData);
                        }
                    }
                    else {
                        layer.msg(reData.info,{time:1500}); 
                    }
                }
            };
            trpm.ajax(paramsObj);
        },
        //改变数量
        changeCou: function(obj){
            var _this=this;
            let ty=obj.ty ? obj.ty : _this.data.cur_ty;
            let cid=obj.cid ? obj.cid : 0;
            let cou=obj.cou ? obj.cou : 1;
            let treeDom=null;
            if(ty==121){ //全景分类
                treeDom=$("#resource-alert .lf .pano-tree");
            }
            else if(ty==3){ //高清矩阵
                treeDom=$("#resource-alert .lf .scenic-tree");
            }
            else if(ty==130){ //全景视频分类
                treeDom=$("#resource-alert .lf .panoVideo-tree");
            }
            else if(ty==23030){ //图片
                treeDom=$("#resource-alert .lf .img-tree");
            }
            else if(ty==23031){ //视频
                treeDom=$("#resource-alert .lf .video-tree");
            }
            else if(ty==2){ //音乐
                treeDom=$("#resource-alert .lf .music-tree");
            }            
            else if(ty==4){ //文档
                treeDom=$("#resource-alert .lf .doc-tree");
            }
            else if(ty==5){ //模型
                treeDom=$("#resource-alert .lf .model-tree");
            }
            else if(ty==6){ //模型-倾斜摄影
                treeDom=$("#resource-alert .lf .model2-tree");
            }
            else if(ty==8){ //视频
                treeDom=$("#resource-alert .lf .texture-tree");
            }
            else if(ty==9){ //贴图
                treeDom=$("#resource-alert .lf .tietu-tree");
            }
            else if(ty==10){ //公共图片
                treeDom=$("#resource-alert .lf .sysImg-tree");
            }
            else if(ty==20){ //公共音乐
                treeDom=$("#resource-alert .lf .sysMusic-tree");
            }
            else if(ty==30){ //公共视频
                treeDom=$("#resource-alert .lf .sysVideo-tree");
            }
            else if(ty==50){ //公共模型
                treeDom=$("#resource-alert .lf .sysModel-tree");
            }
            else if(ty==70){ //公共Hdr
                treeDom=$("#resource-alert .lf .sysHdr-tree");
            }
            else if(ty==80){ //公共材质
                treeDom=$("#resource-alert .lf .sysTexture-tree");
            }
            else if(ty==90){ //公共贴图
                treeDom=$("#resource-alert .lf .sysTietu-tree");
            }

            if(treeDom){
                let subCou=treeDom.find(".tree-uls .tree-tl[data-id=-1] .cou").text();
                treeDom.find(".tree-uls .tree-tl[data-id=-1] .cou").html(Number(subCou)+cou);

                let curCou=treeDom.find(".tree-uls .tree-tl[data-id="+cid+"] .cou").text();
                treeDom.find(".tree-uls .tree-tl[data-id="+cid+"] .cou").html(Number(curCou)+cou);
            }
        },
        
        //合成音频
        synthesis: function(obj) {
            let _this=this;
            let ty=obj.ty ? obj.ty : _this.data.cur_ty;
            let listParams=_this.data.params[ty];
            let synthesisParams=_this.data.synthesisParams;
            //导入js
            trpm.loadScript({"id":"synthesis_script","url":_this.data.resourcePublic + '/trpm/voice/js/synthesis1.2.js?ver=' + new Date().getTime()}).then(function (res) {
                fun();
            }).catch(function (rej) {
                console.log("synthesis_script ", rej);
            });

            function fun() {                
                let formParams={"cid":0};
                if(listParams && listParams.cid){
                    formParams.cid=listParams.cid;
                }
                if(synthesisParams && synthesisParams.data){
                    formParams=Object.assign(formParams,synthesisParams.data);
                }
                console.log(formParams);

                //语音合成
                let synthesisObj = new synthesisModule({"trpm_public": synthesisParams.trpm_public ? synthesisParams.trpm_public : 0});
                synthesisObj.alert({
                    "skin":synthesisParams.skin,
                    "upParams": formParams,
                    "live_vkey": synthesisParams.live_vkey,
                    "pano_is_buy": synthesisParams.pano_is_buy,
                    "format_pano_expire": synthesisParams.format_pano_expire,
                    "enterprise_status": synthesisParams.enterprise_status,
                    "ok_callBack": function (bkData) {
                        console.log(bkData);
                        //获取列表
                        _this.getList({"params":{"pageIndex":1,"keyword":""}});
                        _this.changeCou({"ty":2,"cid":formParams.cid,"cou":1});
                    },
                    "pay_callBack": function (bkData) {
                        console.log(bkData);
                        if (bkData.format_pano_expire) {
                            synthesisParams.format_pano_expire = bkData.format_pano_expire;
                        }
                    },
                });
            }
        },

        //扩容
        kuorong: function(){   
            let _this=this; 
            let buyBtn='<span class="kr kuoBtn">扩容</span>';  
            if(_this.data.kuorong==2){
                return;
            }  
            else if(_this.data.kuorong==3){
                buyBtn='';
            }   
            $('.trpm-alert.resource-alert .trpm-mc .btn-d').prepend(`<div class="space-box">空间容量：<span class="space-contain-text"><span class="curSpaceSize">0</span>/<span class="totalSpaceSize">0</span></span>${buyBtn}</div>`)
            // 上传个数：<span>2</span>/<span>1000</span>个<span class="kr kuoBtn2">扩容</span>
            trpm.ajax({
                "type" : "POST",
                "url" : '/Wasee/VRIndex/getSpaceSize',
                "callBack" : function(reParams){
                    var reData=reParams.data;
                    if(reData.status==1){
                       let data=reData.data;
                       let curSpaceSize=format_file_size(data.curSpaceSize);
                       let totalSpaceSize=format_file_size(data.totalSpaceSize);
                       let payUpgradeObj= new payUpgradeModule();
                       let format_pano_expire= data.format_pano_expire;
                       $('.resource-alert .curSpaceSize').text(curSpaceSize);                  
                       $('.resource-alert .totalSpaceSize').text((Number(totalSpaceSize) + Number(paramObj.base_format_pano_expire||paramObj.format_pano_expire ? format_file_size(paramObj.pano_space_size) : 0) + Number(paramObj.format_green_expire ? format_file_size(paramObj.green_space_size) : 0) + Number(paramObj.format_metaverse_expire ? format_file_size(paramObj.metaverse_space_size) : 0) + Number(format_file_size(paramObj.free_space_size)))+'GB'); 
                       if(!format_pano_expire) $('.resource-alert .kuoBtn').show();
                       $('.resource-alert').on('click','.kuoBtn',function(){
                          payUpgradeObj.spaceAlert({
                            "skin":_this.data.skin,
                            // "live_vkey": "{$Think.config.LIVE_VKEY}",
                            "format_pano_expire": format_pano_expire,
                            "pay_callBack": function (bkData) {
                                // console.log(bkData.data);
                            }
                          })
                       })             
                    }
                    function format_file_size(limit) {
                        if (limit == 0) return 0 ;
                        var size = "";
                        if (limit < 0.1 * 1024) {                            //小于0.1KB，则转化成B
                            size = limit.toFixed(2) + "B"
                        } else if (limit < 0.1 * 1024 * 1024) {            //小于0.1MB，则转化成KB
                            size = (limit / 1024).toFixed(2) + "KB"
                        } else if (limit < 0.1 * 1024 * 1024 * 1024) {        //小于0.1GB，则转化成MB
                            size = (limit / (1024 * 1024)).toFixed(2) + "MB"
                        } else {                                            //其他转化成GB
                            size = (limit / (1024 * 1024 * 1024)).toFixed(2) 
                        }
    
                        var sizeStr = size + "";                        //转成字符串
                        var index = sizeStr.indexOf(".");                    //获取小数点处的索引
                        var dou = sizeStr.substr(index + 1, 2)            //获取小数点后两位的值
                        if (dou == "00") {                                //判断后两位是否为00，如果是则删除00                
                            return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
                        }
                        return size;
                    }
                }
            });
        },
    }

    window.materialModule=materialModule;
}())
