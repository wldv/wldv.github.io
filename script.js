// Переменные для хранения текущего котика и избранных
let currentCatUrl = '';
let favorites = JSON.parse(localStorage.getItem('catFavorites')) || [];

// Загружаем случайного котика
async function loadRandomCat() {
    const loader = document.getElementById('loader');
    const catImage = document.getElementById('cat-image');
    
    // Показываем загрузчик и скрываем текущее изображение
    loader.style.display = 'block';
    catImage.style.display = 'none';
    
    try {
        // Используем The Cat API
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await response.json();
        
        if (data && data[0] && data[0].url) {
            currentCatUrl = data[0].url;
            catImage.src = currentCatUrl;
            catImage.onload = function() {
                loader.style.display = 'none';
                catImage.style.display = 'block';
            };
        } else {
            throw new Error('Не удалось загрузить котика :(');
        }
    } catch (error) {
        loader.style.display = 'none';
        alert(error.message);
    }
}

// Добавляем текущего котика в избранное
function addToFavorites() {
    if (!currentCatUrl) {
        alert('Сначала загрузите котика!');
        return;
    }
    
    if (!favorites.includes(currentCatUrl)) {
        favorites.push(currentCatUrl);
        localStorage.setItem('catFavorites', JSON.stringify(favorites));
        alert('Котик добавлен в избранное! 😊');
    } else {
        alert('Этот котик уже в избранном!');
    }
}

// Показываем/скрываем список избранных
function toggleFavorites() {
    const container = document.getElementById('favorites-container');
    const grid = document.getElementById('favorites-grid');
    
    if (container.style.display === 'block') {
        container.style.display = 'none';
        return;
    }
    
    if (favorites.length === 0) {
        alert('У вас пока нет избранных котиков 😿');
        return;
    }
    
    // Очищаем и заполняем сетку избранных
    grid.innerHTML = '';
    favorites.forEach(url => {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'favorite-img';
        img.onclick = function() {
            // При клике на избранного котика показываем его в основном окне
            document.getElementById('cat-image').src = url;
            document.getElementById('cat-image').style.display = 'block';
            currentCatUrl = url;
            container.style.display = 'none';
        };
        grid.appendChild(img);
    });
    
    container.style.display = 'block';
}

// Загружаем случайного котика при открытии страницы
window.onload = loadRandomCat;
