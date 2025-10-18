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
