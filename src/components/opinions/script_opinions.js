
const token = localStorage.getItem('token');
let params = new URLSearchParams(window.location.search);
let id = params.get('id');


//const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkNVU1RPTUVSIiwiaWF0IjoxNzE2NjU3MjEyLCJleHAiOjE3MTY3NDM2MTJ9.CxZmNE5UXcvPNpiDNMDd8W5luQGN4s5TxNUbca0wu58";
//const id = 10;

let opinionsSummary = [];
const fetchOpinionsSummary = async () => {
    try {
        const response = await fetch(`http://127.0.0.1:5016/customer/profile/summary-reviews/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        opinionsSummary = data;

        let total_rating = 0;
        let rating_based_on_stars = 0;

        opinionsSummary.forEach(rating => {
            total_rating += rating.count;
            rating_based_on_stars += rating.count * rating.star;
        });

        opinionsSummary.forEach(rating => {
            let rating_progess = `<div class="rating_progress_value">
                <p>${rating.star} <span class="star">&#9733;</span></p>
                <div class="progress">
                    <div class="bar" style="width: ${(rating.count / total_rating) * 100}%;"></div>
                </div>
                <p>${rating.count.toLocaleString()}</p>
            </div>`;
            document.querySelector('.rating_progress').innerHTML += rating_progess;
        });
        let rating_average = total_rating !== 0 ? (rating_based_on_stars / total_rating).toFixed(1) : 0
        document.querySelector('.rating_avg h1').innerHTML = rating_average.toLocaleString();
        document.querySelector('.rating_avg p').innerHTML = total_rating.toLocaleString();
        document.querySelector('.star-inner').style.width = (rating_average / 5) * 100 + "%";
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchOpinionsSummary();