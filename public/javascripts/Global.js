//Emeployeelist data array for filling in info box
var employeedata = [];

//DOM Ready========================
$(document).ready(function() {

//populate the user table on initial page load
populateTable();

});

//Functions=====
 //Fill table with data

function populateTable() {
  //Empty content String
	var tableContent = '';

	//jQuery AJAX call for JSON
	$.getJSON('/employee/employee_records', function(data) {
	
	//For each item in our JSON, add a table row and cells to the content String
	$.each(data, fucntion() {
	tableContent += '<tr>';
	tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.emp_id + '">' + this.emp_id + '</a></td>';
	tableContent += '<td>' + this.emp_name + '</td>';
	tableContent += '<td>' + this.emp_address + '</td>';
	tableContent += '<td>' + this.mobile_no + '</td>';
	tableContent += '<td>' + this.designation + '</td>';
	tableContent += '<td>' + this.job_location + '</td>';
	tableContent += '<td>' + this.esalary + '</td>';
	tableContent += '<td>' + this.email_id + '</td>';
	tableContent += '</tr>';

});

//Inject the whole content String into our existing Html table
$('#employeelist table body').html(tableContent);
});
};

	
