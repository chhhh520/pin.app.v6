//获取应用实例
const app = getApp();

function cancel(orderId,successCallback, failCallback){
  wx.showModal({
    title: '确定“取消订单”吗？',
    content: '',
    success: function (res) {
      if (res.confirm) {
        wx.request({
          url: app.globalData.apiUrl + "v1.0/users/orders/" + orderId,
          header: {
            'AccessToken': wx.getStorageSync("token")
          },
          method: "DELETE",
          success: function(res){
            successCallback(res);
          },
          fail: function (res){
            failCallback(res);
          },
          complete: function(){
          }
        })
      }
    }
  });
}

function express(orderId, successCallback, failCallback, completeCallback){
  wx.request({
    url: app.globalData.apiUrl + 'v1.0/orders/' + orderId + "/express",
    success: function (res) {
      successCallback(res);
    },
    fail: function (res) {
      failCallback(res);
    },
    complete: function (res) {
      completeCallback(res);
    }
  });
} 

function receive(orderId, successCallback, failCallback){
  wx.showModal({
    title: '确定“确认收货”吗？',
    content: '',
    success: function (res) {
      if (res.confirm) {
        wx.request({
          url: app.globalData.apiUrl + "v1.0/users/orders/" + orderId + "/" + "receive",
          header: {
            'AccessToken': wx.getStorageSync("token")
          },
          method: "POST",
          success: function (res) {
            successCallback(res);
          },
          fail: function (res) {
            failCallback(res);
          },
          complete: function () {
          }
        })
      }
    }
  });
}

function pay(orderId, successCallback, failCallback, completeCallback){
  wx.request({
    url: app.globalData.apiUrl + 'v1.0/users/orders/wxpay/' + orderId,
    header: {
      'AccessToken': wx.getStorageSync("token")
    },
    success: function (res) {
      successCallback(res);
    },
    fail: function (res) {
      failCallback(res);
    },
    complete: function (res) {
      completeCallback(res);
    }
  });
}

function goPay(payParams, successCallback, failCallback, completeCallback){
  wx.requestPayment({
    'timeStamp': payParams.timeStamp,
    'nonceStr': payParams.nonceStr,
    'package': payParams.package,
    'signType': payParams.signType,
    'paySign': payParams.paySign,
    
    success:function (res) {
      successCallback();
    },

    fail:function(res){
      failCallback();

      if (res.errMsg == "requestPayment:fail cancel"){
      }else{
        wx.showToast({title: res.errMsg,icon: "none"})
      }
    },

    complete: function(res){
      completeCallback(res);
      
      
    }

  });
}

module.exports = {
  cancel: cancel,
  pay: pay,
  goPay: goPay,
  receive: receive,
  express: express
}