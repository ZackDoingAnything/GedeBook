if (localStorage.getItem('isLoggedIn') !== 'true' || localStorage.getItem('isAdmin') !== 'true') {
    window.location.href = 'index.html';
}

window.handleAdminLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    window.location.href = 'index.html'; 
};

const showMessage = (message, isError = false) => {
    const msgBox = document.getElementById('message-box');
    if (!msgBox) {
        console.warn("Message box element not found.");
        return;
    }
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
    const validCount = Math.min(5, Math.max(0, count)); 
    return fullStar.repeat(validCount) + emptyStar.repeat(5 - validCount);
};


let MOCK_STATS_DATA = [];
let MOCK_USERS_DATA = [];
let MOCK_REVIEWS_DATA = {};
let activeUserId = null;


const fetchStats = async () => {
    try {
        const response = await fetch('api.php?action=get_admin_stats');
        const result = await response.json();
        if (result.success) {
            MOCK_STATS_DATA = result.stats;
        }
    } catch (error) {
        console.error("Failed to fetch stats:", error);
    }
};

const fetchUserList = async () => {
    try {
        const response = await fetch('api.php?action=get_all_users');
        const result = await response.json();
        if (result.success) {
            MOCK_USERS_DATA = result.users;
        }
    } catch (error) {
        console.error("Failed to fetch users:", error);
    }
};

const fetchUserReviews = async (userId) => {
    try {
        const response = await fetch(`api.php?action=get_user_reviews_admin&user_id=${userId}`);
        const result = await response.json();
        if (result.success) {
            MOCK_REVIEWS_DATA[userId] = result.reviews; 
            return result.reviews;
        }
    } catch (error) {
        console.error(`Failed to fetch reviews for user ${userId}:`, error);
        return [];
    }
};


function renderChart(data, key, title, color) {
    const containerId = `chart-${key}`;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    
    const margin = { top: 10, right: 10, bottom: 20, left: 40 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;

    const svg = d3.select(`#${containerId}`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data.map(d => d.month))
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[key])])
        .range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
        .selectAll("text")
        .style("font-size", "10px")
        .attr("fill", "#78716c");

    svg.append("g")
        .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(d3.format("d")))
        .selectAll(".tick line")
        .attr("stroke", "#e7e5e4");

    svg.selectAll(".domain").remove();

    const line = d3.line()
        .x(d => x(d.month) + x.bandwidth() / 2)
        .y(d => y(d[key]))
        .curve(d3.curveMonotoneX);

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 3)
        .attr("d", line);

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => x(d.month) + x.bandwidth() / 2)
        .attr("cy", d => y(d[key]))
        .attr("r", 4)
        .attr("fill", color);

    const maxValue = d3.max(data, d => d[key]);
    const maxData = data.find(d => d[key] === maxValue);
    
    svg.append("text")
        .attr("x", x(maxData.month) + x.bandwidth() / 2)
        .attr("y", y(maxData[key]) - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "600")
        .attr("fill", color)
        .text(maxValue);

    d3.select(`#${containerId}-title`).text(title);
    d3.select(`#${containerId}-value`).text(data[data.length - 1][key]);
}



window.handleDeleteAccount = async (userId, username) => {
    if (!confirm(`WARNING: Are you sure you want to permanently DELETE the account for user '${username}' (ID: ${userId})? This will also remove ALL of their reviews.`)) return;

    try {
        const response = await fetch('api.php?action=admin_delete_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage(result.message);
            
            MOCK_USERS_DATA = MOCK_USERS_DATA.filter(u => u.id !== userId);
            
            if (activeUserId === userId) {
                activeUserId = null;
                document.getElementById('review-detail-container').innerHTML = `<p class="p-4 text-stone-500 text-center">User account deleted. Select a user to view their reviews.</p>`;
            }

            window.renderUserList();
        } else {
            showMessage(result.message || "Account deletion failed.", true);
        }
    } catch (error) {
        showMessage("Failed to connect to server for account deletion.", true);
    }
};


window.handleAdminReviewDelete = async (reviewId, username) => {
    if (!confirm(`Are you sure you want to permanently REMOVE review ID ${reviewId} by ${username}?`)) return;

    try {
        const response = await fetch('api.php?action=admin_delete_review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviewId })
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            showMessage(result.message);
            
            await fetchUserList(); 
            if (activeUserId) {
                delete MOCK_REVIEWS_DATA[activeUserId];
                await window.selectUser(activeUserId); 
            } else {
                window.renderUserList();
            }
        } else {
            showMessage(result.message || "Review deletion failed.", true);
        }
    } catch (error) {
        showMessage("Failed to connect to server for review deletion.", true);
    }
};

