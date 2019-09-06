let mongoose = require('mongoose');
//连接数据库 
mongoose.connect('mongodb://localhost/yonghu', { useNewUrlParser: true });
//上一行的yonghu指的是mongodb中的仓库名

//创建一个对象模型
var userSchema = new mongoose.Schema({
	userTelNum:{
		type:String,
		validate:{
			validator: function(v) {
                return  /^[1-9]\d{10}$/.test(v);
            },
            message: "wrong1"
		},
		require:[true,'wrong1']
	},
	userEmail:{
		type:String,
		validate: {
            validator: function(v) {
                return /^[1-9]\d{7,10}@qq\.com$/.test(v);
            },
            message: "wrong2"
        },
        require:[true,'wrong2']
	},
	password:{
		type:String,
		validate:{
			validator: function(v) {
                return   /^[a-zA-Z0-9]{8}$/.test(v);
            },
            message: "wrong3"
		},
		require:[true,'wrong3']
	},
	passwordSecond:{
		type:String,
		validate:{
			validator: function(v) {
                return  /^[a-zA-Z0-9]{8}$/.test(v);
            },
            message: "wrong4"
		},
		require:[true,'wrong4']
	},
	gender:{
		type:String,
	},
	yonghuming:{
		type:String,
	},
	gexing:{
		type:String,
	}


})
//将对象和仓库数据导出去给其他地方引入
module.exports = mongoose.model('yonghu',userSchema);

