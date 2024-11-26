// script.js

document.addEventListener('DOMContentLoaded', () => {
  const modelViewer = document.querySelector('#modelViewer');
  const featuresContainer = document.querySelector('#featuresContainer');
  const mainView = document.querySelector('.main-view');
  const totalCostElement = document.getElementById('totalCost');
  const sizeSliderContainer = document.getElementById('sizeSliderContainer');
  const sizeSlider = document.getElementById('sizeSlider');

  let selectedElement = null; // Выбранный элемент для изменения размера

  // ---------------------------
  // Ценообразование
  // ---------------------------

  // Базовые цены для каждой модели (в копейках)
  const basePrices = {
    'бушлат.glb': 240000, // 240 тысяч
    'фартук.glb': 120000, // 120 тысяч
    'футболка с воротом.glb': 150000,
    'жилетка.glb': 180000,
    'комбинезон.glb': 200000,
    'куртка.glb': 220000,
    'поварской китель.glb': 160000,
    'футболка без воротника.glb': 140000,
    'халат.glb': 170000,
    'шапка повара.glb': 80000,
    'ELITE.glb': 250000,
    'AGROMIR.glb': 230000,
    'coat.glb': 190000,
    'coat1.glb': 195000,
    'coat2.glb': 200000,
    'coat3.glb': 205000,
    'Coat6.glb': 210000,
    'ELITE KAPUSHON.glb': 220000,
    'Jacket.glb': 175000,
    'Jacket2.glb': 180000,
    'Jacket2hood.glb': 185000,
    'Jacket3.glb': 190000,
    'KLEO.glb': 160000,
    'KLEO KAPUSHON.glb': 165000,
    'MANDARIN.glb': 170000,
    'PREZIDENT.glb': 175000,
    'PREZIDENT KAPUSHON.glb': 180000,
    'tunic.glb': 155000,
    // Добавьте остальные модели с их ценами
  };

  // Стоимость дополнительных элементов (в копейках)
  const featurePrices = {
    'assets/pocket1.glb': 10000, // 10 тысяч
    'assets/pocket2.glb': 15000, // 15 тысяч
    'assets/pocket3.glb': 20000, // 20 тысяч
    // Добавьте остальные элементы с их ценами
  };

  // Стоимость дополнительных деталей (в копейках)
  const detailPrices = {
    'details/collar.png': 5000,
    'details/pocket.png': 3000,
    'details/cuff.png': 2000,
    // Добавьте остальные детали и их цены
  };

  let currentModelPrice = 0;
  let totalCost = 0;
  let addedFeatures = [];
  let addedDetails = [];

  // Функция для обновления отображения стоимости
  function updateTotalCost() {
    let featuresCost = addedFeatures.reduce((sum, feature) => sum + (featurePrices[feature] || 0), 0);
    let detailsCost = addedDetails.reduce((sum, detail) => sum + (detailPrices[detail] || 0), 0);
    totalCost = currentModelPrice + featuresCost + detailsCost;
    totalCostElement.textContent = `Стоимость: ${formatPrice(totalCost)} Сум`;
  }

  // Функция для форматирования цены
  function formatPrice(priceInKopecks) {
    return (priceInKopecks / 1000).toLocaleString('ru-RU');
  }

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
    const additionalModals = ['modalPockets', 'modalLogo', 'modalOtherDetails'];
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
      const modelSrc = e.currentTarget.dataset.model;
      modelViewer.src = modelSrc;
      modal.style.display = 'none';
      updateOptionsVisibility(modelSrc);
      clearFeatures(); // Очистка добавленных элементов при смене модели
      clearLogo(); // Очистка добавленного логотипа при смене модели
      clearDetails(); // Очистка добавленных деталей при смене модели
      resetRotation(); // Сброс состояния вращения при смене модели

      // Обновляем цену
      const modelFileName = modelSrc.split('/').pop();
      currentModelPrice = basePrices[modelFileName] || 0;
      addedFeatures = [];
      addedDetails = [];
      updateTotalCost();
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
    if (src.includes('фартук')) return 'Apron';
    if (src.includes('футболка с воротом')) return 'Tshirt';
    if (src.includes('жилетка') && !src.includes('KAPUSHON')) return 'Waistcoat';
    if (src.includes('жилетка') && src.includes('KAPUSHON')) return 'ELITEKAPUSHON';
    if (src.includes('комбинезон')) return 'Coverall';
    if (src.includes('куртка') && !src.includes('капюшон')) return 'Kurtka';
    if (src.includes('поварской китель') && !src.includes('coat')) return 'ChefCoat';
    if (src.includes('футболка без воротника')) return 'TshirtNoCollar';
    if (src.includes('халат')) return 'Robe';
    if (src.includes('шапка повара')) return 'ChefHat';
    if (src.includes('ELITE KAPUSHON')) return 'ELITEKAPUSHON';
    if (src.includes('ELITE')) return 'ELITE';
    if (src.includes('AGROMIR')) return 'AGROMIR';
    if (src.includes('coat.glb')) return 'CoatS';
    if (src.includes('coat1')) return 'Coat1';
    if (src.includes('coat2')) return 'Coat2';
    if (src.includes('coat3')) return 'Coat3';
    if (src.includes('Coat6')) return 'Coat6';
    if (src.includes('Jacket2hood')) return 'Jacket2hood';
    if (src.includes('Jacket2')) return 'Jacket2';
    if (src.includes('Jacket3')) return 'Jacket3';
    if (src.includes('Jacket.glb')) return 'Jacket';
    if (src.includes('KLEO KAPUSHON')) return 'KLEOKAPUSHON';
    if (src.includes('KLEO')) return 'KLEO';
    if (src.includes('MANDARIN')) return 'MANDARIN';
    if (src.includes('PREZIDENT KAPUSHON')) return 'PREZIDENTKAPUSHON';
    if (src.includes('PREZIDENT')) return 'PREZIDENT';
    if (src.includes('tunic')) return 'tunic';
    // Добавьте условия для остальных новых моделей при необходимости
    return '';
  }

  // ---------------------------
  // Изменение цвета материалов
  // ---------------------------

  // Создаем массив цветов для палитры
  const colorPalette = [
    '#FFFFFF', '#C0C0C0', '#808080', '#000000', '#FF0000',
    '#800000', '#FFFF00', '#808000', '#00FF00', '#008000',
    '#00FFFF', '#008080', '#0000FF', '#000080', '#FF00FF',
    '#800080', '#FFA500', '#A52A2A', '#FFC0CB', '#FFD700',
    '#D2691E', '#B8860B', '#DAA520', '#EEE8AA', '#F0E68C',
    '#ADFF2F', '#7FFF00', '#7CFC00', '#32CD32', '#98FB98',
    '#00FA9A', '#00FF7F', '#2E8B57', '#66CDAA', '#20B2AA',
    '#48D1CC', '#40E0D0', '#5F9EA0', '#4682B4', '#6495ED',
    '#1E90FF', '#4169E1', '#0000CD', '#8A2BE2', '#4B0082',
    '#6A5ACD', '#7B68EE', '#9370DB', '#8B008B', '#BA55D3',
    '#9400D3', '#9932CC', '#C71585', '#FF1493', '#FF69B4',
    '#DB7093', '#B22222', '#DC143C', '#FF4500', '#FF8C00',
    '#FFDAB9', '#EEE8AA', '#F5DEB3', '#DEB887', '#D2B48C',
    '#BC8F8F', '#F4A460', '#DAA520', '#B8860B', '#CD853F',
    // Добавьте больше цветов по необходимости
  ];

  // Обработчик для пользовательского выбора цвета
  document.querySelector('.sidebar').addEventListener('click', (e) => {
    if (e.target.classList.contains('color-picker')) {
      const picker = e.target;
      // Если палитра уже открыта, закрываем ее
      closeAllColorPalettes();

      // Создаем элемент палитры
      const palette = document.createElement('div');
      palette.classList.add('color-palette');

      colorPalette.forEach(color => {
        const swatch = document.createElement('div');
        swatch.classList.add('color-swatch');
        swatch.style.backgroundColor = color;
        swatch.addEventListener('click', () => {
          picker.style.backgroundColor = color;
          const materialNames = picker.dataset.material.split(',').map(name => name.trim());
          changeMaterialsColor(materialNames, color);
          palette.remove(); // Закрываем палитру после выбора
        });
        palette.appendChild(swatch);
      });

      // Добавляем палитру в DOM
      picker.parentElement.appendChild(palette);
    } else {
      // Закрываем все открытые палитры, если кликнули вне color-picker
      closeAllColorPalettes();
    }
  });

  // Функция для закрытия всех открытых палитр
  function closeAllColorPalettes() {
    const palettes = document.querySelectorAll('.color-palette');
    palettes.forEach(palette => palette.remove());
  }

  // Закрываем палитру, если кликнули вне нее
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.option-square')) {
      closeAllColorPalettes();
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
    alert('Функция сохранения проекта еще не реализована.');
  });

  loadButton.addEventListener('click', () => {
    alert('Функция загрузки проекта еще не реализована.');
  });

  exportButton.addEventListener('click', () => {
    alert('Функция экспорта изображения еще не реализована.');
  });

  // ---------------------------
  // Обработка дополнительных элементов (карманы и т.д.)
  // ---------------------------

  const addPocketsButton = document.getElementById('addPocketsButton');
  const modalPockets = document.getElementById('modalPockets');
  const closePocketsModal = modalPockets.querySelector('.close');

  addPocketsButton.addEventListener('click', () => {
    modalPockets.style.display = 'block';
  });

  closePocketsModal.addEventListener('click', () => {
    modalPockets.style.display = 'none';
  });

  // Добавление выбранного элемента к модели
  const featureItems = modalPockets.querySelectorAll('.model-item');
  featureItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const featureModelSrc = e.currentTarget.dataset.featureModel;
      if (featureModelSrc) {
        addFeatureModel(featureModelSrc);
        // Закрытие модального окна после выбора
        modalPockets.style.display = 'none';

        // Добавляем стоимость элемента
        addedFeatures.push(featureModelSrc);
        updateTotalCost();
      }
    });
  });

  // Функция для добавления дополнительного элемента к модели
  function addFeatureModel(modelSrc) {
    const newFeature = document.createElement('img');
    newFeature.src = modelSrc; // Используйте фактический путь к изображению
    newFeature.style.position = 'absolute';
    newFeature.style.cursor = 'pointer';
    newFeature.style.width = '100px';
    newFeature.dataset.modelSrc = modelSrc;

    // Устанавливаем элемент в центр mainView
    newFeature.style.left = (mainView.offsetWidth / 2 - 50) + 'px'; // 50 - половина ширины
    newFeature.style.top = (mainView.offsetHeight / 2 - 50) + 'px';

    // Добавляем ручку для изменения размера
    const resizer = document.createElement('div');
    resizer.classList.add('resizer');
    newFeature.appendChild(resizer);

    // Добавляем элемент в mainView
    mainView.appendChild(newFeature);

    // Делаем элемент перетаскиваемым и масштабируемым
    makeResizableDraggable(newFeature);

    // Добавляем обработчик клика для выбора элемента
    newFeature.addEventListener('click', (e) => {
      e.stopPropagation(); // Предотвращаем всплытие события
      selectElement(newFeature);
    });

    // Обработчик двойного клика для удаления элемента
    newFeature.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      removeFeatureElement(newFeature);
    });
  }

  // Функция для удаления элемента
  function removeFeatureElement(element) {
    element.remove();
    // Удаляем элемент из массива addedFeatures
    const index = addedFeatures.indexOf(element.dataset.modelSrc);
    if (index !== -1) {
      addedFeatures.splice(index, 1);
      updateTotalCost();
    }
    // Скрываем ползунок, если удаленный элемент был выбранным
    if (selectedElement === element) {
      sizeSliderContainer.style.display = 'none';
      selectedElement = null;
    }
  }

  // Функция для выбора элемента
  function selectElement(element) {
    selectedElement = element;
    sizeSliderContainer.style.display = 'block';
    sizeSlider.value = parseInt(selectedElement.style.width);

    // Обновляем ползунок при изменении
    sizeSlider.oninput = function() {
      const parentRect = mainView.getBoundingClientRect();
      const rect = selectedElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - parentRect.left;
      const centerY = rect.top + rect.height / 2 - parentRect.top;

      const newWidth = parseInt(this.value);
      const oldWidth = rect.width;

      // Обновляем размер элемента
      selectedElement.style.width = newWidth + 'px';
      selectedElement.style.height = 'auto'; // Сохраняем пропорции

      // Вычисляем новые размеры после изменения
      const newRect = selectedElement.getBoundingClientRect();
      const deltaX = (newRect.width - rect.width) / 2;
      const deltaY = (newRect.height - rect.height) / 2;

      // Корректируем позицию элемента, чтобы центр оставался на месте
      selectedElement.style.left = (selectedElement.offsetLeft - deltaX) + 'px';
      selectedElement.style.top = (selectedElement.offsetTop - deltaY) + 'px';
    };
  }

  // Скрываем ползунок при клике вне элемента
  mainView.addEventListener('click', (e) => {
    if (e.target === mainView || e.target === modelViewer) {
      sizeSliderContainer.style.display = 'none';
      selectedElement = null;
    }
  });

  // ---------------------------
  // Добавление других деталей
  // ---------------------------

  // Получаем элементы
  const addOtherDetailsButton = document.getElementById('addOtherDetailsButton');
  const modalOtherDetails = document.getElementById('modalOtherDetails');
  const closeOtherDetailsModal = document.querySelector('.close[data-modal="modalOtherDetails"]');
  const detailItems = modalOtherDetails.querySelectorAll('.detail-item');

  // Открытие модального окна
  addOtherDetailsButton.addEventListener('click', () => {
    modalOtherDetails.style.display = 'block';
  });

  // Закрытие модального окна
  closeOtherDetailsModal.addEventListener('click', () => {
    modalOtherDetails.style.display = 'none';
  });

  // Добавление детали на модель при клике
  detailItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const detailSrc = e.currentTarget.dataset.detailSrc;
      if (detailSrc) {
        addDetailToModel(detailSrc);
        modalOtherDetails.style.display = 'none';
        // Добавляем стоимость детали
        addedDetails.push(detailSrc);
        updateTotalCost();
      }
    });
  });

  // Функция для добавления детали на модель
  function addDetailToModel(detailSrc) {
    const detailElement = document.createElement('img');
    detailElement.src = detailSrc;
    detailElement.style.position = 'absolute';
    detailElement.style.cursor = 'pointer';
    detailElement.style.width = '100px';
    detailElement.dataset.detailSrc = detailSrc;

    // Устанавливаем элемент в центр mainView
    detailElement.style.left = (mainView.offsetWidth / 2 - 50) + 'px';
    detailElement.style.top = (mainView.offsetHeight / 2 - 50) + 'px';

    // Добавляем ручку для изменения размера
    const resizer = document.createElement('div');
    resizer.classList.add('resizer');
    detailElement.appendChild(resizer);

    // Добавляем элемент в mainView
    mainView.appendChild(detailElement);

    // Делаем элемент перетаскиваемым и масштабируемым
    makeResizableDraggable(detailElement);

    // Добавляем обработчик клика для выбора элемента
    detailElement.addEventListener('click', (e) => {
      e.stopPropagation();
      selectElement(detailElement);
    });

    // Обработчик двойного клика для удаления элемента
    detailElement.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      removeDetailElement(detailElement);
    });
  }

  // Функция для удаления детали
  function removeDetailElement(element) {
    element.remove();
    // Удаляем элемент из массива addedDetails
    const index = addedDetails.indexOf(element.dataset.detailSrc);
    if (index !== -1) {
      addedDetails.splice(index, 1);
      updateTotalCost();
    }
    // Скрываем ползунок, если удаленный элемент был выбранным
    if (selectedElement === element) {
      sizeSliderContainer.style.display = 'none';
      selectedElement = null;
    }
  }

  // ---------------------------
  // Функция для перетаскивания и изменения размера элементов
  // ---------------------------

  function makeResizableDraggable(elmnt) {
    let isResizing = false;
    let isDragging = false;

    // Находим или создаем ручку для изменения размера
    let resizer = elmnt.querySelector('.resizer');
    if (!resizer) {
      resizer = document.createElement('div');
      resizer.classList.add('resizer');
      elmnt.appendChild(resizer);
    }

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
      const rect = elmnt.getBoundingClientRect();
      const parentRect = mainView.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - parentRect.left;
      const centerY = rect.top + rect.height / 2 - parentRect.top;

      const width = e.clientX - rect.left;
      if (width > 20) { // Минимальный размер
        const oldWidth = rect.width;
        // Обновляем размер элемента
        elmnt.style.width = width + 'px';
        elmnt.style.height = 'auto'; // Сохраняем пропорции

        // Вычисляем новые размеры после изменения
        const newRect = elmnt.getBoundingClientRect();
        const deltaX = (newRect.width - rect.width) / 2;
        const deltaY = (newRect.height - rect.height) / 2;

        // Корректируем позицию элемента, чтобы центр оставался на месте
        elmnt.style.left = (elmnt.offsetLeft - deltaX) + 'px';
        elmnt.style.top = (elmnt.offsetTop - deltaY) + 'px';

        if (selectedElement === elmnt) {
          sizeSlider.value = parseInt(elmnt.style.width);
        }
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

  // ---------------------------
  // Управление Вращением Модели
  // ---------------------------

  const toggleRotationButton = document.getElementById('toggleRotationButton');
  let rotationEnabled = true; // По умолчанию вращение включено

  toggleRotationButton.addEventListener('click', () => {
    rotationEnabled = !rotationEnabled;
    if (rotationEnabled) {
      modelViewer.setAttribute('camera-controls', '');
      toggleRotationButton.textContent = 'Вращение: Включено';
    } else {
      modelViewer.removeAttribute('camera-controls');
      toggleRotationButton.textContent = 'Вращение: Выключено';
    }
  });

  // Функция для сброса состояния вращения при смене модели
  function resetRotation() {
    rotationEnabled = true;
    modelViewer.setAttribute('camera-controls', '');
    toggleRotationButton.textContent = 'Вращение: Включено';
  }

  // ---------------------------
  // Очистка элементов
  // ---------------------------

  function clearFeatures() {
    // Удаляем все добавленные элементы (карманы и т.д.)
    const featureElements = mainView.querySelectorAll('img[data-model-src]');
    featureElements.forEach(el => el.remove());
    addedFeatures = [];
    updateTotalCost();
    sizeSliderContainer.style.display = 'none';
    selectedElement = null;
  }

  function clearDetails() {
    const detailElements = mainView.querySelectorAll('img[data-detail-src]');
    detailElements.forEach(el => el.remove());
    addedDetails = [];
    updateTotalCost();
    sizeSliderContainer.style.display = 'none';
    selectedElement = null;
  }

  function clearLogo() {
    // Очистите логотип, если используете его
    const logoElements = mainView.querySelectorAll('img[data-logo-src]');
    logoElements.forEach(el => el.remove());
  }

});
