(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-game-list"],{2875:function(t,i,a){"use strict";a("7a82"),Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0,a("d3b7");var e={data:function(){return{lists:[]}},onLaunch:function(){console.log("App Launch")},onLoad:function(){this.getList()},onHide:function(){},methods:{getList:function(){var t=this,i=uni.getStorageSync("storage_user");this.$Z.post(i.reqUrl+"/activity/awardList",{page:1,rows:1e3,token:i.token,t:(new Date).getTime()},{native:!1}).then((function(i){t.lists=i.data.data})).catch((function(t){})).finally((function(t){}))},lookDetail:function(t){uni.navigateTo({url:"/pages/game/detail?id="+t})}}};i.default=e},"3e2b":function(t,i,a){"use strict";var e=a("93e5"),n=a.n(e);n.a},4458:function(t,i,a){"use strict";a.r(i);var e=a("2875"),n=a.n(e);for(var s in e)["default"].indexOf(s)<0&&function(t){a.d(i,t,(function(){return e[t]}))}(s);i["default"]=n.a},5227:function(t,i,a){"use strict";a.r(i);var e=a("7b5a"),n=a("4458");for(var s in n)["default"].indexOf(s)<0&&function(t){a.d(i,t,(function(){return n[t]}))}(s);a("3e2b");var o=a("f0c5"),l=Object(o["a"])(n["default"],e["b"],e["c"],!1,null,"5d57eb80",null,!1,e["a"],void 0);i["default"]=l.exports},"7b5a":function(t,i,a){"use strict";a.d(i,"b",(function(){return e})),a.d(i,"c",(function(){return n})),a.d(i,"a",(function(){}));var e=function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("v-uni-view",{staticClass:"lists"},[a("v-uni-view",{staticClass:"lists-title"},[t._v("中奖列表")]),0==t.lists.length?a("v-uni-view",{staticClass:"wujilv"},[t._v("暂无记录")]):t._e(),t._l(t.lists,(function(i,e){return t.lists.length>0?a("v-uni-view",{key:e,staticClass:"data-list"},[a("v-uni-view",{staticClass:"data-list-left"},[a("v-uni-view",{staticClass:"data-img"},[a("v-uni-image",{attrs:{src:i.image}})],1),a("v-uni-view",{staticClass:"data-title"},[a("v-uni-view",{staticClass:"data-title0"},[t._v(t._s(i.shop_name))]),a("v-uni-view",{staticClass:"data-title01"},[t._v(t._s(i.award_name))]),a("v-uni-view",{staticClass:"data-title1"},[t._v("一个优惠券仅可使用一次，不得转让")]),0==i.status?a("v-uni-view",{staticStyle:{"font-size":"12px","margin-top":"20upx",color:"green"}},[t._v("未核销")]):t._e(),1==i.status?a("v-uni-view",{staticStyle:{"font-size":"12px","margin-top":"20upx",color:"#999"}},[t._v("已核销")]):t._e(),2==i.status?a("v-uni-view",{staticStyle:{"font-size":"12px","margin-top":"20upx",color:"#999"}},[t._v("已过期")]):t._e()],1)],1),a("v-uni-view",{staticClass:"data-look",on:{click:function(a){arguments[0]=a=t.$handleEvent(a),t.lookDetail(i.id)}}},[a("v-uni-view",{staticStyle:{width:"30px"}},[t._v("查看")]),a("v-uni-view",{staticStyle:{width:"30px"}},[t._v("明细")])],1)],1):t._e()}))],2)},n=[]},"93e5":function(t,i,a){var e=a("b283");e.__esModule&&(e=e.default),"string"===typeof e&&(e=[[t.i,e,""]]),e.locals&&(t.exports=e.locals);var n=a("4f06").default;n("ea16e5c4",e,!0,{sourceMap:!1,shadowMode:!1})},b283:function(t,i,a){var e=a("24fb");i=e(!1),i.push([t.i,".lists-title[data-v-5d57eb80]{padding:%?40?% 0;text-align:center;background-color:#f6bb21;font-size:%?40?%}.lists[data-v-5d57eb80]{background-color:#f5f5f5;min-height:100vh}.data-list[data-v-5d57eb80]{width:80%;padding:%?30?%;margin:0 auto;margin-top:%?40?%;display:flex;flex-direction:row;align-items:center;justify-content:space-between;background-color:#fff;border-radius:%?16?%}.wujilv[data-v-5d57eb80]{margin-top:30%;font-size:%?30?%;color:#999;text-align:center}.data-list-left[data-v-5d57eb80]{display:flex;flex-direction:row;align-items:center}.data-title[data-v-5d57eb80]{margin-left:%?40?%}.data-title0[data-v-5d57eb80]{font-size:%?30?%;font-weight:700}.data-title01[data-v-5d57eb80]{font-size:%?30?%}.data-title1[data-v-5d57eb80]{margin-top:%?20?%;font-size:12px;color:#333}.data-img[data-v-5d57eb80]{width:%?120?%;height:%?80?%}.data-img uni-image[data-v-5d57eb80]{width:100%;height:100%}.data-look[data-v-5d57eb80]{font-size:%?28?%;border-left:1px solid #999;padding:0 %?40?%}",""]),t.exports=i}}]);