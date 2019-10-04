$(document).ready(function(){
  prefill_user_data()
  $("#create_profile").click(function(e){
    e.preventDefault()
    if (Object.keys(current_user).length>0) {
      edit_profile()
    } else {
      create_profile()
    }

	})

	$("#create_profile").keypress(function(e){
	    if(e.which == 13) {
	       create_profile()
	    }
	})

  $("#cancel_create_profile").click(function(e){
    e.preventDefault()
    window.location.href= window.location.origin + '/user_profile'
    // edit_profile()
  })

  $(".status").empty()
})

const create_profile = function () {
  // Get input values
  const name = $("#input_name").val()
  const university = $("#input_university").val()
  const company = $("#input_company").val()
  const department = $("#input_department :selected").text();
  const interests = $("#input_interests").val().split(",").map(x => x.trim())
  const availability = []

	$(".availability:checked").each(function() {
		availability.push($(this).val());
	});
  // TODO: Error check and make sure there aren't null values

  const new_entry = {
    "name": name,
    "university": university,
    "company": company,
    "department": department,
    "interests": interests,
    "availability": availability
  }
  console.log(new_entry)
  $.ajax({
          type: "POST",
          url: "save_advisor",
          dataType : "json",
          contentType: "application/json; charset=utf-8",
          data : JSON.stringify({"entry" : new_entry}),
        success: function(data, text){
          console.log(data["current"])
          console.log(data["advisors"])
  window.location.href= window.location.origin + '/user_profile'
        },
        error: function(request, status, error){
          console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)

        }
      });
}

const edit_profile = function () {
  // Get input values
  const name = $("#input_name").val()
  const university = $("#input_university").val()
  const company = $("#input_company").val()
  const department = $("#input_department :selected").text();
  const interests = $("#input_interests").val().split(",").map(x => x.trim())
  const availability = []

  $(".availability:checked").each(function() {
    availability.push($(this).val());
  });

  const new_entry = {
    "id": current_user["id"],
    "name": name,
    "university": university,
    "company": company,
    "department": department,
    "interests": interests,
    "availability": availability
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
    window.location.href= window.location.origin + '/user_profile'

  },
  error: function(request, status, error){
    console.log("Error");
      console.log(request)
      console.log(status)
      console.log(error)

  }
});
}
const prefill_user_data = function () {

  if (Object.keys(current_user).length>0) {

    // fill in values
    $("#input_name").val(current_user["name"])
    $("#input_university").val(current_user["university"])
    $("#input_company").val(current_user["company"])
    $("#input_department").val(current_user["department"])
    $("#input_interests").val(current_user["interests"].join(", "))

    $.each(current_user["availability"], function(i, day) {
      var checkbox_id = "#"+ day
      $(checkbox_id).prop('checked', true)
  })
} else {
  }
}
