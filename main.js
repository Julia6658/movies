// Настройки
const apiKey = '448039ad-1047-489d-a591-88a643312dcc';
const url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

const options = {
    method: 'GET',
    headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
    },
}

//  DOM-элементы

const filmsWrapper = document.querySelector('.films'); 
const loader = document.querySelector('.loader-wrapper'); 
const buttonLoadMore = document.querySelector('.show-more');
buttonLoadMore.onclick = fetchAndRenderFilms;

let page = 1

// Получение и вывод Топ 250 фильмов

async function fetchAndRenderFilms() {

        // Show preloader
        loader.classList.remove('none');

        // Fetch films data
        const data = await fetchData(url + `collections?type=TOP_250_MOVIES&page=${page}`, options);

        // Check number of pages and showing the button
        if (data.totalPages > 1) {
            page++;
            buttonLoadMore.classList.remove('none');
        }

        // Hide preloader
        loader.classList.add('none');

        // Render films on page
        renderFilms(data.items);   

        if (page > data.totalPages) {     
            buttonLoadMore.classList.add('none');
        }
}

async function fetchData(url, options) {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;

}

function renderFilms(films) {
    for (film of films) {
       
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = film.kinopoiskId;
        card.onclick = openFilmDetails;

        const html = ` 
                <img src=${film.posterUrlPreview} alt="Cover" class="card__img">
                <h3 class="card__title">${film.nameRu}</h3>
                <p class="card__year">${film.year}</p>
                <p class="card__rating">Рейтинг: ${film.ratingImdb}</p>
           `;
        card.insertAdjacentHTML('beforeend', html);
        filmsWrapper.insertAdjacentElement('beforeend', card);
    }      
}

async function openFilmDetails(e) {

    // Getting id of the film
    const id = e.currentTarget.id;
    // Getting information of the film
    const data = await fetchData(url + id, options); 
    console.log(data);

    // Shiwing film details on page
    renderFilmData(data)

}

function renderFilmData(film) {
    console.log('Render');

    // Проверка на открытый фильм и его удаление
    if (document.querySelector('.container-right')) {
        document.querySelector('.container-right').remove()
    }

    // Отрендерить container-right
    const containerRight = document.createElement('div');
    containerRight.classList.add('container-right');
    document.body.insertAdjacentElement('beforeend', containerRight);

    // Adding close button
    const btnClose = document.createElement('button');
    btnClose.classList.add('btn-close');
    btnClose.innerHTML = '<img src="./img/cross.svg" alt="Close" width="24">';
    containerRight.insertAdjacentElement('afterbegin', btnClose);
    btnClose.onclick = () => {containerRight.remove()}

    // Showing film details on the right side
    const html = `
        <div class="film">
            <div class="film__title">${film.nameOriginal}</div>
            <div class="film__img">
                <img src="${film.posterUrl}" alt="Cover">
            </div>
            <div class="film__desc">
                <p class="film__details">Год: ${film.year}</p>
                <p class="film__details">Рейтинг: ${film.ratingImdb}</p>
                <p class="film__details">Продолжительность: ${formatFilmTime(film.filmLength)}</p>
                <p class="film__details">Страна: ${formatCountry(film.countries)}</p>
                <p class="film__text">${film.description}</p> 
                
            </div>
        </div>`
    
    containerRight.insertAdjacentHTML('beforeend', html);

}

function formatFilmTime(value) {
    let length = '';
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    if (hours > 0) {
        length+= hours + ' ч. '
    }
    if (minutes > 0) {
        length+= minutes + ' мин.'
    }
    return length

};

function formatCountry(countriesArray) {
    let countriesString = '';

    for (country of countriesArray) {
        countriesString += country.country
        if (countriesArray.indexOf(country) + 1 < countriesArray.length) {
            countriesString += ', '
        }
    } 

    return countriesString
}

fetchAndRenderFilms().catch(err => console.log(err))