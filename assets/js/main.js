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

// Blur reveal: images sharpen from a soft blur as they come into view.
// About (project images + profile photo), Portfolio (thumbnails), Paintings (every painting).
// Runs straight away (this script is at the end of the page) so images never flash in sharp first.
(function () {
  const images = document.querySelectorAll(
    ".about-allportfolio .portfolio-image, .personal-details img, .main-wrap .single-items img, .paintmain-wrap .img-wrapper > img"
  );
  if (!images.length) return;
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.remove("js-reveal"); // show images normally
    return;
  }

  images.forEach((img) => img.classList.add("blur-reveal"));

  // Images on screen when the page opens wait for the page to finish loading, then a short pause,
  // so the effect is clearly seen. Images reached by scrolling start after a shorter pause.
  const FIRST_DELAY = 400;
  const DELAY = 250;
  const STEP = 150;
  let firstBatch = true;
  const pageLoaded = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });
  const imageLoaded = (img) =>
    new Promise((resolve) => {
      if (img.complete && img.naturalWidth) resolve();
      else {
        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      }
    });

  const observer = new IntersectionObserver(
    (entries) => {
      const isFirst = firstBatch;
      firstBatch = false;
      const base = isFirst ? FIRST_DELAY : DELAY;
      // Images appearing together reveal one after another, top to bottom, left to right
      entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((entry, i) => {
          const img = entry.target;
          observer.unobserve(img);
          img.style.setProperty("--reveal-delay", base + i * STEP + "ms");
          Promise.all([imageLoaded(img), isFirst ? pageLoaded : null]).then(() => {
            void getComputedStyle(img).filter; // make sure the blurred state is drawn first
            img.classList.add("is-revealed");
          });
        });
    },
    { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
  );
  images.forEach((img) => observer.observe(img));
})();

// Paintings page opened from a link to one painting (painting.html#hearts etc.):
// desktop centres the painting in the space below the header; mobile shows the painting
// with its title, MEDIUM and YEAR at the bottom of the screen. A very tall painting may be cut off.
(function () {
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target || !target.classList.contains("paintmain-wrap")) return;
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const header = document.querySelector(".site-header");
  const image = target.querySelector(".img-wrapper");
  const metas = target.querySelectorAll(".painting-meta");
  const GAP = 20;
  let userScrolled = false;
  ["wheel", "touchstart", "keydown"].forEach((type) =>
    window.addEventListener(type, () => (userScrolled = true), { once: true, passive: true })
  );

  const position = () => {
    if (userScrolled) return; // don't pull the page back once the visitor starts scrolling
    const headerH = header ? header.offsetHeight : 0;
    const img = image.getBoundingClientRect();
    let y;
    if (window.innerWidth <= 768) {
      const year = metas[metas.length - 1].getBoundingClientRect();
      // Painting just below the header; if that pushes YEAR off screen, scroll on until YEAR sits at the bottom
      y = Math.max(scrollY + year.bottom + GAP - innerHeight, scrollY + img.top - headerH - GAP);
    } else {
      y = scrollY + img.top - headerH - (innerHeight - headerH - img.height) / 2;
    }
    window.scrollTo(0, Math.max(0, y));
  };

  // Paintings above this one change height as they load, so place it again once everything has loaded
  position();
  if (document.readyState === "complete") return;
  document.querySelectorAll("main img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", position, { once: true });
  });
  window.addEventListener("load", position, { once: true });
})();