window.showAdminModal = (review) => {
    const modal = document.getElementById('admin-review-modal');
    const modalContainer = document.getElementById('admin-modal-container');
    const content = document.getElementById('admin-modal-content');
    
    if (!modal || !modalContainer || !content) return; 

    content.innerHTML = `
        <div class="p-6 md:p-8 border-b border-stone-100 flex items-start justify-between">
            <div>
                <h3 class="text-3xl font-bold text-stone-800 mb-1">${review.book}</h3>
                <p class="text-lg text-stone-500 italic">Review Details</p>
            </div>
            <button class="text-stone-400 hover:text-stone-700 transition-colors" onclick="hideAdminModal()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>

        <div class="p-6 md:p-8 scroll-hidden overflow-y-auto max-h-[70vh]">

            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-stone-100">
                <div class="mb-2 sm:mb-0">
                    <span class="text-base font-semibold text-stone-700">Rating:</span>
                </div>
                <div class="text-xl">${getStarsHtml(review.stars)}</div>
            </div>

            ${review.reason ? `<div class="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 font-semibold">Flagged Reason: ${review.reason}</div>` : ''}

            <p class="text-lg text-stone-600 whitespace-pre-wrap leading-relaxed">${review.fullReview || "Full review content not available."}</p>
            <p class="mt-4 text-sm text-stone-400">Review ID: ${review.id} | Date: ${review.date}</p>
            
        </div>
    `;
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContainer.classList.remove('scale-95', 'opacity-0');
        modalContainer.classList.add('scale-100', 'opacity-100');
    }, 10); 
    document.body.classList.add('overflow-hidden');
};

window.hideAdminModal = () => {
    const modal = document.getElementById('admin-review-modal');
    const modalContainer = document.getElementById('admin-modal-container');

    if (!modal || !modalContainer) return;

    modalContainer.classList.remove('scale-100', 'opacity-100');
    modalContainer.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }, 300); 
};

window.renderUserList = () => {
    const userListContainer = document.getElementById('user-list-container');
    userListContainer.innerHTML = MOCK_USERS_DATA.map(user => `
        <div 
            class="p-3 mb-2 rounded-lg cursor-pointer transition-colors ${activeUserId === user.id ? 'bg-amber-100 border-amber-400' : 'bg-white hover:bg-stone-50 border-stone-200'} border flex justify-between items-center"
            onclick="window.selectUser('${user.id}')"
        >
            <div>
                <p class="font-semibold text-stone-800">${user.name}</p>
                <p class="text-xs text-stone-500">${user.totalReviews} total reviews</p>
            </div>
            <div class="flex items-center space-x-2">
                <button 
                    onclick="event.stopPropagation(); handleDeleteAccount('${user.id}', '${user.username}')"
                    class="text-xs px-2 py-1 rounded transition-colors bg-red-500 hover:bg-red-600 text-white font-medium cozy-shadow"
                >
                    Delete Account
                </button>
            </div>
        </div>
    `).join('');
    
    if (activeUserId === null && MOCK_USERS_DATA.length > 0) {
        window.selectUser(MOCK_USERS_DATA[0].id);
    } else if (MOCK_USERS_DATA.length === 0) {
            document.getElementById('review-detail-container').innerHTML = `<p class="p-4 text-stone-500 text-center">No users left to moderate.</p>`;
    }
};

window.selectUser = async (userId) => {
    activeUserId = userId;
    window.renderUserList();

    if (!MOCK_REVIEWS_DATA[userId]) {
        await fetchUserReviews(userId);
    }
    window.renderUserReviews(userId);
};

window.renderUserReviews = (userId) => {
    const reviewDetailContainer = document.getElementById('review-detail-container');
    const reviews = MOCK_REVIEWS_DATA[userId] || [];
    const user = MOCK_USERS_DATA.find(u => u.id === userId);

    if (!user) {
        reviewDetailContainer.innerHTML = `<p class="p-4 text-stone-500 text-center">User data not found.</p>`;
        return;
    }

    if (reviews.length === 0) {
        reviewDetailContainer.innerHTML = `<p class="p-4 text-stone-500 text-center">No reviews found for ${user.name || user.username}.</p>`;
        return;
    }

    reviewDetailContainer.innerHTML = `
        <h3 class="text-xl font-bold text-stone-700 mb-4 border-b pb-2">Reviews by ${user.name || user.username}</h3>
        <div class="space-y-4">
            ${reviews.map(review => `
                <div class="p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <div class="flex justify-between items-start mb-2">
                        <p class="font-bold text-base text-amber-800">${review.book}</p>
                        <span class="text-sm">${review.stars}★</span>
                    </div>
                    <p class="text-sm text-stone-600 italic mb-2">"${review.snippet}"</p>
                    ${review.reason ? `<p class="text-xs text-red-600 font-semibold mt-1">Flagged: ${review.reason}</p>` : ''}
                    <div class="flex justify-end mt-2 space-x-2">
                        <button onclick='showAdminModal(${JSON.stringify(review)})' class="text-xs text-blue-500 hover:text-blue-700 font-medium">View Full</button>
                        <button onclick="handleAdminReviewDelete('${review.id}', '${user.username}')" class="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};


document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('isLoggedIn') !== 'true' || localStorage.getItem('isAdmin') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    await fetchStats();
    await fetchUserList();

    if (MOCK_STATS_DATA.length > 0) {
        renderChart(MOCK_STATS_DATA, 'posts', 'Posts Created', '#d97706'); 
        renderChart(MOCK_STATS_DATA, 'accounts', 'New Accounts', '#449071');
        renderChart(MOCK_STATS_DATA, 'visitors', 'Total Visitors', '#6366f1'); 
    }

    window.renderUserList();
});