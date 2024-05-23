let data = [
    { 'star': 5, 'count': 89 },
    { 'star': 4, 'count': 600 },
    { 'star': 3, 'count': 200 },
    { 'star': 2, 'count': 300 },
    { 'star': 1, 'count': 4000 },
];

let total_rating = 0;
rating_based_on_stars = 0;

data.forEach(rating => {
    total_rating += rating.count;
    rating_based_on_stars += rating.count * rating.star;
});

data.forEach(rating => {
    let rating_progess = `<div class="rating_progress_value">
            <p>${rating.star} <span class="star">&#9733;</span></p>
            <div class="progress">
                <div class="bar" style="width: ${(rating.count / total_rating) * 100}%;"></div>
            </div>
            <p>${rating.count.toLocaleString()}</p>
        </div>`;
        document.querySelector('.rating_progress').innerHTML += rating_progess;
});
let rating_average = (rating_based_on_stars / total_rating).toFixed(1); 
document.querySelector('.rating_avg h1').innerHTML = rating_average.toLocaleString();
document.querySelector('.rating_avg p').innerHTML = total_rating.toLocaleString();
document.querySelector('.star-inner').style.width = (rating_average / 5) * 100 + "%";