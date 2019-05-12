Page({
    data: {
        files: [],
        imgSource: ["拍照或相册", "拍照", "相册"],
        imgSourceIndex: 0,
        imgQuality: ["压缩或原图", "压缩", "原图"],
        imgQualityIndex: 0,
        limitNum: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        limitNumIndex: 0,
        sizeType: [["compressed", "original"], ["compressed"], ["original"]],
        chooseSizeType: ["compressed", "original"],
        sourceType: [["camera", "album"], ["camera"], ["album"]],
        chooseSourceType: ["camera", "album"]
    },
    
    // 选择图片
    chooseImage: function (e) {
        var that = this;
        // 图片数量限制
        const len = this.data.limitNum[this.data.limitNumIndex]
        if (this.data.files.length >= len) {
            wx.showModal({
                content: '已达限制',
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        } else {
            wx.chooseImage({
                count: len - this.data.files.length,  // 最多可以选择的图片张数, 默认为9
                sizeType: that.data.chooseSizeType, // 可以指定是原图还是压缩图，默认二者都有
                sourceType: that.data.chooseSourceType, // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                    that.setData({
                        files: that.data.files.concat(res.tempFilePaths)
                    });
                },
                fail: e => {
                    console.error(e)
                }
            })
        }
    },
    // 上传图片
    uploadImg: function () {
        var that = this
        if (this.data.files.length > 0) {
            wx.showLoading({
                title: '上传中',
            })
            for (var i = 0; i < this.data.files.length; i++) {
                const filePath = this.data.files[i]
                const cloudPath = 'my-image/' + i + filePath.match(/\.[^.]+?$/)[0]
                wx.cloud.uploadFile({
                    cloudPath,
                    filePath,
                    success: res => {
                        wx.hideLoading()
                        console.log('[上传文件] 成功：', res)
                        // app.globalData.fileID = res.fileID
                        // app.globalData.cloudPath = cloudPath
                        // app.globalData.imagePath = filePath
                        wx.showModal({
                            content: '上传成功',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    that.setData({
                                        files: []
                                    })
                                }
                            },
                        })
                        
                    },
                    fail: e => {
                        console.error('[上传文件] 失败：', e)
                        wx.showToast({
                            icon: 'none',
                            title: '上传失败',
                        })
                    },
                    complete: () => {
                        
                    }
                })
            }
        } else {
            wx.showModal({
                content: '尚未添加图片，请添加图片',
                showCancel: false,
                success: function(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                },
                
            })
        }
    },
    // 预览图片
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    
    // 选择图片类型
    bindImgSourceChange: function (e) {
        // 辨识类型
        const sourceType = 'sourceType'
        console.log('picker imgSource 发生选择改变，携带值为', e.detail.value);
        this.chooseType(e.detail.value, this.data.sourceType, sourceType)
        this.setData({
            imgSourceIndex: e.detail.value
        })
    },
    bindImgQualityChange: function (e) {
        const sizeType = 'sizeType'
        console.log('picker account 发生选择改变，携带值为', e.detail.value);
        this.chooseType(e.detail.value, this.data.sizeType, sizeType)
        this.setData({
            imgQualityIndex: e.detail.value
        })
    },
    bindLimitNumChange: function (e) {
        console.log('picker account 发生选择改变，携带值为', e.detail.value);
        this.setData({
            limitNumIndex: e.detail.value
        })
        const len = this.data.limitNum[this.data.limitNumIndex]
        // 更新图片个数
        if (len < this.data.files.length) {
            this.data.files.length = len
            this.setData({
                files: this.data.files
            })
        }
    },
    chooseType: function (typeVal, type, typeDefine) {
        if (typeDefine == 'sizeType') {
           
            this.setData({
                chooseSizeType: type[typeVal]
            })
            console.log(this.data.chooseSizeType)
        }
        if (typeDefine == 'sourceType') {

            this.setData({
                chooseSourceType: type[typeVal]
            })
            console.log(this.data.chooseSourceType)
        }
    },
    delImage: function (e) {
        const that = this
        const files = that.data.files
        console.log(e.currentTarget.id)
        console.log(this.data.files)
        wx.showModal({
            content: '是否删除该图片',
            success: function (res) {
                if (res.confirm) {
                    that.delArray(files, e.currentTarget.id)
                    that.setData({
                        files: files
                    })
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    // 删除数组某一元素
    delArray: function (array, delEle) {
        var i=0
        for (i; i<array.length;i++) {
            if (array[i] == delEle) {
                array.splice(i,1)
            }
        }
    }
});