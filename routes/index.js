var express = require('express');
var router = express.Router();
var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var mongo = require('mongodb');
var monk = require('monk');
var db =  monk('192.168.7.102:27017/employee');


var collection = db.get("employee_records");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*GET Hello World Page */
router.get('/helloworld', function(req, res) {
	res.render('helloworld', {title:'Hello, World!'})
});

var employeeName, 
employeeId,
sex,
employeeAddress,
contactNumber,
jobLocation,
desig,
salary,
e_mail;

/*Get Insert Values */
router.post('/inserting', function(req, res, next) {
	employeeName = req.body.emp_name;
	employeeId = req.body.num;
	sex = req.body.diff;
	employeeAddress = req.body.S2;
	contactNumber = req.body.txtFName1;
	jobLocation = req.body.mydropdown;
	desig = req.body.mydropdown1;
	salary = Number(req.body.salary);
	e_mail = req.body.email_id;


	var document = {emp_id:employeeId,emp_name:employeeName,esex:sex,emp_address:employeeAddress,mobile_no:contactNumber,designation:desig,job_location:jobLocation,esalary:salary,email_id:e_mail};

	//Inserting a document in to db
	collection.insert(document);

	//Ensuring Index
	collection.ensureIndex({emp_id:1,emp_name:1,job_location:1,designation:1,esalary:1});
	
	collection.find({},function(err, docs) {
		if(err) {
    			throw err;
    		}else {
    			
    			 res.render('tab', {emplist:docs});
    		}

    });

});

//Update Required Fields.
router.post('/updateaction', function(req, res, next) {
	var eName = req.body.emp_name,
		eId = req.body.num,
		eAddress = req.body.S2,
		cNumber = req.body.txtFName1,
		jLocation = req.body.mydropdown,
		design = req.body.mydropdown1,
		sal = Number(req.body.salary),
		email = req.body.email_id;

		
	if(eAddress != '') { 
		collection.update({emp_id:eId}, {$set:{emp_address:eAddress}},{w:1});
	}
	if(cNumber != '') {
		collection.update({emp_id:eId}, {$set:{mobile_no:cNumber}},{w:1});
	}
	if(jLocation != 'Default') {
		collection.update({emp_id:eId}, {$set:{job_location:jLocation}},{w:1});
	}
	if(design != 'Default') {
		collection.update({emp_id:eId}, {$set:{designation:design}},{w:1});
	}
	if(email != '') {
		collection.update({emp_id:eId}, {$set:{email_id:email}},{w:1});
	}
	if(sal != '') {
		collection.update({emp_id:eId}, {$set:{esalary:sal}},{w:1});
	}

	collection.find({emp_id:eId},function(err, docs) {
		if(err) {
    			throw err;
    		}else {
    			console.log(docs);
    			 res.render('tab', {emplist:docs});
    		}
    });
});


//Delete Record based on EmployeeID
router.post('/deleteaction', function(req, res, next) {
    
    var eId = req.body.num;

	collection.remove({emp_id:eId});

	res.sendfile("views/DeleteSuccess.html");
});


//Reading Documents based on Employee_Id.
router.post('/idoperation', function(req, res, next) {
	var eId = req.body.num;
    var emplist = [];
	
    collection.find({emp_id:eId},function(err, docs) {
		if(err) {
    			throw err;
    		}else {
    			res.render('tab', {emplist:docs});
    		}
	});

});

//Reading Documents based on Employee_Name.
router.post('/nameoperation', function(req, res, next) {
	var eName = req.body.empName;
    var emplist = [];
	
    collection.find({emp_name:eName},function(err, docs) {
		if(err) {
    			throw err;
    		}else {
    			res.render('tab', {emplist:docs});
    		}

    });
});

//Reading Documents based on Employee_Designation.
router.post('/designationoperation', function(req, res, next) {
	var edesign = req.body.designation;
    var emplist = [];
	
	collection.find({designation:edesign},function(err, docs) {
		if(err) {
    			throw err;
    		}else {
    			res.render('tab', {emplist:docs});
    		}

    });
	
});
		

//Reading Documents based on Employee_Location.
router.post('/locationoperation', function(req, res, next) {
	
	var elocation = req.body.emplocation;

    collection.find({"job_location":elocation},function(err, docs) {

    		if(err) {
    			throw err;
    		}else {
    			console.log(docs);
    			 res.render('tab', {emplist:docs});
    		}
 	});
});		


//Reading Documents based on Employee_Salary.
router.post('/salaryoperation', function(req, res, next) {
	var esal1 = Number(req.body.num1);
	var esal2 = Number(req.body.num2);
    var emplist = [];
	
	collection.find({esalary:{$gt:esal1,$lt:esal2}},function(err, docs) {
		if(err) {
    			throw err;
    		}else {
    			res.render('tab', {emplist:docs});
    		}

    });		
});

db.close();		

module.exports = router;
