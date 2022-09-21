let page = 1 ;
let infiniteScroll;
let maxPage;

searchFormBtn.addEventListener('click' , () => {

    location.hash = '#search=' + searchFormInput.value;
});

trendingBtn.addEventListener('click' , () => {
    location.hash = '#trends'
});

arrowBtn.addEventListener('click' , () => {

    history.back();
    location.hash = '#home'
});



window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll' , infiniteScroll, false);



function navigator() {
    console.log({ location });

    if(infiniteScroll) {
        window.removeEventListener('scroll',infiniteScroll , {passive: false});
        infiniteScroll = undefined;
    }

    if (location.hash.startsWith('#trends')){

        trendsPage();

    } else if( location.hash.startsWith('#search=')){

        searchPage();

    } else if( location.hash.startsWith('#movie=')){

        movieDetails();

    } else if( location.hash.startsWith('#category=')){

        categoriesPage();

    } else {

        homePage();
    }

    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if(infiniteScroll){
        window.addEventListener('scroll' , infiniteScroll,{passive: false});

    }
    
}

function homePage(){

    console.log('home');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    likedMovieSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getTrandingMoviesPrview();
    getCategoriesPrview();
    getLikedMovies();
}

function categoriesPage(){
    console.log('categories');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerCategoryTitle.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMovieSection.classList.add('inactive');

    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=');
    const [categoryID , categoryName] = categoryData.split("-");
    headerCategoryTitle.innerHTML = categoryName;
    console.log(categoryID);
    

    getMoviesByCategory(categoryID);

    infiniteScroll = getPaginatedMoviesByCategory(categoryID);

}

function movieDetails(){
    console.log('movie');

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');

    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMovieSection.classList.add('inactive');

    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=');


    getMoviesById(movieId) ;

}

function searchPage(){
    console.log('search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMovieSection.classList.add('inactive');

    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=');

    getMoviesBySearch(query);

    infiniteScroll = getPaginatedMoviesBySearch(query);


}

function trendsPage(){
    console.log('TRENDS');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');

    headerCategoryTitle.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    likedMovieSection.classList.add('inactive');

    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Tendencias';

    getTrandingMovies();

    infiniteScroll = getPaginatedTrandingMovies;
}


