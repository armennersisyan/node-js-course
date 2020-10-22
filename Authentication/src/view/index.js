const signUpForm = document.querySelector('#signUpForm');
const signUpBtn = document.querySelector('#signup');
const username = document.querySelector('input[type=text]');
const password = document.querySelector('input[type=password]');

function handleSignup(e) {
    e.preventDefault();

    const formDataEntries = new FormData(signUpForm).entries();
    const { username, password } = Object.fromEntries(formDataEntries);

    /**
     * Validating form
     */
    if (!username || !password) {
        console.log('Please fill the required fields!');
        return;
    }

    console.log(username, password)

    fetch('http://localhost:3000/api/1/signup', {
        method: 'POST',
        body: JSON.stringify({
            username,
            password,
        })
    })
}

signUpForm.addEventListener('submit', handleSignup);
