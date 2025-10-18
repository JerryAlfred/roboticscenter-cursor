// Robot Database and Ranking System
const robotDatabase = {
    humanoid: [
        {
            id: 'atlas-boston-dynamics',
            name: 'Atlas',
            manufacturer: 'Boston Dynamics',
            category: 'humanoid',
            rank: 1,
            score: 95,
            image: 'https://via.placeholder.com/400x300/2563eb/ffffff?text=Atlas',
            specs: {
                height: '1.5m',
                weight: '89kg',
                battery: '3 hours',
                speed: '2.5 m/s',
                payload: '11kg'
            },
            features: [
                'Advanced dynamic balance',
                'Parkour capabilities',
                'Object manipulation',
                'Autonomous navigation',
                'Real-time perception'
            ],
            description: 'Atlas is the most advanced humanoid robot, capable of complex parkour movements and dynamic balance. It represents the cutting edge of humanoid robotics with its ability to perform backflips, handstands, and navigate complex terrain.',
            pros: [
                'Exceptional dynamic balance',
                'Advanced parkour abilities',
                'Strong manipulation skills',
                'Real-time adaptation'
            ],
            cons: [
                'Very expensive',
                'Limited battery life',
                'Complex maintenance',
                'Not commercially available'
            ],
            price: 'Not for sale',
            availability: 'Research only',
            year: 2023
        },
        {
            id: 'optimus-tesla',
            name: 'Optimus (Tesla Bot)',
            manufacturer: 'Tesla',
            category: 'humanoid',
            rank: 2,
            score: 88,
            image: 'https://via.placeholder.com/400x300/00d4aa/ffffff?text=Optimus',
            specs: {
                height: '1.73m',
                weight: '57kg',
                battery: '8 hours',
                speed: '1.2 m/s',
                payload: '20kg'
            },
            features: [
                'AI-powered navigation',
                'Object recognition',
                'Autonomous operation',
                'Human-like dexterity',
                'Mass production ready'
            ],
            description: 'Tesla\'s Optimus represents a new approach to humanoid robotics, focusing on practical applications and mass production. It\'s designed to perform repetitive tasks in manufacturing and service industries.',
            pros: [
                'Mass production potential',
                'Long battery life',
                'Practical design',
                'Tesla AI integration'
            ],
            cons: [
                'Limited mobility',
                'Still in development',
                'Unproven in real-world',
                'High development cost'
            ],
            price: '$20,000 (estimated)',
            availability: '2025 (planned)',
            year: 2024
        },
        {
            id: 'asimo-honda',
            name: 'ASIMO',
            manufacturer: 'Honda',
            category: 'humanoid',
            rank: 3,
            score: 82,
            image: 'https://via.placeholder.com/400x300/ff6b35/ffffff?text=ASIMO',
            specs: {
                height: '1.3m',
                weight: '48kg',
                battery: '1 hour',
                speed: '2.7 km/h',
                payload: '1kg'
            },
            features: [
                'Human-like walking',
                'Voice recognition',
                'Gesture recognition',
                'Autonomous navigation',
                'Multi-language support'
            ],
            description: 'ASIMO was one of the first advanced humanoid robots, pioneering many technologies now standard in humanoid robotics. While retired, it laid the foundation for modern humanoid development.',
            pros: [
                'Pioneering technology',
                'Stable walking',
                'Good interaction capabilities',
                'Proven reliability'
            ],
            cons: [
                'Limited payload',
                'Short battery life',
                'Retired from development',
                'Outdated technology'
            ],
            price: 'Not for sale',
            availability: 'Retired',
            year: 2011
        },
        {
            id: 'pepper-softbank',
            name: 'Pepper',
            manufacturer: 'SoftBank Robotics',
            category: 'humanoid',
            rank: 4,
            score: 75,
            image: 'https://via.placeholder.com/400x300/ffd700/000000?text=Pepper',
            specs: {
                height: '1.2m',
                weight: '28kg',
                battery: '12 hours',
                speed: '3 km/h',
                payload: '0.5kg'
            },
            features: [
                'Emotional recognition',
                'Conversational AI',
                'Touch screen interface',
                'Multi-language support',
                'Cloud connectivity'
            ],
            description: 'Pepper is designed for human interaction and customer service. It can recognize emotions, engage in conversations, and provide information in retail and hospitality environments.',
            pros: [
                'Excellent interaction design',
                'Emotional intelligence',
                'Commercial availability',
                'Good battery life'
            ],
            cons: [
                'Limited mobility',
                'No manipulation arms',
                'Expensive for capabilities',
                'Limited practical applications'
            ],
            price: '$1,500/month',
            availability: 'Available',
            year: 2014
        }
    ],
    quadruped: [
        {
            id: 'spot-boston-dynamics',
            name: 'Spot',
            manufacturer: 'Boston Dynamics',
            category: 'quadruped',
            rank: 1,
            score: 92,
            image: 'https://via.placeholder.com/400x300/00bcd4/ffffff?text=Spot',
            specs: {
                height: '0.84m',
                weight: '32kg',
                battery: '90 minutes',
                speed: '1.6 m/s',
                payload: '14kg'
            },
            features: [
                'Autonomous navigation',
                'Rugged terrain capability',
                'Payload attachment system',
                'Remote operation',
                '360° cameras'
            ],
            description: 'Spot is the most advanced commercial quadruped robot, designed for industrial inspection, security, and research applications. It can navigate complex terrain and carry various payloads.',
            pros: [
                'Excellent mobility',
                'Commercial availability',
                'Rugged design',
                'Versatile payload system'
            ],
            cons: [
                'Expensive',
                'Limited battery life',
                'Complex operation',
                'Maintenance requirements'
            ],
            price: '$74,500',
            availability: 'Available',
            year: 2020
        },
        {
            id: 'anymal-anybotics',
            name: 'ANYmal',
            manufacturer: 'ANYbotics',
            category: 'quadruped',
            rank: 2,
            score: 87,
            image: 'https://via.placeholder.com/400x300/4caf50/ffffff?text=ANYmal',
            specs: {
                height: '0.6m',
                weight: '30kg',
                battery: '2 hours',
                speed: '1.5 m/s',
                payload: '10kg'
            },
            features: [
                'Industrial inspection',
                'Autonomous operation',
                'Hazardous environment capable',
                'Modular design',
                'Advanced sensors'
            ],
            description: 'ANYmal is designed for industrial inspection and monitoring in hazardous environments. It can operate autonomously in oil rigs, power plants, and other industrial facilities.',
            pros: [
                'Industrial focus',
                'Hazardous environment capable',
                'Good autonomy',
                'Modular design'
            ],
            cons: [
                'Limited commercial availability',
                'High cost',
                'Specialized applications',
                'Complex maintenance'
            ],
            price: 'Contact for pricing',
            availability: 'Limited',
            year: 2019
        },
        {
            id: 'laikago-unitree',
            name: 'Laikago',
            manufacturer: 'Unitree Robotics',
            category: 'quadruped',
            rank: 3,
            score: 78,
            image: 'https://via.placeholder.com/400x300/9c27b0/ffffff?text=Laikago',
            specs: {
                height: '0.6m',
                weight: '22kg',
                battery: '3 hours',
                speed: '3.3 m/s',
                payload: '5kg'
            },
            features: [
                'High-speed running',
                'Dynamic balance',
                'Research platform',
                'Open source software',
                'Affordable price'
            ],
            description: 'Laikago is a research-oriented quadruped robot that offers high performance at a more affordable price point. It\'s popular in academic and research institutions.',
            pros: [
                'Affordable for research',
                'High speed',
                'Open source',
                'Good performance'
            ],
            cons: [
                'Limited commercial support',
                'Research focus',
                'Less rugged than competitors',
                'Limited payload'
            ],
            price: '$15,000',
            availability: 'Research only',
            year: 2017
        },
        {
            id: 'a1-unitree',
            name: 'A1',
            manufacturer: 'Unitree Robotics',
            category: 'quadruped',
            rank: 4,
            score: 72,
            image: 'https://via.placeholder.com/400x300/ff9800/ffffff?text=A1',
            specs: {
                height: '0.3m',
                weight: '12kg',
                battery: '2.5 hours',
                speed: '3.3 m/s',
                payload: '3kg'
            },
            features: [
                'Compact design',
                'High agility',
                'Educational platform',
                'Affordable',
                'Easy to program'
            ],
            description: 'The A1 is a compact, affordable quadruped robot designed for education and research. It offers good performance in a smaller, more accessible package.',
            pros: [
                'Very affordable',
                'Compact size',
                'Good for education',
                'Easy to use'
            ],
            cons: [
                'Limited payload',
                'Smaller size limitations',
                'Basic features',
                'Limited commercial applications'
            ],
            price: '$2,700',
            availability: 'Available',
            year: 2019
        }
    ],
    service: [
        {
            id: 'roomba-irobot',
            name: 'Roomba i7+',
            manufacturer: 'iRobot',
            category: 'service',
            rank: 1,
            score: 85,
            image: 'https://via.placeholder.com/400x300/607d8b/ffffff?text=Roomba',
            specs: {
                height: '0.09m',
                weight: '3.4kg',
                battery: '75 minutes',
                speed: '0.3 m/s',
                payload: '0.6L'
            },
            features: [
                'Smart mapping',
                'Self-emptying base',
                'WiFi connectivity',
                'Voice control',
                'Scheduled cleaning'
            ],
            description: 'The Roomba i7+ is the most advanced home cleaning robot, featuring smart mapping, self-emptying capabilities, and intelligent navigation.',
            pros: [
                'Excellent cleaning performance',
                'Smart mapping technology',
                'Self-emptying base',
                'Reliable operation'
            ],
            cons: [
                'Expensive',
                'Requires maintenance',
                'Limited to flat surfaces',
                'Noise during operation'
            ],
            price: '$800',
            availability: 'Available',
            year: 2018
        }
    ]
};

