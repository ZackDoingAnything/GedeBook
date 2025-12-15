const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';
const isAdmin = () => isLoggedIn() && localStorage.getItem('isAdmin') === 'true';
const currentUserId = localStorage.getItem('userId');

if (!isLoggedIn() || isAdmin()) {
    window.location.href = 'index.html'; 
}

let profileData = {};
let userReviews = [];


window.handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = 'index.html'; 
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

const getStarsHtml = (count) => {
    const fullStar = '<span class="text-amber-500">★</span>';
    const emptyStar = '<span class="text-gray-300">★</span>';
    return fullStar.repeat(count) + emptyStar.repeat(5 - count);
};


window.fetchProfileData = async () => {
        if (!currentUserId) return;

        try {
        const response = await fetch(`api.php?action=get_user_data&user_id=${currentUserId}`);
        
        if (!response.ok) throw new Error('Failed to fetch user data.');
        
        const result = await response.json();
        
        if (result.success) {
            profileData = result.user;
            profileData.totalReviews = result.total_reviews;
            userReviews = result.reviews;
            renderProfile();
        } else {
            window.showMessage(result.message, true);
        }

        } catch (error) {
        console.error("Profile data fetch failed:", error);
        window.showMessage("Failed to load profile. Check API connection.", true);
        }
};



window.showEditProfileModal = () => {
    if (!profileData || !profileData.username) {
        window.showMessage("Error: Profile data not loaded yet.", true);
        return;
    }
    
    document.getElementById('edit-fullname').value = profileData.fullname || '';
    document.getElementById('edit-username').value = profileData.username;
    document.getElementById('edit-email-readonly').value = profileData.email; 
    document.getElementById('edit-profile-modal').classList.remove('hidden');
};

