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

    window.addEventListener("load", () => {

     
      setTimeout(() => {
        logo.src = "assets/images/preloader/CommonLogo_Animation.gif";
      }, 2000);

      setTimeout(() => {
        logo.src = "assets/images/preloader/Common_Logo.svg"; 
        logo.style.paddingLeft = "5%";
        logo.style.paddingBottom = "6%";
      }, 7700);

      setTimeout(() => {
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
      }, 9500);

    
      setTimeout(() => {
               

      header.classList.add("show");
      }, 11000);
      setTimeout(() => {
               

        preloader.classList.add("fade-out");
        document.body.classList.remove("loading-active");
      }, 13000);

   
      preloader.addEventListener("transitionend", function () {
        preloader.remove();
      });

    });

  }

});
