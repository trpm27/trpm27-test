(function(){
    class delVideoColor{
        constructor(params){            
            this.url="";
            this.videoId="";
            this.video=null;
            this.canvasId="";
            this.cvs=null;
            this.cvsContent=null;
            this.color="";
            this.tolerance=0;
            this.rgba="";
            this.isCut=1;
            this.sta=0; //是否可以去色
            this.status=0;//播放状态
            this.wh=0; //0宽高固定1宽固定高自动2高固定宽自动3宽高自动
            this.w=180;
            this.h=320;
            this.scale=1;
            this.videoW=1;
            this.videoH=1;
        }
        init(params){
            let _this=this;
            if(params){
                let {url,w,h,wh,videoId,canvasId,color,tolerance=0,callback_play,callback_pause,callback_ended,callback_timeupdate}=params;
                if(url){
                    _this.url=url;
                }
                if(videoId){
                    _this.videoId=videoId;
                }
                if(canvasId){
                    _this.canvasId=canvasId;
                }
                if(color){
                    _this.color=color;
                }
                if(tolerance){
                    _this.tolerance=tolerance;
                }  
                if(wh){
                    _this.wh=wh;
                }
                if(w){
                    _this.w=w;
                }
                if(h){
                    _this.h=h;
                }
                if(callback_play){
                    _this.callback_play=callback_play;
                }
                if(callback_pause){
                    _this.callback_pause=callback_pause;
                }
                if(callback_ended){
                    _this.callback_ended=callback_ended;
                }
                if(callback_timeupdate){
                    _this.callback_timeupdate=callback_timeupdate;
                }
            }
            if(_this.color){
                _this.rgba= typeof _this.color=="string" ? _this.hexToRgba(_this.color) : _this.color;
            }                        
            if(_this.videoId){
                _this.video=document.getElementById(_this.videoId);
            }
            if(_this.canvasId){
                _this.cvs = document.getElementById(_this.canvasId);
                _this.cvsContent = _this.cvs.getContext('2d');
                _this.setWh({});
            }
            _this.event();
        }
        //设置参数
        setParams(params){
            let _this=this;
            let {url,w,h,scale,color,tolerance,isCut,volume,loop}=params;
            if(url!=undefined){
                _this.url=url;
                _this.video.pause();
                _this.video.src=url;
            }
            if(volume!=undefined){
                _this.video.volume=volume;
            }
            if(loop!=undefined){
                _this.video.loop=loop;
            }
            if(scale!=undefined){
                _this.scale=scale;
            }
            if(w!=undefined){
                _this.w=w;
            }
            if(h!=undefined){
                _this.h=h;
            }    
            if(color!=undefined){
                _this.color=color;
                _this.rgba= typeof _this.color=="string" ? _this.hexToRgba(_this.color) : _this.color;
            }    
            if(tolerance!=undefined){
                _this.tolerance=tolerance;
            }  
            if(isCut!=undefined){
                _this.isCut=isCut;
            }   
            if(scale!=undefined || w!=undefined || h!=undefined){
                _this.setWh({}); 
            }
        }
        //设置宽高
        setWh(params){
            let _this=this;
            let {wh=_this.wh,w=_this.w,h=_this.h,scale=_this.scale}=params;
            if(scale!=undefined){
                _this.scale=scale;
            }
            if(wh==3){
                _this.w=_this.videoW;
                _this.h=_this.videoH;
            }
            else if(wh==1){
                _this.w=w;
                _this.h=_this.videoH*_this.w/_this.videoW;
            }
            else if(wh==2){
                _this.w=_this.videoW*_this.h/_this.videoH;
                _this.h=h;
            }
            else{
                _this.w=w;
                _this.h=h;
            }
            _this.cvs.width = _this.w*scale;
            _this.cvs.height = _this.h*scale;    
        }
        //事件
        event(){
            let _this=this;
            //play：播放监听
            _this.video.addEventListener('play', function(e) {
                // console.log('play',e);
                _this.status=1;
                _this.playCallBack();
                _this.evt_play({});
            })            
            //pause：暂停监听
            _this.video.addEventListener('pause', function(e) {
                // console.log('pause',e);
                _this.status=0;
                _this.evt_pause({});
            })            
            //ended：播放结束
            _this.video.addEventListener('ended', function(e) {
                console.log('ended',e);
                _this.status=0;
                _this.evt_ended({});
            })
            //timeupdate：播放时间
            _this.video.addEventListener('timeupdate', function(e) {
                // console.log('timeupdate',e);
                let currentTime=_this.video.currentTime*1000;
                _this.evt_timeupdate({currentTime});                
            }) 

            _this.video.addEventListener("loadedmetadata", async function() {
                _this.videoW = this.videoWidth;
                _this.videoH = this.videoHeight;
                // console.log("loadedmetadata",_this.videoW,_this.videoH,_this.w,_this.h);
                _this.setWh({});
                _this.sta=1;
            })
        }
        //播放回调
        playCallBack () {
            let _this=this;
            function animate() {
				if (_this.video.paused || _this.video.ended) return;
                if (_this.sta){
                    if(_this.isCut==1){
                        //去色
                        _this.delColor({});
                    }
                    else{
                        _this.cvsContent.drawImage(_this.video, 0, 0,_this.w*_this.scale,_this.h*_this.scale);
                    }
                }
                // 循环调用
                // setTimeout(function(){
                //     animate();
                // }, 0);
                requestAnimationFrame( animate );
            }
            animate();
        }        
        //去色
        delColor(params){
            let _this=this;
            let {rgba=_this.rgba,tolerance=_this.tolerance}=params;
            _this.rgba = rgba;
            _this.tolerance = tolerance;
            let [w,h]=[_this.w*_this.scale,_this.h*_this.scale];
            // console.log(_this.color,_this.rgba,_this.tolerance,_this);
            _this.cvsContent.drawImage(_this.video, 0, 0,w,h);
            // 获取像素信息数据
            let imgData = _this.cvsContent.getImageData(0, 0, w,h);
            // 基于原始图片数据处理
			for (let i = 0; i < imgData.data.length; i += 4) {
                let [r,g,b,a]=[
                    imgData.data[i],
                    imgData.data[i + 1],
                    imgData.data[i + 2],
                    imgData.data[i + 3],
                ];
				
				let t=Math.sqrt(
					(r - rgba[0]) ** 2 + 
					(g - rgba[1]) ** 2 + 
					(b - rgba[2]) ** 2
				);
				if (t <= tolerance) {
					imgData.data[i] = 0;
					imgData.data[i + 1] = 0;
					imgData.data[i + 2] = 0;
					imgData.data[i + 3] = 0;
				}
			}
			// put数据
			_this.cvsContent.putImageData(imgData, 0, 0);
        }
        play(params){
            let _this=this;
            if(params){
                _this.setParams(params);
            }
            if(_this.video.src){
                _this.video.play();
            }
        }
        pause(params){
            let _this=this;
            if(_this.video.src){
                _this.video.pause();
            }
        }
        sw(params){
            let _this=this;
            let {url}=params;
            _this.url=url;
            _this.video.src=url;
        }
        evt_play(params){
            let _this=this;
            if(_this.callback_play && typeof _this.callback_play=="function"){
                _this.callback_play({});
            }
        }
        evt_pause(params){
            let _this=this;
            if(_this.callback_pause && typeof _this.callback_pause=="function"){
                _this.callback_pause({});
            }
        }
        evt_ended(params){
            let _this=this;
            if(_this.callback_ended && typeof _this.callback_ended=="function"){
                _this.callback_ended({});
            }
        }
        evt_timeupdate(params){
            let _this=this;
            if(_this.callback_timeupdate && typeof _this.callback_timeupdate=="function"){
                _this.callback_timeupdate(params);
            }
        }        
        //16进制转rgba
		hexToRgba(hex){
			const rgba = [];
			hex = hex.replace('#', '').padEnd(8, 'F');
			for (let i = 0; i < hex.length; i+=2) {
				rgba.push(parseInt(hex.slice(i, i+2), 16))
			}
			return rgba;
		}
    }
    window.trpm_delVideoColor = delVideoColor;
})()
