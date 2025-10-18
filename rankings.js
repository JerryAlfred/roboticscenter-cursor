// Rankings Page JavaScript
class RankingsPage {
    constructor() {
        this.currentCategory = 'all';
        this.currentSort = 'score';
        this.currentView = 'grid';
        this.searchQuery = '';
        this.robots = [];
        this.filteredRobots = [];
        
        this.init();
    }

    init() {
        this.loadRobots();
        this.setupEventListeners();
        this.updateStats();
        this.renderCategoryStats();
    }

    loadRobots() {
        this.robots = rankingSystem.getAllRobotsRanked();
        this.filteredRobots = [...this.robots];
        this.renderRobots();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentCategory = e.target.dataset.category;
                this.applyFilters();
            });
        });

        // Sort functionality
        const sortSelect = document.getElementById('sort-select');
        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applyFilters();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.toggleView();
            });
        });
    }

    applyFilters() {
        let filtered = [...this.robots];

        // Apply category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(robot => robot.category === this.currentCategory);
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(robot => 
                robot.name.toLowerCase().includes(this.searchQuery) ||
                robot.manufacturer.toLowerCase().includes(this.searchQuery) ||
                robot.features.some(feature => feature.toLowerCase().includes(this.searchQuery))
            );
        }

        // Apply sorting
        filtered = this.sortRobots(filtered, this.currentSort);

        this.filteredRobots = filtered;
        this.renderRobots();
        this.updateTitle();
    }

    sortRobots(robots, sortBy) {
        return robots.sort((a, b) => {
            switch (sortBy) {
                case 'score':
                    return b.calculatedScore - a.calculatedScore;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'manufacturer':
                    return a.manufacturer.localeCompare(b.manufacturer);
                case 'price':
                    return this.comparePrices(a.price, b.price);
                case 'year':
                    return b.year - a.year;
                default:
                    return 0;
            }
        });
    }

    comparePrices(priceA, priceB) {
        const getPriceValue = (price) => {
            if (price === 'Not for sale' || price === 'Contact for pricing') return Infinity;
            if (price.includes('$')) {
                return parseInt(price.replace(/[$,]/g, '')) || 0;
            }
            return 0;
        };
        
        return getPriceValue(priceA) - getPriceValue(priceB);
    }

    renderRobots() {
        const container = document.getElementById('rankings-container');
        const loading = document.getElementById('loading');
        
        loading.style.display = 'block';
        container.innerHTML = '';

        setTimeout(() => {
            if (this.filteredRobots.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-robot" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                        <h3>No robots found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
            } else {
                container.innerHTML = this.filteredRobots.map(robot => this.createRobotCard(robot)).join('');
            }
            
            loading.style.display = 'none';
            this.attachCardClickListeners();
        }, 300);
    }

    createRobotCard(robot) {
        const rankClass = robot.rank <= 3 ? `rank-${robot.rank}` : '';
        const availabilityClass = this.getAvailabilityClass(robot.availability);
        
        return `
            <div class="robot-card" data-robot-id="${robot.id}">
                <div class="robot-image">
                    <img src="${robot.image}" alt="${robot.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; font-size: 3rem; color: #9ca3af;">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="rank-badge ${rankClass}">#${robot.rank}</div>
                </div>
                <div class="robot-content">
                    <div class="robot-header">
                        <div>
                            <div class="robot-name">${robot.name}</div>
                            <div class="robot-manufacturer">${robot.manufacturer}</div>
                        </div>
                        <div class="score-display">
                            <span class="score-number">${robot.calculatedScore}</span>
                            <div class="score-bar">
                                <div class="score-fill" style="width: ${robot.calculatedScore}%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="robot-specs">
                        <div class="spec-item">
                            <span class="spec-label">Height:</span>
                            <span>${robot.specs.height}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Weight:</span>
                            <span>${robot.specs.weight}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Battery:</span>
                            <span>${robot.specs.battery}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Speed:</span>
                            <span>${robot.specs.speed}</span>
                        </div>
                    </div>
                    <div class="robot-features">
                        <div class="features-list">
                            ${robot.features.slice(0, 3).map(feature => 
                                `<span class="feature-tag">${feature}</span>`
                            ).join('')}
                            ${robot.features.length > 3 ? `<span class="feature-tag">+${robot.features.length - 3} more</span>` : ''}
                        </div>
                    </div>
                    <div class="robot-footer">
                        <div class="robot-price">${robot.price}</div>
                        <div class="robot-availability">
                            <span class="availability-badge ${availabilityClass}">${robot.availability}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAvailabilityClass(availability) {
        const availabilityMap = {
            'Available': 'available',
            'Limited': 'limited',
            'Research only': 'research',
            'Retired': 'retired',
            '2025 (planned)': 'limited'
        };
        return availabilityMap[availability] || 'limited';
    }

    attachCardClickListeners() {
        document.querySelectorAll('.robot-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const robotId = card.dataset.robotId;
                this.navigateToRobotDetail(robotId);
            });
        });
    }

    navigateToRobotDetail(robotId) {
        window.location.href = `robot-detail.html?id=${robotId}`;
    }

    toggleView() {
        const container = document.getElementById('rankings-container');
        container.className = `rankings-grid ${this.currentView === 'list' ? 'list-view' : ''}`;
        
        // Re-render with new view
        this.renderRobots();
    }

    updateTitle() {
        const title = document.getElementById('rankings-title');
        let titleText = 'All Robot Rankings';
        
        if (this.currentCategory !== 'all') {
            titleText = `${this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1)} Robot Rankings`;
        }
        
        if (this.searchQuery) {
            titleText += ` - Search: "${this.searchQuery}"`;
        }
        
        titleText += ` (${this.filteredRobots.length} robots)`;
        title.textContent = titleText;
    }

    updateStats() {
        const totalRobots = this.robots.length;
        const categories = [...new Set(this.robots.map(robot => robot.category))].length;
        const avgScore = Math.round(this.robots.reduce((sum, robot) => sum + robot.calculatedScore, 0) / totalRobots);
        
        document.getElementById('total-robots').textContent = totalRobots;
        document.getElementById('categories-count').textContent = categories;
        document.getElementById('avg-score').textContent = avgScore;
    }

    renderCategoryStats() {
        const stats = rankingSystem.getCategoryStats();
        const container = document.getElementById('category-stats');
        
        const categoryIcons = {
            humanoid: 'fas fa-user',
            quadruped: 'fas fa-paw',
            service: 'fas fa-concierge-bell'
        };
        
        container.innerHTML = Object.entries(stats).map(([category, stat]) => `
            <div class="category-stat-card">
                <div class="category-icon ${category}">
                    <i class="${categoryIcons[category]}"></i>
                </div>
                <div class="category-name">${category}</div>
                <div class="category-count">${stat.count}</div>
                <div class="category-avg-score">Avg Score: ${stat.avgScore}</div>
                <div class="category-top-robot">Top: ${stat.topRobot}</div>
            </div>
        `).join('');
    }
}

// Initialize rankings page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RankingsPage();
});

// Add some utility functions for the detail page
function getRobotById(id) {
    return rankingSystem.getRobotById(id);
}

function getRelatedRobots(robot, limit = 3) {
    return rankingSystem.getRobotsByCategory(robot.category)
        .filter(r => r.id !== robot.id)
        .slice(0, limit);
}
