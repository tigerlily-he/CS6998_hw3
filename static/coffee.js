$(document).ready(function() {
  display_target_advisor()
  prefill_advisor_availability()
  $("#request_coffee").click(function(e) {
    add_coffee_request()
  })
})

const display_target_advisor = function() {
  if (Object.keys(requested_advisor).length > 0) {
    console.log(requested_advisor)
    var current_user = requested_advisor
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
    $.each(current_user["interests"], function(i, topic) {
      var topic_pill = $("<span class='badge badge-light'>")
      topic_pill.append(topic)
      interests.append(topic_pill)
    })
    $(text_details).append(interests)

    var university = $("<div class='advisor_university'>")
    university.append(current_user["university"])
    $(text_details).append(university)

    $(row).append(text_details)
    $(".advisor-bio").append(row)

  } else {

  }
}

const prefill_advisor_availability = function() {
  if (Object.keys(requested_advisor).length > 0) {

    $.each(requested_advisor["availability"], function(i, day) {

      var form_check = $("<div class='form-check'>")
      if (i == 0) {
        console.log(day)
        var check_input = $(`<input class="form-check-input" type="radio" id=${day} name="time-input" value=${day} checked>`)
      } else {
        var check_input = $(`<input class="form-check-input" type="radio" id=${day} name="time-input" value=${day}>`)
      }

      var check_label = $(`<label class="form-check-label" for=${day}>`)
      $(check_label).append(`${day}`)

      $(form_check).append(check_input);
      $(form_check).append(check_label);
      $("#input_time").append(form_check)
    })
  }
}
const add_coffee_request = function() {
  const name = $("#input_name").val()
  const year = $("#input_graduating_year").val()
  const major = $("#input_major").val()
  const type = $("#input_interaction_type").val()
  const day = $('input[name=time-input]:checked').val();
  const message = $("#input_message").val();
  const advisor_name = requested_advisor["name"]
  const request = {
    "add": {
      "name": name,
      "year": year,
      "major": major,
      "type": type,
      "day": day,
      "message": message,
      "advisor_name": advisor_name
    }
  }
  console.log(request)
  $.ajax({
      type: "POST",
      url: "/set_coffee",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(request),
      success: function(data){
        console.log("Submitted Request")
        window.location.href= window.location.origin + '/all_coffee'
      },
      error: function(request, status, error) {
          console.log("Error");
          console.log(request)
          console.log(status)
          console.log(error)

        }
      });

    }
