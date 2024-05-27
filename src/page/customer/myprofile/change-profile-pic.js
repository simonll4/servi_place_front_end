document.getElementById('upload-button').addEventListener('click', function(event) {
    event.preventDefault();   
    document.getElementById('image-upload').click();
  });
  
  document.getElementById('image-upload').addEventListener('change', function() {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('change-profile-pic').src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
    console.log(this.files[0]);
    console.log(document.getElementById('change-profile-pic').src);

  });