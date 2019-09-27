$(document).ready(function(){
    prefill_user_data()

    $("#edit_profile").click(function(){
      edit_profile()
    })

    $("#delete_profile").click(function(){
      delete_profile()
    })
    $(".status").empty()
})

const prefill_user_data = function () {

  if (Object.keys(current_user).length>0) {
    $("#current_user_profile").show()
    $("#no_current_user").hide()

    // fill in values
    $("#input_name").val(current_user["name"])
    $("#input_university").val(current_user["university"])
    $("#input_company").val(current_user["company"])
    $("#input_interests").val(current_user["interests"].join(", "))

  } else {
    $("#current_user_profile").hide()
    $("#no_current_user").show()
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

    $("#current_user_profile").hide()
    $("#no_current_user").show()
  },
  error: function(request, status, error){
    console.log("Error");
      console.log(request)
      console.log(status)
      console.log(error)

  }
});
}
