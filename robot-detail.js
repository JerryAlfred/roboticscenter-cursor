// Robot Detail Page JavaScript
class RobotDetailPage {
    constructor() {
        this.robotId = null;
        this.robot = null;
        this.init();
    }

    init() {
        this.getRobotIdFromURL();
        this.loadRobotDetails();
        this.setupCommentsSystem();
    }

    getRobotIdFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        this.robotId = urlParams.get('id');
        
        if (!this.robotId) {
            this.showError('No robot ID provided');
            return;
        }
    }

    loadRobotDetails() {
        const container = document.getElementById('robot-detail-container');
        
        // Show loading state
        container.innerHTML = `
            <div class="loading-detail">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading robot details...</p>
            </div>
        `;

        // Simulate loading delay for better UX
        setTimeout(() => {
            this.robot = rankingSystem.getRobotById(this.robotId);
            
            if (!this.robot) {
                this.showError('Robot not found');
                return;
            }

            this.renderRobotDetails();
            this.updateBreadcrumb();
            this.loadRelatedRobots();
            this.loadComments();
        }, 500);
    }

    renderRobotDetails() {
        const container = document.getElementById('robot-detail-container');
        const rankClass = this.robot.rank <= 3 ? `rank-${this.robot.rank}` : '';
        
        container.innerHTML = `
            <div class="robot-header">
                <div class="robot-image-large">
                    <img src="${this.robot.image}" alt="${this.robot.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 4rem; color: #9ca3af;">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="rank-badge ${rankClass}">#${this.robot.rank}</div>
                </div>
                <div class="robot-info">
                    <h1 class="robot-title">${this.robot.name}</h1>
                    <p class="robot-subtitle">${this.robot.manufacturer}</p>
                    <div class="robot-score-display">
                        <span class="score-large">${this.robot.calculatedScore}</span>
                        <div class="score-bar-large">
                            <div class="score-fill-large" style="width: ${this.robot.calculatedScore}%"></div>
                        </div>
                    </div>
                    <p class="robot-description">${this.robot.description}</p>
                    <div class="robot-meta">
                        <div class="meta-item">
                            <span class="meta-label">Category:</span>
                            <span class="meta-value">${this.robot.category.charAt(0).toUpperCase() + this.robot.category.slice(1)}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Year:</span>
                            <span class="meta-value">${this.robot.year}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Availability:</span>
                            <span class="meta-value">${this.robot.availability}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Price:</span>
                            <span class="meta-value">${this.robot.price}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="robot-details-grid">
                <div class="specifications">
                    <h3><i class="fas fa-cogs"></i> Specifications</h3>
                    <div class="specs-grid">
                        ${Object.entries(this.robot.specs).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-label">${this.formatSpecLabel(key)}:</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="features">
                    <h3><i class="fas fa-star"></i> Key Features</h3>
                    <div class="features-list">
                        ${this.robot.features.map(feature => `
                            <div class="feature-item">
                                <i class="fas fa-check"></i>
                                <span class="feature-text">${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <div class="pros-cons">
                <div class="pros">
                    <h3><i class="fas fa-thumbs-up"></i> Advantages</h3>
                    <ul class="pros-list">
                        ${this.robot.pros.map(pro => `<li>${pro}</li>`).join('')}
                    </ul>
                </div>
                <div class="cons">
                    <h3><i class="fas fa-thumbs-down"></i> Limitations</h3>
                    <ul class="cons-list">
                        ${this.robot.cons.map(con => `<li>${con}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="purchase-info">
                <h3>Interested in ${this.robot.name}?</h3>
                <div class="price-display">${this.robot.price}</div>
                <div class="availability-display">${this.robot.availability}</div>
                <div class="contact-buttons">
                    <a href="index.html#contact" class="contact-btn primary">Contact Us</a>
                    <a href="index.html#pilot" class="contact-btn secondary">Join Pilot Program</a>
                </div>
            </div>
        `;

        // Update page title
        document.title = `${this.robot.name} - Robot Details | Silicon Valley Robotics Center`;
    }

    formatSpecLabel(key) {
        const labelMap = {
            height: 'Height',
            weight: 'Weight',
            battery: 'Battery Life',
            speed: 'Max Speed',
            payload: 'Payload Capacity'
        };
        return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }

    updateBreadcrumb() {
        const breadcrumbRobot = document.getElementById('breadcrumb-robot');
        breadcrumbRobot.textContent = this.robot.name;
    }

    loadRelatedRobots() {
        const relatedRobots = getRelatedRobots(this.robot, 3);
        
        if (relatedRobots.length === 0) {
            return;
        }

        const section = document.getElementById('related-robots-section');
        const grid = document.getElementById('related-robots-grid');
        
        section.style.display = 'block';
        grid.innerHTML = relatedRobots.map(robot => this.createRelatedRobotCard(robot)).join('');
        
        // Add click listeners to related robot cards
        grid.querySelectorAll('.related-robot-card').forEach(card => {
            card.addEventListener('click', () => {
                const robotId = card.dataset.robotId;
                window.location.href = `robot-detail.html?id=${robotId}`;
            });
        });
    }

    createRelatedRobotCard(robot) {
        return `
            <div class="related-robot-card" data-robot-id="${robot.id}">
                <div class="related-robot-image">
                    <img src="${robot.image}" alt="${robot.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 2rem; color: #9ca3af;">
                        <i class="fas fa-robot"></i>
                    </div>
                </div>
                <div class="related-robot-content">
                    <div class="related-robot-name">${robot.name}</div>
                    <div class="related-robot-manufacturer">${robot.manufacturer}</div>
                    <div class="related-robot-score">
                        <span class="related-score-number">${robot.calculatedScore}</span>
                        <div class="related-score-bar">
                            <div class="related-score-fill" style="width: ${robot.calculatedScore}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showError(message) {
        const container = document.getElementById('robot-detail-container');
        container.innerHTML = `
            <div class="error-detail">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <a href="rankings.html" class="btn-primary" style="margin-top: 1rem; display: inline-block;">Back to Rankings</a>
            </div>
        `;
    }
}

// Initialize detail page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RobotDetailPage();
});

// Add smooth scrolling for internal links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

    setupCommentsSystem() {
        // Check if user is logged in
        this.checkAuthStatus();
        
        // Setup comment form
        document.getElementById('commentForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCommentSubmit(e);
        });

        // Setup cancel comment button
        document.getElementById('cancelComment')?.addEventListener('click', () => {
            this.hideCommentForm();
        });
    }

    checkAuthStatus() {
        const authData = localStorage.getItem('robotics_auth') || sessionStorage.getItem('robotics_auth');
        
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                const users = JSON.parse(localStorage.getItem('robotics_users') || '[]');
                this.currentUser = users.find(u => u.id === parsed.userId);
                
                if (this.currentUser) {
                    this.showCommentForm();
                } else {
                    this.showLoginPrompt();
                }
            } catch (error) {
                this.showLoginPrompt();
            }
        } else {
            this.showLoginPrompt();
        }
    }

    showCommentForm() {
        document.getElementById('add-comment-form').style.display = 'block';
        document.getElementById('login-prompt').style.display = 'none';
    }

    showLoginPrompt() {
        document.getElementById('add-comment-form').style.display = 'none';
        document.getElementById('login-prompt').style.display = 'block';
        
        // Update login link with current robot ID
        const loginLink = document.querySelector('#login-prompt a');
        if (loginLink && this.robotId) {
            loginLink.href = `auth.html?return=robot-detail.html?id=${this.robotId}`;
        }
    }

    hideCommentForm() {
        document.getElementById('commentForm').reset();
        document.getElementById('add-comment-form').style.display = 'none';
    }

    async handleCommentSubmit(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        const commentData = {
            rating: parseInt(formData.get('rating')),
            comment: formData.get('comment')
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        this.setLoading(submitBtn, true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newComment = {
                id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                robotId: this.robotId,
                userId: this.currentUser.id,
                userName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
                userType: this.currentUser.userType,
                comment: commentData.comment,
                rating: commentData.rating,
                createdAt: new Date().toISOString()
            };

            // Add to user's comments
            if (!this.currentUser.comments) {
                this.currentUser.comments = [];
            }
            this.currentUser.comments.push(newComment);

            // Save to robot comments
            this.saveRobotComment(newComment);

            // Update users data
            this.saveUsers();

            this.showAlert('success', 'Review submitted successfully!');
            this.hideCommentForm();
            this.loadComments();

        } catch (error) {
            this.showAlert('error', 'Failed to submit review. Please try again.');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    loadComments() {
        const comments = this.getRobotComments(this.robotId);
        this.renderComments(comments);
        this.updateCommentsStats(comments);
    }

    getRobotComments(robotId) {
        const allComments = this.loadRobotComments();
        return allComments[robotId] || [];
    }

    loadRobotComments() {
        const stored = localStorage.getItem('robotics_comments');
        return stored ? JSON.parse(stored) : {};
    }

    saveRobotComment(commentData) {
        const robotComments = this.loadRobotComments();
        if (!robotComments[commentData.robotId]) {
            robotComments[commentData.robotId] = [];
        }
        robotComments[commentData.robotId].push(commentData);
        localStorage.setItem('robotics_comments', JSON.stringify(robotComments));
    }

    saveUsers() {
        const users = JSON.parse(localStorage.getItem('robotics_users') || '[]');
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
        }
        localStorage.setItem('robotics_users', JSON.stringify(users));
    }

    renderComments(comments) {
        const commentsList = document.getElementById('comments-list');
        if (!commentsList) return;

        if (comments.length === 0) {
            commentsList.innerHTML = `
                <div class="empty-comments">
                    <i class="fas fa-comments"></i>
                    <h3>No reviews yet</h3>
                    <p>Be the first to share your experience with this robot!</p>
                </div>
            `;
            return;
        }

        // Sort comments by date (newest first)
        const sortedComments = comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        commentsList.innerHTML = sortedComments.map(comment => `
            <div class="comment-item">
                <div class="comment-header">
                    <div class="comment-user">
                        <div class="user-avatar">
                            ${comment.userName.charAt(0).toUpperCase()}
                        </div>
                        <div class="user-info">
                            <h4>${comment.userName}</h4>
                            <p>${this.formatUserType(comment.userType)}</p>
                        </div>
                    </div>
                    <div class="comment-rating-display">
                        <div class="stars">
                            ${this.renderStars(comment.rating)}
                        </div>
                        <span class="comment-date">${this.formatDate(comment.createdAt)}</span>
                    </div>
                </div>
                <div class="comment-content">
                    ${comment.comment}
                </div>
                <div class="comment-actions">
                    <button onclick="robotDetail.likeComment('${comment.id}')">
                        <i class="fas fa-thumbs-up"></i> Helpful
                    </button>
                    <button onclick="robotDetail.reportComment('${comment.id}')">
                        <i class="fas fa-flag"></i> Report
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateCommentsStats(comments) {
        const statsContainer = document.getElementById('comments-stats');
        if (!statsContainer) return;

        const totalComments = comments.length;
        let avgRating = 0;
        
        if (totalComments > 0) {
            const totalRating = comments.reduce((sum, comment) => sum + (comment.rating || 0), 0);
            avgRating = (totalRating / totalComments).toFixed(1);
        }

        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-number">${totalComments}</span>
                <span class="stat-label">Reviews</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${avgRating}</span>
                <span class="stat-label">Avg Rating</span>
            </div>
        `;
    }

    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star ${i <= rating ? '' : 'empty'}"></i>`;
        }
        return stars;
    }

    formatUserType(userType) {
        const typeMap = {
            'researcher': 'Robotics Researcher',
            'engineer': 'Robotics Engineer',
            'student': 'Student',
            'enthusiast': 'Robotics Enthusiast',
            'business': 'Business Professional',
            'other': 'Other'
        };
        return typeMap[userType] || 'User';
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

    likeComment(commentId) {
        // Implementation for liking comments
        this.showAlert('info', 'Like functionality coming soon!');
    }

    reportComment(commentId) {
        // Implementation for reporting comments
        this.showAlert('info', 'Report functionality coming soon!');
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
                icon.className = 'fas fa-paper-plane';
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

        // Insert at the top of the comments section
        const commentsSection = document.querySelector('.comments-section .container');
        if (commentsSection) {
            commentsSection.insertBefore(alert, commentsSection.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }
}

// Initialize detail page when DOM is loaded
let robotDetail;
document.addEventListener('DOMContentLoaded', () => {
    robotDetail = new RobotDetailPage();
});

// Add back button functionality
document.addEventListener('DOMContentLoaded', () => {
    // Add back button to breadcrumb if needed
    const breadcrumb = document.querySelector('.breadcrumb-nav');
    if (breadcrumb && document.referrer.includes('rankings.html')) {
        const backButton = document.createElement('a');
        backButton.href = 'javascript:history.back()';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
        backButton.style.marginRight = '1rem';
        backButton.style.color = '#2563eb';
        backButton.style.textDecoration = 'none';
        breadcrumb.insertBefore(backButton, breadcrumb.firstChild);
    }
});
