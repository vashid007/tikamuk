function load_animation(){
    const galleryItems = document.querySelectorAll('.img-wrapper');
    let currentItem = 0;
    let hoverFlag = false;

    // Handle Hover for Desktop (shows content)
    document.addEventListener("mousemove", (e) => {
      const element = document.elementFromPoint(e.clientX, e.clientY);

      if (element && element.parentElement?.classList.contains("img-wrapper")) {
        // If we are hovering, remove any auto-active class
        galleryItems.forEach(i => i.classList.remove('auto-active'));
        hoverFlag = true;
      } else {
        // Only reset hover flag if no active item from click
        const activeItem = document.querySelector('.img-wrapper.active');
        if (!activeItem) {
          hoverFlag = false;
        }
      }
    });

    // Handle Click/Tap interaction (shows content)
    galleryItems.forEach((item, index) => {
      item.addEventListener("click", (e) => {
        const isActive = item.classList.contains("active");

        // Deactivate all first (including auto-zoom)
        galleryItems.forEach(i => {
            i.classList.remove('active');
            i.classList.remove('auto-active');
        });

        if (!isActive) {
          item.classList.add('active');
          currentItem = index;
          hoverFlag = true; // Pause auto-zoom
        } else {
          hoverFlag = false; // Restore auto-zoom
        }
        
        e.stopPropagation();
      });
    });

    // Deactivate when clicking anywhere else
    document.addEventListener("click", () => {
      galleryItems.forEach(i => {
          i.classList.remove('active');
          i.classList.remove('auto-active');
      });
      hoverFlag = false;
    });
    
    // Automatic Background Animation (Works on both if hoverFlag is false)
    setInterval(() => {
      if (hoverFlag === false) {
        galleryItems.forEach(i => {
           i.classList.remove('active');
           i.classList.remove('auto-active');
        });
        currentItem = Math.floor(Math.random() * galleryItems.length);
        galleryItems[currentItem].classList.add('auto-active');
      }
    }, 3000); 
  }

  window.addEventListener("load", () => {
    load_animation();
  });



// Desktop: work out how far each image must move when zoomed (scale 2.5) so that
// the image (auto zoom) or image + details (hover / click) stays inside the screen,
// with a small margin on every side and below the header.
(function () {
  const SCALE = 2.5;
  const MARGIN = 16;
  const desktop = window.matchMedia("(min-width: 769px)");
  const PROPS = ["--shift-x", "--lift-zoom", "--lift-details"];

  // Move needed to fit [start, end] inside [min, max]; keeps the start edge visible if it can't fit
  function fit(start, end, min, max) {
    if (start < min) return min - start;
    if (end > max) return Math.max(max - end, min - start);
    return 0;
  }

  function updateLifts() {
    const header = document.querySelector(".site-header");
    const minTop = (header ? header.getBoundingClientRect().bottom : 0) + MARGIN;
    const maxBottom = window.innerHeight - MARGIN;
    const maxRight = document.documentElement.clientWidth - MARGIN;

    document.querySelectorAll(".homegallery .img-wrapper").forEach((wrapper) => {
      if (!desktop.matches) {
        PROPS.forEach((p) => wrapper.style.removeProperty(p));
        return;
      }
      // offset* values ignore transforms, so this works even while an image is zoomed
      const top = wrapper.offsetTop;
      const left = wrapper.offsetLeft;
      const width = wrapper.offsetWidth;
      const height = wrapper.offsetHeight;
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const scaled = (edge, center) => center + SCALE * (edge - center);

      const details = wrapper.querySelector(".hover-details");
      const imageBottom = top + height;
      const detailsBottom = details ? top + details.offsetTop + details.offsetHeight : imageBottom;
      const zoomTop = scaled(top, centerY);

      const shiftX = fit(scaled(left, centerX), scaled(left + width, centerX), MARGIN, maxRight);
      const liftZoom = fit(zoomTop, scaled(imageBottom, centerY), minTop, maxBottom);
      const liftDetails = fit(zoomTop, scaled(detailsBottom, centerY), minTop, maxBottom);

      wrapper.style.setProperty("--shift-x", shiftX + "px");
      wrapper.style.setProperty("--lift-zoom", liftZoom + "px");
      wrapper.style.setProperty("--lift-details", liftDetails + "px");
    });
  }

  // Recalculate right before an image zooms: the preloader changes the layout at page load
  window.addEventListener("resize", updateLifts);
  document.addEventListener("DOMContentLoaded", () => {
    const wrappers = document.querySelectorAll(".homegallery .img-wrapper");
    wrappers.forEach((wrapper) => wrapper.addEventListener("mouseenter", updateLifts));
    const observer = new MutationObserver(updateLifts);
    wrappers.forEach((wrapper) => observer.observe(wrapper, { attributes: true, attributeFilter: ["class"] }));
    updateLifts();
  });
})();

