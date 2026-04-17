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


