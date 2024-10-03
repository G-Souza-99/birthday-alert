// script.js
document.getElementById('submitNameButton').addEventListener('click', function() {
  const name = document.getElementById('name').value;
  
  if (name) {
    // Hide the name submission button and input field
    document.querySelector('.form-container').style.display = 'none';
    
    // Show the birthday button
    const birthdayButton = document.getElementById('birthdayButton');
    birthdayButton.style.display = 'block';
    
    // Add event listener to the birthday button to show alert with the name
    birthdayButton.addEventListener('click', function() {
      alert(`Happy Birthday, ${name}!`);
    });
  } else {
    alert('Please enter your name.');
  }
});