/* ===== ANIMATION 1: "Stack & Scatter" (disabled) =====
   The images start as a tilted stack in the centre of the screen and
   glide out to their positions one after another.
   To use it again: remove this comment wrapper and comment out the active animation.

// Intro animation: the images start stacked in the middle of the screen
// and then spread out to their own positions, one after another.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ANGLES = [-6, 4, -3, 7, -8, 3, -4, 6, -2, 5, -5]; // small tilt for the stack
  const STAGGER = 90; // ms between images
  const DURATION = 1400; // ms per image

  let wrappers = [];

  function stack() {
    wrappers = Array.from(document.querySelectorAll(".homegallery .img-wrapper"));
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    wrappers.forEach((wrapper, i) => {
      // offset* values are the image's own position, without any transform
      const dx = centerX - (wrapper.offsetLeft + wrapper.offsetWidth / 2);
      const dy = centerY - (wrapper.offsetTop + wrapper.offsetHeight / 2);
      wrapper.style.transition = "none";
      wrapper.style.transform = `translate(${dx}px, ${dy}px) rotate(${ANGLES[i % ANGLES.length]}deg)`;
      wrapper.style.zIndex = String(50 + i);
    });
  }

  function scatter() {
    wrappers.forEach((wrapper, i) => {
      wrapper.style.transition = `transform ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1) ${i * STAGGER}ms`;
      wrapper.style.transform = "translate(0, 0) rotate(0deg)";
    });
    // Hand control back to the normal hover / auto-zoom styles
    setTimeout(() => {
      wrappers.forEach((wrapper) => {
        wrapper.style.removeProperty("transition");
        wrapper.style.removeProperty("transform");
        wrapper.style.removeProperty("z-index");
      });
    }, DURATION + wrappers.length * STAGGER + 100);
  }

  function play() {
    stack();
    setTimeout(scatter, 700); // show the stack briefly, then spread out
  }

  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (!preloader) {
      play();
      return;
    }
    // The gallery is hidden while the preloader runs; start when it fades out
    // (that's also when the gallery becomes visible, so the stack can be measured)
    const observer = new MutationObserver(() => {
      if (preloader.classList.contains("fade-out")) {
        observer.disconnect();
        play();
      }
    });
    observer.observe(preloader, { attributes: true, attributeFilter: ["class"] });
  });
})();
===== END OF ANIMATION 1 ===== */

