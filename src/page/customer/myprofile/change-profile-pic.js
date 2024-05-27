document.getElementById('upload-button').addEventListener('click', function(event) {
  event.preventDefault();  
  document.getElementById('image-upload').click();
  
  });
  
  document.getElementById('image-upload').addEventListener('change', function(event) {
    event.preventDefault();
    console.log("jeje") 
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profile-image-change').src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
  });