// script.js

document.addEventListener('DOMContentLoaded', () => {
  const modelViewer = document.querySelector('#modelViewer');

  // Открытие и закрытие модального окна
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
  });

  // Переключение моделей при выборе в модальном окне
  modelItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const modelSrc = e.target.dataset.model;
      modelViewer.src = modelSrc;
      modal.style.display = 'none';
      updateOptionsVisibility(modelSrc);
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

  // Функции для сохранения и загрузки проекта
  const saveButton = document.getElementById('saveProject');
  const loadButton = document.getElementById('loadProject');
  const exportButton = document.getElementById('exportImage');

  saveButton.addEventListener('click', () => {
    const settings = {};
    document.querySelectorAll('.sidebar input[type="color"]').forEach(input => {
      settings[input.dataset.material] = input.value;
    });
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "project.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });

  loadButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = e => { 
      const file = e.target.files[0]; 
      const reader = new FileReader();
      reader.readAsText(file,'UTF-8');
      reader.onload = readerEvent => {
        const content = readerEvent.target.result;
        try {
          const settings = JSON.parse(content);
          Object.keys(settings).forEach(material => {
            const color = settings[material];
            const inputColor = document.querySelector(`input[data-material="${material}"]`);
            if (inputColor) {
              inputColor.value = color;
              // Если опция объединяет несколько материалов, разбиваем на массив
              const materials = material.split(',').map(name => name.trim());
              changeMaterialsColor(materials, color);
            }
          });
          alert('Проект успешно загружен!');
        } catch (error) {
          console.error('Ошибка при загрузке проекта:', error);
          alert('Ошибка при загрузке проекта. Убедитесь, что файл имеет корректный формат.');
        }
      }
    }
    input.click();
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
});
