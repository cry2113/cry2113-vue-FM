//npm install express
let express = require("express");
//引入express
let app=express();

//mongodb操作
//npm install mongoose
let mongoose = require("mongoose");
//引入mongodb中的数据
let Yonghu = require("./models/yonghu.js");


//设置静态资源目录
// app.use(express.static("./public",{index:""}));

// npm install body-parser
// //下面三句话让请求中能拿到数据如req.body 引入body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.json());//用以解析请求体，这里就会把字符串动态转换为json对象
app.use(bodyParser.urlencoded({ extended: false }));

//注册账号核对接口
app.post('/zhuce',function(req,res){
	//把req.body数据存到数据库中
	// console.log(req.body)
	if(req.body.password!=req.body.passwordSecond){
		let makesure={
			userCreate:false,
			mistake:"11"
		}
		res.send(makesure)
	}
	else{
		var name  = req.body.userTelNum;
		var email = req.body.userEmail;
		//1.根据邮箱和用户名从数据库查找该用户是否已经存在
		Yonghu.findOne({$or:[{userTelNum:name},{userEmail:email}]})
		.then(function(data){
			//2.如果用户不存在，则可以注册，则保存这个用户数据到数据库
			if (data == null) {
				var user = new Yonghu();
				Object.assign(user,req.body);
				//3.保存用户到数据库
				user.save()
				.then(function(msg){
					console.log("111",msg);
					//4.注册成功，跳转到登陆页面
					console.log("保存用户成功了",msg);
					let makesure={
						userCreate:true,
						mistake:"0"
					}
					res.send(makesure);

				},
				function(err){
					//console.log("22",err);
					console.log(err.message)
					let makesure={
						userCreate:false,
						//err_message:err.message,
						mistake:""
					};
					if(err.message == "yonghu validation failed: userTelNum: wrong1, userEmail: wrong2, password: wrong3, passwordSecond: wrong4"){
						makesure.mistake="1"
					}else if(err.message == "yonghu validation failed: userEmail: wrong2, password: wrong3, passwordSecond: wrong4"){
						makesure.mistake="2"
					}else if(err.message == "yonghu validation failed: userTelNum: wrong1, password: wrong3, passwordSecond: wrong4"){
						makesure.mistake="3"
					}else if(err.message == "yonghu validation failed: userTelNum: wrong1, userEmail: wrong2额愤愤愤愤"){
						makesure.mistake="4"
					}else if(err.message == "yonghu validation failed: userEmail: wrong2, password: wrong3"){
						makesure.mistake="5"
					}else if(err.message == "yonghu validation failed: password: wrong3, passwordSecond: wrong4"){
						makesure.mistake="6"
					}else if(err.message == "yonghu validation failed: userTelNum: wrong1"){
						makesure.mistake="7"
					}else if(err.message == "yonghu validation failed: userEmail: wrong2"){
						makesure.mistake="8"
					}else if(err.message == "yonghu validation failed: password: wrong3"){
						makesure.mistake="9"
					}else if(err.message == "yonghu validation failed: passwordSecond: wrong4"){
						makesure.mistake="10"
					}
					res.send(makesure);
					// console.log("2222222222222")
				})
				
			}
			//如果用户已经存在，则不能注册，返回错误提示
			else{
				let makesure={
					userCreate:false,
					mistake:"12"
				};
				res.send(makesure);
			}
		},function(err){
				cosnole.log(err)
				// res.render("register.html",{err_message:err.message});
			}
		)
		console.log('zhuce 被响应');
		}
});
//登录账号核对接口
app.post('/login',function(req,res){
	// console.log(req.body)
	var userName=req.body.userName;
	var userPassword=req.body.password;
	Yonghu.findOne({$or:[{userTelNum:userName,password:userPassword},{userEmail:userName,password:userPassword}]})
	.then(function(data){
		console.log("xxxxxxxxx"+data)
		if(data==null){
			let search={
				mistake:"0",
				
			}
			res.send(search);
			// console.log("000000000")
		}
		else{
			let search={
				mistake:"1",
				id:data._id
			}
			res.send(search);
			// console.log("111111111111")
		}
	},function(err){
		console.log(err,"查询出错")
	})
})
app.get('/getinfo',function(req,res){
	// console.log(req.query);
	Yonghu.find({userTelNum:req.query.userTelNum})
	.then(function(data){
		data[0].passwordSecond='********';
		data[0].password='********';
		res.send(data[0]);
	},function(err){
		console.log(err,"getinfo没找到")
	})
	console.log("getinfo请求了")
})

app.post('/changeyhm',function(req,res){
	// console.log(req.body);
	let updataMsg = req.body.yonghuming;
	let userId = req.body.id;
	//转成Json格式字符串
	// let temp  = JSON.stringify(data[0]);
	// //再把Json格式的字符串转化成可以通过"."来拿属性的对象
	// let temp1 = JSON.parse(temp).yonghuming;
	Yonghu.findByIdAndUpdate(userId,{$set:{yonghuming:updataMsg}})
	.then(function(data){
		// console.log(data.yonghuming);
	})
	Yonghu.findById(userId)
	.then(function(data){
		// console.log(data.yonghuming);
		res.send(JSON.stringify(data.yonghuming));
	})	
})		


app.post('/changeGender',function(req,res){
	// console.log(req.body);
	let updataMsg = req.body.gender;
	let userId = req.body.id;
	Yonghu.findByIdAndUpdate(userId,{$set:{gender:updataMsg}})
	.then(function(data){
		// console.log(data.gender);
	})
	Yonghu.findById(userId)
	.then(function(data){
		// console.log(data.gender);
		res.send(JSON.stringify(data.gender));
	})	
})
app.post('/changeGexing',function(req,res){
	// console.log(req.body);
	let updataMsg = req.body.gexing;
	let userId = req.body.id;
	Yonghu.findByIdAndUpdate(userId,{$set:{gexing:updataMsg}})
	.then(function(data){
		// console.log(data.gexing);
	})
	Yonghu.findById(userId)
	.then(function(data){
		// console.log(data.gexing);
		res.send(JSON.stringify(data.gexing));
	})	
})
app.post('/passwordChange',function(req,res){
	console.log(req.body);
	let updataMsg = req.body.newpassword;
	let userId = req.body.id;
	let password = req.body.password;

	Yonghu.findById(userId)
	.then(function(data){
		if(password == data.password){
			console.log("旧密码正确");
			data.password = updataMsg;
			data.passwordSecond = updataMsg;
			//console.log(data.password);
			let msg={
				makeSure:true,
			}
			res.send(msg)
			Yonghu.findByIdAndUpdate(userId,{$set:{password:updataMsg}})
			.then(function(msg){
				console.log("密码修改成功");
			})
			//console.log(data.password);
			//res.send(JSON.stringify(data.gexing));
		}
		else if(password != data.password){
			console.log("旧密码不正确");
			let msg={
				makeSure:false,
			}
			res.send(msg)
		}


	})	
})





// app.get('/home',(req,res)=>{
// 	res.send('hello world');
// })
app.listen(8000,()=>{
    console.log("running........")
})

module.exports = app;		
		





// app.get('/home',(req,res)=>{
// 	res.send('hello world');
// })
app.listen(8000,()=>{
    console.log("running........")
})

module.exports = app;