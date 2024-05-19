document.getElementById('upload-button').addEventListener('click', function() {
    document.getElementById('image-upload').click();
  });
  
  document.getElementById('image-upload').addEventListener('change', function() {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('profile-pic').src = e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
  });