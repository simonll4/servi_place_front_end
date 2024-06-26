document.addEventListener("DOMContentLoaded", function () {

  const dropzoneBox = document.getElementsByClassName("dropzone-box")[0];

  const inputFiles = document.querySelectorAll(
    ".dropzone-area input[type='file']"
  );

  const inputElement = inputFiles[0];

  const dropZoneElement = inputElement.closest(".dropzone-area");

  inputElement.addEventListener("change", (e) => {
    if (inputElement.files.length) {
      updateDropzoneFileList(dropZoneElement, inputElement.files[0]);
    }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZoneElement.classList.add("dropzone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
    dropZoneElement.addEventListener(type, (e) => {
      dropZoneElement.classList.remove("dropzone--over");
    });
  });

  dropZoneElement.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length) {
      inputElement.files = e.dataTransfer.files;

      updateDropzoneFileList(dropZoneElement, e.dataTransfer.files[0]);
    }

    dropZoneElement.classList.remove("dropzone--over");
  });

  document
    .getElementById("profilePhoto")
    .addEventListener("change", function (e) {
      var file = e.target.files[0];
      var reader = new FileReader();
      var uploadIcon = document.querySelector(".file-upload-icon");
      var imgElement = document.getElementById("image-preview");

      if (file) {
        reader.addEventListener("load", function (e) {
          imgElement.src = e.target.result;
          imgElement.style.display = "block";
          uploadIcon.style.display = "none";
        });

        reader.readAsDataURL(file);
      } else {
        imgElement.style.display = "none";
        uploadIcon.style.display = "block";
      }
    });

  const updateDropzoneFileList = (dropzoneElement, file) => {
    let dropzoneFileMessage = dropzoneElement.querySelector(".message");

    dropzoneFileMessage.innerHTML = `
        ${file.name}, ${file.size} bytes
    `;
  };

  dropzoneBox.addEventListener("submit", (e) => {
    e.preventDefault();
    const myFiled = document.getElementById("profilePhoto");
    console.log(myFiled.files[0]);
  });

  /////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////
});
