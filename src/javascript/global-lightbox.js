(() => {
  const lightbox = document.createElement('div');
  lightbox.id = 'global-lightbox';
  lightbox.className = 'global-lightbox';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'global-lightbox-close';
  closeBtn.innerHTML = '&times;';

  const lightboxImg = document.createElement('img');
  lightboxImg.className = 'global-lightbox-content';
  lightboxImg.alt = 'Enlarged View';

  lightbox.appendChild(closeBtn);
  lightbox.appendChild(lightboxImg);

  let isZoomed = false;

  const resetZoom = () => {
    isZoomed = false;
    lightboxImg.classList.remove('zoomed');
    lightboxImg.style.transformOrigin = 'center center';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    resetZoom();
  };

  const init = () => {
    document.body.appendChild(lightbox);

    document.addEventListener('click', (e) => {
      const target = e.target;
      
      if (
        target.tagName === 'IMG' && 
        !target.classList.contains('global-lightbox-content') &&
        !target.closest('#global-lightbox')
      ) {
        lightboxImg.src = target.src;
        lightboxImg.alt = target.alt || 'Enlarged View';
        resetZoom();
        lightbox.classList.add('active');
      }
    });

    lightboxImg.addEventListener('click', (e) => {
      e.stopPropagation();
      
      if (!isZoomed) {
        const rect = lightboxImg.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        lightboxImg.style.transformOrigin = `${x}% ${y}%`;
        lightboxImg.classList.add('zoomed');
        isZoomed = true;
      } else {
        resetZoom();
      }
    });

    lightboxImg.addEventListener('mousemove', (e) => {
      if (!isZoomed) return;
      const rect = lightboxImg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      lightboxImg.style.transformOrigin = `${x}% ${y}%`;
    });

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();