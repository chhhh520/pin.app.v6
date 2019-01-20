// pages/order.js
//获取应用实例
const app = getApp();
var orderId = 0,
    order = require('../utils/order.js');

Page({


  data: {
    isLoading: true,
    isOperate: false,
    isNoNetError: true,
    order: {},
  },

  loadData: function() {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/orders/' + orderId,
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      success: function (res) {
        that.setData({
          order: res.data.order,
        });
        
        that.setData({ isLoading: false, isOperate: false })

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
      }
    });
  },

  orderReceive: function (e) {
    var that = this, orderId = e.currentTarget.dataset.order_id;
    order.receive(orderId, function (res) {
      if (res.data.result == 'ok') {
        wx.startPullDownRefresh();
      }
    }, function (res) {
    });
  },
  
  orderCancel: function(e) {
    var that = this;
    order.cancel(orderId, function (res) {
      if (res.data.result == 'ok') {
        wx.startPullDownRefresh();
      }
    }, function (res) {
    });
        
  },

  orderBuy: function (e) {
    var that = this;
    orderId = e.currentTarget.dataset.order_id,
      order.pay(orderId, function (res) {

        if (res.data.result == 'ok') {
          order.goPay(res.data.param, function () {
            wx.startPullDownRefresh();
          }, function () { }, function () {
          });
        }
        
      }, function () {

      }, function () {

      });
  },

  expressShow: function (e) {
    var that = this, orderId = e.currentTarget.dataset.order_id;

    this.setData({ showExpressModal: true, IsLoadingExpress: true, Express: null, isNoNetErrorExpress: false });

    order.express(orderId, function (res) {
      if (res.data.result == 'ok') {
        that.setData({ Express: res.data.shipping });
      } else {

        that.setData({ isNoNetErrorExpress: true });

      }
    }, function (res) {

      that.setData({ isNoNetErrorExpress: true });

    }, function (res) {

      that.setData({ IsLoadingExpress: false });
    });

  },

  onPullDownRefresh: function () {
    this.loadData();
  },

  onLoad: function (options) {
    orderId = options.id;
    this.loadData();
  },

 
  onReady: function () {

  },

  
  onShow: function () {

  },

  
  onHide: function () {

  },

 
  onUnload: function () {

  },  
  
  onReachBottom: function () {

  },

  
  onShareAppMessage: function () {

  }
})