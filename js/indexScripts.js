const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';
const isAdmin = () => isLoggedIn() && localStorage.getItem('isAdmin') === 'true';

let loadedReviewsData = [];

const fetchReviews = async () => {
    try {
        const response = await fetch('api.php?action=get_reviews');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        loadedReviewsData = await response.json();
        console.log("Reviews loaded from database:", loadedReviewsData);
        
    } catch (error) {
        console.error("Failed to fetch reviews:", error);
        window.showMessage(`Error loading reviews: ${error.message}. Is XAMPP running?`, true);
        loadedReviewsData = []; 
    }
};


const getStarsHtml = (count) => {
    const fullStar = '<span class="text-amber-500">★</span>';
    const emptyStar = '<span class="text-gray-300">★</span>';
    const validCount = Math.min(5, Math.max(0, count)); 
    return fullStar.repeat(validCount) + emptyStar.repeat(5 - validCount);
};

const renderCards = (filteredReviews) => {
    const container = document.getElementById('review-cards-container');
    if (!container) return;
    
    const reviewsToRender = filteredReviews || loadedReviewsData;

    if (reviewsToRender.length === 0) {
            container.innerHTML = `
            <div class="col-span-full p-8 text-center bg-white/70 rounded-xl border border-stone-200 text-stone-600">
                <p class="text-xl font-semibold mb-2">No Reviews Found</p>
                <p>Try adjusting your search terms or star rating filter, or check your database connection.</p>
            </div>
            `;
            return;
    }

    container.innerHTML = reviewsToRender.map(review => `
        <div 
            class="review-card bg-white rounded-xl cozy-shadow transition-all duration-300 hover:cozy-shadow hover:scale-[1.01] cursor-pointer flex flex-col"
            data-id="${review.id}"
            onclick="showModal('${review.id}')"
        >
            <div class="p-4 flex flex-col gap-3 h-full">
                
                <div class="text-center">
                    <h2 class="text-xl font-bold text-stone-800 leading-tight">${review.title}</h2>
                    <p class="text-sm text-stone-500 font-medium italic">by ${review.author}</p>
                </div>

                <div class="flex-shrink-0 w-32 h-48 rounded-lg ${review.imageBg || 'bg-amber-800/40'} flex items-center justify-center border border-gray-100 cozy-book-shadow mx-auto">
                    <svg class="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                
                <div class="flex-grow flex flex-col">
                    <div>
                        
                        <div class="mb-3 text-lg">${getStarsHtml(review.stars)}</div>
                        
                        <p class="text-base text-stone-600 line-clamp-3 mb-4">
                            <span class="font-semibold text-stone-700">Reviewer: ${review.reviewer}</span> — ${review.snippet}
                        </p>
                    </div>
                    
                    <p class="mt-auto text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-200">
                        Click to read full review &rarr;
                    </p>
                </div>
            </div>
        </div>
    `).join('');
};

window.updateDisplay = async () => {
    if (loadedReviewsData.length === 0) {
        await fetchReviews(); 
    }
    
    const reviewsToFilter = loadedReviewsData; 

    const searchInput = document.getElementById('search-input');
    const starFilter = document.getElementById('star-filter');
    
    if (!searchInput || !starFilter) {
        renderCards(reviewsToFilter);
        return;
    }

    const searchTerm = searchInput.value.toLowerCase();
    const selectedStars = starFilter.value; 

    const filteredReviews = reviewsToFilter.filter(review => {
        const searchArea = `${review.title} ${review.author} ${review.reviewer}`.toLowerCase(); 
        const matchesSearch = searchArea.includes(searchTerm);
        const matchesRating = selectedStars === "0" || review.stars === parseInt(selectedStars, 10);

        return matchesSearch && matchesRating;
    });
    
    renderCards(filteredReviews);
};

