// pages/orders.js
//获取应用实例
const app = getApp();
var order = require('../utils/order.js')
//orderType = 0,

Page({

  data: {
    isLoading: true,
    isOperate: false,
    isNoNetError: true,
    orders: [],
    isHideLoadMore: true,
    isNoNetError: true,
    showExpressModal: false,
    _: app.globalData._.config,
    navStatus: null
  },

  loadData: function () {
    var that = this;
    //请求订单列表
    that.data.orders = [];
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/orders',
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      data: { order_status: (that.data.navStatus == null ? "" : that.data.navStatus),offset: that.data.orders.length, size: 30 },
      success: function (res) {
        if (res.data.result == 'ok') {
          that.setData({
            orders: res.data.order_list
          });
        }
        
        that.setData({
          isNoNetError: true
        });
      },
      fail: function (res) {
        that.setData({
          isNoNetError: false
        });
      },
      complete: function (res) {
        wx.stopPullDownRefresh();
        that.setData({
          isLoading: false
        });
      }
    });
  },
  
  onPullDownRefresh: function () {
    this.loadData();
  },

  onReachBottom: function () {
    if (this.data.isHideLoadMore) {
      this.loadMore();
    }
  },

  loadMore: function () {
    var that = this;
    that.setData({
      isHideLoadMore: false
    });
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/orders',
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      data: { offset: that.data.orders.length, size: 15 },
      success: function (res) {
        if (res.data.result == 'ok') {
          that.setData({
            orders: that.data.orders.concat(res.data.order_list)
          });
        }
      },
      fail: function (res) {

      },
      complete: function (res) {

        that.setData({
          isHideLoadMore: true
        });
      }
    });
  },

  navChange: function(e) {
    var navStatus = e.currentTarget.dataset.nav_status; 
    if ('3' == navStatus){
      navStatus = null;
    }
    this.setData({ navStatus: navStatus,isLoading: true,isOperate: true }),
    this.loadData()
  },

  onLoad: function (options) {
    this.setData({ navStatus: options.order_type || null}),
    this.loadData();
  },

  orderReceive: function (e) {
    var that = this, orderId = e.currentTarget.dataset.order_id;
    order.receive(that,orderId, function (res) {
      if (res.data.result == 'ok') {
        wx.startPullDownRefresh();
      }
    }, function (res) {
    });
  },

  orderCancel: function(e) {
    var that = this, orderId = e.currentTarget.dataset.order_id;
    order.cancel(that,orderId, function (res) {
      if (res.data.result == 'ok') {
        wx.startPullDownRefresh();
      }
    }, function (res) {
    });
  },
  
  orderBuy: function(e) {
    if (this.data.isPayDisable) return true;

    this.setData({ "isPayDisable": true });
    var that = this, orderId = e.currentTarget.dataset.order_id;


    order.pay(orderId,function(res) {


      if (res.data.result == 'fail') {

        that.setData({ showWinpopModal: true, showWinpopCancel: false, winpopContent: res.data.error_info });
        
      } else if(res.data.result == 'ok') {
        order.goPay(res.data.param,function(){
          // 支付成功
          order.paySuccess(orderId)
          
        }, function (res) {

          that.setData({ "isPayDisable": false })
          console.log(res)
        },function() {
          
        });
      } else {
        that.setData({ showWinpopModal: true, showWinpopCancel: false, winpopContent: that.data._.error_text[0] })
      }


      that.confirmCallback = function () {
        wx.startPullDownRefresh(),
        that.setData({ "isPayDisable": false })
      }
      
    },function() {

    },function() {
      
    });
  },

  expressShow: function(e) {
    var that = this, orderId = e.currentTarget.dataset.order_id;
    
    this.setData({ showExpressModal: true, IsLoadingExpress: true, Express: null, isNoNetErrorExpress: false});

    order.express(orderId, function (res) {
      if (res.data.result == 'ok'){
        that.setData({ Express: res.data.shipping});
      }else{

        that.setData({isNoNetErrorExpress:true});
        
      }
    }, function (res){

      that.setData({ isNoNetErrorExpress: true });

    },function(res){

      that.setData({ IsLoadingExpress: false});
    });

  },

  onTabItemTap: function (item) {
    this.setData({ navStatus: null }),
    wx.startPullDownRefresh();
  },
  
  onReady: function () {

  },

  
  onShow: function () {
    //wx.startPullDownRefresh();
  },

  
  onHide: function () {

  },

  
  onUnload: function () {

  }
  
})