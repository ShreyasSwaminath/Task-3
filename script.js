document.addEventListener('DOMContentLoaded', function() {
    // Carousel functionality
    const carouselImages = document.querySelector('.carousel-images');
    const images = document.querySelectorAll('.carousel-image');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    let currentIndex = 0;
    
    function updateCarousel() {
        carouselImages.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    prevButton.addEventListener('click', function() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        updateCarousel();
    });
    
    nextButton.addEventListener('click', function() {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    });
    
    // Auto-advance carousel every 5 seconds
    setInterval(function() {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateCarousel();
    }, 5000);
    
    // Quiz functionality
    const options = document.querySelectorAll('.quiz-option');
    const submitButton = document.getElementById('submit');
    const quizResult = document.getElementById('quiz-result');
    
    // Correct answers
    const correctAnswers = {
        1: 'a',
        2: 'b'
    };
    
    // User answers
    const userAnswers = {};
    
    options.forEach(option => {
        option.addEventListener('click', function() {
            const question = this.closest('.quiz-question').dataset.question;
            
            // Remove any existing selection for this question
            this.parentElement.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select this option
            this.classList.add('selected');
            
            // Store the user's answer
            userAnswers[question] = this.dataset.value;
        });
    });
    
    submitButton.addEventListener('click', function() {
        let score = 0;
        const totalQuestions = Object.keys(correctAnswers).length;
        
        // Check answers and apply styles
        for (const question in correctAnswers) {
            const questionElement = document.querySelector(`.quiz-question[data-question="${question}"]`);
            const options = questionElement.querySelectorAll('.quiz-option');
            
            options.forEach(option => {
                // Reset old highlights first
                option.classList.remove('correct', 'incorrect');

                // Mark correct answer
                if (option.dataset.value === correctAnswers[question]) {
                    option.classList.add('correct');
                }
                // Mark incorrect selected answers
                else if (option.classList.contains('selected')) {
                    option.classList.add('incorrect');
                }
                
                // Disable further selection
                option.style.pointerEvents = 'none';
            });
            
            if (userAnswers[question] === correctAnswers[question]) {
                score++;
            }
        }
        
        // Display result
        quizResult.textContent = `You scored ${score} out of ${totalQuestions}!`;
        
        // Color code the result
        if (score === totalQuestions) {
            quizResult.style.color = '#28a745';
        } else if (score >= totalQuestions / 2) {
            quizResult.style.color = '#ff9800';
        } else {
            quizResult.style.color = '#dc3545';
        }
        
        // Disable submit button after submission
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        submitButton.style.cursor = 'not-allowed';
    });
    
    // Joke API functionality
    const jokeButton = document.getElementById('get-joke');
    const jokeContainer = document.getElementById('joke-container');

    // Feminist jokes array
    const feministJokes = [
        "Why did the feminist bring a ladder to the bar? Because the glass ceiling was too high!",
        "Why did the feminist cross the road? To smash the patriarchy on the other side!",
        "What’s a feminist’s favorite workout? Smashing stereotypes!",
        "Why don’t feminists like elevator jokes? Because they always bring them down.",
        "How many feminists does it take to change a light bulb? None — they’ve already changed the whole system!"
    ];

    jokeButton.addEventListener('click', function() {
        jokeContainer.innerHTML = '<p>Loading joke...</p>';

        // 30% chance to show feminist joke
        if (Math.random() < 0.3) {
            const randomFeministJoke = feministJokes[Math.floor(Math.random() * feministJokes.length)];
            jokeContainer.innerHTML = `<p>${randomFeministJoke}</p>`;
            return;
        }

        // Otherwise, fetch random joke from API
        fetch('https://v2.jokeapi.dev/joke/Any?type=twopart')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    throw new Error(data.message);
                }

                jokeContainer.innerHTML = `
                    <p>${data.setup}</p>
                    <p><strong>${data.delivery}</strong></p>
                `;
            })
            .catch(error => {
                console.error("Error fetching joke:", error);

                // Fallback jokes if API fails
                const fallbackJokes = [
                    "Why don't scientists trust atoms? Because they make up everything!",
                    "Why did the scarecrow win an award? Because he was outstanding in his field!",
                    "What do you call a fake noodle? An impasta!",
                    "How does a penguin build its house? Igloos it together!",
                    "Why did the math book look so sad? Because it had too many problems!"
                ];

                const randomJoke = fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
                jokeContainer.textContent = randomJoke;
            });
    });

}); // ✅ Final closing bracket for DOMContentLoaded

