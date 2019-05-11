// miniprogram/pages/movie_isgood/movie_isgood.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isgood: 0,
    timer: "",
    //swiper
    imgUrls: [
      'cloud://xyspace-2864e7.7879-xyspace-2864e7/batmanvssuperman.png',
      'cloud://xyspace-2864e7.7879-xyspace-2864e7/spiderman.png'
    ],
    image: 'cloud://xyspace-2864e7.7879-xyspace-2864e7/cover.jpg',
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    dianzan: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {

  },

  loadbasedata: function() {
    var that = this;
    const db = wx.cloud.database();
    db.collection('Isgood').doc('96c1cbbe5cc55bbe082a033104893068').get({
      success(res) {
        console.log("数据库当前isgood=", res.data.isgood)
        that.setData({
          wxml_isgood: res.data.isgood,
          isgood: res.data.isgood
        })
      }
    })
  },

  handleProxy: function() {
    const db = wx.cloud.database();
    var that=this
    this.data.dianzan = true
    this.data.isgood = that.data.isgood + 1
    db.collection('Isgood').doc('96c1cbbe5cc55bbe082a033104893068').update({
      // data 传入需要局部更新的数据
      data: {
        isgood: this.data.isgood
      },
      success(res) {
        //console.log(res.data)
        console.log("数据更新成功")
      }
    })
    if (this.data.dianzan) {
      wx.showToast({
        title: '点赞成功',
        icon: 'success',
        duration: 2000,
      })
      this.setData({
        wxml_isgood:this.data.isgood
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadbasedata()
  }
})