// Initialize Firebase
var config = {
  apiKey: "AIzaSyDYCfTGsBQUpGZ8bPc42A46jJAR2qP6Pzo",
  authDomain: "trainproject-6e628.firebaseapp.com",
  databaseURL: "https://trainproject-6e628.firebaseio.com",
  projectId: "trainproject-6e628",
  storageBucket: "",
  messagingSenderId: "375478586742",
  appId: "1:375478586742:web:df8de7f141317749"
};
// Initialize Firebase
firebase.initializeApp(config);
var database = firebase.database();
var currentTime = moment();

var newDataCount = [];

database.ref().on("child_added", function(childSnap) {
  var name = childSnap.val().name;
  var destination = childSnap.val().destination;
  var firstTrain = childSnap.val().firstTrain;
  var frequency = childSnap.val().frequency;
  var min = childSnap.val().min;
  var next = childSnap.val().next;

  $("#trainChart> tbody").append(
    "<tr><td>" +
      name +
      "</td><td>" +
      destination +
      "</td><td>" +
      frequency +
      "</td><td>" +
      next +
      "</td><td>" +
      min +
      "</td></tr>"
  );
});

database.ref().on("value", function(snapshot) {});

$("#submit").on("click", function() {
  event.preventDefault();

  var trainName = $("#trName")
    .val()
    .trim();
  var destination = $("#destinationId")
    .val()
    .trim();
  var firstTrain = $("#firstTrainTimeId")
    .val()
    .trim();
  var frequency = $("#frequencyId")
    .val()
    .trim();
  //ensures that each input has a value

  if (trainName == "") {
    alert("Enter a train name.");
    return false;
  }
  if (destination == "") {
    alert("Enter a destination.");
    return false;
  }
  if (frequency == "") {
    alert("Enter a frequency.");
    return false;
  }
  if (firstTrain == "") {
    alert("Enter a time.");
    return false;
  }

  // THE MATH!
  //subtracts the first train time back a year to ensure it's before current time.
  var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
  // the time difference between current time and the first train
  var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
  var remainder = difference % frequency;
  var minUntilTrain = frequency - remainder;
  var nextTrain = moment()
    .add(minUntilTrain, "minutes")
    .format("hh:mm a");

  var newTrain = {
    name: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency,
    min: minUntilTrain,
    next: nextTrain
  };

  console.log(newTrain);
  database.ref().push(newTrain);

  $("#trName").val("");
  $("#destinationId").val("");
  $("#firstTrainTimeId").val("");
  $("#frequencyId").val("");

  return false;
});
// console.log(trainName, destination, firstTrainTime, frequency);

//  newDataCount.push(trainName, destination, firstTrainTime, frequency);

//  addRow(newDataCount);
//  $.each(newDataCount, function(index, value) {
//    var newDiv = $("<div>");
//    $("#train-chart").append(newDiv.text(value));
//  });

//   $('#trName').val('');
//   $('#destinationId').val('');
//   $('#firstTrainTimeId').val('');
//   $('#frequencyId').val('');
//    });

var database = firebase.database();
function addRow(trainArray) {
  //console.log("in add row");
  //console.log(trainArray);
  // Save new value to Firebase
  database.ref("train" + trainArray[0]).set({
    "Train Name": trainArray[0],
    "destination": trainArray[1],
    "First train time": trainArray[2],
    "Frequency(min)": trainArray[3]
  });
}
var trainArray = ["Marta", "Nyc", "12:00pm", "20"];