// Ranking Algorithm
class RobotRankingSystem {
    constructor() {
        this.robots = this.flattenDatabase();
        this.categories = ['humanoid', 'quadruped', 'service'];
    }

    flattenDatabase() {
        let allRobots = [];
        Object.values(robotDatabase).forEach(category => {
            allRobots = allRobots.concat(category);
        });
        return allRobots;
    }

    // Calculate comprehensive score based on multiple factors
    calculateScore(robot) {
        let score = 0;
        
        // Base score from database
        score += robot.score * 0.4;
        
        // Availability bonus
        if (robot.availability === 'Available') score += 10;
        else if (robot.availability === 'Limited') score += 5;
        
        // Price factor (lower price = higher score for accessibility)
        const priceScore = this.getPriceScore(robot.price);
        score += priceScore * 0.2;
        
        // Year factor (newer = higher score)
        const currentYear = new Date().getFullYear();
        const yearScore = Math.max(0, 10 - (currentYear - robot.year));
        score += yearScore * 0.1;
        
        // Feature count bonus
        score += Math.min(robot.features.length * 2, 10) * 0.1;
        
        // Pros vs cons ratio
        const prosConsRatio = robot.pros.length / (robot.cons.length + 1);
        score += Math.min(prosConsRatio * 5, 10) * 0.2;
        
        return Math.min(Math.round(score), 100);
    }

