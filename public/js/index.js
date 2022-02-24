const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector("#browseBtn");
const margin = document.querySelector(".upload-container");
const sharingContainer = document.querySelector(".sharing-container");
const copyURLBtn = document.querySelector("#copyURLBtn");
const fileURL = document.querySelector("#fileURL");
const emailForm = document.querySelector("#emailForm");
const toast = document.querySelector(".toast");
let uuid;

browseBtn.addEventListener("click", () => {
  fileInput.click();
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  const inputFildValue = e.dataTransfer.files[0];
  dropZone.classList.remove("dragged");
  margin.classList.add("margin");
  toast.classList.add("finalTost");
  fatchFileUrl(inputFildValue);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragged");
});

dropZone.addEventListener("dragleave", (e) => {
  dropZone.classList.remove("dragged");
});

// file input change and uploader
fileInput.addEventListener("change", (e) => {
  fatchFileUrl(fileInput.files[0]);
  margin.classList.add("margin");
  toast.classList.add("finalTost");
});

const fatchFileUrl = async (file) => {
  const formData = new FormData();
  formData.append("myfile", file);

  const res = await fetch(
    "https://file-sharing-app-node.herokuapp.com/api/files",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  fileURL.value = data.file;
  sharingContainer.style.display = "block";
  uuid = data.file.split("/").splice(-1, 1)[0];
};

// sharing container listenrs
copyURLBtn.addEventListener("click", () => {
  fileURL.select();
  document.execCommand("copy");
  showToast("Copied to clipboard");
});

fileURL.addEventListener("click", () => {
  fileURL.select();
});

//2nd

// 1st

emailForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // stop submission

  // disable the button
  emailForm[2].setAttribute("disabled", "true");
  emailForm[2].innerText = "Sending";

  const formData = {
    uuid: uuid,
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };

  const response = await fetch(
    "https://file-sharing-app-node.herokuapp.com/api/files/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );
  const data = await response.json();

  if (data) {
    showToast(data.succuss);
    emailForm.elements["to-email"].value = "";
    emailForm.elements["from-email"].value = "";
    emailForm[2].innerText = "Send";
  }
});

let toastTimer;
// the toast function
const showToast = (msg) => {
  clearTimeout(toastTimer);
  toast.innerText = msg;
  toast.classList.add("show");
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
};
