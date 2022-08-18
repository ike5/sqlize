let diffInMinutes = 30;
var countDownDate = new Date(new Date().getTime() + diffInMinutes * 60000);

module.exports = setInterval(function () {
  var now = new Date().getTime();
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Output
  console.log(`${days}d ${hours}h ${minutes}m ${seconds}s`);

  // If the count down is over, write some text
  if (distance < 0) {
    clearInterval(x);
    console.log("Expired");
  }
}, 1000);
