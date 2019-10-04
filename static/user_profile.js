$(document).ready(function(){
    // prefill_user_data()
    display_current_advisor()

    $("#get_started").click(function(){
      window.location.href= window.location.origin + '/create_profile'
      // edit_profile()
    })
    $("#edit_profile").click(function(){
      window.location.href= window.location.origin + '/create_profile'
      // edit_profile()
    })

    $("#delete_profile").click(function(){
      delete_profile()
    })
    $(".status").empty()
})
const display_current_advisor = function (){
  if (Object.keys(current_user).length>0) {
    $("#profile_view").empty()
    // $("#current_user_profile").show()
    // $("#no_current_user").hide()
    $(".edit_or_delete-btn").show()
    $(".create-btn").hide()
    var person = current_user
    // fill in values
    var row = $(`<div class='row bottom_row_padding advisor_row' data-id = ${current_user["id"]}>`)

    var profile_pic = $("<div class='col-md-6'><img src='https://watershed.co.uk/engage/wp-content/uploads/2010/08/blank-profile.jpg' class='img-fluid'>")
    $(row).append(profile_pic)

    var text_details = $("<div class='col-md-6 advisor_details'>")

    var company = $("<div class='advisor_company'>")
    company.append(current_user["company"].toUpperCase())
    $(text_details).append(company)

    var name = $("<div class='advisor_name'>")
    name.append(current_user["name"])
    $(text_details).append(name)

    var department = $("<div class='advisor_department'>")
    department.append(current_user["department"])
    $(text_details).append(department)

    var interests = $("<div class='advisor_interests'>")
    $.each(person["interests"], function(i, topic) {
      var topic_pill = $("<span class='badge badge-light'>")
      topic_pill.append(topic)
      interests.append(topic_pill)
    })
    $(text_details).append(interests)

    var university = $("<div class='advisor_university'>")
    university.append(current_user["university"])
    $(text_details).append(university)

    $(row).append(text_details)
    $("#profile_view").append(row)

  } else {
    // $("#current_user_profile").hide()
    // $("#no_current_user").show()
    $("#profile_view").hide()

    $(".edit_or_delete-btn").hide()
    $(".create-btn").show()
  }
}


const prefill_user_data = function () {

  if (Object.keys(current_user).length>0) {
    // $("#current_user_profile").show()
    // $("#no_current_user").hide()

    // // fill in values
    // $("#input_name").val(current_user["name"])
    // $("#input_university").val(current_user["university"])
    // $("#input_company").val(current_user["company"])
    // $("#input_interests").val(current_user["interests"].join(", "))

  } else {
    // $("#current_user_profile").hide()
    // $("#no_current_user").show()

  }
}

const edit_profile = function () {
  // Get input values
  const name = $("#input_name").val()
  const university = $("#input_university").val()
  const company = $("#input_company").val()
  const interests = $("#input_interests").val().split(",").map(x => x.trim())

  const new_entry = {
    "id": current_user["id"],
    "name": name,
    "university": university,
    "company": company,
    "interests": interests
  }
  console.log(new_entry)
  $.ajax({
    type: "POST",
    url: "edit_profile",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(new_entry),
  success: function(data, text){
    current_user = data["current_user"]

    var confirmation = $("<div class='alert alert-success' role='alert'>")
    confirmation.text("Your profile has been updated")
    $(".status").append(confirmation)

  },
  error: function(request, status, error){
    console.log("Error");
      console.log(request)
      console.log(status)
      console.log(error)

  }
});
}

const delete_profile = function () {
  $.ajax({
    type: "POST",
    url: "delete_profile",
    dataType : "json",
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({"id": current_user["id"]}),
  success: function(data, text){
    current_user = data["current_user"]
    window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")

    $("#profile_view").empty()
    $("#profile_view").hide()
    $(".edit_or_delete-btn").hide()
    $(".create-btn").show()
    // $("#current_user_profile").hide()
    // $("#no_current_user").show()
  },
  error: function(request, status, error){
    console.log("Error");
      console.log(request)
      console.log(status)
      console.log(error)

  }
});
}
