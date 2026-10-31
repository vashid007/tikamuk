document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => observer.observe(element));
});

//preloader animation

document.addEventListener("DOMContentLoaded", function () {

  const preloader = document.getElementById("preloader");
  const logo = document.getElementById("loader-logo");
  const header = document.querySelector(".site-header");
   const finalLogo = document.getElementById("final-site-logo");

  if (preloader) {
    document.body.classList.add("loading-active");

    // The logo animation GIF is large (~3 MB). Download it straight away, and only switch to it
    // once it is fully loaded, so it always plays from start to end. Every later step is timed
    // from the moment the animation starts, so a slow first visit can't cut the animation short.
    const ANIMATION_SRC = "assets/images/preloader/CommonLogo_Animation.gif";
    const ANIMATION_MS = 5700; // GIF length (5.44 s) plus a short hold on the last frame
    const animationReady = new Promise((resolve) => {
      const gif = new Image();
      gif.onload = resolve;
      gif.onerror = resolve; // if it fails, carry on with the rest of the sequence
      gif.src = ANIMATION_SRC;
    });
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    window.addEventListener("load", async () => {
      // Show the splash for at least 2 s, and longer if the animation is still downloading
      await Promise.all([wait(2000), animationReady]);
      logo.src = ANIMATION_SRC;
      const start = Date.now();
      const at = (ms, fn) => setTimeout(fn, Math.max(0, ms - (Date.now() - start)));

      at(ANIMATION_MS, () => {
        logo.src = "assets/images/preloader/Common_Logo.svg";
        logo.style.paddingLeft = "5%";
        logo.style.paddingBottom = "6%";
      });

      at(7500, () => {
        // Calculate dimensions directly from unscaled logo
        const loaderRect = logo.getBoundingClientRect();
        const finalRect = finalLogo.getBoundingClientRect();

        const unscaledWidth = logo.offsetWidth;

        const loaderCenterX = loaderRect.left + (loaderRect.width / 2);
        const loaderCenterY = loaderRect.top + (loaderRect.height / 2);

        const finalCenterX = finalRect.left + (finalRect.width / 2);
        const finalCenterY = finalRect.top + (finalRect.height / 2);

        const deltaX = finalCenterX - loaderCenterX;
        const deltaY = finalCenterY - loaderCenterY;

        const scale = finalRect.width / unscaledWidth;

        // Animate smoothly to the top left corner while shrinking
        logo.style.transform = `
          translate(${deltaX}px, ${deltaY}px)
          scale(${scale})
        `;
      });

      // Same gaps as before, counted from the start of the logo animation
      at(9000, () => {
        header.classList.add("show");
      });

      at(11000, () => {
        preloader.classList.add("fade-out");
        document.body.classList.remove("loading-active");
      });

   
      preloader.addEventListener("transitionend", function () {
        preloader.remove();
      });

    });

  }

});
