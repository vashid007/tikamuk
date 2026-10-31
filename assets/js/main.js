document.addEventListener("DOMContentLoaded", () => {
  const yearNodes = document.querySelectorAll(".js-year");
  yearNodes.forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  // Works with both /about.html and clean URLs like /about
  const pageName = (path) =>
    (path.split("/").pop() || "index").replace(/\.html$/, "");
  const currentPath = pageName(window.location.pathname);
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const normalizedHref = pageName(href.split(/[?#]/)[0]);
    if (normalizedHref === currentPath) {
      link.classList.add("active");
    }
  });
});
// navmenu
const hamburger = document.getElementById("hamburger");
const navMenu = document.querySelector(".nav-links");

if (hamburger && navMenu) {
  hamburger.setAttribute("role", "button");
  hamburger.setAttribute("aria-label", "Menu");
  hamburger.setAttribute("aria-expanded", "false");

  const setMenu = (open) => {
    hamburger.classList.toggle("active", open);
    navMenu.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  };

  hamburger.addEventListener("click", () => setMenu(!navMenu.classList.contains("active")));
  // Close when a menu link is tapped, or with the Escape key
  navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
}

document.addEventListener("DOMContentLoaded", function(){

const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImg");
const closeModal = document.getElementById("closeModal");

if (!modal || !modalImg || !closeModal) return;

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
    const localExtraImages = parent ? Array.from(parent.querySelectorAll(".gallery-image")) : [];

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const visibleExtraImages = localExtraImages.filter(el => {
      const parentGallery = el.closest(".extra-gallery");
      if (isMobile) {
        if (el.classList.contains("hide-mobile") || (parentGallery && parentGallery.classList.contains("hide-mobile"))) {
          return false;
        }
      } else {
        if (el.classList.contains("hide-desktop") || (parentGallery && parentGallery.classList.contains("hide-desktop"))) {
          return false;
        }
      }
      return true;
    });

    if (visibleExtraImages.length > 0) {
      images = visibleExtraImages;
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
// Portfolio tab: the whole project area (title, thumbnail and the space between them)
// opens the project, not just the title. The row's padding above/below stays inactive.
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".main-wrap .single-items").forEach((item) => {
    const link = item.querySelector("a[href]");
    const thumb = item.querySelector(".img-wrapper");
    if (!link || !thumb) return;

    // Inside the band from the top to the bottom of the title/thumbnail
    const inBand = (e) => {
      const a = link.getBoundingClientRect();
      const t = thumb.getBoundingClientRect();
      return e.clientY >= Math.min(a.top, t.top) && e.clientY <= Math.max(a.bottom, t.bottom);
    };

    item.addEventListener("mousemove", (e) => {
      item.style.cursor = inBand(e) ? "pointer" : "";
    });
    item.addEventListener("mouseleave", () => {
      item.style.cursor = "";
    });
    item.addEventListener("click", (e) => {
      if (e.target.closest("a") || !inBand(e)) return; // the title link already works on its own
      if (e.ctrlKey || e.metaKey || e.shiftKey) {
        window.open(link.href, "_blank");
      } else {
        window.location.href = link.href;
      }
    });
  });
});
