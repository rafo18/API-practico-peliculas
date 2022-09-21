
//Data

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    Headers: {
        'Content-Type':'application/json;charset=utf-8',
    },
    params: {
        'api_key':API_KEY,
    },
});

function likedMoviesList() {

    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;

    if (item) {
        movies = item;
    } else {
        movies = {};
    }

    return movies;
}

function likeMovie(movie) {
    const likedMovies = likedMoviesList();



    if (likedMovies[movie.id]) {
        likedMovies[movie.id] = undefined;
    } else {
        likedMovies[movie.id] = movie;
    }

    localStorage.setItem('liked_movies' ,JSON.stringify(likedMovies))

}

//Utils

const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach( (entry) => {
        // console.log({entry})
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-img')
            entry.target.setAttribute('src',url)
        }
        
    });
});

function createMovies(movies , container ,
    {
        lazyLoad = false,
        clean = true
    } = {},
    
){
    if (clean) { 

        container.innerHTML = ''; 
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt' , movie.title);
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            'https://image.tmdb.org/t/p/w300' + movie.poster_path,
        
        );

        movieImg.addEventListener('click', () => {
            location.hash = '#movie=' + movie.id;
        });
        movieImg.addEventListener('error' , () => {
            movieImg.setAttribute(
                'src',
                'https://blogs.unsw.edu.au/nowideas/files/2018/11/error-no-es-fracaso.jpg',
            );
        });

        const movieBtn = document.createElement('button');
        movieBtn.classList.add('movie-btn');
        movieBtn.addEventListener('click', () => {
            movieBtn.classList.toggle('movie-btn--liked');
            likeMovie(movie);
        });

        if (lazyLoad) {
            lazyLoader.observe(movieImg)   
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtn);
        container.appendChild(movieContainer);
    });
}

function createCategories (categories , container){
    container.innerHTML = "";

    categories.forEach(category => {

        const categoryContainer = document.createElement('div')
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id' , 'id'+category.id);
        const categoryTitleText = document.createTextNode(category.name);
        categoryTitle.addEventListener('click' , () => {
            location.hash = `#category=${category.id}-${category.name}`;
        })

        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    });

}

//Llamados a la api

async function getTrandingMoviesPrview(){
    const { data } = await api('trending/movie/day');
    const movies = data.results;

    createMovies( movies , trendingMoviesPreviewList , {lazyLoad: true});

};

async function getCategoriesPrview(){
    const { data } = await api('genre/movie/list');

    const categories = data.genres;

    categoriesPreviewList.innerHTML= "";

    // console.log("data2",data);
    // console.log("categories",categories);
    
    createCategories(categories , categoriesPreviewList)
};


async function getMoviesByCategory(id){
    const { data } = await api('discover/movie', {
        params:{
            with_genres:id,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;

    genericSection.innerHTML="";
    createMovies( movies , genericSection , {lazyLoad: true });  
};

function getPaginatedMoviesByCategory(id){

    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight,
        } = document.documentElement;
    
        const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight -15;
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
    
            const { data } = await api('discover/movie', {
                params:{
                    with_genres:id,
                    page,
                },
            });
            const movies = data.results;
    
            createMovies( movies , genericSection , {lazyLoad: true , clean: false});
        }
    }
};

async function getMoviesBySearch(query){

    const { data } = await api('search/movie', {
        params: {
            query,
        },
    });
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage);

    createMovies( movies , genericSection);  
};

function getPaginatedMoviesBySearch(query){

    return async function () {
        const {
            scrollTop,
            scrollHeight,
            clientHeight,
        } = document.documentElement;
    
        const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight -15;
        const pageIsNotMax = page < maxPage;
    
        if (scrollIsBottom && pageIsNotMax) {
            page++;
    
            const { data } = await api('search/movie', {
                params: {
                    query,
                    page,
                },
            });
            const movies = data.results;
    
            createMovies( movies , genericSection , {lazyLoad: true , clean: false});
        }
    }
};


async function getTrandingMovies(){
    const { data } = await api('trending/movie/day');
    const movies = data.results;
    console.log('pages',data.total_pages);
    maxPage = data.total_pages;


    createMovies( movies , genericSection , {lazyLoad: true , clean: false});

    // const btnLoadMore = document.createElement('button')
    // btnLoadMore.innerText = "Cargar mas";
    // btnLoadMore.addEventListener('click' , getPaginatedTrandingMovies)
    // genericSection.appendChild(btnLoadMore);
};


async function getPaginatedTrandingMovies(){

    const {
        scrollTop,
        scrollHeight,
        clientHeight,
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= scrollHeight -15;
    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
        page++;

        const { data } = await api('trending/movie/day', {
        params: {
            page,
        },

        });
    const movies = data.results;

    createMovies( movies , genericSection , {lazyLoad: true , clean: false});
    }

    // const btnLoadMore = document.createElement('button')
    // btnLoadMore.innerText = "Cargar mas";
    // btnLoadMore.addEventListener('click' , getPaginatedTrandingMovies)
    // genericSection.appendChild(btnLoadMore);
};

async function getMoviesById(id){
    const { data: movie } = await api('movie/' + id);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
    headerSection.style.background = `

        linear-gradient(
            180deg, 
            rgba(0, 0, 0, 0.35) 19.27%, 
            rgba(0, 0, 0, 0) 29.17%
        ),

        url(${movieImgUrl})`

    
    movieDetailTitle.textContent = movie.title;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average;

    createCategories(movie.genres , movieDetailCategoriesList);
    getRelatedMovieId(id);

    
};

async function getRelatedMovieId(id) {
    const { data } = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies , relatedMoviesContainer);
}

function getLikedMovies() {
    const likedMovies = likedMoviesList();
    const movieArray = Object.values(likedMovies);
    
    createMovies(movieArray , likedMoviesListArticle , {lazyLoad: true, clean: true})

}