window.hideEditProfileModal = () => {
    document.getElementById('old-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('edit-profile-modal').classList.add('hidden');
};

window.handleEditProfile = async () => {
    event.preventDefault();
    
    const fullname = document.getElementById('edit-fullname').value;
    const username = document.getElementById('edit-username').value;
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;

    if (!fullname || !username) {
        window.showMessage("Full Name and Username are required.", true);
        return;
    }

    if (newPassword && !oldPassword) {
            window.showMessage("You must enter your current password to set a new password.", true);
            return;
    }

    const payload = {
        userId: currentUserId,
        fullname: fullname,
        username: username,
        oldPassword: oldPassword || null,
        newPassword: newPassword || null
    };
    
    try {
        const response = await fetch('api.php?action=update_profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();

        if (response.ok && result.success) {
            window.showMessage(result.message);
            
            document.getElementById('old-password').value = '';
            document.getElementById('new-password').value = '';

            await fetchProfileData();
            hideEditProfileModal();

        } else {
            window.showMessage(result.message || "Profile update failed.", true);
        }

    } catch (error) {
        console.error("Profile update error:", error);
        window.showMessage("Failed to connect to the server for profile update.", true);
    }
};

let currentReviewStars = 0;
let isEditing = false;
let currentEditReviewId = null;

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

window.showPostReviewModal = (reviewToEdit = null) => {
    const form = document.getElementById('post-review-form');
    form.reset();
    
    if (reviewToEdit) {
        isEditing = true;
        currentEditReviewId = reviewToEdit.id;
        document.getElementById('post-modal-title').innerText = "Edit Review";
        form.elements['book-title'].value = reviewToEdit.title;
        form.elements['author'].value = reviewToEdit.author;
        form.elements['full-review'].value = reviewToEdit.fullReview;
        form.elements['publisher'].value = reviewToEdit.publisher; 
        form.elements['publish-date'].value = reviewToEdit.publicationDate; 
        updateStarRating(reviewToEdit.stars);
        document.getElementById('post-submit-button').innerText = "Save Changes";

    } else {
        isEditing = false;
        currentEditReviewId = null;
        document.getElementById('post-modal-title').innerText = "Make a Review!";
        updateStarRating(0);
        document.getElementById('post-submit-button').innerText = "Post Review";
    }
    document.getElementById('post-review-modal').classList.remove('hidden');
};

window.hidePostReviewModal = () => {
    document.getElementById('post-review-modal').classList.add('hidden');
};

window.handlePostReview = async () => {
    event.preventDefault();
    const form = document.getElementById('post-review-form');
    const title = form.elements['book-title'].value;
    const fullReview = form.elements['full-review'].value;
    
    if (!title || currentReviewStars === 0 || !fullReview) {
        window.showMessage("Please fill out required fields and select a star rating.", true);
        return;
    }

    const payload = {
        title: title,
        author: form.elements['author'].value,
        stars: currentReviewStars,
        fullReview: fullReview,
        publisher: form.elements['publisher'].value,
        publicationDate: form.elements['publish-date'].value,
        reviewerId: currentUserId
    };

    const action = isEditing ? 'edit_review' : 'post_review';
    if (isEditing) {
        payload.reviewId = currentEditReviewId;
    }

    try {
        const response = await fetch(`api.php?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();

        if (response.ok && result.success) {
            window.showMessage(result.message);
            window.hidePostReviewModal();
            await fetchProfileData();

        } else {
            window.showMessage(`Action failed: ${result.message}`, true);
        }
    } catch (error) {
            console.error(`${action} error:`, error);
            window.showMessage("Failed to connect to the server for review action.", true);
    }
};


window.handleReviewAction = async (id, action) => {
    const review = userReviews.find(r => r.id == id);
    if (!review) return;

    if (action === 'view') {
        const modal = document.getElementById('simple-view-modal');
        modal.querySelector('#view-title').textContent = review.title;
        modal.querySelector('#view-author').textContent = 'by ' + review.author;
        modal.querySelector('#view-stars').innerHTML = getStarsHtml(review.stars);
        modal.querySelector('#view-full-review').textContent = review.fullReview;
        
        const modalContainer = modal.querySelector('div');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modalContainer.classList.remove('scale-95', 'opacity-0');
            modalContainer.classList.add('scale-100', 'opacity-100');
        }, 10); 
        document.body.classList.add('overflow-hidden');

    } else if (action === 'edit') {
        window.showPostReviewModal(review);

    } else if (action === 'delete') {
        if (confirm(`Are you sure you want to delete the review for "${review.title}"?`)) {
            try {
                const response = await fetch('api.php?action=delete_review', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reviewId: id, userId: currentUserId })
                });
                
                const result = await response.json();

                if (response.ok && result.success) {
                    window.showMessage(result.message);
                    await fetchProfileData();
                } else {
                    window.showMessage(`Delete failed: ${result.message}`, true);
                }
            } catch (error) {
                console.error("Delete review error:", error);
                window.showMessage("Failed to connect to server for delete action.", true);
            }
        }
    }
};

window.hideSimpleViewModal = () => {
    const modal = document.getElementById('simple-view-modal');
    const modalContainer = modal.querySelector('div');

    modalContainer.classList.remove('scale-100', 'opacity-100');
    modalContainer.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }, 300); 
};

window.renderProfile = () => {
    document.getElementById('profile-name').textContent = profileData.fullname || 'Your Name';
    document.getElementById('profile-username').textContent = `@${profileData.username}`;
    document.getElementById('profile-email').textContent = profileData.email;
    document.getElementById('profile-reviews').textContent = `${profileData.totalReviews} Reviews`;
    document.getElementById('profile-since').textContent = `Member since ${profileData.member_since}`;
    document.getElementById('profile-pfp').src = 'https://placehold.co/80x80/fcd34d/6e4d0d?text=' + (profileData.username ? profileData.username.charAt(0).toUpperCase() : 'JS'); 
    
    renderReviewsList();
};

window.renderReviewsList = () => {
    const container = document.getElementById('user-reviews-list');
    if (!container) return;

    if (userReviews.length === 0) {
        container.innerHTML = `<p class="text-center text-stone-500 p-8">You haven't posted any reviews yet.</p>`;
        return;
    }

    container.innerHTML = userReviews.map(review => `
        <div class="p-4 bg-white rounded-xl cozy-shadow border border-stone-200 flex flex-col justify-between">
            <div>
                <h4 class="text-lg font-bold text-stone-800 leading-tight">${review.title}</h4>
                <p class="text-sm text-stone-500 italic mb-2">by ${review.author}</p>
                <div class="mb-3 text-sm">${getStarsHtml(review.stars)}</div>
                <p class="text-base text-stone-600 line-clamp-3 mb-4">${review.snippet}</p>
            </div>
            <div class="flex flex-wrap gap-2 pt-2 border-t border-stone-100">
                <button class="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors" onclick="handleReviewAction('${review.id}', 'view')">
                    View More
                </button>
                <button class="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors" onclick="handleReviewAction('${review.id}', 'edit')">
                    Edit
                </button>
                <button class="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors" onclick="handleReviewAction('${review.id}', 'delete')">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
};

document.addEventListener('DOMContentLoaded', window.fetchProfileData);