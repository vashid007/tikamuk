document.addEventListener("DOMContentLoaded", () => {
  const yearNodes = document.querySelectorAll(".js-year");
  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const normalizedHref = href.replace("./", "");
    if (
      normalizedHref === currentPath ||
      (currentPath === "" && normalizedHref === "index.html")
    ) {
      link.classList.add("active");
    }
  });
});
// navmenu
const hamburger = document.getElementById("hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

 
document.addEventListener("DOMContentLoaded", function () {

  const links = document.querySelectorAll(".nav-links a");
  const currentPage = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

});

// const hamburger = document.getElementById("hamburger");
//   const nav = document.getElementById("nav");

//   hamburger.addEventListener("click", () => {
//     nav.classList.toggle("active");
//   });

document.addEventListener("DOMContentLoaded", function(){

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");

const pageImages = document.querySelectorAll(".page-intro img:not(.no-zoom)");
const extraImages = document.querySelectorAll(".gallery-image");

let images = [];
let currentIndex = 0;

function showImage(index){
  const img = images[index];
  const src = img.getAttribute("data-zoom") || img.src;
  const modalVideo = document.getElementById("modalVideo");

  if (src.toLowerCase().endsWith(".mp4")) {
    modalImg.style.display = "none";
    if (modalVideo) {
      modalVideo.style.display = "block";
      modalVideo.src = src;
      modalVideo.play();
    }
  } else {
    if (modalVideo) {
      modalVideo.style.display = "none";
      modalVideo.pause();
    }
    modalImg.style.display = "block";
    modalImg.src = src;
  }
}

pageImages.forEach(img => {

  img.addEventListener("click", function(){

    const parent = img.closest(".single-items");
    const localExtraImages = parent ? parent.querySelectorAll(".gallery-image") : [];

    if (localExtraImages.length > 0) {
      images = Array.from(localExtraImages);
    } else {
      images = [img];
    }

    const nextBtn = document.querySelector(".gallery-next");
    const prevBtn = document.querySelector(".gallery-prev");

    if (images.length > 1) {
      if (nextBtn) nextBtn.style.display = "block";
      if (prevBtn) prevBtn.style.display = "block";
    } else {
      if (nextBtn) nextBtn.style.display = "none";
      if (prevBtn) prevBtn.style.display = "none";
    }

    modal.style.display = "flex";

    currentIndex = 0;

    showImage(currentIndex);

  });

});


/* NEXT IMAGE */

const nextBtn = document.querySelector(".gallery-next");

if(nextBtn){
nextBtn.onclick=function(){

currentIndex++;

if(currentIndex >= images.length){
currentIndex = 0;
}

showImage(currentIndex);

};
}


/* PREVIOUS IMAGE */

const prevBtn = document.querySelector(".gallery-prev");

if(prevBtn){
prevBtn.onclick=function(){

currentIndex--;

if(currentIndex < 0){
currentIndex = images.length - 1;
}

showImage(currentIndex);

};
}


/* CLOSE */

closeModal.onclick=function(){
modal.style.display="none";
const modalVideo = document.getElementById("modalVideo");
if (modalVideo) {
  modalVideo.pause();
  modalVideo.src = "";
}
};

modal.onclick=function(e){
if(e.target === modal){
modal.style.display="none";
const modalVideo = document.getElementById("modalVideo");
if (modalVideo) {
  modalVideo.pause();
  modalVideo.src = "";
}
}
};

});