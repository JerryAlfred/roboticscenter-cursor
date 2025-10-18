// Dashboard JavaScript
class Dashboard {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'reviews';
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadUserData();
        this.loadDashboardContent();
    }

    checkAuth() {
        // Check if user is authenticated
        const authData = localStorage.getItem('robotics_auth') || sessionStorage.getItem('robotics_auth');
        
        if (!authData) {
            window.location.href = 'auth.html?return=dashboard.html';
            return;
        }

        try {
            const parsed = JSON.parse(authData);
            const users = JSON.parse(localStorage.getItem('robotics_users') || '[]');
            this.currentUser = users.find(u => u.id === parsed.userId);
            
            if (!this.currentUser) {
                window.location.href = 'auth.html?return=dashboard.html';
                return;
            }
        } catch (error) {
            console.error('Error parsing auth data:', error);
            window.location.href = 'auth.html?return=dashboard.html';
        }
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // User dropdown
        const userBtn = document.getElementById('userBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        userBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown?.classList.remove('active');
        });

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Add review modal
        document.getElementById('addReviewBtn')?.addEventListener('click', () => {
            this.openAddReviewModal();
        });

        document.getElementById('closeReviewModal')?.addEventListener('click', () => {
            this.closeAddReviewModal();
        });

        document.getElementById('cancelReview')?.addEventListener('click', () => {
            this.closeAddReviewModal();
        });

        // Add review form
        document.getElementById('addReviewForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddReview(e);
        });

        // Profile form
        document.getElementById('profileForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate(e);
        });

        // Modal close on background click
        document.getElementById('addReviewModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'addReviewModal') {
                this.closeAddReviewModal();
            }
        });
    }

    loadUserData() {
        if (!this.currentUser) return;

        // Update welcome message
        document.getElementById('welcomeName').textContent = this.currentUser.firstName;
        document.getElementById('userName').textContent = this.currentUser.firstName;

        // Load stats
        this.updateStats();
    }

    updateStats() {
        const totalComments = this.currentUser.comments?.length || 0;
        const totalFavorites = this.currentUser.favorites?.length || 0;
        
        // Calculate average rating
        let avgRating = 0;
        if (totalComments > 0) {
            const totalRating = this.currentUser.comments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
            avgRating = (totalRating / totalComments).toFixed(1);
        }

        document.getElementById('totalComments').textContent = totalComments;
        document.getElementById('avgRating').textContent = avgRating;
        document.getElementById('totalFavorites').textContent = totalFavorites;
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Load tab-specific content
        switch (tabName) {
            case 'reviews':
                this.loadReviews();
                break;
            case 'favorites':
                this.loadFavorites();
                break;
            case 'activity':
                this.loadActivity();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    loadDashboardContent() {
        this.loadReviews();
    }

    loadReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        const reviews = this.currentUser.comments || [];
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                    <h3>No reviews yet</h3>
                    <p>Start sharing your robot experiences with the community!</p>
                    <button class="btn-primary" onclick="document.getElementById('addReviewBtn').click()">
                        <i class="fas fa-plus"></i>
                        Add Your First Review
                    </button>
                </div>
            `;
            return;
        }

        reviewsList.innerHTML = reviews.map(review => {
            const robot = this.getRobotById(review.robotId);
            if (!robot) return '';

            return `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-robot">
                            <img src="${robot.image}" alt="${robot.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div style="display: none; width: 60px; height: 60px; background: #e5e7eb; border-radius: 8px; align-items: center; justify-content: center; font-size: 1.5rem; color: #9ca3af;">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="review-robot-info">
                                <h4>${robot.name}</h4>
                                <p>${robot.manufacturer}</p>
                            </div>
                        </div>
                        <div class="review-rating">
                            <div class="stars">
                                ${this.renderStars(review.rating)}
                            </div>
                            <span class="review-date">${this.formatDate(review.createdAt)}</span>
                        </div>
                    </div>
                    <div class="review-comment">
                        ${review.comment}
                    </div>
                    <div class="review-actions">
                        <button onclick="dashboard.editReview('${review.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="dashboard.deleteReview('${review.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadFavorites() {
        const favoritesGrid = document.getElementById('favoritesGrid');
        if (!favoritesGrid) return;

        const favorites = this.currentUser.favorites || [];
        
        if (favorites.length === 0) {
            favoritesGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-heart" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                    <h3>No favorites yet</h3>
                    <p>Start adding robots to your favorites from the rankings page!</p>
                    <a href="rankings.html" class="btn-primary">
                        <i class="fas fa-robot"></i>
                        Browse Robots
                    </a>
                </div>
            `;
            return;
        }

        favoritesGrid.innerHTML = favorites.map(robotId => {
            const robot = this.getRobotById(robotId);
            if (!robot) return '';

            return `
                <div class="favorite-item" onclick="window.location.href='robot-detail.html?id=${robot.id}'">
                    <div class="favorite-image">
                        <img src="${robot.image}" alt="${robot.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 2rem; color: #9ca3af;">
                            <i class="fas fa-robot"></i>
                        </div>
                    </div>
                    <div class="favorite-content">
                        <div class="favorite-name">${robot.name}</div>
                        <div class="favorite-manufacturer">${robot.manufacturer}</div>
                        <div class="favorite-actions">
                            <div class="favorite-score">
                                <span class="score">${robot.calculatedScore}</span>
                                <div class="score-bar">
                                    <div class="score-fill" style="width: ${robot.calculatedScore}%"></div>
                                </div>
                            </div>
                            <button class="remove-favorite" onclick="event.stopPropagation(); dashboard.removeFavorite('${robot.id}')">
                                <i class="fas fa-heart-broken"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    loadActivity() {
        const activityTimeline = document.getElementById('activityTimeline');
        if (!activityTimeline) return;

        const activities = this.generateActivityFeed();
        
        if (activities.length === 0) {
            activityTimeline.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                    <h3>No activity yet</h3>
                    <p>Your activity will appear here as you interact with the platform.</p>
                </div>
            `;
            return;
        }

        activityTimeline.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-date">${this.formatDate(activity.date)}</div>
                </div>
            </div>
        `).join('');
    }

    loadProfile() {
        if (!this.currentUser) return;

        // Populate profile form
        document.getElementById('profileFirstName').value = this.currentUser.firstName || '';
        document.getElementById('profileLastName').value = this.currentUser.lastName || '';
        document.getElementById('profileEmail').value = this.currentUser.email || '';
        document.getElementById('profileUserType').value = this.currentUser.userType || '';
        document.getElementById('profileBio').value = this.currentUser.bio || '';
    }

    openAddReviewModal() {
        const modal = document.getElementById('addReviewModal');
        const robotSelect = document.getElementById('reviewRobot');
        
        // Populate robot options
        const robots = rankingSystem.getAllRobotsRanked();
        robotSelect.innerHTML = '<option value="">Choose a robot to review</option>' +
            robots.map(robot => `<option value="${robot.id}">${robot.name} - ${robot.manufacturer}</option>`).join('');
        
        modal.classList.add('active');
    }

    closeAddReviewModal() {
        const modal = document.getElementById('addReviewModal');
        modal.classList.remove('active');
        document.getElementById('addReviewForm').reset();
    }

    async handleAddReview(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        const reviewData = {
            robotId: formData.get('robotId'),
            rating: parseInt(formData.get('rating')),
            comment: formData.get('comment')
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        this.setLoading(submitBtn, true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const commentData = {
                id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                robotId: reviewData.robotId,
                userId: this.currentUser.id,
                userName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
                userType: this.currentUser.userType,
                comment: reviewData.comment,
                rating: reviewData.rating,
                createdAt: new Date().toISOString()
            };

            // Add to user's comments
            if (!this.currentUser.comments) {
                this.currentUser.comments = [];
            }
            this.currentUser.comments.push(commentData);

            // Save to robot comments
            this.saveRobotComment(commentData);

            // Update users data
            this.saveUsers();

            this.showAlert('success', 'Review added successfully!');
            this.closeAddReviewModal();
            this.loadReviews();
            this.updateStats();

        } catch (error) {
            this.showAlert('error', 'Failed to add review. Please try again.');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    async handleProfileUpdate(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        const profileData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            userType: formData.get('userType'),
            bio: formData.get('bio')
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        this.setLoading(submitBtn, true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update user data
            Object.assign(this.currentUser, profileData);
            this.saveUsers();

            // Update UI
            document.getElementById('welcomeName').textContent = this.currentUser.firstName;
            document.getElementById('userName').textContent = this.currentUser.firstName;

            this.showAlert('success', 'Profile updated successfully!');

        } catch (error) {
            this.showAlert('error', 'Failed to update profile. Please try again.');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    removeFavorite(robotId) {
        if (!this.currentUser.favorites) return;

        this.currentUser.favorites = this.currentUser.favorites.filter(id => id !== robotId);
        this.saveUsers();
        this.loadFavorites();
        this.updateStats();
        this.showAlert('success', 'Robot removed from favorites');
    }

    deleteReview(reviewId) {
        if (confirm('Are you sure you want to delete this review?')) {
            this.currentUser.comments = this.currentUser.comments.filter(comment => comment.id !== reviewId);
            this.saveUsers();
            this.loadReviews();
            this.updateStats();
            this.showAlert('success', 'Review deleted successfully');
        }
    }

    editReview(reviewId) {
        // Implementation for editing reviews
        this.showAlert('info', 'Edit functionality coming soon!');
    }

    // Helper methods
    getRobotById(id) {
        return rankingSystem.getRobotById(id);
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star ${i <= rating ? '' : 'empty'}"></i>`;
        }
        return stars;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    generateActivityFeed() {
        const activities = [];
        
        // Add review activities
        if (this.currentUser.comments) {
            this.currentUser.comments.forEach(comment => {
                const robot = this.getRobotById(comment.robotId);
                if (robot) {
                    activities.push({
                        title: 'Reviewed a robot',
                        description: `You reviewed ${robot.name} by ${robot.manufacturer}`,
                        date: comment.createdAt
                    });
                }
            });
        }

        // Add favorite activities
        if (this.currentUser.favorites) {
            this.currentUser.favorites.forEach(robotId => {
                const robot = this.getRobotById(robotId);
                if (robot) {
                    activities.push({
                        title: 'Added to favorites',
                        description: `You added ${robot.name} to your favorites`,
                        date: this.currentUser.createdAt
                    });
                }
            });
        }

        // Sort by date (newest first)
        return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    saveRobotComment(commentData) {
        const robotComments = this.loadRobotComments();
        if (!robotComments[commentData.robotId]) {
            robotComments[commentData.robotId] = [];
        }
        robotComments[commentData.robotId].push(commentData);
        localStorage.setItem('robotics_comments', JSON.stringify(robotComments));
    }

    loadRobotComments() {
        const stored = localStorage.getItem('robotics_comments');
        return stored ? JSON.parse(stored) : {};
    }

    saveUsers() {
        const users = JSON.parse(localStorage.getItem('robotics_users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
        }
        localStorage.setItem('robotics_users', JSON.stringify(users));
    }

    setLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-spinner fa-spin';
            }
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            const icon = button.querySelector('i');
            if (icon) {
                // Restore original icon
                icon.className = 'fas fa-save';
            }
        }
    }

    showAlert(type, message) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        // Create new alert
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        alert.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        // Insert at the top of the dashboard
        const dashboardMain = document.querySelector('.dashboard-main .container');
        if (dashboardMain) {
            dashboardMain.insertBefore(alert, dashboardMain.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }

    logout() {
        localStorage.removeItem('robotics_auth');
        sessionStorage.removeItem('robotics_auth');
        window.location.href = 'index.html';
    }
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new Dashboard();
});
