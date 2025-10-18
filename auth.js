// Authentication System JavaScript
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupFormValidation();
    }

    setupEventListeners() {
        // Form switching
        document.getElementById('showRegister')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterForm();
        });

        document.getElementById('showLogin')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginForm();
        });

        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(e);
        });

        document.getElementById('registerForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister(e);
        });

        // Real-time validation
        document.getElementById('registerPassword')?.addEventListener('input', () => {
            this.validatePasswordMatch();
        });

        document.getElementById('confirmPassword')?.addEventListener('input', () => {
            this.validatePasswordMatch();
        });
    }

    showRegisterForm() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
        document.title = 'Register - Silicon Valley Robotics Center';
    }

    showLoginForm() {
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        document.title = 'Login - Silicon Valley Robotics Center';
    }

    async handleLogin(e) {
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe');

        const submitBtn = form.querySelector('button[type="submit"]');
        this.setLoading(submitBtn, true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const user = this.authenticateUser(email, password);
            
            if (user) {
                this.currentUser = user;
                this.saveAuthState(user, rememberMe);
                this.showAlert('success', 'Login successful! Redirecting...');
                
                setTimeout(() => {
                    this.redirectAfterLogin();
                }, 1500);
            } else {
                this.showAlert('error', 'Invalid email or password. Please try again.');
            }
        } catch (error) {
            this.showAlert('error', 'Login failed. Please try again.');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    async handleRegister(e) {
        const form = e.target;
        const formData = new FormData(form);
        
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password'),
            userType: formData.get('userType'),
            agreeTerms: formData.get('agreeTerms')
        };

        const submitBtn = form.querySelector('button[type="submit"]');
        this.setLoading(submitBtn, true);

        try {
            // Validate form
            if (!this.validateRegisterForm(userData)) {
                this.setLoading(submitBtn, false);
                return;
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (this.userExists(userData.email)) {
                this.showAlert('error', 'An account with this email already exists.');
                this.setLoading(submitBtn, false);
                return;
            }

            const newUser = this.createUser(userData);
            this.users.push(newUser);
            this.saveUsers();
            
            this.showAlert('success', 'Account created successfully! Please sign in.');
            this.showLoginForm();
            
        } catch (error) {
            this.showAlert('error', 'Registration failed. Please try again.');
        } finally {
            this.setLoading(submitBtn, false);
        }
    }

    validateRegisterForm(userData) {
        let isValid = true;

        // Check required fields
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.password || !userData.userType) {
            this.showAlert('error', 'Please fill in all required fields.');
            isValid = false;
        }

        // Check email format
        if (userData.email && !this.isValidEmail(userData.email)) {
            this.showAlert('error', 'Please enter a valid email address.');
            isValid = false;
        }

        // Check password strength
        if (userData.password && userData.password.length < 6) {
            this.showAlert('error', 'Password must be at least 6 characters long.');
            isValid = false;
        }

        // Check terms agreement
        if (!userData.agreeTerms) {
            this.showAlert('error', 'Please agree to the Terms of Service and Privacy Policy.');
            isValid = false;
        }

        return isValid;
    }

    validatePasswordMatch() {
        const password = document.getElementById('registerPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        if (confirmPassword && password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Passwords do not match');
        } else {
            this.clearFieldError('confirmPassword');
        }
    }

    setupFormValidation() {
        // Email validation
        document.getElementById('registerEmail')?.addEventListener('blur', (e) => {
            if (e.target.value && !this.isValidEmail(e.target.value)) {
                this.showFieldError('registerEmail', 'Please enter a valid email address');
            } else {
                this.clearFieldError('registerEmail');
            }
        });

        // Password strength validation
        document.getElementById('registerPassword')?.addEventListener('input', (e) => {
            const password = e.target.value;
            if (password.length > 0 && password.length < 6) {
                this.showFieldError('registerPassword', 'Password must be at least 6 characters');
            } else {
                this.clearFieldError('registerPassword');
            }
        });
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        
        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    }

    clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    authenticateUser(email, password) {
        return this.users.find(user => 
            user.email === email && user.password === this.hashPassword(password)
        );
    }

    userExists(email) {
        return this.users.some(user => user.email === email);
    }

    createUser(userData) {
        return {
            id: this.generateUserId(),
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: this.hashPassword(userData.password),
            userType: userData.userType,
            createdAt: new Date().toISOString(),
            comments: [],
            favorites: []
        };
    }

    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hashPassword(password) {
        // Simple hash function (in production, use proper hashing)
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    saveAuthState(user, rememberMe) {
        const authData = {
            userId: user.id,
            email: user.email,
            rememberMe: rememberMe
        };

        if (rememberMe) {
            localStorage.setItem('robotics_auth', JSON.stringify(authData));
        } else {
            sessionStorage.setItem('robotics_auth', JSON.stringify(authData));
        }
    }

    checkAuthStatus() {
        const authData = localStorage.getItem('robotics_auth') || sessionStorage.getItem('robotics_auth');
        
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                const user = this.users.find(u => u.id === parsed.userId);
                if (user) {
                    this.currentUser = user;
                    this.redirectAfterLogin();
                }
            } catch (error) {
                console.error('Error parsing auth data:', error);
            }
        }
    }

    redirectAfterLogin() {
        // Check if there's a return URL
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('return') || 'index.html';
        
        // Update navigation to show user is logged in
        this.updateNavigation();
        
        // Redirect to the appropriate page
        window.location.href = returnUrl;
    }

    updateNavigation() {
        // This will be called from other pages to update the navigation
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && this.currentUser) {
            const loginBtn = navMenu.querySelector('a[href="auth.html"]');
            if (loginBtn) {
                loginBtn.innerHTML = `<i class="fas fa-user"></i> ${this.currentUser.firstName}`;
                loginBtn.href = 'dashboard.html';
            }
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('robotics_auth');
        sessionStorage.removeItem('robotics_auth');
        window.location.href = 'index.html';
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
                // Restore original icon based on button type
                if (button.closest('#loginForm')) {
                    icon.className = 'fas fa-sign-in-alt';
                } else {
                    icon.className = 'fas fa-user-plus';
                }
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

        // Insert at the top of the form
        const form = document.querySelector('.auth-form:not([style*="display: none"]) .form');
        if (form) {
            form.insertBefore(alert, form.firstChild);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }

    // Data persistence methods
    loadUsers() {
        const stored = localStorage.getItem('robotics_users');
        return stored ? JSON.parse(stored) : [];
    }

    saveUsers() {
        localStorage.setItem('robotics_users', JSON.stringify(this.users));
    }

    // Public methods for other parts of the app
    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    addComment(robotId, comment) {
        if (!this.currentUser) return false;
        
        const commentData = {
            id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            robotId: robotId,
            userId: this.currentUser.id,
            userName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
            userType: this.currentUser.userType,
            comment: comment.text,
            rating: comment.rating,
            createdAt: new Date().toISOString()
        };

        // Add to user's comments
        this.currentUser.comments.push(commentData);
        
        // Save to robot comments
        this.saveRobotComment(commentData);
        
        // Update users data
        this.saveUsers();
        
        return commentData;
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

    getRobotComments(robotId) {
        const allComments = this.loadRobotComments();
        return allComments[robotId] || [];
    }
}

// Initialize authentication system
const authSystem = new AuthSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthSystem;
}