    getPriceScore(price) {
        if (price === 'Not for sale' || price === 'Contact for pricing') return 0;
        if (price.includes('$')) {
            const numPrice = parseInt(price.replace(/[$,]/g, ''));
            if (numPrice < 1000) return 10;
            if (numPrice < 5000) return 8;
            if (numPrice < 20000) return 6;
            if (numPrice < 50000) return 4;
            return 2;
        }
        return 5; // Default for other pricing formats
    }

    // Get robots by category
    getRobotsByCategory(category) {
        return this.robots
            .filter(robot => robot.category === category)
            .map(robot => ({
                ...robot,
                calculatedScore: this.calculateScore(robot)
            }))
            .sort((a, b) => b.calculatedScore - a.calculatedScore);
    }

    // Get all robots ranked
    getAllRobotsRanked() {
        return this.robots
            .map(robot => ({
                ...robot,
                calculatedScore: this.calculateScore(robot)
            }))
            .sort((a, b) => b.calculatedScore - a.calculatedScore);
    }

    // Search robots
    searchRobots(query) {
        const searchTerm = query.toLowerCase();
        return this.robots.filter(robot => 
            robot.name.toLowerCase().includes(searchTerm) ||
            robot.manufacturer.toLowerCase().includes(searchTerm) ||
            robot.features.some(feature => feature.toLowerCase().includes(searchTerm))
        );
    }

    // Get robot by ID
    getRobotById(id) {
        return this.robots.find(robot => robot.id === id);
    }

    // Get category statistics
    getCategoryStats() {
        const stats = {};
        this.categories.forEach(category => {
            const robots = this.getRobotsByCategory(category);
            stats[category] = {
                count: robots.length,
                avgScore: Math.round(robots.reduce((sum, robot) => sum + robot.calculatedScore, 0) / robots.length),
                topRobot: robots[0]?.name || 'N/A'
            };
        });
        return stats;
    }
}

// Initialize ranking system
const rankingSystem = new RobotRankingSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { robotDatabase, RobotRankingSystem, rankingSystem };
}
