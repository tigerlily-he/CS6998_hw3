$(document).ready(function(){
  $("#create_profile").click(function(e){
    e.preventDefault()
		create_profile()
	})

	$("#create_profile").keypress(function(e){
	    if(e.which == 13) {
	       create_profile()
	    }
	})
  $(".status").empty()
})

const create_profile = function () {
  // Get input values
  const name = $("#input_name").val()
  const university = $("#input_university").val()
  const company = $("#input_company").val()
  const interests = $("#input_interests").val().split(",").map(x => x.trim())

  // TODO: Error check and make sure there aren't null values

  const new_entry = {
    "name": name,
    "university": university,
    "company": company,
    "interests": interests
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
        // clear inputs
        $("#input_name").val("")
        $("#input_university").val("")
        $("#input_company").val("")
        $("#input_interests").val("")
        var confirm_creation = $("<div class='alert alert-success' role='alert'>")
        confirm_creation.text("Success! New profile has been created. ")
	var profile_link_url = window.location.origin + "/user_profile"
        var profile_link = $(`<a href=${profile_link_url}>`)
        profile_link.text(" Check it out.")

        confirm_creation.append(profile_link)
        $(".status").append(confirm_creation)
        },
        error: function(request, status, error){
          console.log("Error");
            console.log(request)
            console.log(status)
            console.log(error)

        }
      });
}
