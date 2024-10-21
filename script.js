// script.js

document.addEventListener('DOMContentLoaded', () => {
  const modelViewer = document.querySelector('#modelViewer');
  const featuresContainer = document.querySelector('#featuresContainer');
  const mainView = document.querySelector('.main-view');

  // ---------------------------
  // Модальные окна и их управление
  // ---------------------------

  // Открытие и закрытие модального окна выбора фасона
  const openModalButton = document.getElementById('openModal');
  const modal = document.getElementById('modal');
  const closeModalButton = document.getElementById('closeModal');
  const modelItems = document.querySelectorAll('.model-item');

  openModalButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Закрытие модального окна при клике вне контента
  window.addEventListener('click', (event) => {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
    // Закрытие дополнительных модальных окон
    const additionalModals = ['modalPockets', 'modalReflectors', 'modalCollar', 'modalLogo'];
    additionalModals.forEach(modalId => {
      const additionalModal = document.getElementById(modalId);
      if (additionalModal && event.target == additionalModal) {
        additionalModal.style.display = 'none';
      }
    });
  });

  // Переключение моделей при выборе в модальном окне
  modelItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const modelSrc = e.target.dataset.model;
      modelViewer.src = modelSrc;
      modal.style.display = 'none';
      updateOptionsVisibility(modelSrc);
      clearFeatures(); // Очистка добавленных элементов при смене модели
      clearLogo(); // Очистка добавленного логотипа при смене модели
    });
  });

  // Функция для обновления видимости опций
  function updateOptionsVisibility(modelSrc) {
    const optionsGroups = document.querySelectorAll('.options-group');
    optionsGroups.forEach(group => {
      if (group.id === `options${getModelName(modelSrc)}`) {
        group.style.display = 'grid'; // Используем grid для двухколоночного вида
      } else {
        group.style.display = 'none';
      }
    });
  }

  // Функция для получения имени модели из src
  function getModelName(src) {
    if (src.includes('бушлат')) return 'Bushlat';
    if (src.includes('футболка с воротом')) return 'Tshirt';
    if (src.includes('жилетка')) return 'Waistcoat';
    if (src.includes('комбинезон')) return 'Coverall';
    if (src.includes('куртка')) return 'Kurtka';
    if (src.includes('поварской китель')) return 'ChefCoat';
    if (src.includes('фартук')) return 'Apron';
    if (src.includes('футболка без воротника')) return 'TshirtNoCollar';
    if (src.includes('халат')) return 'Robe';
    if (src.includes('шапка повара')) return 'ChefHat';
    return '';
  }

  // ---------------------------
  // Изменение цвета материалов
  // ---------------------------

  // Делегирование событий для изменения цвета
  document.querySelector('.sidebar').addEventListener('input', (e) => {
    if (e.target.type === 'color') {
      const materialNames = e.target.dataset.material.split(',').map(name => name.trim());
      const color = e.target.value;
      changeMaterialsColor(materialNames, color);
    }
  });

  // Функция для изменения цвета нескольких материалов
  function changeMaterialsColor(materialNames, color) {
    if (modelViewer.model && modelViewer.model.materials) {
      materialNames.forEach(materialName => {
        const material = modelViewer.model.materials.find(m => m.name === materialName);
        if (material) {
          // Преобразование HEX в RGBA
          const rgba = hexToRgba(color);
          material.pbrMetallicRoughness.setBaseColorFactor(rgba);
        } else {
          console.error(`Материал "${materialName}" не найден.`);
          alert(`Ошибка: Материал "${materialName}" не найден.`);
        }
      });
    } else {
      console.warn('Модель или материалы не загружены.');
    }
  }

  // Функция для преобразования HEX в RGBA
  function hexToRgba(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r / 255, g / 255, b / 255, 1];
  }

  // ---------------------------
  // Сохранение и загрузка проекта
  // ---------------------------

  const saveButton = document.getElementById('saveProject');
  const loadButton = document.getElementById('loadProject');
  const exportButton = document.getElementById('exportImage');

  saveButton.addEventListener('click', () => {
    modelViewer.toBlob().then(blob => {
      // Создаем изображение из Blob
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.onload = function() {
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = img.width;
        finalCanvas.height = img.height;
        const ctx = finalCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Теперь, если есть логотип, рисуем его
        if (currentLogoContainer) {
          // Вычисляем позицию и размер логотипа относительно canvas
          const logoRect = currentLogoContainer.getBoundingClientRect();
          const mainRect = mainView.getBoundingClientRect();
          const scaleX = finalCanvas.width / mainRect.width;
          const scaleY = finalCanvas.height / mainRect.height;
          const logoX = (logoRect.left - mainRect.left) * scaleX;
          const logoY = (logoRect.top - mainRect.top) * scaleY;
          const logoWidth = logoRect.width * scaleX;
          const logoHeight = logoRect.height * scaleY;

          const logoImg = new Image();
          logoImg.onload = function() {
            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
            // Сохраняем итоговый canvas как JPEG
            finalCanvas.toBlob(finalBlob => {
              const finalUrl = URL.createObjectURL(finalBlob);
              const a = document.createElement('a');
              a.href = finalUrl;
              a.download = 'project.jpg';
              a.click();
              URL.revokeObjectURL(finalUrl);
            }, 'image/jpeg');
          };
          logoImg.src = currentLogoImageSrc;
        } else {
          // Сохраняем итоговый canvas как JPEG
          finalCanvas.toBlob(finalBlob => {
            const finalUrl = URL.createObjectURL(finalBlob);
            const a = document.createElement('a');
            a.href = finalUrl;
            a.download = 'project.jpg';
            a.click();
            URL.revokeObjectURL(finalUrl);
          }, 'image/jpeg');
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }).catch(error => {
      console.error('Ошибка при сохранении проекта:', error);
      alert('Ошибка при сохранении проекта.');
    });
  });

  loadButton.addEventListener('click', () => {
    // Загрузка проекта из JSON остается прежней
    alert('Функция загрузки проекта недоступна, так как сохранение осуществляется в формате JPEG.');
  });

  // Функция для экспорта изображения модели
  exportButton.addEventListener('click', () => {
    const canvas = modelViewer.getCanvas();
    if (canvas) {
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'model.png';
        a.click();
        URL.revokeObjectURL(url);
      });
    } else {
      alert('Не удалось экспортировать изображение.');
    }
  });

  // Логирование всех материалов при загрузке модели для отладки
  modelViewer.addEventListener('load', () => {
    if (modelViewer.model && modelViewer.model.materials) {
      console.log('Список материалов в модели:');
      modelViewer.model.materials.forEach(material => {
        console.log(material.name);
      });
    } else {
      console.warn('Модель или материалы не загружены.');
    }
  });

  // ---------------------------
  // Обработка дополнительных элементов (карманы, отражатели, воротники)
  // ---------------------------

  const featureButtons = document.querySelectorAll('.feature-button');
  const featureModals = {
    'pockets': document.getElementById('modalPockets'),
    'reflectors': document.getElementById('modalReflectors'),
    'collar': document.getElementById('modalCollar'),
    'logo': document.getElementById('modalLogo') // Для возможных будущих расширений
  };

  featureButtons.forEach(button => {
    const feature = button.dataset.feature;
    // Исключаем кнопки, не связанные с модальными окнами (например, "Темная Тема")
    if (featureModals[feature]) {
      button.addEventListener('click', () => {
        const modalFeature = featureModals[feature];
        if (modalFeature) {
          modalFeature.style.display = 'block';
        }
      });
    }
  });

  // Закрытие модальных окон для дополнительных элементов
  const closeFeatureButtons = document.querySelectorAll('.close[data-modal]');
  closeFeatureButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modalId = button.dataset.modal;
      const modalToClose = document.getElementById(modalId);
      if (modalToClose) {
        modalToClose.style.display = 'none';
      }
    });
  });

  // Добавление выбранного элемента к модели
  const featureItems = document.querySelectorAll('.feature-item');
  featureItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const featureModelSrc = e.target.dataset.featureModel;
      addFeatureModel(featureModelSrc);
      // Закрытие модального окна после выбора
      const parentModal = e.target.closest('.modal');
      if (parentModal) {
        parentModal.style.display = 'none';
      }
    });
  });

  // Функция для добавления дополнительного элемента к модели
  function addFeatureModel(modelSrc) {
    const existingFeature = featuresContainer.querySelector(`model-viewer[src="${modelSrc}"]`);
    if (existingFeature) {
      alert('Этот элемент уже добавлен.');
      return;
    }

    const newFeature = document.createElement('model-viewer');
    newFeature.setAttribute('src', modelSrc);
    newFeature.setAttribute('alt', 'Дополнительный элемент');
    newFeature.setAttribute('camera-controls', '');
    newFeature.setAttribute('ar', '');
    newFeature.style.position = 'absolute';
    newFeature.style.top = '0';
    newFeature.style.left = '0';
    newFeature.style.width = '100%';
    newFeature.style.height = '100%';
    newFeature.style.pointerEvents = 'none'; // Не позволяет взаимодействовать с элементом

    featuresContainer.appendChild(newFeature);
  }

  // Функция для очистки добавленных элементов при смене основной модели
  function clearFeatures() {
    featuresContainer.innerHTML = '';
  }

  // ---------------------------
  // Новые функции: Добавление Логотипов и Эмблем
  // ---------------------------

  // 1. Добавление Логотипов и Эмблем
  const addLogoButton = document.getElementById('addLogoButton');
  const modalLogo = document.getElementById('modalLogo');
  const closeLogoModal = document.querySelector('.close[data-modal="modalLogo"]');
  const logoUpload = document.getElementById('logoUpload');
  const logoPreviewContainer = document.getElementById('logoPreviewContainer');
  const logoCanvas = document.getElementById('logoCanvas');
  const logoSize = document.getElementById('logoSize');
  const logoX = document.getElementById('logoX');
  const logoY = document.getElementById('logoY');
  const applyLogoButton = document.getElementById('applyLogoButton');

  let currentLogoContainer = null; // Контейнер для логотипа
  let currentLogoImageSrc = null; // Ссылка на изображение логотипа
  let logoDataURL = null; // Данные изображения логотипа

  addLogoButton.addEventListener('click', () => {
    modalLogo.style.display = 'block';
  });

  logoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      const img = new Image();
      img.onload = function() {
        // Отобразить изображение на canvas для предварительного просмотра
        logoCanvas.width = 300;
        logoCanvas.height = 300;
        const ctx = logoCanvas.getContext('2d');
        ctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
        ctx.drawImage(img, 0, 0, 300, 300);
        logoPreviewContainer.style.display = 'block';
        logoDataURL = logoCanvas.toDataURL();
      }
      img.src = evt.target.result;
    }
    reader.readAsDataURL(file);
  });

  // Обработчик нажатия кнопки "Применить Логотип"
  applyLogoButton.addEventListener('click', () => {
    if (!logoDataURL) {
      alert('Пожалуйста, загрузите изображение логотипа.');
      return;
    }

    if (currentLogoContainer) {
      mainView.removeChild(currentLogoContainer);
    }

    currentLogoContainer = document.createElement('div');
    currentLogoContainer.style.position = 'absolute';
    currentLogoContainer.style.top = `${parseInt(logoY.value)}px`;
    currentLogoContainer.style.left = `${parseInt(logoX.value)}px`;
    currentLogoContainer.style.width = `${parseInt(logoSize.value)}px`;
    currentLogoContainer.style.height = `${parseInt(logoSize.value)}px`;
    currentLogoContainer.style.cursor = 'move';

    const logoImg = document.createElement('img');
    logoImg.src = logoDataURL;
    logoImg.style.width = '100%';
    logoImg.style.height = '100%';
    logoImg.style.pointerEvents = 'none';

    currentLogoImageSrc = logoDataURL;

    currentLogoContainer.appendChild(logoImg);

    // Добавляем ручку для изменения размера
    const resizer = document.createElement('div');
    resizer.style.width = '15px';
    resizer.style.height = '15px';
    resizer.style.background = 'rgba(0,0,0,0.5)';
    resizer.style.position = 'absolute';
    resizer.style.right = '0';
    resizer.style.bottom = '0';
    resizer.style.cursor = 'se-resize';
    currentLogoContainer.appendChild(resizer);

    makeResizableDraggable(currentLogoContainer);

    mainView.appendChild(currentLogoContainer);

    modalLogo.style.display = 'none';
    // Сбросить загрузку и предварительный просмотр логотипа
    logoUpload.value = '';
    logoPreviewContainer.style.display = 'none';
    logoCanvas.getContext('2d').clearRect(0, 0, logoCanvas.width, logoCanvas.height);
  });

  // Функция для очистки логотипа при смене модели
  function clearLogo() {
    if (currentLogoContainer) {
      mainView.removeChild(currentLogoContainer);
      currentLogoContainer = null;
    }
  }

  // Функция для реализации перетаскивания и изменения размера элемента
  function makeResizableDraggable(elmnt) {
    const resizer = elmnt.querySelector('div'); // Ручка изменения размера
    let isResizing = false;
    let isDragging = false;

    resizer.addEventListener('mousedown', function(e) {
      e.preventDefault();
      e.stopPropagation();
      isResizing = true;
      document.addEventListener('mousemove', resizeMouseMove);
      document.addEventListener('mouseup', stopResize);
    });

    elmnt.addEventListener('mousedown', function(e) {
      if (isResizing) return;
      e.preventDefault();
      isDragging = true;
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener('mousemove', elementDrag);
      document.addEventListener('mouseup', closeDragElement);
    });

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    function elementDrag(e) {
      e.preventDefault();
      if (!isDragging) return;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      isDragging = false;
      document.removeEventListener('mousemove', elementDrag);
      document.removeEventListener('mouseup', closeDragElement);
    }

    function resizeMouseMove(e) {
      e.preventDefault();
      if (!isResizing) return;
      const width = e.clientX - elmnt.getBoundingClientRect().left;
      const height = e.clientY - elmnt.getBoundingClientRect().top;
      if (width > 20 && height > 20) { // Минимальный размер
        elmnt.style.width = width + 'px';
        elmnt.style.height = height + 'px';
      }
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener('mousemove', resizeMouseMove);
      document.removeEventListener('mouseup', stopResize);
    }
  }

  // ---------------------------
  // Режим Темной Темы
  // ---------------------------

  const toggleThemeButton = document.getElementById('toggleThemeButton');
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Функция для применения темы
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  // Загрузка предпочтительной темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Применить тему на основе системных настроек
    applyTheme(prefersDarkScheme.matches ? 'dark' : 'light');
  }

  toggleThemeButton.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      applyTheme('light');
      localStorage.setItem('theme', 'light');
    } else {
      applyTheme('dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  // Опционально: слушать изменения системных настроек темы
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

});
