/*
  Landing page with list of all advisors
*/
var search_results = []
$(document).ready(function(){
  /**************************/
  /* Home: Main Search Page */

  $("#find_advisor").click( function (e) {
    e.preventDefault();
    searchForAdvisors()
  })

  $("#find_department").autocomplete({
      source: departments
    });
    $("#find_company").autocomplete({
      source: companies
    })
  $("#find_focus").keypress(function(e){
      if(e.which == 13) {
        e.preventDefault()
         searchForAdvisors()
      }
  })

  $("#find_department").keypress(function(e){
      if(e.which == 13) {
        e.preventDefault()
         searchForAdvisors()
      }
  })
  /**************************/
  /* Advisors Listing page */
  $("#search_advisor").click(function(e){
    e.preventDefault()
    const company = $("#enter_company").val()
    const dept = $("#enter_department").val()
    find({
      "company":company,
      "department": dept
     })
	})

	$("#enter_company").keypress(function(e){
	    if(e.which == 13) {
        e.preventDefault()
        // const term = $("#enter_company").val()
        const company = $("#enter_company").val()
        const dept = $("#enter_department").val()
        find({
          "company":company,
          "department": dept
         })
	    }
	})

  $("#enter_department").keypress(function(e){
	    if(e.which == 13) {
        e.preventDefault()
        // const term = $("#enter_company").val()
        const company = $("#enter_company").val()
        const dept = $("#enter_department").val()
        find({
          "company":company,
          "department": dept
         })
	    }
	})

  $("#enter_department").autocomplete({
      source: departments
    });

    $("#enter_company").autocomplete({
      source: companies
    })

$(".contact-btn").click(function (e) {
  console.log("contact");
  window.location.href='mailto:hello@example.com'
})

console.log("company search: " + company_search["entry"])
console.log("department search: " + department_search["entry"])

find({
  "company":company_search["entry"],
  "department": department_search["entry"]
 })

})

const find = function(query){
    /*
    {"company" : "Facebook",
    "department": "Engineering"}
    */
      $.ajax({
        type: "POST",
        url: "find",
        dataType : "json",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(query),
      success: function(data, text){
          display_advisors_list(data["matches"])
          $("#keyword_search").empty() // summary of query
          $("#keyword_search").append("Showing " + data["matches"].length +" results for '" + query['company'] + "'" + " and '" + query['department'] + "'" )
          // $("#enter_company").val("")
      },
      error: function(request, status, error){
      	console.log("Error");
          console.log(request)
          console.log(status)
          console.log(error)

      }
    });
}

const display_advisors_list = function(people_list){
  console.log(people_list)
  $("#advisors-list").empty()
  if (people_list.length == 0){

    var row = $("<div class='row'>")
		var col_advisors = $("<div class='col-md-4'>")
		$(col_advisors).append("No Advisors Available")
		$("#advisors-list").append(row)

  } else {
    	$.each(people_list, function(i, person){
        var row = $(`<div class='row bottom_row_padding advisor_row' data-id = ${person["id"]}>`)
        var profile_pic = $("<div class='col-md-2'><img src='https://watershed.co.uk/engage/wp-content/uploads/2010/08/blank-profile.jpg' class='img-fluid'>")
        $(row).append(profile_pic)

        var text_details = $("<div class='col-md-6 advisor_details'>")

        var company = $("<div class='advisor_company'>")
        company.append(person["company"].toUpperCase())
        $(text_details).append(company)

        var name = $("<div class='advisor_name'>")
        name.append(person["name"])
        $(text_details).append(name)

        var department = $("<div class='advisor_department'>")
        department.append(person["department"])
        $(text_details).append(department)

        var interests = $("<div class='advisor_interests'>")
        $.each(person["interests"], function(i, topic) {
          var topic_pill = $("<span class='badge badge-light'>")
          topic_pill.append(topic)
          interests.append(topic_pill)
        })
        $(text_details).append(interests)

        /*
        Display university info
        var university = $("<div class='advisor_university'>")
        university.append(person["university"])
        $(text_details).append(university)
        */

        $(row).append(text_details)

        var bookmarkDiv = $("<div class='col-md-2 bookmark'>");
        var bookmarkBtn =  $(`<button data-id =${person["id"]} class="btn bookmark-btn"/>`)
        if (person["bookmarked"] == false){
          $(bookmarkBtn).append("Bookmark").addClass( "btn-primary" ).removeClass("btn-danger")
        } else {
          $(bookmarkBtn).append("Unbookmark").addClass("btn-danger").removeClass("btn-primary")
        }


        $(bookmarkDiv).append(bookmarkBtn)
        $(row).append(bookmarkDiv)

        $("#advisors-list").append(row)

        var getInTouchDiv = $("<div class='col-md-2 get-in-touch'>");
        var contactEmail = person["name"].substring(0, 3).toLowerCase()+person["id"]+"@"+person["company"].toLowerCase()+".com"
        var contactBtn = $(`<a href='mailto:${contactEmail}' class="contact-btn"><button type='button' class='btn btn-outline-primary contact-btn' data-person-id = ${person["id"]} >`).text('Contact')
        $(getInTouchDiv).append(contactBtn)
        $(row).append(getInTouchDiv)

        $("#advisors-list").append(row)
      })

      $(".bookmark-btn").click(function (e) {

        if ($(this).text() == "Bookmark"){
          // add bookmark
          alert("Bookmark Success")
          $(this).text("Unbookmark");
          $(this).addClass( "btn-danger" ).removeClass("btn-primary")
          setBookmark({
              "add": [parseInt($(this).attr("data-id"))],
              "remove": []
          })

        } else {
          // remove bookmark
          alert("Bookmark Removal Success")
          $(this).text("Bookmark");
          $(this).addClass( "btn-primary" ).removeClass("btn-danger")
          setBookmark({
              "add": [],
              "remove": [parseInt($(this).attr("data-id"))]
          })
        }

      })
  }
}

var setBookmark = function (req) {
  /*
  req = {
  "add": [1]
  "remove": []
}
  */
console.log(req)
  $.ajax({
    type: "POST",
    url: "set_bookmark",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(req),
    success: function(){
      console.log("success")
  },
  error: function(request, status, error){
    console.log("Error");
      console.log(request)
      console.log(status)
      console.log(error)

  }
});
}


/* Home: Landing Page */
var searchForAdvisors = function () {
  console.log("redirect to advisors list");
  const company = $("#find_company").val()
  const department = $("#find_department").val()

  $.ajax({
    type: "POST",
    url: "set_search_terms",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({"company": company, "department": department }),
    success: function(){
      console.log("success")
  },
  error: function(request, status, error){
    console.log("Error");
      console.log(request)
      console.log(status)
      console.log(error)

  }
});

window.location.href='http://127.0.0.1:5000/advisors'
}