window.showModal = (id) => {
    const review = loadedReviewsData.find(r => r.id == id); 
    if (!review) return;

    const modal = document.getElementById('review-modal');
    const modalContainer = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    
    if (!modal || !modalContainer || !content) return; 
    
    content.innerHTML = `
        <div class="p-6 md:p-8 border-b border-stone-100 flex items-start justify-between">
            <div>
                <h3 class="text-3xl font-bold text-stone-800 mb-1">${review.title}</h3>
                <p class="text-lg text-stone-500 italic">by ${review.author}</p>
            </div>
            <button class="text-stone-400 hover:text-stone-700 transition-colors" onclick="hideModal()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <div class="p-6 md:p-8 scroll-hidden overflow-y-auto max-h-[70vh]">

            <div class="mb-8 h-64 w-40 mx-auto rounded-lg ${review.imageBg || 'bg-amber-800/40'} opacity-50 flex items-center justify-center text-xl text-white font-semibold italic cozy-book-shadow">
                "Book Cover"
            </div>

            <div class="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-100 text-stone-700 text-sm grid grid-cols-2 gap-2">
                <div class="font-semibold">Publisher:</div>
                <div>${review.publisher || 'N/A'}</div> 
                <div class="font-semibold">Publication Date:</div>
                <div>${review.publicationDate || 'N/A'}</div> 
            </div>


            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-stone-100">
                    <div class="mb-2 sm:mb-0">
                    <span class="text-base font-semibold text-stone-700">Reviewer:</span>
                    <span class="text-base text-amber-600 ml-1">${review.reviewer}</span>
                </div>
                <div class="text-xl">${getStarsHtml(review.stars)}</div>
            </div>

            <p class="text-lg text-stone-600 whitespace-pre-wrap leading-relaxed">${review.fullReview}</p>
            
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContainer.classList.remove('scale-95', 'opacity-0');
        modalContainer.classList.add('scale-100', 'opacity-100');
    }, 10); 
    document.body.classList.add('overflow-hidden');
};

window.hideModal = () => {
    const modal = document.getElementById('review-modal');
    const modalContainer = document.getElementById('modal-container');

    if (!modal || !modalContainer) return;

    modalContainer.classList.remove('scale-100', 'opacity-100');
    modalContainer.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }, 300); 
};

let currentReviewStars = 0;

window.showPostReviewModal = () => {
    document.getElementById('post-modal-title').innerText = "Make a Review!";
    document.getElementById('post-review-form').reset();
    currentReviewStars = 0;
    updateStarRating(0);
    document.getElementById('post-review-modal').classList.remove('hidden');
};

window.hidePostReviewModal = () => {
    document.getElementById('post-review-modal').classList.add('hidden');
};

window.updateStarRating = (rating) => {
    currentReviewStars = rating;
    const starContainer = document.getElementById('star-selector-container');
    starContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'text-3xl cursor-pointer transition-colors';
        star.style.color = i <= rating ? '#f59e0b' : '#d1d5db';
        star.innerHTML = '★';
        star.onclick = () => updateStarRating(i);
        starContainer.appendChild(star);
    }
};

window.showMessage = (message, isError = false) => {
    const msgBox = document.getElementById('message-box');
    msgBox.textContent = message;
    msgBox.className = isError 
        ? 'fixed bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-red-600 text-white rounded-lg cozy-shadow z-50 transition-opacity duration-300'
        : 'fixed bottom-4 left-1/2 transform -translate-x-1/2 p-3 bg-amber-600 text-white rounded-lg cozy-shadow z-50 transition-opacity duration-300';
    msgBox.classList.remove('opacity-0', 'hidden');
    setTimeout(() => {
        msgBox.classList.add('opacity-0');
        setTimeout(() => msgBox.classList.add('hidden'), 300);
    }, 3000);
};

window.handlePostReview = async () => {
    event.preventDefault();
    const form = document.getElementById('post-review-form');
    const title = form.elements['book-title'].value;
    const author = form.elements['author'].value;
    const fullReview = form.elements['full-review'].value;
    
    const publisher = form.elements['publisher'].value;
    const publicationDate = form.elements['publish-date'].value;

    if (!title || currentReviewStars === 0 || !fullReview) {
        window.showMessage("Please fill out the title, review, and star rating.", true);
        return;
    }
    
    const reviewerId = localStorage.getItem('userId');

    if (!reviewerId) {
        window.showMessage("You must be logged in to post a review.", true);
        return;
    }

    try {
        const response = await fetch('api.php?action=post_review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: title,
                author: author,
                stars: currentReviewStars,
                fullReview: fullReview,
                reviewerId: reviewerId, 
                publisher: publisher,
                publicationDate: publicationDate 
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            window.hidePostReviewModal();
            window.showMessage(`Review for "${title}" posted successfully!`);
            
            loadedReviewsData = []; 
            await window.updateDisplay();

        } else {
            window.showMessage(`Post failed: ${result.message}`, true);
        }

    } catch (error) {
        console.error("Submission error:", error);
        window.showMessage("Failed to connect to the server. Check api.php.", true);
    }
};

window.renderUI = () => {
    const headerNav = document.getElementById('header-nav');
    const profileLink = isAdmin() ? 'admin.html' : 'profile.html';
    const profileIconColor = isAdmin() ? 'text-amber-700' : 'text-amber-600';

    if (isLoggedIn()) {
        headerNav.innerHTML = `
            <a href="${profileLink}" class="p-2 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors cozy-shadow">
                <svg class="w-6 h-6 ${profileIconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
            </a>
        `;
        
    } else {
        headerNav.innerHTML = `
            <a 
                href="login.html" 
                class="text-stone-600 hover:text-amber-700 font-medium transition-colors"
            >
                Log In
            </a>
            
            <a 
                href="signup.html"
                class="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors cozy-shadow"
            >
                Sign Up
            </a>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.updateDisplay();
    window.renderUI();
});