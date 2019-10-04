$(document).ready(function(){
  console.log(coffee)
  display_meeting_requests()
})

const display_meeting_requests = function () {
  $.each(coffee, function(i, req) {
    var reqDiv = $("<div class='row coffee_req shadow p-3 mb-5 bg-white rounded'>")

    var adviseeDetails = $("<div class='col-md-3 advisee-detail'>")
    var adviseeNameDiv = $("<div class='advisee-name'>")
    adviseeNameDiv.html(req["name"])

    var adviseeYearMajorDiv = $("<div class='advisee-year'>")
    adviseeYearMajorDiv.html(req["year"] + "·" + req["major"])

    $(adviseeDetails).append(adviseeNameDiv)
    $(adviseeDetails).append(adviseeYearMajorDiv)

    $(reqDiv).append(adviseeDetails)

    var meetingDetails = $("<div class='col-md-6 meeting-detail'>")
    var typeDiv = $("<div class='meeting_type'>")
    $(typeDiv).html(`<h4><span class="badge badge-info">${req["type"]}</span></h4>`)
    $(meetingDetails).append(typeDiv)

    var messageDiv = $("<div class='meeting_message'>")
    $(messageDiv).html(req["message"])
    $(meetingDetails).append(messageDiv)

    $(reqDiv).append(meetingDetails)

    var meetingLogistics = $("<div class='col-md-3 meeting-logistics'>")
    var advisorDiv = $("<div class='meeting_advisor'>")
    $(advisorDiv).html(req["advisor_name"])

    var dayDiv = $("<div class='meeting_day'>")
    $(dayDiv).html(req["day"])

    $(meetingLogistics).append(advisorDiv)
    $(meetingLogistics).append(dayDiv)

    $(reqDiv).append(meetingLogistics)
    $("#all-coffee-requests").append(reqDiv)

})

}
