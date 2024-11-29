// script.js

document.addEventListener('DOMContentLoaded', () => {
  const modelViewer = document.querySelector('#modelViewer');
  const featuresContainer = document.querySelector('#featuresContainer');
  const mainView = document.querySelector('.main-view');
  const totalCostElement = document.getElementById('totalCost');
  const sizeSliderContainer = document.getElementById('sizeSliderContainer');
  const sizeSlider = document.getElementById('sizeSlider');
  const costBreakdownElement = document.getElementById('costBreakdown');

  let selectedElement = null; // Выбранный элемент для изменения размера

  // ---------------------------
  // Ценообразование
  // ---------------------------

  // Базовые цены для каждой модели (в сумах)
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
  };

  // Отображаемые названия моделей
  const modelDisplayNames = {
    'бушлат.glb': 'Bushlat',
    'фартук.glb': 'Fartuk',
    'футболка с воротом.glb': 'Футболка с воротом',
    'жилетка.glb': 'Жилетка VERTU',
    'комбинезон.glb': 'Комбинезон',
    'куртка.glb': 'Куртка',
    'поварской китель.glb': 'Поварской китель',
    'футболка без воротника.glb': 'Футболка без воротника',
    'халат.glb': 'Халат',
    'шапка повара.glb': 'Шапка повара',
    'ELITE.glb': 'ELITE',
    'AGROMIR.glb': 'AGROMIR',
    'coat.glb': 'Пальто',
    'coat1.glb': 'Пальто 1',
    'coat2.glb': 'Пальто 2',
    'coat3.glb': 'Пальто 3',
    'Coat6.glb': 'Пальто 6',
    'ELITE KAPUSHON.glb': 'ELITE с капюшоном',
    'Jacket.glb': 'Куртка',
    'Jacket2.glb': 'Куртка 2',
    'Jacket2hood.glb': 'Куртка 2 с капюшоном',
    'Jacket3.glb': 'Куртка 3',
    'KLEO.glb': 'KLEO',
    'KLEO KAPUSHON.glb': 'KLEO с капюшоном',
    'MANDARIN.glb': 'MANDARIN',
    'PREZIDENT.glb': 'PREZIDENT',
    'PREZIDENT KAPUSHON.glb': 'PREZIDENT с капюшоном',
    'tunic.glb': 'Туника',
  };

  // Стоимость дополнительных элементов (в сумах)
  const featurePrices = {
    'assets/pocket1.glb': 10000, // 10 тысяч
    // Добавьте остальные элементы с их ценами
    'customLogo': 5000, // Стоимость добавления логотипа
    'customText': 3000, // Стоимость добавления текста
  };

  // Отображаемые названия дополнительных элементов
  const featureDisplayNames = {
    'assets/pocket1.glb': 'Карманы 1',
    // Добавьте остальные элементы с их названиями
    'customLogo': 'Добавлен логотип',
    'customText': 'Добавлен текст',
  };

  // Стоимость дополнительных деталей (в сумах)
  const detailPrices = {
    'pocket/OIP.png': 5000,
    'details/pocket2.png': 6000,
    'details/button1.png': 2000,
    // Добавьте остальные детали и их цены
  };

  // Отображаемые названия дополнительных деталей
  const detailDisplayNames = {
    'pocket/OIP.png': 'Карман 1',
    'details/pocket2.png': 'Карман 2',
    'details/button1.png': 'Пуговица 1',
    // Добавьте остальные детали и их названия
  };

  let currentModelPrice = 0;
  let currentModelFileName = '';
  let currentModelName = '';
  let totalCost = 0;
  let addedFeatures = [];
  let addedDetails = [];

  // Функция для обновления отображения стоимости
  function updateTotalCost() {
    let featuresCost = addedFeatures.reduce((sum, feature) => sum + (featurePrices[feature] || 0), 0);
    let detailsCost = addedDetails.reduce((sum, detail) => sum + (detailPrices[detail] || 0), 0);
    totalCost = currentModelPrice + featuresCost + detailsCost;
    totalCostElement.textContent = `Стоимость: ${formatPrice(totalCost)} Сум`;

    // Создаем массив для разбивки стоимости
    const costItems = [];

    // Добавляем базовую модель
    if (currentModelName) {
      costItems.push({
        name: currentModelName,
        price: currentModelPrice
      });
    }

    // Добавляем добавленные элементы
    addedFeatures.forEach(feature => {
      costItems.push({
        name: featureDisplayNames[feature] || 'Дополнительный элемент',
        price: featurePrices[feature] || 0
      });
    });

    // Добавляем добавленные детали
    addedDetails.forEach(detail => {
      costItems.push({
        name: detailDisplayNames[detail] || 'Дополнительная деталь',
        price: detailPrices[detail] || 0
      });
    });

    // Обновляем отображение разбивки стоимости
    costBreakdownElement.innerHTML = ''; // Очищаем предыдущий список

    costItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.name}: ${formatPrice(item.price)} сумов`;
      costBreakdownElement.appendChild(li);
    });
  }

  // Функция для форматирования цены
  function formatPrice(price) {
    return price.toLocaleString('ru-RU');
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
    const additionalModals = ['modalPockets', 'modalLogo', 'modalOtherDetails', 'modalText', 'modalFill'];
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
      currentModelFileName = modelFileName; // Сохраняем имя файла модели
      currentModelName = modelDisplayNames[modelFileName] || 'Выбранная модель';
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
    if (src.includes('фартук')) return 'Fartuk';
    if (src.includes('футболка с воротом')) return 'FutbolkaSVorotom';
    if (src.includes('жилетка.glb')) return 'Jiletka';
    if (src.includes('комбинезон')) return 'Kombinezon';
    if (src.includes('куртка.glb')) return 'Kurtka';
    if (src.includes('поварской китель')) return 'PovarskoyKitel';
    if (src.includes('футболка без воротника')) return 'FutbolkaBezVorotnika';
    if (src.includes('халат')) return 'Halat';
    if (src.includes('шапка повара')) return 'ShapkaPovara';
    if (src.includes('ELITE KAPUSHON')) return 'ELITEKAPUSHON';
    if (src.includes('ELITE')) return 'ELITE';
    if (src.includes('AGROMIR')) return 'AGROMIR';
    if (src.includes('coat.glb')) return 'Coat';
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
    if (src.includes('tunic')) return 'Tunic';
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
  const closePocketsModal = modalPockets ? modalPockets.querySelector('.close') : null;

  if (addPocketsButton && modalPockets && closePocketsModal) {
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
  }

  // Функция для добавления дополнительного элемента к модели
  function addFeatureModel(modelSrc) {
    const newFeature = document.createElement('img');
    newFeature.src = modelSrc; // Используйте фактический путь к изображению
    newFeature.style.position = 'absolute';
    newFeature.style.cursor = 'pointer';
    newFeature.style.width = '100px';
    newFeature.dataset.modelSrc = modelSrc;

    // Добавляем класс "pocket", если это карман
    if (modelSrc.includes('pocket')) {
      newFeature.classList.add('pocket');
    }

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
  const detailItems = modalOtherDetails ? modalOtherDetails.querySelectorAll('.detail-item') : [];

  if (addOtherDetailsButton && modalOtherDetails && closeOtherDetailsModal) {
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
  }

  // Функция для добавления детали на модель
  function addDetailToModel(detailSrc) {
    const detailElement = document.createElement('img');
    detailElement.src = detailSrc;
    detailElement.style.position = 'absolute';
    detailElement.style.cursor = 'pointer';
    detailElement.style.width = '100px';
    detailElement.dataset.detailSrc = detailSrc;

    // Добавляем класс "pocket", если это карман
    if (detailSrc.includes('pocket')) {
      detailElement.classList.add('pocket');
    }

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
  // Добавление логотипа или изображения
  // ---------------------------

  const addLogoButton = document.getElementById('addLogoButton');
  const modalLogo = document.getElementById('modalLogo');
  const closeLogoModal = modalLogo.querySelector('.close');
  const logoInput = document.getElementById('logoInput');
  const applyLogoButton = document.getElementById('applyLogoButton');

  addLogoButton.addEventListener('click', () => {
    modalLogo.style.display = 'block';
  });

  closeLogoModal.addEventListener('click', () => {
    modalLogo.style.display = 'none';
    logoInput.value = '';
  });

  applyLogoButton.addEventListener('click', () => {
    const file = logoInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        addImageToModel(e.target.result);
        modalLogo.style.display = 'none';
        logoInput.value = '';
        // Добавляем стоимость логотипа
        addedFeatures.push('customLogo');
        updateTotalCost();
      };
      reader.readAsDataURL(file);
    } else {
      alert('Пожалуйста, выберите файл изображения.');
    }
  });

  // ---------------------------
  // Добавление текста
  // ---------------------------

  const addTextButton = document.getElementById('addTextButton');
  const modalText = document.getElementById('modalText');
  const closeTextModal = modalText.querySelector('.close');
  const textInput = document.getElementById('textInput');
  const fontSelect = document.getElementById('fontSelect');
  const fontSizeInput = document.getElementById('fontSizeInput');
  const applyTextButton = document.getElementById('applyTextButton');

  addTextButton.addEventListener('click', () => {
    modalText.style.display = 'block';
  });

  closeTextModal.addEventListener('click', () => {
    modalText.style.display = 'none';
    textInput.value = '';
  });

  applyTextButton.addEventListener('click', () => {
    const text = textInput.value.trim();
    const font = fontSelect.value;
    const fontSize = fontSizeInput.value;
    if (text) {
      addTextToModel(text, font, fontSize);
      modalText.style.display = 'none';
      textInput.value = '';
      // Добавляем стоимость текста
      addedFeatures.push('customText');
      updateTotalCost();
    } else {
      alert('Пожалуйста, введите текст.');
    }
  });

  // Функция для добавления изображения на модель
  function addImageToModel(imageSrc) {
    const imageElement = document.createElement('img');
    imageElement.src = imageSrc;
    imageElement.style.position = 'absolute';
    imageElement.style.cursor = 'pointer';
    imageElement.style.width = '100px';
    imageElement.dataset.logoSrc = imageSrc;

    // Устанавливаем элемент в центр mainView
    imageElement.style.left = (mainView.offsetWidth / 2 - 50) + 'px';
    imageElement.style.top = (mainView.offsetHeight / 2 - 50) + 'px';

    // Добавляем ручку для изменения размера
    const resizer = document.createElement('div');
    resizer.classList.add('resizer');
    imageElement.appendChild(resizer);

    // Добавляем элемент в mainView
    mainView.appendChild(imageElement);

    // Делаем элемент перетаскиваемым и масштабируемым
    makeResizableDraggable(imageElement);

    // Добавляем обработчик клика для выбора элемента
    imageElement.addEventListener('click', (e) => {
      e.stopPropagation();
      selectElement(imageElement);
    });

    // Обработчик двойного клика для удаления элемента
    imageElement.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      removeLogoElement(imageElement);
    });
  }

  // Функция для удаления логотипа
  function removeLogoElement(element) {
    element.remove();
    // Удаляем стоимость логотипа
    const index = addedFeatures.indexOf('customLogo');
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

  // Функция для добавления текста на модель
  function addTextToModel(text, font, fontSize) {
    const textElement = document.createElement('div');
    textElement.textContent = text;
    textElement.style.position = 'absolute';
    textElement.style.cursor = 'move';
    textElement.style.fontFamily = font;
    textElement.style.fontSize = fontSize + 'px';
    textElement.style.color = '#000';
    textElement.style.backgroundColor = 'transparent';
    textElement.classList.add('draggable-text');

    // Устанавливаем элемент в центр mainView
    textElement.style.left = (mainView.offsetWidth / 2 - 50) + 'px';
    textElement.style.top = (mainView.offsetHeight / 2 - 20) + 'px';

    // Добавляем ручку для изменения размера
    const resizer = document.createElement('div');
    resizer.classList.add('resizer');
    textElement.appendChild(resizer);

    // Добавляем элемент в mainView
    mainView.appendChild(textElement);

    // Делаем элемент перетаскиваемым и масштабируемым
    makeResizableDraggable(textElement);

    // Добавляем обработчик клика для выбора элемента
    textElement.addEventListener('click', (e) => {
      e.stopPropagation();
      selectElement(textElement);
    });

    // Обработчик двойного клика для удаления элемента
    textElement.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      removeTextElement(textElement);
    });
  }

  // Функция для удаления текста
  function removeTextElement(element) {
    element.remove();
    // Удаляем стоимость текста
    const index = addedFeatures.indexOf('customText');
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
      const width = e.clientX - rect.left;
      if (width > 20) { // Минимальный размер
        // Обновляем размер элемента
        if (elmnt.tagName.toLowerCase() === 'div') {
          const scale = width / rect.width;
          const fontSize = parseFloat(window.getComputedStyle(elmnt).fontSize);
          elmnt.style.fontSize = (fontSize * scale) + 'px';
        } else {
          elmnt.style.width = width + 'px';
          elmnt.style.height = 'auto'; // Сохраняем пропорции
        }

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
    // Очистите логотип и текст, если используете их
    const logoElements = mainView.querySelectorAll('img[data-logo-src]');
    logoElements.forEach(el => el.remove());

    const textElements = mainView.querySelectorAll('.draggable-text');
    textElements.forEach(el => el.remove());

    // Удаляем стоимость логотипа и текста
    ['customLogo', 'customText'].forEach(feature => {
      const index = addedFeatures.indexOf(feature);
      if (index !== -1) {
        addedFeatures.splice(index, 1);
      }
    });
    updateTotalCost();
  }

  // ---------------------------
  // Функциональность "Заливка"
  // ---------------------------

  const fillButton = document.getElementById('fillButton');
  const modalFill = document.getElementById('modalFill');
  const closeFillModal = document.querySelector('.close[data-modal="modalFill"]');
  const fillColorPalette = document.querySelector('.fill-color-palette');

  let fillMode = false;
  let selectedFillColor = '';

  fillButton.addEventListener('click', () => {
    modalFill.style.display = 'block';
    generateFillColorPalette();
  });

  closeFillModal.addEventListener('click', () => {
    modalFill.style.display = 'none';
    fillMode = false;
    selectedFillColor = '';
  });

  // Генерация палитры цветов для заливки
  function generateFillColorPalette() {
    fillColorPalette.innerHTML = '';
    colorPalette.forEach(color => {
      const swatch = document.createElement('div');
      swatch.classList.add('fill-color-swatch');
      swatch.style.backgroundColor = color;
      swatch.addEventListener('click', () => {
        selectedFillColor = color;
        fillMode = true;
        modalFill.style.display = 'none';
        enableFillMode();
      });
      fillColorPalette.appendChild(swatch);
    });
  }

  // Включение режима заливки
  function enableFillMode() {
    // Подсвечиваем карманы
    const pockets = mainView.querySelectorAll('.pocket');
    pockets.forEach(pocket => {
      pocket.classList.add('fillable');
      pocket.style.pointerEvents = 'auto';
      pocket.addEventListener('click', fillPocket);
    });

    // При клике вне карманов отключаем режим заливки
    mainView.addEventListener('click', exitFillMode);
  }

  // Отключение режима заливки
  function exitFillMode(e) {
    if (e.target.classList.contains('pocket')) return;
    fillMode = false;
    selectedFillColor = '';
    const pockets = mainView.querySelectorAll('.pocket');
    pockets.forEach(pocket => {
      pocket.classList.remove('fillable');
      pocket.removeEventListener('click', fillPocket);
    });
    mainView.removeEventListener('click', exitFillMode);
  }

  // Функция для заливки кармана
  function fillPocket(e) {
    e.stopPropagation();
    if (!fillMode) return;
    const pocket = e.currentTarget;
    // Применяем цвет к карману
    pocket.style.filter = `brightness(0) saturate(100%) sepia(1) hue-rotate(${getHueRotation(
      selectedFillColor
    )}deg)`;
  }

  // Функция для получения значения hue-rotate для CSS фильтра
  function getHueRotation(color) {
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return Math.round(hsl.h);
  }

  // Функция для преобразования HEX в RGB
  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  // Функция для преобразования RGB в HSL
  function rgbToHsl(r, g, b) {
    (r /= 255), (g /= 255), (b /= 255);

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
          break;
        case g:
          h = ((b - r) / d + 2) * 60;
          break;
        case b:
          h = ((r - g) / d + 4) * 60;
          break;
      }
    }

    return { h, s, l };
  }
});