// ===== ANIMATION 2: "Ripple Bloom" (active) =====
// The images bloom out of the centre like a ripple: the ones nearest the centre
// appear first. Each one fades in from blurred and small, drifting outward
// from the middle of the screen into its own position.
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const STEP = 110; // ms between ripple rings
  const DURATION = 1600; // ms per image
  const PULL = 0.35; // how far towards the centre each image starts (0 = in place, 1 = at centre)

  let wrappers = [];

  function hide() {
    wrappers = Array.from(document.querySelectorAll(".homegallery .img-wrapper"));
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Order by distance from the centre: closest images bloom first
    const ranked = wrappers
      .map((wrapper) => {
        const dx = centerX - (wrapper.offsetLeft + wrapper.offsetWidth / 2);
        const dy = centerY - (wrapper.offsetTop + wrapper.offsetHeight / 2);
        return { wrapper, dx, dy, distance: Math.hypot(dx, dy) };
      })
      .sort((a, b) => a.distance - b.distance);

    ranked.forEach(({ wrapper, dx, dy }, rank) => {
      wrapper.dataset.introDelay = String(rank * STEP);
      wrapper.style.transition = "none";
      wrapper.style.opacity = "0";
      wrapper.style.filter = "blur(14px)";
      wrapper.style.transform = `translate(${dx * PULL}px, ${dy * PULL}px) scale(0.4)`;
    });
  }

  function bloom() {
    wrappers.forEach((wrapper) => {
      const delay = wrapper.dataset.introDelay + "ms";
      wrapper.style.transition =
        `transform ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}, ` +
        `opacity 900ms ease ${delay}, filter 1200ms ease ${delay}`;
      wrapper.style.opacity = "1";
      wrapper.style.filter = "blur(0)";
      wrapper.style.transform = "translate(0, 0) scale(1)";
    });
    // Hand control back to the normal hover / auto-zoom styles
    setTimeout(() => {
      wrappers.forEach((wrapper) => {
        ["transition", "transform", "opacity", "filter"].forEach((p) => wrapper.style.removeProperty(p));
        delete wrapper.dataset.introDelay;
      });
    }, DURATION + wrappers.length * STEP + 100);
  }

  function play() {
    hide();
    setTimeout(bloom, 150);
  }

  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (!preloader) {
      play();
      return;
    }
    // The gallery is hidden while the preloader runs; start when it fades out
    const observer = new MutationObserver(() => {
      if (preloader.classList.contains("fade-out")) {
        observer.disconnect();
        play();
      }
    });
    observer.observe(preloader, { attributes: true, attributeFilter: ["class"] });
  });
})();

/* ===== ANIMATION 3: "Curtain Rise" (disabled) =====
   The images are revealed in a wave from left to right. Each one rises gently
   into place while a curtain lifts from the bottom of the image to the top,
   with a soft fade and a slight settle in size.
   To use it again: remove this comment wrapper and comment out the active animation.

(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const WAVE = 650; // ms for the wave to cross the whole screen
  const DURATION = 1300; // ms per image
  const RISE = 60; // px each image rises from

  let wrappers = [];

  function hide() {
    wrappers = Array.from(document.querySelectorAll(".homegallery .img-wrapper"));
    const width = document.documentElement.clientWidth || window.innerWidth;
    wrappers.forEach((wrapper) => {
      // Delay follows the image's horizontal position, so the reveal sweeps left to right
      const centerX = wrapper.offsetLeft + wrapper.offsetWidth / 2;
      const delay = Math.max(0, Math.min(1, centerX / width)) * WAVE;
      wrapper.dataset.introDelay = String(Math.round(delay));
      wrapper.style.transition = "none";
      wrapper.style.opacity = "0";
      wrapper.style.clipPath = "inset(100% 0 0 0)";
      wrapper.style.transform = `translateY(${RISE}px) scale(1.08)`;
    });
  }

  function rise() {
    const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
    wrappers.forEach((wrapper) => {
      const delay = wrapper.dataset.introDelay + "ms";
      wrapper.style.transition =
        `transform ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}, ` +
        `clip-path ${DURATION}ms ${ease} ${delay}, opacity 500ms ease ${delay}`;
      wrapper.style.opacity = "1";
      wrapper.style.clipPath = "inset(0 0 0 0)";
      wrapper.style.transform = "translateY(0) scale(1)";
    });
    // Hand control back to the normal hover / auto-zoom styles
    setTimeout(() => {
      wrappers.forEach((wrapper) => {
        ["transition", "transform", "opacity", "clip-path"].forEach((p) => wrapper.style.removeProperty(p));
        delete wrapper.dataset.introDelay;
      });
    }, DURATION + WAVE + 100);
  }

  function play() {
    hide();
    setTimeout(rise, 150);
  }

  window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (!preloader) {
      play();
      return;
    }
    // The gallery is hidden while the preloader runs; start when it fades out
    const observer = new MutationObserver(() => {
      if (preloader.classList.contains("fade-out")) {
        observer.disconnect();
        play();
      }
    });
    observer.observe(preloader, { attributes: true, attributeFilter: ["class"] });
  });
})();
===== END OF ANIMATION 3 ===== */
